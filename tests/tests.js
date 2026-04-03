import {
  createCharacter,
  openPlutoniumImporter,
  pickImportItemByName,
  handleDialog,
  assertDialogOptions,
  checkOption,
  allArtisanTools,
} from "./foundry-test-utils.js";
import { ImportType, ArtisanTool, ItemType } from "./types.js";
import { testCombos } from "./test-combos.js";
Hooks.on("quenchReady", (quench) => {
  quench.registerBatch(
    "ros5e.createTestCharacters",
    async (context) => {
      const { describe, it, assert } = context;
      describe("Create Test Characters", function () {
        for (const combo of testCombos) {
          it(`Create ${combo.name}`, async function () {
            await createCharacter(combo.name);
          });
        }
      });
    },
    { displayName: "ROS5E: Create Test Characters" },
  );
  quench.registerBatch(
    "ros5e.basic-tests",
    async (context) => {
      const { describe, it, assert } = context;

      describe("Add Player Character", function () {
        it("Create a new player character", async function () {
          actor = await createCharacter("Test Character");
        });

        it("Import Artifact Collector background", async function () {
          await openPlutoniumImporter(actor, ImportType.BACKGROUNDS);
          await pickImportItemByName("Artifact Collector");
        });

        it("Customize Background", async function () {
          await handleDialog("Customize Background");
        });

        it("Customize Background: Skills", async function () {
          await handleDialog("Customize Background: Skills", {
            confirm: "Use Default",
          });
        });
        it("Skill Proficiencies", async function () {
          await handleDialog("Skill Proficiencies", {
            handler: async (dialog) => {
              assertDialogOptions(
                dialog,
                ["Insight", "Investigation", "Perception"],
                "label span.help",
              );
              checkOption(dialog, "Insight");
            },
          });
        });
        it("Customize Background: Languages", async function () {
          await handleDialog("Customize Background: Languages", {
            confirm: "Use Default",
          });
        });
        it("Tool Proficiencies", async function () {
          await handleDialog("Tool Proficiencies", {
            handler: async (dialog) => {
              assertDialogOptions(dialog, allArtisanTools(), "label a");
              checkOption(dialog, ArtisanTool.ALCHEMIST);
            },
          });
        });
        it("Characteristics", async function () {
          await handleDialog("Characteristics", {
            confirm: "Skip",
          });
        });
        it("Equipment", async function () {
          await handleDialog("Equipment", {
            confirm: "Skip",
            timeout: 1500,
          });
        });
        it("Background Complete", async function () {
          actor.assertHasItems(ItemType.BACKGROUND, ["Artifact Collector"]);
          actor.assertHasItems(ItemType.FEAT, ["Inspector"]);
        });
      });
    },
    { displayName: "ROS5E: Add Player Character" },
  );

  quench.registerBatch(
    "DANGEROUS",
    async (context) => {
      const { describe, it, assert } = context;

      describe("Delete All Actors", function () {
        it("Delete all actors", async function () {
          const actors = game.actors.values();
          for (const actor of actors) {
            await actor.delete();
          }
        });
      });
    },
    { displayName: "ROS5E: Delete All Actors" },
  );
});
