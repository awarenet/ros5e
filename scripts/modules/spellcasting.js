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
}
