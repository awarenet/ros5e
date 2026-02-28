import { Common } from "../common.js";
import { logger } from "../logger.js";
import { ROS5E } from "../config.js";

/* Initial attempt is via injection only */
export class Syb5eItemSheet {
  static NAME = "Syb5eItemSheet";

  static register() {
    this.hooks();
  }

  static hooks() {
    Hooks.on("renderItemSheet5e", this._renderItemSheet5e);
  }

  /* Handles injection of new ROS5E properties that are NOT handled
   * implicitly by a game.dnd5e.config object
   */
  static async _renderItemSheet5e(sheet, html /*, options*/) {
    /* need to insert checkbox for favored and put a favored 'badge' on the description tab */
    const item = sheet.item;

    const commonData = {
      edit: (sheet.isEditable ?? false) ? "" : "disabled",
    };
    /* if this is an owned item, owner needs to be a SYB sheet actor
     * if this is an unowned item, show always
     */
    if (item.parent && !item.parent.isSybActor()) {
      logger.debug(
        `Item [${item.id}] with parent actor [${item.parent.id}] is not an ROS5E item`,
      );
      return;
    }

    /* only concerned with adding favored to sybactor owned spell type items */
    if (item.type == "spell") {
      const data = {
        ...commonData,
        isFavored: item.isFavored,
        favoredPath: ROS5E.CONFIG.PATHS.favored,
        favoredValue:
          foundry.utils.getProperty(item, ROS5E.CONFIG.PATHS.favored) ?? 0,
        favoredStates: {
          [Common.localize("ROS5E.Spell.Favored")]: 1,
          [Common.localize("ROS5E.Spell.NotFavored")]: 0,
          [Common.localize("ROS5E.Spell.NeverFavored")]: -1,
        },
      };

      const favoredSelect = await renderTemplate(
        `${Common.constants.path}/templates/items/parts/spell-favored.html`,
        data,
      );
      const favoredBadge = await renderTemplate(
        `${Common.constants.path}/templates/items/parts/spell-favored-badge.html`,
        data,
      );

      /* adjust spell prep div style to <label style="max-width: fit-content;"> */
      const preparedCheckbox = html.find("label.checkbox.prepared");
      const prepModeLineLabel = preparedCheckbox.parent().prev();
      prepModeLineLabel.css("max-width", "fit-content");

      /* insert our favored select menu */
      preparedCheckbox.after(favoredSelect);

      /* insert our favored badge */
      const itemPropBadges = html.find(".properties-list li");
      itemPropBadges.last().after(favoredBadge);

      /* find the "Cost (GP)" label (if it exists) */
      const costLabel = html.find('[name="system.materials.cost"]').prev();
      if (costLabel.length > 0) {
        costLabel.text(Common.localize("ROS5E.Currency.CostThaler"));
      }
    }

    /* need to rename "subclass" to "approach" */
    if (item.type == "subclass") {
      /* get the subclass text field entry */
      const subclassLabel = html.find(".header-details .item-type");
      if (subclassLabel.length > 0) {
        subclassLabel.text(Common.localize("ROS5E.Item.Class.Approach"));
      } else {
        logger.debug(
          "Could not find subclass label field in class item render.",
        );
      }

      /* remove spellcasting progression not in ros5e */
      const filterList = Object.keys(
        game.ros5e.CONFIG.SPELL_PROGRESSION,
      ).reduce((acc, key) => {
        if (acc.length == 0) {
          /* dont put the comma in front */
          acc += `[value="${key}"]`;
        } else {
          acc += `, [value="${key}"]`;
        }
        return acc;
      }, "");
      const progressionSelect = html.find(
        '[name="system.spellcasting.progression"]',
      );
      progressionSelect.children().not(filterList).remove();
    }

    /* we want to add a custom corruption field if there is a general resource consumption field */
    const consumeGroup = html.find(".form-group.consumption");
    if (consumeGroup.length > 0) {
      const currentOverrides = item.corruptionOverride;
      let data = {
        corruptionType: {
          none: "",
          temp: Common.localize("ROS5E.Corruption.TemporaryFull"),
          permanent: Common.localize("ROS5E.Corruption.Permanent"),
        },
        corruptionModes: {
          "": CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          ADD: CONST.ACTIVE_EFFECT_MODES.ADD,
          MULTIPLY: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          OVERRIDE: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
        },
        overridePath: game.ros5e.CONFIG.PATHS.corruptionOverride.root,
        ...currentOverrides,
      };

      /* non-spell items have no base corruption to modify, can only override with a custom value */
      if (item.type !== "spell") {
        delete data.corruptionModes.ADD;
        delete data.corruptionModes.MULTIPLY;
      }

      const corruptionGroup = await renderTemplate(
        `${Common.constants.path}/templates/items/parts/item-corruption.html`,
        data,
      );
      consumeGroup.after(corruptionGroup);
    }
  }
}
