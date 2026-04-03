import {
  $$,
  waitForDOM,
  findByText,
  waitForState,
  waitForText,
} from "./test-utils.js";

export { ArtisanTool, allArtisanTools, ImportType, ItemType } from "./types.js";

export const createCharacter = async (name) => {
  $$("button[data-tab='actors']").click();
  $$("section[data-tab='actors'] button[data-action='createEntry']").click();
  await waitForDOM("input[name='name']");
  $$("input[name='name']").value = name;
  $$("input[value='character']").click();
  $$("button[data-action='ok']").click();
  await waitForState(() => game.actors.getName(name), {
    label: `actor "${name}"`,
  });
  return game.actors.getName(name);
};

export const openPlutoniumImporter = async (actor, importType) => {
  await plutonium.importer.pOpen({ actor: actor });
  const btn = findByText("button.ve-btn-5et", importType);
  if (!btn) throw new Error(`Import type button not found: ${importType}`);
  btn.click();
  await selectAwarenetSources();
  const confirmBtn = await waitForText("button.ve-btn-5et", "Open Importer");
  confirmBtn.click();
};

export async function selectAwarenetSources() {
  const list = await waitForText("label.row", "Awarenet;");
  const labels = list.querySelectorAll("label.row");
  [...labels].forEach((label) => {
    const checkbox = label.querySelector("input[type='checkbox']");
    if (!checkbox) return;
    const isAwarenet = label.textContent.includes("Awarenet;");
    if (isAwarenet && !checkbox.checked) checkbox.click();
    if (!isAwarenet && checkbox.checked) checkbox.click();
  });
}

export async function pickImportItemByName(
  name,
  selector = "label.veapp__list-row-hoverable",
) {
  const row = await waitForText(selector, name);
  const importButton = row.querySelector("div[title='Import']");
  if (!importButton)
    throw new Error(`Import button not found in row "${name}"`);
  importButton.click();
}

export async function handleDialog(
  title,
  { confirm = "OK", handler, timeout = 2000 } = {},
) {
  const header = await waitForText("h1.window-title", title, { timeout });
  const dialog = header.closest(".application");
  if (!dialog) throw new Error(`Dialog container not found for "${title}"`);
  if (handler) await handler(dialog);
  const btn = await waitForText("button", confirm, { parent: dialog });
  if (!btn)
    throw new Error(`"${confirm}" button not found in dialog "${title}"`);
  btn.click();
}

export function assertDialogOptions(dialog, expected, selector = "label") {
  const options = dialog.querySelectorAll(selector);
  const actual = [...options].map((el) => el.textContent.trim());
  const expectedStr = JSON.stringify(expected);
  const actualStr = JSON.stringify(actual);
  if (actualStr !== expectedStr) {
    throw new Error(
      `Dialog options mismatch.\nExpected: ${expectedStr}\nActual:   ${actualStr}`,
    );
  }
}

export function checkOption(dialog, name) {
  const labels = dialog.querySelectorAll("label");
  const label = [...labels].find((l) => l.textContent.includes(name));
  if (!label) throw new Error(`Option "${name}" not found in dialog`);
  const checkbox = label.querySelector("input[type='checkbox']");
  if (!checkbox) throw new Error(`Checkbox not found for option "${name}"`);
  checkbox.click();
}

Actor.prototype.assertHasItems = function (type, names) {
  const items = [...this.items.values()];
  const matching = items.filter((i) => i.type === type).map((i) => i.name);
  const missing = names.filter((n) => !matching.includes(n));
  if (missing.length) {
    throw new Error(
      `Actor "${this.name}" missing ${type} items: ${JSON.stringify(missing)}\nFound: ${JSON.stringify(matching)}`,
    );
  }
};
