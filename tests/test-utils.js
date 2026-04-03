export const $$ = (selector) => document.querySelector(selector);

export function waitForDOM(
  selector,
  { timeout = 1000, parent = document.body } = {},
) {
  const existing = parent.querySelector(selector);
  if (existing) return Promise.resolve(existing);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timed out waiting for ${selector}`));
    }, timeout);
    const observer = new MutationObserver(() => {
      const el = parent.querySelector(selector);
      if (el) {
        observer.disconnect();
        clearTimeout(timer);
        resolve(el);
      }
    });
    observer.observe(parent, { childList: true, subtree: true });
  });
}
export const actionButton = (element, action) => {
  return element.querySelector(`button[data-action='${action}']`);
};

export async function waitForState(
  predicate,
  { timeout = 1000, interval = 10, label = "state" } = {},
) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const result = predicate();
    if (result) return result;
    await new Promise((r) => setTimeout(r, interval));
  }
  throw new Error(`Timed out waiting for ${label}`);
}

export function findByText(selector, text, { parent = document } = {}) {
  const elements = parent.querySelectorAll(selector);
  return [...elements].find((el) => el.textContent.trim().includes(text));
}

export function waitForText(
  selector,
  text,
  { timeout = 1000, parent = document.body } = {},
) {
  const match = findByText(selector, text, { parent });
  if (match) return Promise.resolve(match);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      observer.disconnect();
      reject(
        new Error(`Timed out waiting for "${selector}" with text "${text}"`),
      );
    }, timeout);
    const observer = new MutationObserver(() => {
      const el = findByText(selector, text, { parent });
      if (el) {
        observer.disconnect();
        clearTimeout(timer);
        resolve(el);
      }
    });
    observer.observe(parent, { childList: true, subtree: true });
  });
}

export function waitForHook(hookName, { timeout = 1500, filter } = {}) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      Hooks.off(hookName, hookId);
      reject(new Error(`Timed out waiting for hook: ${hookName}`));
    }, timeout);

    const hookId = Hooks.on(hookName, (...args) => {
      if (filter && !filter(...args)) return;
      clearTimeout(timer);
      Hooks.off(hookName, hookId);
      resolve(args);
    });
  });
}
