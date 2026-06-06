import { Signal } from "./signal-polyfill.js";

let needsEnqueue = true;

const effectWatcher = new Signal.subtle.Watcher(() => {
  if (!needsEnqueue) return;
  needsEnqueue = false;
  queueMicrotask(processPending);
});

const report = (error) => {
  if (typeof globalThis.reportError === "function") {
    globalThis.reportError(error);
  } else {
    setTimeout(() => {
      throw error;
    });
  }
};

function processPending() {
  needsEnqueue = true;
  const errors = [];

  for (const signal of effectWatcher.getPending()) {
    try {
      signal.get();
    } catch (error) {
      errors.push(error);
    }
  }

  effectWatcher.watch();
  for (const error of errors) report(error);
}

export const state = (initial, options) => new Signal.State(initial, options);

export const computed = (callback, options) => new Signal.Computed(callback, options);

export const isSignal = (value) =>
  Signal.isState(value) || Signal.isComputed(value);

export const read = (value) => {
  if (isSignal(value)) return value.get();
  if (typeof value === "function") return value();
  return value;
};

export const effect = (callback) => {
  let cleanup;

  const computation = new Signal.Computed(() => {
    if (typeof cleanup === "function") cleanup();
    cleanup = callback();
  });

  effectWatcher.watch(computation);
  computation.get();

  return () => {
    effectWatcher.unwatch(computation);
    if (typeof cleanup === "function") cleanup();
    cleanup = undefined;
  };
};

export const bindText = (node, value) =>
  effect(() => {
    node.textContent = read(value) ?? "";
  });

export const bindHTML = (element, value) =>
  effect(() => {
    element.innerHTML = read(value) ?? "";
  });

export const bindAttr = (element, name, value) =>
  effect(() => {
    const next = read(value);
    if (next === false || next === null || next === undefined) {
      element.removeAttribute(name);
    } else {
      element.setAttribute(name, next === true ? "" : String(next));
    }
  });

export const bindProperty = (element, property, value) =>
  effect(() => {
    element[property] = read(value);
  });

export const bindClass = (element, name, value) =>
  effect(() => {
    element.classList.toggle(name, Boolean(read(value)));
  });

export const bindStyle = (element, name, value) =>
  effect(() => {
    const next = read(value);
    if (next === false || next === null || next === undefined) {
      element.style.removeProperty(name);
    } else {
      element.style.setProperty(name, String(next));
    }
  });

export const model = (element, signal, eventName = "input") => {
  const stopBinding = bindProperty(element, "value", signal);
  const update = () => signal.set(element.value);
  element.addEventListener(eventName, update);

  return () => {
    stopBinding();
    element.removeEventListener(eventName, update);
  };
};

export { Signal };
