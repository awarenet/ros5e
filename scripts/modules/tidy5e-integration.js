import { Common } from "../common.js";
import { SybCorruptionDialog } from "./apps/syb-corruption-dialog.js";

export class Tidy5eIntegration {
  static NAME = "Tidy5eIntegration";

  static register() {
    Hooks.once("tidy5e-sheet.ready", (api) => {
      Tidy5eIntegration.registerCorruption(api);
      Tidy5eIntegration.registerExtRest(api);
      Tidy5eIntegration.registerSpellcaster(api);
      Handlebars.registerHelper("defaultIfEmpty", function (a, b) {
        return a ? a : b;
      });
    });
    Hooks.on("tidy5e-sheet.selectTab", (app, element, id) => {
      document
        .querySelectorAll("header.spell-method.method-spell")
        .forEach((el) => Tidy5eIntegration.addMaxSpells(el, app));
      app.render();
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

  static addMaxSpells(element, app) {
    const key = element.attributes["data-key"]?.value;
    if (key) {
      const max = app.actor.system.spells[key]?.max;
      if (max != null) {
        var countspan = element.querySelector("span.table-header-count");
        var count = parseInt(countspan.innerText);
        if (count != null && count > max) {
          countspan.classList.add("overlimit");
        } else {
          countspan.classList.remove("overlimit");
        }
      }
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

  // Spellcaster chips
  static registerSpellcaster(api) {
    api.registerActorContent(
      new api.models.HandlebarsContent({
        path: `${Common.constants.path}/templates/actors/parts/tidy-spellcaster-container.hbs`,
        injectParams: {
          selector: `.spellcasting-class-card`,
          position: "beforebegin",
        },
        // context doesn't have the extension method for get ros5eActor so we have to do it manually
        getData(context) {
          if (context.actor.getRunes()) {
            context.runes = {
              prepared: context.actor.getRunes().prepared.length,
              max: context.actor.system.attributes.prof * 2,
            };
          }
          context.talismans = context.actor.getTalismans();
          context.favored = context.actor.getFavoredSpells();
          context.cantripsmax = context.actor.getFavoredSpellsMax("cantrip");
          context.spellsmax = context.actor.getFavoredSpellsMax("spells");
          context.show = context.runes || context.talismans || context.favored;
          return context;
        },
      }),
    );
  }

  // Known spell counts
  static registerKnownSpells(api) {
    api.registerActorContent(
      new api.models.HandlebarsContent({
        path: `${Common.constants.path}/templates/actors/parts/tidy-known-spells.hbs`,
        injectParams: {
          selector: `.spellcasting-class-card`,
          position: "beforebegin",
        },
        // context doesn't have the extension method for get ros5eActor so we have to do it manually
        getData(context) {
          if (context.actor.getRunes()) {
            context.runes = {
              prepared: context.actor.getRunes().prepared.length,
              max: context.actor.system.attributes.prof * 2,
            };
          }
          context.talismans = context.actor.getTalismans();
          context.favored = context.actor.getFavoredSpells();
          context.cantripsmax = context.actor.getFavoredSpellsMax("cantrip");
          context.spellsmax = context.actor.getFavoredSpellsMax("spells");
          context.show = context.runes || context.talismans || context.favored;
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
