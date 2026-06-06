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

/**
 * Create a writable signal. Read it with `.get()` and update it with `.set()`.
 *
 * @param {unknown} initial Initial value.
 * @param {object} [options] Signal options (custom equality, etc.).
 * @returns {Signal.State} A writable signal.
 */
export const state = (initial, options) => new Signal.State(initial, options);

/**
 * Create a read-only signal derived from other signals. It recomputes lazily
 * when a dependency changes.
 *
 * @param {() => unknown} callback Computation that reads other signals.
 * @param {object} [options] Signal options.
 * @returns {Signal.Computed} A derived, read-only signal.
 */
export const computed = (callback, options) => new Signal.Computed(callback, options);

/**
 * Test whether a value is a signal (state or computed).
 *
 * @param {unknown} value Value to test.
 * @returns {boolean} True for a state or computed signal.
 */
export const isSignal = (value) =>
  Signal.isState(value) || Signal.isComputed(value);

/**
 * Resolve a value: call `.get()` on a signal, invoke a function, or return a
 * plain value unchanged. Lets every binding helper accept a signal, a getter,
 * or a static value.
 *
 * @param {unknown} value Signal, getter, or plain value.
 * @returns {unknown} The current value.
 */
export const read = (value) => {
  if (isSignal(value)) return value.get();
  if (typeof value === "function") return value();
  return value;
};

/**
 * Run a callback immediately and re-run it whenever a signal it read changes
 * (batched on the microtask queue). Return a function from the callback to run
 * cleanup before the next run.
 *
 * @param {() => (void | (() => void))} callback Effect; may return a cleanup.
 * @returns {() => void} Dispose function that stops the effect.
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
 * Bind a node's text content to a signal.
 *
 * @param {Node} node Target node.
 * @param {unknown} value Signal, getter, or value.
 * @returns {() => void} Dispose function.
 */
export const bindText = (node, value) =>
  effect(() => {
    node.textContent = read(value) ?? "";
  });

/**
 * Bind an element's `innerHTML` to a signal. Use trusted HTML only.
 *
 * @param {Element} element Target element.
 * @param {unknown} value Signal, getter, or value.
 * @returns {() => void} Dispose function.
 */
export const bindHTML = (element, value) =>
  effect(() => {
    element.innerHTML = read(value) ?? "";
  });

/**
 * Bind an attribute to a signal. `false`, `null`, and `undefined` remove the
 * attribute; `true` renders it empty.
 *
 * @param {Element} element Target element.
 * @param {string} name Attribute name.
 * @param {unknown} value Signal, getter, or value.
 * @returns {() => void} Dispose function.
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
 * Bind a DOM property to a signal.
 *
 * @param {Element} element Target element.
 * @param {string} property Property name.
 * @param {unknown} value Signal, getter, or value.
 * @returns {() => void} Dispose function.
 */
export const bindProperty = (element, property, value) =>
  effect(() => {
    element[property] = read(value);
  });

/**
 * Toggle a class on an element based on a signal's truthiness.
 *
 * @param {Element} element Target element.
 * @param {string} name Class name.
 * @param {unknown} value Signal, getter, or value.
 * @returns {() => void} Dispose function.
 */
export const bindClass = (element, name, value) =>
  effect(() => {
    element.classList.toggle(name, Boolean(read(value)));
  });

/**
 * Bind a style property to a signal. `false`, `null`, and `undefined` remove
 * the property.
 *
 * @param {Element} element Target element.
 * @param {string} name CSS property name.
 * @param {unknown} value Signal, getter, or value.
 * @returns {() => void} Dispose function.
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
 * Two-way bind an input-like element's `value` to a writable signal: the signal
 * drives the element, and the element updates the signal on `eventName`.
 *
 * @param {HTMLElement} element Target element with a `value`.
 * @param {Signal.State} signal Writable signal to sync.
 * @param {string} [eventName="input"] DOM event that updates the signal.
 * @returns {() => void} Dispose function.
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
