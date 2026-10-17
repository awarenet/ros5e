Run `npm run brew:spells:enrich` to enrich the existing spell brew in place.
This does not run `spell.generator.js` or recreate the spell list.

The default input is `brew/spell/Awarenet; Ruins of Symbaroum (Spells).json`;
source data comes from the sibling module `../plutonium/data/spells/`.
To supply different paths, run:

```sh
npm run brew:spells:enrich -- /path/to/brew.json /path/to/data/spells
```

The generator looks up each `_copy` target by its original name and exact source.
It adds `_copy._preserve.srd`, retaining the `srd` marker that `_copy` normally excludes, allowing Plutonium
to load Foundry SRD effects and activities. Renamed spells receive the original
SRD name as an alias through a `setProp` copy modification. It also fills missing inline Foundry fields from matching
`foundry.json` records. PHB records never fall back to XPHB records.

Existing values, RoS flags, and `_copy` modifications take precedence. Repeating
the command does not duplicate data. Missing source files or copy targets fail
before writing. Previously generated values are treated as existing overrides;
remove a generated field to refresh it from updated source data.

SRD effects come from the configured Foundry compendium at import time. This
command does not update spells already imported into a world. Non-SRD spells
without exact-source Foundry side data still need separate automation data.
