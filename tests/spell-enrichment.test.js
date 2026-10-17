import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { enrichSpells } from "../brew/generator/enrich-spells.js";

test("enrichment restores SRD access and exact-source side data without replacing RoS overrides", () => {
  const copy = { name: "Bless", source: "PHB", _mod: { "*": { mode: "replaceTxt" } } };
  const spell = { name: "RoS Bless", source: "RoS", _copy: structuredClone(copy),
    foundryFlags: { ros5e: { isRoSSpell: true } }, foundrySystem: { target: { count: 2 } } };
  const brew = { spell: [spell] };
  const originals = [{ name: "Bless", source: "PHB", srd: true }];
  const side = { spell: [
    { name: "Bless", source: "XPHB", effects: [{ name: "Wrong edition" }] },
    { name: "Bless", source: "PHB", effects: [{ foundryId: "bless" }],
      activities: [{ type: "utility", effects: [{ foundryId: "bless" }] }],
      flags: { other: true }, system: { target: { count: 3, type: "creature" } } },
  ] };
  assert.equal(enrichSpells(brew, originals, side).changed, 1);
  assert.equal(spell._copy._preserve.srd, true);
  assert.equal(spell._copy._mod.srd.value, "Bless");
  assert.deepEqual(spell._copy._mod["*"], copy._mod["*"]);
  assert.equal(spell.foundrySystem.target.count, 2);
  assert.equal(spell.foundrySystem.target.type, "creature");
  assert.equal(spell.foundryFlags.ros5e.isRoSSpell, true);
  assert.equal(spell.foundryEffects[0].foundryId, spell.foundryActivities[0].effects[0].foundryId);
  assert.equal(enrichSpells(brew, originals, side).changed, 0);
});

test("missing targets are reported and explicit SRD opt-outs are respected", () => {
  const brew = { spell: [{ name: "Custom" },
    { name: "Bless", srd: false, _copy: { name: "Bless", source: "PHB" } },
    { name: "Missing", _copy: { name: "Missing", source: "PHB" } }] };
  const report = enrichSpells(brew, [{ name: "Bless", source: "PHB", srd: true }], {});
  assert.deepEqual(report.missing, ["Missing (PHB)"]);
  assert.equal(brew.spell[1].srd, false);
});

test("shipped Bless retains PHB copy and enables Foundry SRD automation", () => {
  const brew = JSON.parse(readFileSync(new URL("../brew/spell/Awarenet; Ruins of Symbaroum (Spells).json", import.meta.url)));
  const bless = brew.spell.find(spell => spell.name === "Bless");
  assert.deepEqual(bless._copy, { name: "Bless", source: "PHB", _preserve: { srd: true } });
  assert.equal(bless.foundryFlags.ros5e.isRoSSpell, true);
});
