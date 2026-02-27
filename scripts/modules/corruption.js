import { COMMON } from "../common.js";

export class Corruption {
  static NAME = "Corruption";
  static register() {
    this.hooks();
  }
  static hooks() {
    Hooks.on("dnd5e.postUseActivity", Corruption.trollSingerCorruptionCheck);
  }

  static async trollSingerCorruptionCheck(activity, data) {
    if (!activity.actor.isSinger() || !activity.isSpell) return;
    const level = activity.item.system.level;
    if (level == 0) return; // no corruption for cantrips
    const target = 12 + level * 2;
    const favored = Corruption.isFavored(activity.item);
    const speaker = ChatMessage.getSpeaker({ actor: activity.actor });
    const messageData = {
      data: { speaker, flavor: "Troll Singer Corruption Check" },
    };
    var result = await activity.actor.rollAbilityCheck(
      {
        ability: "cha",
        target: target,
        event: {
          // this tricks the rollAbilityCheck to not show the dialog and roll adv/dis whether favored or not
          ctrlKey: !favored,
          altKey: favored,
          target: {
            closest: () => {
              return null;
            },
          },
        },
      },
      {},
      messageData,
    );
    if (result[0] && !result[0].isSuccess) {
      const corruption = activity.actor.system.corruption.permanent + 1;
      activity.actor.update({
        ["system.corruption.permanent"]: corruption,
      });
    }
  }

  /* Generate the raw expression string based on level and favor */
  static _generateCorruptionExpression(level, itemData) {
    if (itemData.actor.isSinger()) {
      return "0";
    }
    /* cantrips have a level of "0" (string) for some reason */
    const favored = Corruption.isFavored(itemData);
    const rune = Corruption.getRuneLevel(itemData);
    if (rune > 0) {
      return favored ? rune : rune * 2;
    }
    const scaling = itemData.flags.dnd5e?.scaling ?? 0;
    let mod = level + scaling;
    var shadowedSlope =
      itemData.actor.items.filter(
        (i) => i.flags[COMMON.DATA.name]?.shadowedSlope === true ?? false,
      ).length > 0;
    if (
      shadowedSlope &&
      !favored &&
      level <= 4 &&
      itemData.actor.corruption.permanent >= level
    ) {
      mod--;
    }

    const talisman = Corruption.isTalisman(itemData);
    let base = favored ? mod : level == 0 ? "1" : `1d4 + ${mod}`;
    return talisman ? `max(round((${base})/2), 1)` : base;
  }

  /* Determine if a cast generates corruption */
  static generatesCorruption(castLevel, favored) {
    const level = parseInt(castLevel);
    return !(level == 0 && favored);
  }

  static isFavored(itemData) {
    /* If it's a real item instance, check the system data first */
    if (!itemData.actor) return false;
    const type = itemData.system.level == 0 ? "cantrips" : "spells";
    const favoredList =
      itemData.actor.getFlag(COMMON.DATA.name, `favored.${type}`) ?? [];
    return favoredList.includes(itemData.id);
  }

  static isTalisman(itemData) {
    /* If it's a real item instance, check the system data first */
    if (!itemData.actor || !itemData.actor.subclasses["artifact-crafter"])
      return false;
    const talismanList =
      itemData.actor.subclasses["artifact-crafter"].getFlag(
        COMMON.DATA.name,
        "talismans.used",
      ) ?? [];
    return talismanList.includes(itemData.id);
  }

  static isRune(itemData) {
    /* If it's a real item instance, check the system data first */
    if (!itemData.actor || !itemData.actor.subclasses["symbolist"])
      return false;
    return (
      itemData.actor
        .getRunes()
        ["prepared"]?.filter((x) => x.id === itemData.id)[0] ?? false
    );
  }

  static getRuneLevel(itemData) {
    if (!itemData.actor || !itemData.actor.subclasses["symbolist"]) return 0;
    return (
      itemData.actor
        .getRunes()
        ["prepared"]?.filter((x) => x.id === itemData.id)[0]?.level ?? 0
    );
  }

  /* Get the full corruption expression including overrides */
  static corruptionExpression(itemData, level = itemData.system.level) {
    /* get default expression */
    let expression =
      itemData.type === "spell"
        ? Corruption._generateCorruptionExpression(level, itemData)
        : "0";
    let type = "base";

    /* has custom corruption? */
    const custom =
      foundry.utils.getProperty(
        itemData,
        game.ros5e.CONFIG.PATHS.corruptionOverride.root,
      ) ??
      foundry.utils.duplicate(
        game.ros5e.CONFIG.DEFAULT_ITEM.corruptionOverride,
      );

    /* modify the expression (always round up) minimum 1 unless custom */
    if (
      custom.mode !== game.ros5e.CONFIG.DEFAULT_ITEM.corruptionOverride.mode
    ) {
      //has override
      switch (custom.mode) {
        case CONST.ACTIVE_EFFECT_MODES.ADD:
          expression = `${expression} + (${custom.value})`;
          break;
        case CONST.ACTIVE_EFFECT_MODES.MULTIPLY:
          expression = `(${expression}) * (${custom.value})`;
          break;
        case CONST.ACTIVE_EFFECT_MODES.OVERRIDE:
          expression = custom.value;
          break;
      }
    }

    /* modify the target */
    if (
      custom.type !== game.ros5e.CONFIG.DEFAULT_ITEM.corruptionOverride.type
    ) {
      type = custom.type;
    }

    /* after all modifications have been done, return the final expression */
    return { expression, type };
  }
}
