# Native Fragments Signals

Optional signal-based reactive state helpers for Native Fragments apps.

Core stays dependency-free. Add this package when a component or island needs
client-side state that updates DOM bindings without a build step.

```sh
npm i @nativefragments/signals
```

For no-build browser usage, copy the public helpers into your app:

```sh
cp node_modules/@nativefragments/signals/public/nativefragments/*.js public/nativefragments/
```

Then import the browser module:

```js
import {
  bindText,
  computed,
  effect,
  state
} from "/nativefragments/signals.js";

const count = state(0);
const doubled = computed(() => count.get() * 2);

bindText(document.querySelector("[data-count]"), () => doubled.get());
document.querySelector("button").addEventListener("click", () => {
  count.set(count.get() + 1);
});

effect(() => {
  console.log("count changed", count.get());
});
```

Bundled or server-side code can import from the package:

```js
import { state, computed } from "@nativefragments/signals";
```

## API

- `state(initial, options)`: create a writable `Signal.State`.
- `computed(callback, options)`: create a `Signal.Computed`.
- `effect(callback)`: run a microtask-batched reactive side effect.
- `read(value)`: read a raw value, signal, or function.
- `bindText(node, value)`: bind text content.
- `bindHTML(element, value)`: bind trusted HTML.
- `bindAttr(element, name, value)`: bind an attribute.
- `bindProperty(element, property, value)`: bind an object property.
- `bindClass(element, name, value)`: toggle a class.
- `bindStyle(element, name, value)`: bind a style property.
- `model(element, signal, eventName)`: two-way bind a form value.

## Agent Skill

Agents can read the shipped conventions from:

```sh
node_modules/@nativefragments/signals/skills/nativefragments-signals/SKILL.md
```
