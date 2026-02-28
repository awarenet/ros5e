/* Common operations and utilities for all
 * core submodules
 */

const NAME = "ros5e";
const TITLE = "Symbaroum 5E Ruins of Symbaroum - Core System";
const PATH = `modules/${NAME}`;

export class Common {
  /** CONSTANTS **/
  static constants = {
    name: NAME,
    path: PATH,
    title: TITLE,
    brewPath: `${PATH}/brew`,
  };

  static NAME = this.name;

  static register() {
    globalThis.game.ros5e = {
      debug: {},
    };
  }

  /** HELPER FUNCTIONS **/
  static setting(key, value = null) {
    if (value !== null) {
      return game.settings.set(Common.constants.name, key, value);
    }

    return game.settings.get(Common.constants.name, key);
  }

  static localize(stringId, data = {}) {
    return game.i18n.format(stringId, data);
  }

  static applySettings(settingsData, moduleKey = Common.constants.name) {
    Object.entries(settingsData).forEach(([key, data]) => {
      game.settings.register(moduleKey, key, {
        name: Common.localize(`ROS5E.setting.${key}.name`),
        hint: Common.localize(`ROS5E.setting.${key}.hint`),
        ...data,
      });
    });
  }

  static translateObject(obj) {
    Object.keys(obj).forEach((key) => (obj[key] = Common.localize(obj[key])));
    return obj;
  }

  //libwrapper patcher
  static patch(target, path, patches) {
    if (!target) return;

    Object.entries(patches).forEach(([name, data]) => {
      /* properties support (getters/setters) */
      if (data.get || data.set) {
        Object.defineProperty(target, name, {
          configurable: true,
          get: data.get,
          set: data.set,
        });
      } else {
        const type = data.type ?? "WRAPPER";
        //Shim allows for 'WRAPPER', 'MIXED', 'OVERRIDE'

        /* if we have a type, use it, otherwise check the mode */
        const mode = data.mode ?? type;

        libWrapper.register(
          Common.constants.name,
          `${path}.${name}`,
          data.value,
          mode,
        );
      }
    });
  }
}
