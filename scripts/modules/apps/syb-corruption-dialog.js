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
    const base = this.document.system.toObject().corruption;
    const derived = this.document.corruption;
    return {
      corruption: base,
      modifiers: {
        temp: (derived.temp ?? 0) - (base.temp ?? 0),
        permanent: (derived.permanent ?? 0) - (base.permanent ?? 0),
        bonus: (derived.bonus ?? 0) - (base.bonus ?? 0),
      },
      totals: {
        temp: derived.temp ?? 0,
        permanent: derived.permanent ?? 0,
        bonus: derived.bonus ?? 0,
        threshold: this.document.corruptionThreshold,
      },
      thresholdBase: this.document.corruptionThreshold - (derived.bonus ?? 0),
    };
  }

  static async create(document) {
    return new this({ document }).render(true);
  }

  _onRender(context, options) {
    super._onRender(context, options);
    const html = this.element;
    const inputs = html.querySelectorAll('input[type="number"]');
    inputs.forEach((input) => {
      input.addEventListener("input", this._onChangeInput.bind(this));
    });
  }

  _onChangeInput(event) {
    const input = event.currentTarget;
    const value = parseInt(input.value) || 0;
    const modifier = parseInt(input.dataset.modifier) || 0;
    const field = input.name;

    const html = this.element;
    const totalSpan = html.querySelector(`.total-value[data-field="${field}"]`);

    if (totalSpan) {
      if (field === "bonus") {
        const container = html.querySelector(".corruption-dialog-container");
        const thresholdBase = parseInt(container.dataset.thresholdBase) || 0;
        const bonusTotal = value + modifier;
        const newThreshold = thresholdBase + bonusTotal;

        const totalThresholdSpan = html.querySelector(".total-threshold-value");
        if (totalThresholdSpan) totalThresholdSpan.innerText = newThreshold;
      } else {
        totalSpan.innerText = value + modifier;
      }
    }
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
