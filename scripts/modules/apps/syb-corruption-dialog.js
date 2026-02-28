import { Common } from "../../common.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class SybCorruptionDialog extends HandlebarsApplicationMixin(
  ApplicationV2,
) {
  static DEFAULT_OPTIONS = {
    tag: "form",
    id: "syb-corruption-dialog",
    classes: ["dnd5e2", "ros5e", "corruption-dialog"],
    window: {
      title: "ROS5E.Corruption.Label",
      icon: "fas fa-biohazard",
      resizable: false,
    },
    position: {
      width: 300,
      height: "auto",
    },
    form: {
      handler: SybCorruptionDialog.onSubmit,
      closeOnSubmit: true,
    },
  };

  static PARTS = {
    form: {
      template: "modules/ros5e/templates/apps/corruption-dialog.hbs",
    },
  };

  constructor(options) {
    super(options);
    this.document = options.document;
  }

  async _prepareContext(options) {
    return {
      corruption: this.document.corruption,
    };
  }

  static async create(document) {
    return new this({ document }).render(true);
  }

  static async onSubmit(event, form, formData) {
    const updateData = {
      [game.ros5e.CONFIG.PATHS.corruption.temp]: formData.object.temp,
      [game.ros5e.CONFIG.PATHS.corruption.permanent]: formData.object.permanent,
      [game.ros5e.CONFIG.PATHS.corruption.bonus]: formData.object.bonus,
    };
    await this.document.update(updateData);
  }
}
