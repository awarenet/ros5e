import { Common } from "./common.js";
import { SybConfigApp } from "./modules/apps/config-app.js";

/* CONFIG class for ros5e data.
 * Stored in 'game.ros5e.CONFIG'
 */
export class ROS5E {
  static NAME = "ROS5E_CONFIG";

  static register() {
    this.globals();
    this.templates();
    this.hooks();
    this.settings();
  }

  static get CONFIG() {
    return globalThis.game.ros5e.CONFIG;
  }

  /**
   * Return template paths for preloading
   */
  static templates() {
    const loadTemplates =
      foundry.applications?.handlebars?.loadTemplates ??
      globalThis.loadTemplates;
    return loadTemplates([`${Common.constants.path}/templates/apps/rest.hbs`]);
  }

  /**
   * Register world and client settings for the ROS5E module
   */
  static settings() {
    game.settings.registerMenu("ros5e", "symbaroumSettings", {
      name: "ROS5E.setting.config-menu-label.name",
      label: "ROS5E.setting.config-menu-label.name",
      hint: "ROS5E.setting.config-menu-label.hint",
      icon: "fas fa-palette",
      type: SybConfigApp,
      restricted: false,
    });

    const settingsData = {
      useSymbaroumCurrency: {
        scope: "world",
        config: false,
        default: true,
        type: Boolean,
      },
    };

    Common.applySettings(settingsData);
  }

  /**
   * Register system hooks used by ROS5E
   */
  static hooks() {
    Hooks.on("i18nInit", ROS5E._preTranslateConfig);
    Hooks.on("ready", ROS5E.setPlutoniumConfig);
    Hooks.on("ready", ROS5E.bootstrapResources);
    Hooks.once("ready", ROS5E.loadBrewItemProperties);
    Hooks.on("preCreateItem", ROS5E.applyCustomItemProperties);
  }

  /**
   * Ensure Plutonium is configured to load the Ruins of Symbaroum homebrew compendium.
   */
  static async setPlutoniumConfig() {
    if (!game.user.isGM) {
      return;
    }

    if (globalThis.plutonium) {
      //config already set to our path
      if (
        globalThis.plutonium.config.getValue(
          "dataSources",
          "isLoadLocalHomebrewIndex",
        ) &&
        globalThis.plutonium.config.getValue(
          "dataSources",
          "localHomebrewDirectoryPath",
        ) === Common.constants.brewPath
      ) {
        return;
      }

      //config set to another path
      if (
        globalThis.plutonium.config.getValue(
          "dataSources",
          "isLoadLocalHomebrewIndex",
        ) &&
        globalThis.plutonium.config.getValue(
          "dataSources",
          "localHomebrewDirectoryPath",
        ) !== Common.constants.brewPath
      ) {
        await foundry.applications.api.Dialog.confirm({
          title: Common.localize("ROS5E.setting.plutonium-source.title"),
          content: Common.localize("ROS5E.setting.plutonium-source.content"),
          yes: {
            callback: ROS5E.setBrewSources,
          },
        });
      } else {
        ROS5E.setBrewSources();
      }
    } else {
      logger.error(`plutonium not found`);
    }
  }

  /**
   * Appends the specific local ROS5E brew item paths to Plutonium.
   */
  static setBrewSources() {
    globalThis.plutonium.config.setValue(
      "dataSources",
      "isLoadLocalHomebrewIndex",
      true,
    );
    globalThis.plutonium.config.setValue(
      "dataSources",
      "localHomebrewDirectoryPath",
      Common.constants.brewPath,
    );
  }

  /**
   * Gross hack: Need to override dnd5e config after it's loaded as there is no hook for it.
   * This is currently the only way to cleanly append new consumable resources.
   */
  static async bootstrapResources() {
    const sleep = (delay) =>
      new Promise((resolve) => setTimeout(resolve, delay));
    while (globalThis.game.dnd5e.config.consumableResources.length == 0) {
      await sleep(100);
      logger.info(`waiting for consumableResources to be loaded...`);
    }
    globalThis.game.dnd5e.config.consumableResources.push(
      "corruption.permanent",
      "corruption.temp",
    );
  }

  /**
   * Configures DND5E translation keys and overrides for Symbaroum terminology
   */
  static _preTranslateConfig() {
    globalThis.game.dnd5e.config.limitedUsePeriods.er = {
      label: Common.localize("ROS5E.Rest.Extended"),
      abbreviation: "ER",
    };

    /* Add in "Extended Rest" type */
    globalThis.game.dnd5e.config.restTypes.ext = {
      label: Common.localize("ROS5E.Rest.Extended"),
      duration: { normal: 1440, gritty: 10080, epic: 60 },
      recoverPeriods: ["er", "lr", "sr"],
      icon: "fas fa-bed",
      recoverHitDice: true,
      recoverHitPoints: true,
      recoverTemp: true,
      recoverTempMax: true,
      newDay: true,
    };

    /* Add in "Greater Artifact" rarity for items */
    globalThis.game.dnd5e.config.itemRarity.greaterArtifact = Common.localize(
      "ROS5E.Item.Rarity.GreaterArtifact",
    );

    /* Add in "Alchemical Weapon" category for weapons */
    globalThis.game.dnd5e.config.weaponTypes.alchemical = Common.localize(
      "ROS5E.Item.Subtype.Alchemical",
    );

    /* Add in "Alchemical" as a weapon proficiency */
    globalThis.game.dnd5e.config.weaponProficiencies.alc = Common.localize(
      "ROS5E.Proficiency.WeaponAlchemical",
    );

    /* Add in unique Ruins of Symbaroum tool proficiencies */
    const rosTools = {
      artifactCatalog: Common.localize("ROS5E.Proficiency.ArtifactCatalog"),
      bestiary: Common.localize("ROS5E.Proficiency.Bestiary"),
      fieldLaboratory: Common.localize("ROS5E.Proficiency.FieldLaboratory"),
      fieldLibrary: Common.localize("ROS5E.Proficiency.FieldLibrary"),
      trapperManual: Common.localize("ROS5E.Proficiency.TrapperManual"),
      birchbarkhorn: Common.localize("ROS5E.Proficiency.BirchBarkHorn"),
      brasshorn: Common.localize("ROS5E.Proficiency.BrassHorn"),
      fiddle: Common.localize("ROS5E.Proficiency.Fiddle"),
      hurdygurdy: Common.localize("ROS5E.Proficiency.HurdyGurdy"),
      mouthharp: Common.localize("ROS5E.Proficiency.MouthHarp"),
      spinet: Common.localize("ROS5E.Proficiency.Spinet"),
    };

    foundry.utils.mergeObject(
      globalThis.game.dnd5e.config.toolProficiencies,
      rosTools,
    );

    foundry.utils.mergeObject(globalThis.game.dnd5e.config.toolIds, {
      birchbarkhorn: Common.localize("ROS5E.Proficiency.BirchBarkHorn"),
      brasshorn: Common.localize("ROS5E.Proficiency.BrassHorn"),
      fiddle: Common.localize("ROS5E.Proficiency.Fiddle"),
      hurdygurdy: Common.localize("ROS5E.Proficiency.HurdyGurdy"),
      mouthharp: Common.localize("ROS5E.Proficiency.MouthHarp"),
      spinet: Common.localize("ROS5E.Proficiency.Spinet"),
    });

    /* Extend dnd5e weapon properties */
    const weaProps = {
      are: { label: "ROS5E.Item.WeaponProps.AreaEffect" },
      bal: { label: "ROS5E.Item.WeaponProps.Balanced" },
      crw: { label: "ROS5E.Item.WeaponProps.Crewed" },
      con: { label: "ROS5E.Item.WeaponProps.Concealed" },
      dim: { label: "ROS5E.Item.WeaponProps.DeepImpact" },
      ens: { label: "ROS5E.Item.WeaponProps.Ensnaring" },
      imm: { label: "ROS5E.Item.WeaponProps.Immobile" },
      msv: { label: "ROS5E.Item.WeaponProps.Massive" },
      res: { label: "ROS5E.Item.WeaponProps.Restraining" },
      sge: { label: "ROS5E.Item.WeaponProps.Siege" },
    };

    Reflect.ownKeys(weaProps).forEach((prop) => {
      globalThis.game.dnd5e.config.validProperties.weapon.add(prop);
      globalThis.game.dnd5e.config.itemProperties[prop] =
        Common.translateObject(weaProps[prop]);
    });

    /* Extend armor properties */
    const armProps = {
      con: { label: "ROS5E.Item.ArmorProps.Concealable" },
      cmb: { label: "ROS5E.Item.ArmorProps.Cumbersome" },
      noi: { label: "ROS5E.Item.ArmorProps.Noisy" },
      wei: { label: "ROS5E.Item.ArmorProps.Weighty" },
    };

    Reflect.ownKeys(armProps).forEach((prop) => {
      globalThis.game.dnd5e.config.validProperties.equipment.add(prop);
      globalThis.game.dnd5e.config.itemProperties[prop] =
        Common.translateObject(armProps[prop]);
    });

    /* Store new armor properties */
    globalThis.game.ros5e.CONFIG.ARMOR_PROPS = Common.translateObject({
      con: "ROS5E.Item.ArmorProps.Concealable",
      cmb: "ROS5E.Item.ArmorProps.Cumbersome",
      noi: "ROS5E.Item.ArmorProps.Noisy",
      wei: "ROS5E.Item.ArmorProps.Weighty",
    });

    /* insert translated keys into our default item properties */
    globalThis.game.ros5e.CONFIG.DEFAULT_ITEM.armorProps = Object.keys(
      globalThis.game.ros5e.CONFIG.ARMOR_PROPS,
    ).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});

    /* Replace currency names */
    globalThis.game.ros5e.CONFIG.CURRENCY = Common.translateObject({
      gp: "ROS5E.Currency.Thaler",
      sp: "ROS5E.Currency.Shilling",
      cp: "ROS5E.Currency.Orteg",
    });

    /* Apply currency overrides to dnd5e config */
    if (Common.setting("useSymbaroumCurrency")) {
      for (const [key, label] of Object.entries(
        globalThis.game.ros5e.CONFIG.CURRENCY,
      )) {
        if (globalThis.game.dnd5e.config.currencies[key]) {
          if (
            typeof globalThis.game.dnd5e.config.currencies[key] === "object"
          ) {
            globalThis.game.dnd5e.config.currencies[key].label = label;
            globalThis.game.dnd5e.config.currencies[key].abbreviation = label;
          } else {
            globalThis.game.dnd5e.config.currencies[key] = label;
          }
        }
      }
    }
  }

  /**
   * Sets all global variables and configs needed for the ROS5E ecosystem
   */
  static async globals() {
    globalThis.game.ros5e.CONFIG = {};
    globalThis.game.ros5e.CONFIG.LEVEL_SHORT = [
      "ROS5E.Level.Zeroth",
      "ROS5E.Level.First",
      "ROS5E.Level.Second",
      "ROS5E.Level.Third",
      "ROS5E.Level.Fourth",
      "ROS5E.Level.Fifth",
      "ROS5E.Level.Sixth",
      "ROS5E.Level.Seventh",
      "ROS5E.Level.Eighth",
      "ROS5E.Level.Nineth",
    ];

    /* Map the weapon type key (alchemical) to the proficiency key (alc) */
    globalThis.game.dnd5e.config.weaponProficienciesMap.alchemical = "alc";

    /* add 'abomination' and 'phenomenon' to creature types */
    foundry.utils.mergeObject(globalThis.game.dnd5e.config.creatureTypes, {
      abomination: {
        label: "ROS5E.Creature.Abomination",
        icon: "/icons/creatures/magical/spirit-undead-ghost-tan-teal.webp",
        detectAlignment: true,
      },
      phenomenon: {
        label: "ROS5E.Creature.Phenomenon",
        icon: "/icons/creatures/magical/spirit-undead-ghost-purple.webp",
        detectAlignment: true,
      },
    });

    /* redefine used currencies (only cp, sp, gp) */
    globalThis.game.ros5e.CONFIG.CURRENCY_CONVERSION = {
      cp: { into: "sp", each: 10 },
      sp: { into: "gp", each: 10 },
      gp: { into: "gp", each: 1 },
    };

    /* The default values for ros5e actor data */
    globalThis.game.ros5e.CONFIG.DEFAULT_FLAGS = {
      corruption: {
        ability: "cha",
        temp: 0,
        permanent: 0,
        value: 0,
        max: 0,
        bonus: 0,
      },
    };

    /* The default values for ros5e item data */
    globalThis.game.ros5e.CONFIG.DEFAULT_ITEM = {
      armorProps: {}, //populated after translations are loaded
      corruptionOverride: {
        type: "none",
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM, //custom = use stock items values (i.e. "none")
        value: "0",
      },
      corruption: false, //temp storage for previously rolled corruption
    };
    const root = `system`;

    /* paths for syb flag data */
    globalThis.game.ros5e.CONFIG.PATHS = {
      root,
      delete: {
        corruption: `${root}.-=corruption`,
      },
      corruption: {
        root: `${root}.corruption`,
        temp: `${root}.corruption.temp`,
        permanent: `${root}.corruption.permanent`,
        value: `${root}.corruption.value`,
        bonus: `${root}.corruption.bonus`,
        last: {
          total: `${root}.corruption.total`, //last rolled corruption value (items/message)
          expression: `${root}.corruption.expression`, //last roll corruption expression (items/message)
          type: `${root}.corruption.type`, //last rolled corruption type (items/message)
        },
      },
      corruptionOverride: {
        root: `flags.${Common.constants.name}.corruptionOverride`,
        type: `flags.${Common.constants.name}.corruptionOverride.type`,
        value: `flags.${Common.constants.name}.corruptionOverride.value`, //getter only for actors
        mode: `flags.${Common.constants.name}.corruptionOverride.mode`, //for custom corruption items
      },
      manner: `flags.${Common.constants.name}.manner`,
      shadow: `flags.${Common.constants.name}.shadow`,
      favored: `system.favored`,
      armorProps: `flags.${Common.constants.name}.armorProps`,
      sybSoulless: {
        dataPath: `flags.${Common.constants.name}.sybSoulless`,
        scope: Common.constants.name,
        key: "sybSoulless",
      },
    };

    globalThis.game.ros5e.CONFIG.SPELL_PROGRESSION = {
      none: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      full: [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 9, 9],
      half: [0, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    };

    globalThis.game.ros5e.CONFIG.FAVORED_SPELL_PROGRESSION = {
      cantrip: [2, 3, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
      spells: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10],
    };

    CONFIG.DND5E.characterFlags.sybSoulless = {
      hint: "ROS5E.Sheet.Soulless.Hint",
      name: "ROS5E.Sheet.Soulless.Name",
      section: "DND5E.RacialTraits",
      type: Boolean,
    };
  }

  /**
   * Asynchronously fetches ROS weapon/armor JSON configurations during startup.
   * This is used later by the item creation hook to map missing properties.
   */
  static async loadBrewItemProperties() {
    try {
      const response = await fetch(
        "modules/ros5e/brew/items/Awarenet; Ruins of Symbaroum (Items).json",
      );
      const jsonData = await response.json();

      const moduleProps = [
        "dim",
        "ens",
        "con",
        "bal",
        "msv",
        "res",
        "ret",
        "sge",
        "are",
        "imm",
        "rel",
        "crw",
        "cmb",
        "noi",
        "wei",
        "fin",
      ];
      ROS5E._dynamicPropsMap = {};

      for (const item of jsonData.item || []) {
        if (!item.property) continue;
        const customProps = item.property
          .map((p) => p.split("|")[0])
          .filter((p) => moduleProps.includes(p));

        if (customProps.length > 0) {
          ROS5E._dynamicPropsMap[item.name] = customProps;
        }
      }
    } catch (e) {
      console.warn(
        "ROS5E | Failed to load brew items for dynamic property mapping",
        e,
      );
    }
  }

  /**
   * preCreateItem Hook target that analyzes incoming items and forces custom
   * properties back onto the payload if Plutonium stripped them.
   */
  static applyCustomItemProperties(item, data, options, userId) {
    if (game.user.id !== userId) return;

    // Retrieve flag either via API or raw
    const sourceData =
      item.getFlag("plutonium", "source") ||
      (item.flags && item.flags.plutonium && item.flags.plutonium.source);

    if (sourceData !== "RuinsOfSymbaroumI") return;

    // Use our dynamically loaded brew properties
    if (!ROS5E._dynamicPropsMap) return;
    const newCustomProps = ROS5E._dynamicPropsMap[item.name];

    if (newCustomProps && newCustomProps.length > 0) {
      if (item.system.properties instanceof Set) {
        // dnd5e version 3+ syntax (Set)
        const newProperties = new Set(item.system.properties);
        newCustomProps.forEach((p) => newProperties.add(p));
        item.updateSource({ "system.properties": newProperties });
      } else if (Array.isArray(item.system.properties)) {
        // Array fallback
        const newProperties = [...item.system.properties];
        newCustomProps.forEach((p) => {
          if (!newProperties.includes(p)) newProperties.push(p);
        });
        item.updateSource({ "system.properties": newProperties });
      } else {
        // Object fallback (dnd5e 1.x or 2.x fallback)
        const newProperties =
          foundry.utils.deepClone(item.system.properties) || {};
        newCustomProps.forEach((p) => (newProperties[p] = true));
        item.updateSource({ "system.properties": newProperties });
      }
    }
  }
}
