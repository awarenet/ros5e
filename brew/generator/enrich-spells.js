import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const defaultBrew = new URL("../spell/Awarenet; Ruins of Symbaroum (Spells).json", import.meta.url);
const defaultData = new URL("../../../plutonium/data/spells/", import.meta.url);
const key = spell => JSON.stringify([spell.name.toLowerCase(), spell.source.toLowerCase()]);
const sideProperties = {
  system: "foundrySystem", flags: "foundryFlags", activities: "foundryActivities",
  effects: "foundryEffects", img: "foundryImg",
  ignoreSrdEffects: "foundryIgnoreSrdEffects", ignoreSrdActivities: "foundryIgnoreSrdActivities",
};

// Fill gaps only: RoS rules, copy modifications, and explicit Foundry overrides win.
export function enrichSpells(brew, originals, sideData) {
  const bySpell = new Map(originals.map(spell => [key(spell), spell]));
  const bySide = new Map((sideData.spell || []).map(spell => [key(spell), spell]));
  const report = { changed: 0, missing: [] };
  for (const spell of brew.spell || []) {
    if (!spell._copy) continue;
    const original = bySpell.get(key(spell._copy));
    if (!original) {
      report.missing.push(`${spell._copy.name} (${spell._copy.source})`);
      continue;
    }
    const before = JSON.stringify(spell);
    // Plutonium gates SRD compendium effects/activities on this normally excluded field.
    if (spell.srd === undefined && original.srd) {
      (spell._copy._preserve ||= {}).srd = true;
      if (spell.name !== original.name && original.srd === true) {
        const mods = spell._copy._mod ||= {};
        // Respect any existing modification of SRD identity.
        mods.srd ??= { mode: "setProp", value: original.name };
      }
    }
    const side = bySide.get(key(original));
    for (const [from, to] of Object.entries(sideProperties)) {
      if (side?.[from] === undefined) continue;
      if (spell[to] === undefined) spell[to] = structuredClone(side[from]);
      else if (["system", "flags"].includes(from)) {
        spell[to] = mergeMissing(spell[to], side[from]);
      }
    }
    if (before !== JSON.stringify(spell)) report.changed++;
  }
  return report;
}

function mergeMissing(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (target[key] === undefined) target[key] = structuredClone(value);
    else if (value && typeof value === "object" && !Array.isArray(value)
      && target[key] && typeof target[key] === "object" && !Array.isArray(target[key])) {
      mergeMissing(target[key], value);
    }
  }
  return target;
}

async function main() {
  const [brewPath, dataPath] = process.argv.slice(2);
  const input = brewPath ? resolve(brewPath) : defaultBrew;
  const data = dataPath ? pathToFileURL(`${resolve(dataPath)}/`) : defaultData;
  const readJson = async path => JSON.parse(await readFile(path, "utf8"));
  const brew = await readJson(input);
  const sources = [...new Set((brew.spell || []).flatMap(spell => spell._copy ? [spell._copy.source] : []))];
  const originals = [];
  for (const source of sources) {
    originals.push(...(await readJson(new URL(`spells-${source.toLowerCase()}.json`, data))).spell);
  }
  const report = enrichSpells(brew, originals, await readJson(new URL("foundry.json", data)));
  if (report.missing.length) throw new Error(`Missing copy targets: ${report.missing.join(", ")}`);
  if (report.changed) await writeFile(input, `${JSON.stringify(brew, null, 2)}\n`);
  console.log(`Enriched ${report.changed} spells; existing overrides and _copy entries retained.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await main();
}
