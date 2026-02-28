import { ROS5E } from "../config.js";
import { logger } from "../logger.js";
import { Corruption } from "./corruption.js";
import { Common } from "../common.js";

export class Spellcasting {
  static NAME = "Spellcasting";

  static register() {
    this.hooks();
  }

  static hooks() {
    Hooks.on(
      "dnd5e.getItemContextOptions",
      Spellcasting._getContextMenuOptions,
    );
    Hooks.on(
      "renderTidy5eCharacterSheetQuadrone",
      Spellcasting._renderFavoredSpellIcons,
    );
  }

  //Add context menu options for spells (favor and talisman)
  static _getContextMenuOptions(item, options) {
    if (
      item.type == "spell" &&
      !item.actor.flags[Common.constants.name].noFavors
    ) {
      options.push({
        callback: () => {
          const type = item.system.level == 0 ? "cantrips" : "spells";
          let favoredList = item.actor.getFavoredSpells()[type] ?? [];
          if (favoredList.includes(item.id)) {
            favoredList = favoredList.filter((id) => id !== item.id);
          } else {
            favoredList.push(item.id);
          }
          item.actor.setFavoredSpells(type, favoredList);
        },
        group: "common",
        icon: '<i class="fas fa-heart fa-fw"></i>',
        name: Corruption.isFavored(item)
          ? Common.localize("ROS5E.Spell.UnfavorAction")
          : Common.localize("ROS5E.Spell.FavorAction"),
      });

      const talismans = item.actor.getTalismans();
      if (talismans) {
        options.push({
          callback: () => {
            let talismanList = talismans.used ?? [];
            if (talismanList.includes(item.id)) {
              talismanList = talismanList.filter((id) => id !== item.id);
            } else {
              talismanList.push(item.id);
            }
            item.actor.setTalismans({ used: talismanList });
          },
          group: "common",
          icon: '<i class="fas fa-book-sparkles fa-fw"></i>',
          name: Corruption.isTalisman(item)
            ? Common.localize("ROS5E.Talisman.Remove")
            : Common.localize("ROS5E.Talisman.Add"),
        });
      }

      const runes = item.actor.getRunes();
      if (runes && item.system.level > 0) {
        options.push({
          callback: () => {
            let runeList = runes.prepared ?? [];
            if (runeList.some((x) => x.id === item.id)) {
              runeList = runeList.filter((rune) => rune.id !== item.id);
            } else {
              //submenu or dialog to select level
              runeList.push({ id: item.id, level: item.system.level });
            }
            item.actor.setRunes({ prepared: runeList });
          },
          group: "common",
          icon: '<i class="fas fa-book-sparkles fa-fw"></i>',
          name: Corruption.isRune(item)
            ? Common.localize("ROS5E.Rune.Remove")
            : Common.localize("ROS5E.Rune.Add"),
        });
      }
    }
    return options;
  }

  //override spell list background to add favored spell and talisman colors
  static _renderFavoredSpellIcons(app, html, data) {
    const actor = app.actor;
    if (!actor) return;

    actor.items.forEach((item) => {
      if (item.type !== "spell") return;
      html
        .querySelectorAll(
          `.tidy-table-row-container[data-item-id="${item.id}"]`,
        )
        .forEach((x) => {
          if (Corruption.isFavored(item)) {
            x.classList.add("favored-spell");
          } else {
            x.classList.remove("favored-spell");
          }
          if (Corruption.isTalisman(item)) {
            x.classList.add("talisman-spell");
          } else {
            x.classList.remove("talisman-spell");
          }
          if (Corruption.isRune(item)) {
            x.classList.add("rune-spell");
          } else {
            x.classList.remove("rune-spell");
          }
        });
    });
  }

  /* MECHANICS HELPERS */

  /* get max spell level based
   * on highest class progression
   * NOTE: this is probably excessive
   *   but since its a single display value
   *   we want to show the higest value
   * @param classData {array<classItemData>}
   */

  static _maxSpellLevelByClass(classData = []) {
    const maxLevel = classData.reduce(
      (acc, cls) => {
        const progression = cls.spellcasting.progression;
        const progressionArray =
          ROS5E.CONFIG.SPELL_PROGRESSION[progression] ?? false;
        if (progressionArray) {
          const spellLevel =
            ROS5E.CONFIG.SPELL_PROGRESSION[progression][cls.system.levels] ?? 0;

          return spellLevel > acc.level
            ? { level: spellLevel, fullCaster: progression == "full" }
            : acc;
        }

        /* nothing to accumulate */
        return acc;
      },
      { level: 0, fullCaster: false },
    );

    const result = {
      level: maxLevel.level,
      label: ROS5E.CONFIG.LEVEL_SHORT[maxLevel.level],
      fullCaster: maxLevel.fullCaster,
    };

    return result;
  }

  /* highest spell level for an NPC:
   * if a leveled caster, use that level as Full Caster
   * if not and spellcasting stat is != 'none', use CR as full caster
   * otherwise, no spellcasting
   *
   * @param actor5eData {Object} (i.e. actor.system)
   */
  static _maxSpellLevelNPC(actor5eData) {
    const casterLevel = actor5eData.details.spellLevel ?? 0;

    /* has caster levels, assume full caster */
    let result = {
      level: 0,
      label: "",
      fullCaster: casterLevel > 0,
    };

    /* modify max spell level if full caster or has a casting stat */
    if (result.fullCaster) {
      /* if we are a full caster, use our caster level */
      result.level = game.ros5e.CONFIG.SPELL_PROGRESSION.full[casterLevel];
    }

    result.label = game.ros5e.CONFIG.LEVEL_SHORT[result.level];

    return result;
  }
}
