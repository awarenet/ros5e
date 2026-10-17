import assert from "node:assert/strict";
import { test } from "node:test";
import { ItemSyb5e } from "../scripts/modules/item.js";
import { LibWrapperShim } from "../scripts/libraries/LibWrapper/shim.js";

globalThis.foundry = { utils: { deepClone: structuredClone } };

function casting({ type = "class", syb = true, formula = "", max = 0, classMax = 12 } = {}) {
  const parent = {
    system: {
      spellcasting: {
        preparation: { formula: "@scale.mystic.max-prepared", value: 2, max: classMax },
      },
    },
  };
  const item = {
    type,
    actor: { isSybActor: () => syb },
    system: parent.system,
    class: parent,
  };
  const original = { ability: "int", preparation: { formula, value: 2, max } };
  const result = ItemSyb5e.getSpellcasting.call(item, () => structuredClone(original));
  return { result, item, original };
}

test("a subclass ability override inherits the class's doubled preparation limit", () => {
  const { result, item } = casting();
  assert.equal(result.ability, "int");
  assert.equal(result.preparation.max, 12);
  assert.equal(result.preparation.value, 2);
  result.preparation.max = 99;
  assert.equal(item.system.spellcasting.preparation.max, 12);
});

test("the subclass getter also inherits class preparation", () => {
  assert.equal(casting({ type: "subclass" }).result.preparation.max, 12);
});

test("the base preparation limit is used when Book Worm is absent", () => {
  assert.equal(casting({ classMax: 6 }).result.preparation.max, 6);
});

test("a subclass's explicit preparation formula takes precedence", () => {
  const { result } = casting({ formula: "@scale.self-taught.max-prepared", max: 5 });
  assert.equal(result.preparation.max, 5);
});

test("other systems' actors keep the original spellcasting data", () => {
  const { result, original } = casting({ syb: false });
  assert.deepEqual(result, original);
});

test("the runtime shim registers the spellcasting getter as a wrapper", () => {
  class Item5e {
    get spellcasting() {
      return { ability: "int", preparation: { formula: "", value: 2, max: 0 } };
    }
    prepareDerivedData() {}
    hasDamage() {}
  }
  globalThis.dnd5e = { documents: { Item5e } };
  LibWrapperShim.register();
  ItemSyb5e.patch();

  const item = Object.assign(new Item5e(), casting().item);
  assert.equal(item.spellcasting.preparation.max, 12);
  assert.equal(item.spellcasting.ability, "int");
});
