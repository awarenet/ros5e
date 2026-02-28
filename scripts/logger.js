/* Code used with permission:
 *  Copyright (c) 2020-2021 DnD5e Helpers Team and Contributors
 *  Full License at "scripts/licenses/DnD5e-Helpers-LICENSE"
 */

import { Common } from "./common.js";

export class logger {
  static NAME = this.name;

  static info(...args) {
    console.log(`${Common?.constants?.title || ""}  | `, ...args);
  }
  static debug(...args) {
    if (Common.setting("debug")) this.info("DEBUG | ", ...args);
  }
  static error(...args) {
    console.error(`${Common?.constants?.title || ""} | ERROR | `, ...args);
    ui.notifications.error(
      `${Common?.constants?.title || ""} | ERROR | ${args[0]}`,
    );
  }

  static warning(notify, ...args) {
    console.warn(`${Common?.constants?.title || ""} | WARNING | `, ...args);
    if (notify) this.warn(...args);
  }

  static notify(...args) {
    ui.notifications.notify(`${args[0]}`);
  }

  static warn(...args) {
    ui.notifications.warn(`${args[0]}`);
  }

  static register() {
    this.settings();
  }

  static settings() {
    const config = true;
    const settingsData = {
      debug: {
        scope: "world",
        config,
        default: false,
        type: Boolean,
      },
    };

    Common.applySettings(settingsData);
  }
}
