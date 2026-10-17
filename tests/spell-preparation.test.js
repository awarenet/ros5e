import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
const classes = JSON.parse(read("../brew/class/Awarenet; Ruins of Symbaroum (Class).json"));
const subclasses = JSON.parse(read("../brew/subclass/Awarenet; Ruins of Symbaroum (Subclass).json"));
const feats = JSON.parse(read("../brew/feat/Awarenet; Ruins of Symbaroum (Feats).json"));
const migration = read("../scripts/modules/migrations.js").replaceAll("export ", "");
const suffix = " * max(1, @flags.ros5e.preparedSpellMultiplier)";
const formula = identifier => `@scale.${identifier}.max-prepared${suffix}`;

test("Explorer has no casting; Former Cultist and Templar retain their per-spell-level data", () => {
  const explorer = subclasses.subclass.find(entry => entry.name === "Explorer");
  assert.equal(explorer.casterProgression, undefined);
  assert.equal(explorer.spellcastingAbility, undefined);
  for (const name of ["Former Cultist", "Templar"]) {
    const entry = subclasses.subclass.find(entry => entry.name === name);
    assert.equal(entry.preparedSpellsProgression[4], 3);
    assert.equal(entry.preparedSpellsProgression[19], 15);
    for (let level = 1; level <= 20; level++) {
      assert.equal(entry.preparedSpellsProgression[level - 1],
        Object.values(entry.spellsKnownProgressionFixedByLevel[level]).reduce((a, b) => a + b, 0));
    }
  }
});

test("every ROS preparation formula uses the universal Book Worm multiplier", () => {
  for (const entry of [...classes.class, ...subclasses.subclass]) {
    if (entry.preparedSpellsProgression || entry.className === "Mystic") {
      const actual = entry.foundrySystem.spellcasting.preparation.formula;
      assert.ok(actual.endsWith(suffix), entry.name);
      if (entry.preparedSpellsProgression) {
        assert.equal(actual, formula(entry.name.toLowerCase().replaceAll(" ", "-")));
      }
    }
  }
  const change = feats.feat.find(entry => entry.name === "Book Worm").foundryEffects[0].changes[0];
  assert.equal(change.key, "flags.ros5e.preparedSpellMultiplier");
  assert.equal(change.mode, "OVERRIDE");
  assert.equal(change.value, "2");
  assert.equal(subclasses.subclass.find(entry => entry.name === "Self-taught").preparedSpellsProgression[4], 5);
});

function apply(document, updates) {
  for (const [path, value] of Object.entries(updates)) {
    const keys = path.split(".");
    let target = document;
    for (const key of keys.slice(0, -1)) target = target[key] ??= {};
    target[keys.at(-1)] = structuredClone(value);
  }
}

function fixture(className, subclassName, bookWorm = false) {
  const identifier = name => name.toLowerCase().replaceAll(" ", "-");
  const item = name => ({ id: identifier(name), name, system: {
    identifier: identifier(name), spellcasting: { progression: "full", preparation: { formula: "" } }, advancement: {}
  }, toObject() { return { system: structuredClone(this.system) }; } });
  const cls = item(className), subclass = item(subclassName);
  cls.subclass = subclass;
  subclass.system.classIdentifier = cls.system.identifier;
  const actor = {
    name: "Existing Character", isOwner: true, itemTypes: { class: [cls] },
    items: [cls, subclass], effects: [], sheet: { render() {} },
    async updateEmbeddedDocuments(type, updates) {
      assert.equal(type, "Item");
      for (const update of updates) apply(this.items.find(item => item.id === update._id), update);
    }
  };
  if (bookWorm) {
    const feat = item("Book Worm");
    feat.createEmbeddedDocuments = async (type, effects) => {
      assert.equal(type, "ActiveEffect");
      for (const data of effects) {
        feat.effects.push({ ...structuredClone(data), parent: feat,
          async update(update) { apply(this, update); }
        });
      }
    };
    feat.effects = [{ name: "Book Worm", parent: feat, disabled: false,
      changes: [{ key: "system.scale.mystic.max-prepared.value", mode: 1, value: "2" }],
      async update(data) { apply(this, data); }
    }];
    actor.items.push(feat);
  }
  return { actor, cls, subclass };
}

async function migrate(actors) {
  const errors = [];
  let nextId = 0;
  const context = {
    canvas: { tokens: { controlled: actors.flatMap(actor => [{ actor }, { actor }]) } },
    fetch: async url => ({ ok: true, json: async () => url.includes("(Subclass)") ? subclasses : classes }),
    foundry: { utils: { randomID: () => `scale-${++nextId}` } },
    ui: { notifications: { info() {}, warn() {}, error: message => errors.push(message) } }, console
  };
  context.actors = actors;
  context.classes = classes;
  context.subclasses = subclasses;
  const run = `(async () => { ${migration}\nfor (const actor of actors) await migrateSpellPreparationActor(actor, classes, subclasses); })()`;
  await runInNewContext(run, context);
  await runInNewContext(run, context);
  assert.deepEqual(errors, []);
}

test("migration updates existing class/subclass formulas and Book Worm without duplicating scales", async () => {
  const mystic = fixture("Mystic", "Blood Mage", true);
  const templar = fixture("Warrior", "Templar", true);
  const cultist = fixture("Scoundrel", "Former Cultist");
  const explorer = fixture("Scoundrel", "Explorer");
  const selfTaught = fixture("Mystic", "Self-taught");
  await migrate([mystic, templar, cultist, explorer, selfTaught].map(f => f.actor));
  assert.equal(mystic.cls.system.spellcasting.preparation.formula, formula("mystic"));
  assert.equal(mystic.subclass.system.spellcasting.preparation.formula, formula("mystic"));
  for (const fixture of [templar, cultist, selfTaught]) {
    assert.equal(fixture.subclass.system.spellcasting.preparation.formula, formula(fixture.subclass.system.identifier));
    assert.equal(Object.keys(fixture.subclass.system.advancement).length, 1);
  }
  assert.equal(Object.keys(mystic.cls.system.advancement).length, 1);
  assert.equal(explorer.subclass.system.spellcasting.progression, "none");
  assert.equal(explorer.subclass.system.spellcasting.ability, "");
  for (const fixture of [mystic, templar]) {
    const changes = fixture.actor.items.find(item => item.name === "Book Worm").effects[0].changes;
    assert.equal(changes.length, 1);
    assert.equal(changes[0].key, "flags.ros5e.preparedSpellMultiplier");
    assert.equal(changes[0].mode, 5);
  }
});

test("migration preserves a custom preparation formula", async () => {
  const { actor, subclass } = fixture("Mystic", "Blood Mage");
  subclass.system.spellcasting.preparation.formula = "@scale.custom.prepared";
  await migrate([actor]);
  assert.equal(subclass.system.spellcasting.preparation.formula, "@scale.custom.prepared");
});

test("migration repairs Book Worm feats that have no effect", async () => {
  const { actor } = fixture("Warrior", "Templar", true);
  const feat = actor.items.find(item => item.name === "Book Worm");
  feat.effects = [];
  await migrate([actor]);
  assert.equal(feat.effects.length, 1);
  assert.equal(feat.effects[0].transfer, true);
  assert.equal(feat.effects[0].changes.length, 1);
  assert.equal(feat.effects[0].changes[0].key, "flags.ros5e.preparedSpellMultiplier");
});

test("migration keeps Book Worm's disabled state and unrelated effect changes", async () => {
  const { actor } = fixture("Mystic", "Blood Mage", true);
  const effect = actor.items.find(item => item.name === "Book Worm").effects[0];
  effect.disabled = true;
  effect.changes.push({ key: "system.attributes.hp.max", mode: 2, value: "1" });
  await migrate([actor]);
  assert.equal(effect.disabled, true);
  assert.equal(effect.changes.length, 2);
  assert.equal(effect.changes[0].key, "system.attributes.hp.max");
});

function worldFixture() {
  const actor = () => {
    const { actor } = fixture("Mystic", "Blood Mage");
    actor.flags = { ros5eActor: true };
    actor.getFlag = (scope, key) => actor.flags[key];
    actor.setFlag = async (scope, key, value) => { actor.flags[key] = value; };
    return actor;
  };
  const worldActor = actor(), tokenActor = actor(), unrelated = actor();
  unrelated.flags.ros5eActor = false;
  const errors = [];
  let loads = 0, nextId = 0;
  const context = {
    game: { user: { id: "gm", isGM: true }, users: { activeGM: { id: "gm" } },
      actors: [worldActor, unrelated], scenes: [{ tokens: [
        { actorLink: true, actor: worldActor }, { actorLink: false, actor: tokenActor }
      ] }] },
    fetch: async url => { loads++; return { ok: true, json: async () => url.includes("(Subclass)") ? subclasses : classes }; },
    foundry: { utils: { randomID: () => `world-scale-${++nextId}` } },
    ui: { notifications: { info() {}, warn() {}, error: message => errors.push(message) } },
    console: { error() {} }
  };
  const api = runInNewContext(`(() => { ${migration}\nreturn { migrateSpellPreparation, collectRoSActors }; })()`, context);
  return { ...api, worldActor, tokenActor, unrelated, errors, context, loads: () => loads };
}

test("world migration includes unlinked tokens, skips non-RoS actors, and records successful versions", async () => {
  const world = worldFixture();
  assert.equal(world.collectRoSActors().length, 2);
  const result = await world.migrateSpellPreparation();
  assert.equal(result.migrated, 2);
  assert.equal(result.failed, 0);
  assert.equal(world.worldActor.flags.spellPreparationMigration, 1);
  assert.equal(world.tokenActor.flags.spellPreparationMigration, 1);
  assert.equal(world.unrelated.flags.spellPreparationMigration, undefined);
  assert.equal((await world.migrateSpellPreparation()).migrated, 0);
  assert.equal(world.loads(), 2);
  assert.equal((await world.migrateSpellPreparation({ force: true })).migrated, 2);
});

test("only the active GM migrates actors", async () => {
  for (const user of [{ id: "player", isGM: false }, { id: "other-gm", isGM: true }]) {
    const world = worldFixture();
    world.context.game.user = user;
    assert.equal((await world.migrateSpellPreparation()).migrated, 0);
    assert.equal(world.loads(), 0);
  }
});

test("actor failures are isolated and remain eligible for retry", async () => {
  const world = worldFixture();
  world.worldActor.isOwner = false;
  const result = await world.migrateSpellPreparation();
  assert.equal(result.failed, 1);
  assert.equal(result.migrated, 1);
  assert.equal(world.worldActor.flags.spellPreparationMigration, undefined);
  assert.equal(world.tokenActor.flags.spellPreparationMigration, 1);
  world.worldActor.isOwner = true;
  assert.equal((await world.migrateSpellPreparation()).migrated, 1);
});
