import { Common } from "../common.js";
import { logger } from "../logger.js";

import { SybRestDialog } from "./apps/syb-rest-dialog.js";
import { Resting } from "./resting.js";

export class ActorSyb5e {
  static NAME = "ActorSyb5e";

  static register() {
    this.patch();
    this.hooks();
  }

  static patch() {
    const target = dnd5e.documents.Actor5e.prototype;
    const targetPath = "dnd5e.documents.Actor5e.prototype";

    const patches = {
      corruptionThreshold: {
        get: ActorSyb5e.calcMaxCorruption,
        enumerable: true,
      },
      isSinger: {
        value: ActorSyb5e.isSinger,
        enumerable: true,
      },
      listSpells: {
        value: ActorSyb5e.listSpells,
        enumerable: true,
      },
      getRollData: {
        value: ActorSyb5e.getRollData,
        mode: "WRAPPER",
      },
      longRest: {
        value: ActorSyb5e.longRest,
      },
      shortRest: {
        value: ActorSyb5e.shortRest,
      },
      convertSybCurrency: {
        value: ActorSyb5e.convertSybCurrency,
        enumerable: true,
      },
      isSybActor: {
        value: ActorSyb5e.isSybActor,
        enumerable: true,
      },
      getTalismans: {
        value: ActorSyb5e.getTalismans,
        enumerable: true,
      },
      setTalismans: {
        value: ActorSyb5e.setTalismans,
        enumerable: true,
      },
      getRunes: {
        value: ActorSyb5e.getRunes,
        enumerable: true,
      },
      setRunes: {
        value: ActorSyb5e.setRunes,
        enumerable: true,
      },
      getFavoredSpells: {
        value: ActorSyb5e.getFavoredSpells,
        enumerable: true,
      },
      setFavoredSpells: {
        value: ActorSyb5e.setFavoredSpells,
        enumerable: true,
      },
      getFavoredSpellsMax: {
        value: ActorSyb5e.getFavoredSpellsMax,
        enumerable: true,
      },
      extendedRest: {
        value: ActorSyb5e.extendedRest,
        enumerable: true,
      },
      corruption: {
        get: ActorSyb5e.getCorruption,
        enumerable: true,
      },
      shadow: {
        get: ActorSyb5e.getShadow,
        enumerable: true,
      },
      manner: {
        get: ActorSyb5e.getManner,
        enumerable: true,
      },
      cleanse: {
        value: ActorSyb5e.cleanse,
        enumerable: true,
      },
    };

    Common.patch(target, targetPath, patches);
    this.patchDataModel();
  }

  static patchDataModel() {
    const CharacterData = dnd5e.dataModels?.actor?.CharacterData;
    if (!CharacterData) return;

    const original = CharacterData.defineSchema;
    CharacterData.defineSchema = function () {
      const schema = original.call(this);
      schema.corruption = new foundry.data.fields.SchemaField({
        value: new foundry.data.fields.NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0,
          min: 0,
        }),
        max: new foundry.data.fields.NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0,
          min: 0,
        }),
        temp: new foundry.data.fields.NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0,
          min: 0,
          label: "ROS5E.Corruption.TempDamage",
        }),
        permanent: new foundry.data.fields.NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0,
          min: 0,
          label: "ROS5E.Corruption.PermDamage",
        }),
        bonus: new foundry.data.fields.NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0,
        }),
      });
      return schema;
    };
  }

  /* -------------------------------------------- */

  static hooks() {
    Hooks.on("preUpdateActor", ActorSyb5e._preUpdateActor);
    Hooks.on("deleteItem", ActorSyb5e._deleteItem);
  }

  /* -------------------------------------------- */

  /* @override */
  static getRollData(wrapped, ...args) {
    let data = wrapped(...args);

    if (this.isSybActor()) {
      data.attributes.corruption = this.corruption;
      data.details.shadow = this.shadow;
      data.details.manner = this.manner;
    }

    return data;
  }

  static _deleteItem(item, options, userId) {
    item.actor.cleanse();
    return true;
  }
  /* -------------------------------------------- */

  /* @override */
  static async longRest(
    wrapped,
    { dialog = true, chat = true, newDay = true } = {},
    ...args
  ) {
    const initHd = this.system.attributes.hd;
    const initHp = this.system.attributes.hp.value;
    const initCorr = this.corruption.temp;

    if (!this.isSybActor()) {
      return wrapped({ dialog, chat, newDay }, ...args);
    }

    // Maybe present a confirmation dialog
    if (dialog) {
      try {
        newDay = await SybRestDialog.restDialog({
          actor: this,
          type: game.dnd5e.config.restTypes.long,
        });
      } catch (err) {
        if (err == "cancelled") logger.debug("Rest dialog cancelled.");
        return false;
      }
    }

    //do long rest
    await Resting._sybRest(
      this,
      game.dnd5e.config.restTypes.long,
      chat,
      newDay,
      this.system.attributes.hd - initHd,
      this.system.attributes.hp.value - initHp,
      this.corruption.temp - initCorr,
    );
  }

  /* -------------------------------------------- */

  static async shortRest(
    wrapped,
    { dialog = true, chat = true, autoHD = false, autoHDThreshold = 3 } = {},
    ...args
  ) {
    const initHd = this.system.attributes.hd;
    const initHp = this.system.attributes.hp.value;
    const initCorr = this.corruption.temp;

    if (!this.isSybActor()) {
      return wrapped({ dialog, chat, autoHD, autoHDThreshold }, ...args);
    }

    // Maybe present a confirmation dialog
    if (dialog) {
      try {
        await SybRestDialog.restDialog({
          actor: this,
          type: game.dnd5e.config.restTypes.short,
        });
      } catch (err) {
        if (err == "cancelled") logger.debug("Rest dialog cancelled.");
        return false;
      }
    }

    //do extended rest
    await Resting._sybRest(
      this,
      game.dnd5e.config.restTypes.short,
      chat,
      false,
      this.system.attributes.hd - initHd,
      this.system.attributes.hp.value - initHp,
      this.corruption.temp - initCorr,
    );
  }

  /* -------------------------------------------- */

  static getCorruption() {
    /* Try to get from system data (Schema injection) */
    if (this.system.corruption) {
      const corruption = this.system.corruption;

      // Ensure we have defaults if somehow missing (though schema handles this)
      if (corruption.temp === undefined) corruption.temp = 0;
      if (corruption.permanent === undefined) corruption.permanent = 0;

      // Calculate derived values
      corruption.value = corruption.temp + corruption.permanent;
      return corruption;
    }
    return null;
  }

  /* -------------------------------------------- */

  static getShadow() {
    const shadow =
      this.getFlag(Common.constants.name, "shadow") ??
      game.ros5e.CONFIG.DEFAULT_FLAGS.shadow;
    return shadow;
  }

  static getManner() {
    const manner =
      this.getFlag(Common.constants.name, "manner") ??
      game.ros5e.CONFIG.DEFAULT_FLAGS.manner;
    return manner;
  }

  /* -------------------------------------------- */

  /**
   * Convert all carried currency to the highest possible denomination to reduce the number of raw coins being
   * carried by an Actor.
   * @returns {Promise<Actor5e>}
   */
  static convertSybCurrency() {
    /* dont convert syb currency if not an syb actor */
    if (!this.isSybActor()) {
      logger.error(Common.localize("ROS5E.error.notSybActor"));
      return;
    }

    const conversion = Object.entries(game.ros5e.CONFIG.CURRENCY_CONVERSION);
    const current = foundry.utils.duplicate(this.system.currency);

    for (const [denom, data] of conversion) {
      /* get full coin conversion to next step */
      const denomUp = Math.floor(current[denom] / data.each);

      /* subtract converted coins and add converted coins */
      current[denom] -= denomUp * data.each;
      current[data.into] += denomUp;
    }

    return this.update({ "data.currency": current });
  }

  /* -------------------------------------------- */

  // gets basic max corruption. override in subclass effects where needed
  static calcMaxCorruption() {
    // get bonus from corruption.bonus field
    const currentBonus = dnd5e.utils.simplifyBonus(
      foundry.utils.getProperty(this, "system.corruption.bonus") ?? 0,
    );

    // mystics have higher max corruption
    if (Object.keys(this.classes).some((x) => x == "mystic")) {
      return Math.max(
        (this.system.attributes.spell.mod + this.system.attributes.prof) * 2 +
          currentBonus,
        4,
      );
    }

    var corruptionThresholdMod = "cha";
    // special case for templar
    if (Object.keys(this.classes).some((x) => x == "templar")) {
      if (this.system.abilities.wis.mod > this.system.abilities.cha.mod) {
        corruptionThresholdMod = "wis";
      }
    }
    // default
    return Math.max(
      this.system.abilities[corruptionThresholdMod].mod +
        this.system.attributes.prof * 2 +
        currentBonus,
      2,
    );
  }

  /* -------------------------------------------- */

  static isSybActor() {
    var retval = this.getFlag(Common.constants.name, "ros5eActor") ?? false;
    return retval;
  }

  static getTalismans() {
    var retval =
      this.subclasses["artifact-crafter"]?.getFlag(
        Common.constants.name,
        "talismans",
      ) ?? false;
    return retval;
  }

  static setTalismans(talismans) {
    this.subclasses["artifact-crafter"]?.setFlag(
      Common.constants.name,
      "talismans",
      talismans,
    );
  }

  static getRunes() {
    return (
      this.subclasses["symbolist"]?.getFlag(Common.constants.name, "runes") ??
      false
    );
  }

  static setRunes(runes) {
    this.subclasses["symbolist"]?.setFlag(
      Common.constants.name,
      "runes",
      runes,
    );
  }

  /* -------------------------------------------- */

  static async extendedRest({
    dialog = true,
    chat = true,
    newDay = true,
  } = {}) {
    if (!this.isSybActor()) {
      return false;
    }

    // Maybe present a confirmation dialog
    if (dialog) {
      try {
        newDay = await SybRestDialog.restDialog({
          actor: this,
          type: game.dnd5e.config.restTypes.ext,
        });
      } catch (err) {
        if (err == "cancelled") logger.debug("Rest dialog cancelled.");
        return false;
      }
    }

    //do extended rest
    await Resting._sybRest(this, game.dnd5e.config.restTypes.ext, chat, newDay);
  }

  static listSpells() {
    var spells = this.items.filter((x) => x.system.method == "spell");
    var output = spells.map((spell) => {
      return {
        name: spell.name,
        activities: Array.from(spell.system.activities.values()),
      };
    });
    return output;
  }

  static cleanse() {
    // checks if the actor has any favored spells or talismans and removes them if they don't have the item anymore.
    // if not found, it will remove the entry from the flag.
    var favoredSpells = this.getFavoredSpells();
    var cantrips = favoredSpells.cantrips.filter((x) => {
      return this.items.some((y) => y.id == x);
    });
    var spells = favoredSpells.spells.filter((x) => {
      return this.items.some((y) => y.id == x);
    });
    var talismans = this.getTalismans();
    var used = talismans.used.filter((x) => {
      return this.items.some((y) => y.id == x);
    });
    this.setFavoredSpells("cantrips", cantrips);
    this.setFavoredSpells("spells", spells);
    this.setTalismans({ used: used });
  }

  static getFavoredSpells() {
    return (
      this.getFlag(Common.constants.name, "favored") ?? {
        cantrips: [],
        spells: [],
      }
    );
  }

  static setFavoredSpells(type, favoredSpellIds) {
    if (!Array.isArray(favoredSpellIds)) {
      logger.error("Favored spell ids must be an array", favoredSpellIds);
      return;
    }
    this.setFlag(Common.constants.name, `favored.${type}`, favoredSpellIds);
  }

  static getFavoredSpellsMax(type) {
    const progression = game.ros5e.CONFIG.FAVORED_SPELL_PROGRESSION[type];
    const level = this.system.details.level;
    return progression[level - 1] ?? 0;
  }

  static isSinger() {
    return Object.values(this.subclasses)?.some(
      (x) => x.getFlag(Common.constants.name, "isSinger") == true,
    );
  }

  /* handles the "soulless" trait */
  static _preUpdateActor(actor, update) {
    /* is corruption being modified? */
    const { temp, permanent } = foundry.utils.getProperty(
      update,
      game.ros5e.CONFIG.PATHS.corruption.root,
    ) ?? { temp: null, permanent: null };

    /* if no corruption update, does not concern us */
    if (temp == null && permanent == null) return;

    /* If the current actor has the 'soulless' trait, mirror this damage to current/max health */
    const { scope, key } = game.ros5e.CONFIG.PATHS.sybSoulless;
    if (actor.getFlag(scope, key)) {
      /* compute the total change in corruption */
    if (sybSoulless) {
      const current = actor.corruption;
      const gainedCorruption =
        (temp ?? current.temp) -
        current.temp +
        (permanent ?? current.permanent) -
        current.permanent;
        (temp ?? current.temp) + (permanent ?? current.permanent);

      const hpPath = "system.attributes.hp";

      let { value: currentHp, max: currentMax } = foundry.utils.mergeObject(
        foundry.utils.getProperty(actor, hpPath),
        foundry.utils.getProperty(update, hpPath) ?? {},
        { inplace: false },
      );
      /* Apply the change to current HP */
      currentHp -= gainedCorruption * sybSoulless;

      const targetMaxDelta = -totalCorruption * sybSoulless;

      /* clamp current HP between max HP and 0 */
      currentHp = Math.max(Math.min(currentHp, currentMax + targetMaxDelta), 0);

      /* add in our hp changes to the update object */
      foundry.utils.setProperty(update, hpPath, {
        value: currentHp,
        tempmax: targetMaxDelta,
      });
    }
  }
}
