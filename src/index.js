import { Signal } from "signal-polyfill";

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

/**
 * Create a writable signal.
 *
 * @template T
 * @param {T} initial Initial value.
 * @param {object} [options] Signal options passed to `Signal.State`.
 * @returns {Signal.State<T>} Writable signal.
 */
export const state = (initial, options) => new Signal.State(initial, options);

/**
 * Create a computed signal.
 *
 * @template T
 * @param {() => T} callback Computation callback.
 * @param {object} [options] Signal options passed to `Signal.Computed`.
 * @returns {Signal.Computed<T>} Computed signal.
 */
export const computed = (callback, options) => new Signal.Computed(callback, options);

/**
 * Check whether a value is a signal state or computed.
 *
 * @param {unknown} value Value to check.
 * @returns {boolean} Whether the value is a signal.
 */
export const isSignal = (value) =>
  Signal.isState(value) || Signal.isComputed(value);

/**
 * Read a raw value, signal, or value function.
 *
 * @template T
 * @param {T | { get(): T } | (() => T)} value Value source.
 * @returns {T} Current value.
 */
export const read = (value) => {
  if (isSignal(value)) return value.get();
  if (typeof value === "function") return value();
  return value;
};

/**
 * Run a reactive side effect.
 *
 * The callback runs immediately. Any signals read during the callback are
 * tracked, and the callback reruns in a microtask when they change.
 *
 * @param {() => void | (() => void)} callback Effect callback.
 * @returns {() => void} Cleanup function.
 */
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

/**
 * Bind text content to a reactive value.
 *
 * @param {Node} node Target node.
 * @param {unknown | (() => unknown)} value Reactive value.
 * @returns {() => void} Cleanup function.
 */
export const bindText = (node, value) =>
  effect(() => {
    node.textContent = read(value) ?? "";
  });

/**
 * Bind inner HTML to a reactive value.
 *
 * Use only with trusted HTML.
 *
 * @param {Element} element Target element.
 * @param {unknown | (() => unknown)} value Reactive HTML.
 * @returns {() => void} Cleanup function.
 */
export const bindHTML = (element, value) =>
  effect(() => {
    element.innerHTML = read(value) ?? "";
  });

/**
 * Bind an attribute to a reactive value.
 *
 * `false`, `null`, and `undefined` remove the attribute. `true` writes a
 * boolean attribute.
 *
 * @param {Element} element Target element.
 * @param {string} name Attribute name.
 * @param {unknown | (() => unknown)} value Reactive value.
 * @returns {() => void} Cleanup function.
 */
export const bindAttr = (element, name, value) =>
  effect(() => {
    const next = read(value);
    if (next === false || next === null || next === undefined) {
      element.removeAttribute(name);
    } else {
      element.setAttribute(name, next === true ? "" : String(next));
    }
  });

/**
 * Bind an element property to a reactive value.
 *
 * @param {object} element Target object or element.
 * @param {string} property Property name.
 * @param {unknown | (() => unknown)} value Reactive value.
 * @returns {() => void} Cleanup function.
 */
export const bindProperty = (element, property, value) =>
  effect(() => {
    element[property] = read(value);
  });

/**
 * Toggle a class from a reactive value.
 *
 * @param {Element} element Target element.
 * @param {string} name Class name.
 * @param {unknown | (() => unknown)} value Reactive value.
 * @returns {() => void} Cleanup function.
 */
export const bindClass = (element, name, value) =>
  effect(() => {
    element.classList.toggle(name, Boolean(read(value)));
  });

/**
 * Bind a CSS custom property or style property to a reactive value.
 *
 * @param {HTMLElement} element Target element.
 * @param {string} name Style property name.
 * @param {unknown | (() => unknown)} value Reactive value.
 * @returns {() => void} Cleanup function.
 */
export const bindStyle = (element, name, value) =>
  effect(() => {
    const next = read(value);
    if (next === false || next === null || next === undefined) {
      element.style.removeProperty(name);
    } else {
      element.style.setProperty(name, String(next));
    }
  });

/**
 * Bind an input-like element's value to a writable signal.
 *
 * @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} element
 * Form control.
 * @param {{ get(): string, set(value: string): void }} signal Writable signal.
 * @param {string} [eventName="input"] Event name used to update the signal.
 * @returns {() => void} Cleanup function.
 */
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
