---
name: nativefragments-signals
description: Add reactive state to Native Fragments apps with signal-polyfill and no build step.
---

# Native Fragments Signals Skill

Use this skill when a Native Fragments app needs client-side reactive state.

## Rules

- Keep `@nativefragments/core` dependency-free. Use this package only where
  client-side reactivity is needed.
- Prefer `state()` for writable values and `computed()` for derived values.
- Use DOM binding helpers instead of rerendering whole component trees.
- Keep effects small. They run immediately and rerun in a microtask when a
  signal read by the effect changes.
- For first-paint UI, keep server-rendered HTML canonical and use signals only
  to hydrate interactive islands.

## Browser Setup

Copy the browser files into the app's public helpers:

```sh
cp node_modules/@nativefragments/signals/public/nativefragments/*.js public/nativefragments/
```

Import from the public path:

```js
import { bindText, computed, state } from "/nativefragments/signals.js";
```

## Component Pattern

```js
import { bindText, computed, state } from "/nativefragments/signals.js";
import { shadow, sheet } from "/nativefragments/component.js";

const styles = sheet(`
  :host { display: inline-grid; gap: 0.5rem; }
`);

class CounterButton extends HTMLElement {
  connectedCallback() {
    const count = state(0);
    const label = computed(() => `Count ${count.get()}`);
    const root = shadow(this, {
      styles: [styles],
      html: `<button type="button"><span data-label></span></button>`
    });

    bindText(root.querySelector("[data-label]"), label);
    root.querySelector("button").addEventListener("click", () => {
      count.set(count.get() + 1);
    });
  }
}

customElements.define("counter-button", CounterButton);
```

## Cleanup

Bindings return cleanup functions. Call them in `disconnectedCallback()` when a
component can be removed and reinserted.
