// Versioned migrations run only on the active GM client.
export const SPELL_PREPARATION_VERSION = 3;
const migrationFlag = "spellPreparationMigration";

export function collectRoSActors(world = game) {
  const actors = new Set(world.actors);
  for (const scene of world.scenes) {
    for (const token of scene.tokens) {
      if (!token.actorLink && token.actor) actors.add(token.actor);
    }
  }
  return [...actors].filter(actor => actor.getFlag("ros5e", "ros5eActor"));
}

export async function migrateSpellPreparationActor(actor, classBrew, subclassBrew) {
  const multiplierKey = "flags.ros5e.preparedSpellMultiplier";
  const suffix = ` * max(1, @${multiplierKey})`;
  const identifier = entry => entry.name.toLowerCase().replaceAll(" ", "-");
  const matches = (entry, item) => identifier(entry) === item.system.identifier || entry.name === item.name;
  const isBookWorm = item => item.system.identifier === "book-worm" || /^book worm$/i.test(item.name);

  const updates = new Map();
  const update = (item, data) => updates.set(item.id, { ...updates.get(item.id), _id: item.id, ...data });
  const setFormula = (item, source, parentIdentifier) => {
    const reference = `@scale.${source.system.identifier}.max-prepared`;
    const current = item.system.spellcasting?.preparation?.formula;
    const oldParent = `@scale.${parentIdentifier}.max-prepared`;
    if (!current || [reference, reference + suffix, oldParent, oldParent + suffix].includes(current)) {
      update(item, { "system.spellcasting.preparation.formula": reference + suffix });
    }
  };
  const addProgression = (item, progression) => {
    if (progression.length !== 20 || !progression.every(Number.isInteger)) {
      throw new Error(`Invalid preparation progression for ${item.name}.`);
    }
    const raw = item.toObject().system.advancement ?? {};
    const usesArray = Array.isArray(raw);
    const entries = Object.entries(raw);
    let existing;
    let existingKey;
    for (const [key, advancement] of entries) {
      if (advancement.type === "ScaleValue" && advancement.configuration?.identifier === "max-prepared") {
        existing = advancement;
        existingKey = key;
        break;
      }
    }
    const id = existing?._id ?? (!usesArray ? existingKey : undefined) ?? foundry.utils.randomID();
    const scale = {
        ...existing,
        _id: id,
        type: "ScaleValue",
        title: "Max Prepared Spells",
        configuration: {
          ...existing?.configuration,
          identifier: "max-prepared",
          type: "number",
          scale: Object.fromEntries(progression.map((value, index) => [index + 1, { value }]))
        }
      };
    let advancements;
    if (usesArray) {
      advancements = entries.map(([key, value]) => key === existingKey ? scale : value);
      if (existingKey === undefined) advancements.push(scale);
    } else {
      advancements = Object.fromEntries(entries);
      advancements[existingKey ?? id] = scale;
    }
    update(item, { "system.advancement": advancements });
    setFormula(item, item, item.system.classIdentifier ?? item.system.identifier);
  };

  for (const cls of actor.itemTypes.class ?? []) {
    const entry = classBrew.class.find(entry => matches(entry, cls));
    if (!entry) continue;
    if (entry.preparedSpellsProgression) addProgression(cls, entry.preparedSpellsProgression);

    const subclass = cls.subclass;
    const subclassEntry = subclass && subclassBrew.subclass.find(candidate =>
      candidate.className === entry.name && matches(candidate, subclass)
    );
    if (!subclassEntry) continue;
    if (subclassEntry.name === "Explorer") {
      update(subclass, {
        "system.spellcasting.progression": "none",
        "system.spellcasting.ability": "",
        "system.spellcasting.preparation.formula": ""
      });
    } else if (subclassEntry.preparedSpellsProgression) {
      addProgression(subclass, subclassEntry.preparedSpellsProgression);
    } else if (entry.preparedSpellsProgression) {
      setFormula(subclass, cls, cls.system.identifier);
    }
  }

  if (updates.size) await actor.updateEmbeddedDocuments("Item", [...updates.values()]);

  const feats = actor.items.filter(isBookWorm);
  const effects = [...new Set([
    ...feats.flatMap(feat => [...feat.effects]),
    ...[...actor.effects].filter(effect => /^book worm$/i.test(effect.name))
  ])].filter(effect => /^book worm$/i.test(effect.name) || effect.changes.some(change =>
    change.key === multiplierKey || /^system\.spells\.spell\d+\.max$/.test(change.key)
    || /^system\.scale\.[^.]+\.max-prepared\.value$/.test(change.key)
  ));
  const change = { key: multiplierKey, mode: 5, value: "2", priority: 20 };
  for (const effect of effects) {
    const changes = effect.changes.filter(change =>
      change.key !== multiplierKey && !/^system\.spells\.spell\d+\.max$/.test(change.key)
      && !/^system\.scale\.[^.]+\.max-prepared\.value$/.test(change.key)
    );
    await effect.update({ changes: [...changes, change], transfer: effect.parent !== actor });
  }
  if (feats.length && !effects.length) {
    await feats[0].createEmbeddedDocuments("ActiveEffect", [{
      name: "Book Worm", transfer: true, disabled: false, changes: [change]
    }]);
  }

  actor.sheet?.render(false);
}

async function loadBrew(directory, label) {
  const response = await fetch(
    `modules/ros5e/brew/${directory}/Awarenet; Ruins of Symbaroum (${label}).json`,
    { cache: "no-store" }
  );
  if (!response.ok) throw new Error(`Could not load ROS5E ${directory} data.`);
  return response.json();
}

let running;
export function migrateSpellPreparation(options = {}) {
  if (running) return running;
  running = runMigration(options).finally(() => { running = undefined; });
  return running;
}

async function runMigration({ force = false } = {}) {
  if (!game.user.isGM || game.users.activeGM?.id !== game.user.id) {
    ui.notifications.warn("The active GM must run the ROS5E migration.");
    return { migrated: 0, failed: 0 };
  }
  const candidates = collectRoSActors();
  const actors = candidates.filter(actor =>
    force || (actor.getFlag("ros5e", migrationFlag) ?? 0) < SPELL_PREPARATION_VERSION
  );
  const result = { migrated: 0, failed: 0 };
  console.info(`ROS5E spell preparation migration v${SPELL_PREPARATION_VERSION}: ${candidates.length} RoS actors found; ${actors.length} pending.`);
  if (!actors.length) {
    if (force) ui.notifications.info(`ROS5E spell preparation: no RoS actors found to migrate.`);
    return result;
  }
  ui.notifications.info(`ROS5E: migrating spell preparation for ${actors.length} actors.`);
  const [classes, subclasses] = await Promise.all([
    loadBrew("class", "Class"), loadBrew("subclass", "Subclass")
  ]);
  for (const actor of actors) {
    try {
      if (!actor.isOwner) throw new Error(`You cannot update ${actor.name}.`);
      await migrateSpellPreparationActor(actor, classes, subclasses);
      await actor.setFlag("ros5e", migrationFlag, SPELL_PREPARATION_VERSION);
      result.migrated++;
    } catch (error) {
      result.failed++;
      console.error(`ROS5E spell preparation migration failed for ${actor.name}:`, error);
    }
  }
  const message = `ROS5E spell preparation: updated ${result.migrated} actors; ${result.failed} failed.`;
  if (result.failed) ui.notifications.error(`${message} See the console for details.`);
  else ui.notifications.info(message);
  return result;
}

export class Migrations {
  static NAME = "Migrations";

  static register() {
    Hooks.once("ready", () => {
      game.ros5e.migrateSpellPreparation = migrateSpellPreparation;
      if (!game.user.isGM || game.users.activeGM?.id !== game.user.id) return;
      return migrateSpellPreparation().catch(error => {
        console.error("ROS5E migration failed:", error);
        ui.notifications.error(`ROS5E migration failed: ${error.message}`);
      });
    });
  }
}
