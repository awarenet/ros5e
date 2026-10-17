// Select character tokens, then run this as a Script macro or in the browser console.
(async () => {
  const actors = [...new Set(canvas.tokens.controlled.map(token => token.actor).filter(Boolean))];
  if (!actors.length) {
    ui.notifications.warn("Select at least one character token.");
    return;
  }

  const load = async (directory, label) => {
    const response = await fetch(
      `modules/ros5e/brew/${directory}/Awarenet; Ruins of Symbaroum (${label}).json`,
      { cache: "no-store" }
    );
    if (!response.ok) throw new Error(`Could not load ROS5E ${directory} data.`);
    return response.json();
  };
  const [classBrew, subclassBrew] = await Promise.all([
    load("class", "Class"), load("subclass", "Subclass")
  ]);
  const multiplierKey = "flags.ros5e.preparedSpellMultiplier";
  const suffix = ` * max(1, @${multiplierKey})`;
  const identifier = entry => entry.name.toLowerCase().replaceAll(" ", "-");
  const matches = (entry, item) => identifier(entry) === item.system.identifier || entry.name === item.name;
  const isBookWorm = item => item.system.identifier === "book-worm" || /^book worm$/i.test(item.name);

  for (const actor of actors) {
    if (!actor.isOwner) {
      ui.notifications.warn(`You cannot update ${actor.name}.`);
      continue;
    }
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
      const existing = Object.values(item.toObject().system.advancement ?? {}).find(advancement =>
        advancement.type === "ScaleValue" && advancement.configuration?.identifier === "max-prepared"
      );
      const id = existing?._id ?? foundry.utils.randomID();
      update(item, {
        [`system.advancement.${id}`]: {
          _id: id,
          type: "ScaleValue",
          title: "Max Prepared Spells",
          configuration: {
            identifier: "max-prepared",
            type: "number",
            scale: Object.fromEntries(progression.map((value, index) => [index + 1, { value }]))
          }
        }
      });
      setFormula(item, item, item.system.classIdentifier ?? item.system.identifier);
    };

    for (const cls of actor.itemTypes.class) {
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

    actor.sheet.render(false);
    ui.notifications.info(`Updated ROS5E spell preparation: ${actor.name}`);
  }
})().catch(error => {
  console.error("ROS5E progression update failed:", error);
  ui.notifications.error(error.message);
});
