import { COMMON } from "../common.js";
import { Spellcasting } from "./spellcasting.js";
import { Corruption } from "./corruption.js";
export class ItemSyb5e {
  static NAME = "ItemSyb5e";

  static register() {
    this.patch();
    this.hooks();
  }

  static parent = {};

  static hooks() {
    //Hooks.on('dnd5e.preDisplayCard', this.flagWithCorruption);
    Hooks.on("dnd5e.preItemUsageConsumption", this.swapCorruptionConsumption);
    Hooks.on("dnd5e.itemUsageConsumption", this.generateCorruptionUsage);
    //Hooks.on('renderChatLog', this.setChatListeners)
  }

  static patch() {
    const target = dnd5e.documents.Item5e.prototype;
    const targetPath = "dnd5e.documents.Item5e.prototype";

    const patches = {
      properties: {
        get: ItemSyb5e.getProperties,
      },
      corruption: {
        get: ItemSyb5e.getCorruption,
      },
      corruptionOverride: {
        get: ItemSyb5e.getCorruptionOverride,
      },
      prepareDerivedData: {
        value: ItemSyb5e.prepareDerivedData,
        mode: "WRAPPER",
      },
      hasDamage: {
        value: ItemSyb5e.hasDamage,
        mode: "WRAPPER",
      },
    };

    COMMON.patch(target, targetPath, patches);
  }

  static prepareDerivedData(wrapped, ...args) {
    wrapped(...args);

    /* calculate corruption */
    const corruption = Corruption.corruptionExpression(this);
    this.flags.ros5e = foundry.utils.mergeObject(this.flags.ros5e ?? {}, {
      corruption: corruption,
    });
  }

  static getCorruption() {
    return (
      this.flags.ros5e?.corruption ?? {
        expression: "0",
        type: "base",
      }
    );
  }

  static getCorruptionOverride() {
    const override =
      foundry.utils.getProperty(
        this,
        game.ros5e.CONFIG.PATHS.corruptionOverride.root,
      ) ??
      foundry.utils.duplicate(
        game.ros5e.CONFIG.DEFAULT_ITEM.corruptionOverride,
      );
    override.mode = parseInt(override.mode);
    return override;
  }

  static getProperties() {
    const props = this.system.properties;

    /* DnD5e v4+ properties are Sets */
    if (props instanceof Set) {
      if (this.isArmor) {
        const flags = this.getFlag(COMMON.DATA.name, "armorProps");
        if (flags) {
          for (const [k, v] of Object.entries(flags)) {
            if (v) props.add(k);
          }
        }
      }
      return props;
    }

    /* Legacy support: props is object */
    let propsObj = props ?? {};
    /* Armor will also have item properties similar to Weapons */

    /* is armor type? return syb armor props or the default object
     * if no flag data exists yet */
    if (this.isArmor) {
      return foundry.utils.mergeObject(
        propsObj,
        this.getFlag(COMMON.DATA.name, "armorProps") ??
          game.ros5e.CONFIG.DEFAULT_ITEM.armorProps,
      );
    }

    /* all others, fall back to core data */
    return propsObj;
  }

  static hasDamage(wrapped, ...args) {
    /* core logic */
    //const coreHasDamage = !!(this.system.damage && this.system.damage.parts.length)
    const coreHasDamage = wrapped(...args);

    const consumesAmmo = this.system.consume?.type === "ammo";
    const consumedItem = this.actor?.items.get(this.system.consume?.target);
    let consumedDamage = false;

    if (consumesAmmo && !!consumedItem && consumedItem?.id !== this.id)
      consumedDamage = consumedItem.hasDamage;

    return coreHasDamage || consumedDamage;
  }
}
