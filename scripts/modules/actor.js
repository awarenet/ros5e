import { Common } from "../common.js";
import { logger } from "../logger.js";

import { SybRestDialog } from "./apps/syb-rest-dialog.js";
import { Resting } from "./resting.js";

/**
 * Core Symbaroum Actor extensions.
 * Injects custom mechanics such as corruption, favored spells, and rest variants into the standard D&D5e Actor.
 */
export class ActorSyb5e {
  static NAME = "ActorSyb5e";

  /* ========================================== */
  /*        Core Initialization & Patching      */
  /* ========================================== */

  /**
   * Main entry point to register actor modifications.
   */
  static register() {
    this.patch();
    this.hooks();
  }

  /**
   * Patches standard dnd5e Actor prototype methods with Symbaroum extensions.
   */
  static patch() {
    const target = dnd5e.documents.Actor5e.prototype;
    const targetPath = "dnd5e.documents.Actor5e.prototype";

    const patches = {
      corruptionThreshold: { get: ActorSyb5e.calcMaxCorruption, enumerable: true },
      isSinger: { value: ActorSyb5e.isSinger, enumerable: true },
      listSpells: { value: ActorSyb5e.listSpells, enumerable: true },
      getRollData: { value: ActorSyb5e.getRollData, mode: "WRAPPER" },
      longRest: { value: ActorSyb5e.longRest },
      shortRest: { value: ActorSyb5e.shortRest },
      convertSybCurrency: { value: ActorSyb5e.convertSybCurrency, enumerable: true },
      isSybActor: { value: ActorSyb5e.isSybActor, enumerable: true },
      getTalismans: { value: ActorSyb5e.getTalismans, enumerable: true },
      setTalismans: { value: ActorSyb5e.setTalismans, enumerable: true },
      getRunes: { value: ActorSyb5e.getRunes, enumerable: true },
      setRunes: { value: ActorSyb5e.setRunes, enumerable: true },
      getFavoredSpells: { value: ActorSyb5e.getFavoredSpells, enumerable: true },
      setFavoredSpells: { value: ActorSyb5e.setFavoredSpells, enumerable: true },
      getFavoredSpellsMax: { value: ActorSyb5e.getFavoredSpellsMax, enumerable: true },
      extendedRest: { value: ActorSyb5e.extendedRest, enumerable: true },
      corruption: { get: ActorSyb5e.getCorruption, enumerable: true },
      cleanse: { value: ActorSyb5e.cleanse, enumerable: true },
    };

    Common.patch(target, targetPath, patches);
    this.patchDataModel();
  }

  /**
   * Modifies the Character data schema to support corruption variables persistently.
   */
  static patchDataModel() {
    const CharacterData = dnd5e.dataModels?.actor?.CharacterData;
    if (!CharacterData) return;

    const original = CharacterData.defineSchema;
    CharacterData.defineSchema = function () {
      const schema = original.call(this);
      schema.corruption = new foundry.data.fields.SchemaField({
        value: new foundry.data.fields.NumberField({ required: true, nullable: false, integer: true, initial: 0, min: 0 }),
        max: new foundry.data.fields.NumberField({ required: true, nullable: false, integer: true, initial: 0, min: 0 }),
        temp: new foundry.data.fields.NumberField({ required: true, nullable: false, integer: true, initial: 0, min: 0, label: "ROS5E.Corruption.TempDamage" }),
        permanent: new foundry.data.fields.NumberField({ required: true, nullable: false, integer: true, initial: 0, min: 0, label: "ROS5E.Corruption.PermDamage" }),
        bonus: new foundry.data.fields.NumberField({ required: true, nullable: false, integer: true, initial: 0 }),
      });
      return schema;
    };
  }

  /**
   * Registers Foundry VTT document hooks relevant to actors.
   */
  static hooks() {
    Hooks.on("preUpdateActor", ActorSyb5e._preUpdateActor);
    Hooks.on("deleteItem", ActorSyb5e._deleteItem);
  }

  /* ========================================== */
  /*          Foundry Hook Handlers             */
  /* ========================================== */

  /**
   * Hook listener when an item is deleted. Cleans up any orphaned tracking arrays.
   */
  static _deleteItem(item, options, userId) {
    item.actor.cleanse();
    return true;
  }

  /**
   * Handles the 'soulless' trait. Translates corruption damage dynamically into immediate health loss.
   */
  static _preUpdateActor(actor, update) {
    const { temp, permanent } = foundry.utils.getProperty(update, game.ros5e.CONFIG.PATHS.corruption.root) ?? { temp: null, permanent: null };

    if (temp == null && permanent == null) return;

    const { scope, key } = game.ros5e.CONFIG.PATHS.sybSoulless;
    const sybSoulless = actor.getFlag(scope, key);
    if (sybSoulless) {
      const current = actor.corruption;
      const gainedCorruption = (temp ?? current.temp) - current.temp + (permanent ?? current.permanent) - current.permanent;
      const totalCorruption = (temp ?? current.temp) + (permanent ?? current.permanent);
      const hpPath = "system.attributes.hp";

      let { value: currentHp, max: currentMax } = foundry.utils.mergeObject(
        foundry.utils.getProperty(actor, hpPath),
        foundry.utils.getProperty(update, hpPath) ?? {},
        { inplace: false },
      );

      currentHp -= gainedCorruption * sybSoulless;
      const targetMaxDelta = -totalCorruption * sybSoulless;

      currentHp = Math.max(Math.min(currentHp, currentMax + targetMaxDelta), 0);

      foundry.utils.setProperty(update, hpPath, {
        value: currentHp,
        tempmax: targetMaxDelta,
      });
    }
  }

  /**
   * Allows dice rolls in chat macros to reference custom metrics like @attributes.corruption.
   */
  static getRollData(wrapped, ...args) {
    let data = wrapped(...args);

    if (this.isSybActor()) {
      data.attributes.corruption = this.corruption;
    }

    return data;
  }

  /* ========================================== */
  /*               Rest Mechanics               */
  /* ========================================== */

  /**
   * Wraps the default Long Rest logic via the custom SybRestDialog.
   */
  static async longRest(wrapped, { dialog = true, chat = true, newDay = true } = {}, ...args) {
    const initHd = this.system.attributes.hd;
    const initHp = this.system.attributes.hp.value;
    const initCorr = this.corruption.temp;

    if (!this.isSybActor()) {
      return wrapped({ dialog, chat, newDay }, ...args);
    }

    if (dialog) {
      try {
        newDay = await SybRestDialog.restDialog({ actor: this, type: game.dnd5e.config.restTypes.long });
      } catch (err) {
        if (err == "cancelled") logger.debug("Rest dialog cancelled.");
        return false;
      }
    }

    await Resting._sybRest(
      this, game.dnd5e.config.restTypes.long, chat, newDay,
      this.system.attributes.hd - initHd,
      this.system.attributes.hp.value - initHp,
      this.corruption.temp - initCorr,
    );
  }

  /**
   * Wraps the default Short Rest logic via the custom SybRestDialog.
   */
  static async shortRest(wrapped, { dialog = true, chat = true, autoHD = false, autoHDThreshold = 3 } = {}, ...args) {
    const initHd = this.system.attributes.hd;
    const initHp = this.system.attributes.hp.value;
    const initCorr = this.corruption.temp;

    if (!this.isSybActor()) {
      return wrapped({ dialog, chat, autoHD, autoHDThreshold }, ...args);
    }

    if (dialog) {
      try {
        await SybRestDialog.restDialog({ actor: this, type: game.dnd5e.config.restTypes.short });
      } catch (err) {
        if (err == "cancelled") logger.debug("Rest dialog cancelled.");
        return false;
      }
    }

    await Resting._sybRest(
      this, game.dnd5e.config.restTypes.short, chat, false,
      this.system.attributes.hd - initHd,
      this.system.attributes.hp.value - initHp,
      this.corruption.temp - initCorr,
    );
  }

  /**
   * Exclusive Extended Rest type specific to Symbaroum rulesets.
   */
  static async extendedRest({ dialog = true, chat = true, newDay = true } = {}) {
    if (!this.isSybActor()) {
      return false;
    }

    if (dialog) {
      try {
        newDay = await SybRestDialog.restDialog({ actor: this, type: game.dnd5e.config.restTypes.ext });
      } catch (err) {
        if (err == "cancelled") logger.debug("Rest dialog cancelled.");
        return false;
      }
    }

    await Resting._sybRest(this, game.dnd5e.config.restTypes.ext, chat, newDay);
  }

  /* ========================================== */
  /*            Symbaroum Corruption            */
  /* ========================================== */

  /**
   * Retrieves the combined current temporary and permanent corruption.
   */
  static getCorruption() {
    if (this.system.corruption) {
      const corruption = this.system.corruption;
      if (corruption.temp === undefined) corruption.temp = 0;
      if (corruption.permanent === undefined) corruption.permanent = 0;

      corruption.value = corruption.temp + corruption.permanent;
      return corruption;
    }
    return null;
  }

  /**
   * Calcuates maximum corruption limit based on class modifications (Mystic, Templar) and attributes.
   */
  static calcMaxCorruption() {
    const currentBonus = dnd5e.utils.simplifyBonus(foundry.utils.getProperty(this, "system.corruption.bonus") ?? 0);

    if (Object.keys(this.classes).some((x) => x == "mystic")) {
      return Math.max((this.system.attributes.spell.mod + this.system.attributes.prof) * 2 + currentBonus, 4);
    }

    let corruptionThresholdMod = "cha";
    if (Object.keys(this.classes).some((x) => x == "templar")) {
      if (this.system.abilities.wis.mod > this.system.abilities.cha.mod) {
        corruptionThresholdMod = "wis";
      }
    }

    return Math.max(this.system.abilities[corruptionThresholdMod].mod + this.system.attributes.prof * 2 + currentBonus, 2);
  }

  /* ========================================== */
  /*         Mystic & Class Data Getters        */
  /* ========================================== */

  /**
   * Helper test to identify if the current Actor belongs to Symbaroum.
   */
  static isSybActor() {
    return this.getFlag(Common.constants.name, "ros5eActor") ?? false;
  }

  static getTalismans() {
    return this.subclasses["artifact-crafter"]?.getFlag(Common.constants.name, "talismans") ?? false;
  }

  static setTalismans(talismans) {
    this.subclasses["artifact-crafter"]?.setFlag(Common.constants.name, "talismans", talismans);
  }

  static getRunes() {
    return this.subclasses["symbolist"]?.getFlag(Common.constants.name, "runes") ?? false;
  }

  static setRunes(runes) {
    this.subclasses["symbolist"]?.setFlag(Common.constants.name, "runes", runes);
  }

  static getFavoredSpells() {
    return this.getFlag(Common.constants.name, "favored") ?? { cantrips: [], spells: [] };
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
    return Object.values(this.subclasses)?.some((x) => x.getFlag(Common.constants.name, "isSinger") == true);
  }

  static listSpells() {
    const spells = this.items.filter((x) => x.system.method == "spell");
    return spells.map((spell) => {
      return {
        name: spell.name,
        activities: Array.from(spell.system.activities.values()),
      };
    });
  }

  /**
   * Audits favored spells and talismans, removing any references to items no longer owned by the actor.
   */
  static cleanse() {
    const favoredSpells = this.getFavoredSpells();
    const cantrips = favoredSpells.cantrips.filter((x) => this.items.some((y) => y.id == x));
    const spells = favoredSpells.spells.filter((x) => this.items.some((y) => y.id == x));
    
    const talismans = this.getTalismans();
    const used = talismans.used ? talismans.used.filter((x) => this.items.some((y) => y.id == x)) : [];

    this.setFavoredSpells("cantrips", cantrips);
    this.setFavoredSpells("spells", spells);
    this.setTalismans({ used: used });
  }

  /* ========================================== */
  /*                  Utilities                 */
  /* ========================================== */

  /**
   * Consolidates all carried currency to the highest possible denomination to reduce raw coin bloat.
   */
  static convertSybCurrency() {
    if (!this.isSybActor()) {
      logger.error(Common.localize("ROS5E.error.notSybActor"));
      return;
    }

    const conversion = Object.entries(game.ros5e.CONFIG.CURRENCY_CONVERSION);
    const current = foundry.utils.duplicate(this.system.currency);

    for (const [denom, data] of conversion) {
      const denomUp = Math.floor(current[denom] / data.each);
      current[denom] -= denomUp * data.each;
      current[data.into] += denomUp;
    }

    return this.update({ "data.currency": current });
  }
}
