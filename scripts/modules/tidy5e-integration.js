import { Common } from "../common.js";
import { SybCorruptionDialog } from "./apps/syb-corruption-dialog.js";

export class Tidy5eIntegration {
  static NAME = "Tidy5eIntegration";

  static register() {
    Hooks.once("tidy5e-sheet.ready", (api) => {
      Tidy5eIntegration.registerCorruption(api);
      Tidy5eIntegration.registerTalisman(api);
      Tidy5eIntegration.registerExtRest(api);
      Tidy5eIntegration.registerFavored(api);
      Tidy5eIntegration.registerRunes(api);
    });
    if (Common.setting("useSymbaroumCurrency")) {
      Hooks.on("renderActorSheetV2", (app, element, data, forced) => {
        // remove unused currency fields
        document.querySelector(
          '.currency-container .input-group:has(input[data-tidy-field="system.currency.pp"])',
        ).style.display = "none";
        document.querySelector(
          '.currency-container .input-group:has(input[data-tidy-field="system.currency.ep"])',
        ).style.display = "none";
      });
    }
  }

  // Corruption ability bar
  static registerCorruption(api) {
    api.registerActorContent(
      new api.models.HandlebarsContent({
        path: `${Common.constants.path}/templates/actors/parts/tidy-corruption-container.hbs`,
        injectParams: {
          selector: `.ability.cha`,
          position: "afterend",
        },
        onRender(params) {
          const element = params.element;
          const container = element.querySelector?.(".ability.corruption");
          container?.addEventListener("click", () => {
            SybCorruptionDialog.create(params.app.document);
          });
        },
        // context doesn't have the extension method for get ros5eActor so we have to do it manually
        getData(context) {
          context.isSybActor = context.actor.flags
            ? context.actor.flags[Common.constants.name]?.ros5eActor > 0
            : false;
          context.corruptionThreshold = context.actor.corruptionThreshold;
          return context;
        },
      }),
    );
  }

  // Talisman chip
  static registerTalisman(api) {
    api.registerActorContent(
      new api.models.HandlebarsContent({
        path: `${Common.constants.path}/templates/actors/parts/tidy-talisman-container.hbs`,
        injectParams: {
          selector: `.info.pills .pill:last-child`,
          position: "beforebegin",
        },
        // context doesn't have the extension method for get ros5eActor so we have to do it manually
        getData(context) {
          context.talismans = context.actor.getTalismans();
          return context;
        },
      }),
    );
  }

  // Runes chip
  static registerRunes(api) {
    api.registerActorContent(
      new api.models.HandlebarsContent({
        path: `${Common.constants.path}/templates/actors/parts/tidy-rune-container.hbs`,
        injectParams: {
          selector: `.info.pills .pill:last-child`,
          position: "beforebegin",
        },
        // context doesn't have the extension method for get ros5eActor so we have to do it manually
        getData(context) {
          if (!context.actor.getRunes()) {
            return context;
          }
          context.runes = {
            prepared: context.actor.getRunes().prepared.length,
            max: context.actor.system.attributes.prof * 2,
          };
          return context;
        },
      }),
    );
  }

  // Favored Spells/Cantrips chip
  static registerFavored(api) {
    api.registerActorContent(
      new api.models.HandlebarsContent({
        path: `${Common.constants.path}/templates/actors/parts/tidy-favored-container.hbs`,
        injectParams: {
          selector: `.info.pills .pill:last-child`,
          position: "beforebegin",
        },
        // context doesn't have the extension method for get ros5eActor so we have to do it manually
        getData(context) {
          context.favored = context.actor.getFavoredSpells();
          context.cantripsmax = context.actor.getFavoredSpellsMax("cantrip");
          context.spellsmax = context.actor.getFavoredSpellsMax("spells");
          return context;
        },
      }),
    );
  }

  // Extended Rest button
  static registerExtRest(api) {
    api.registerActorContent(
      new api.models.HandlebarsContent({
        path: `${Common.constants.path}/templates/actors/parts/tidy-extended-rest-container.hbs`,
        injectParams: {
          selector: `[data-tooltip="DND5E.REST.Long.Label"]`,
          position: "afterend",
        },
        onRender(params) {
          const element = params.element;
          const button = element.querySelector?.(".extended-rest");
          button?.addEventListener("click", () => {
            params.app.document.extendedRest();
          });
        },
        getData(context) {
          // context doesn't have the extension method for get ros5eActor so we have to do it manually
          context.isSybActor = context.actor.flags
            ? context.actor.flags[Common.constants.name]?.ros5eActor > 0
            : false;
          return context;
        },
      }),
    );
  }
}
