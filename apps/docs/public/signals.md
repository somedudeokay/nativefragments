# State

Core has no reactive state. Add the optional @nativefragments/signals package when an island needs local state and DOM bindings. Its API is a thin layer over the TC39 Signals proposal (shipped with a polyfill).

> **Note:** State is a separate package, not part of @nativefragments/core. Reach for it only where a component needs client-side reactivity.

## Install

Add the package and copy its browser module next to the other helpers so it loads with no build step.

```shell
npm i @nativefragments/signals
cp node_modules/@nativefragments/signals/public/nativefragments/*.js public/nativefragments/
```

## Signals

`state(initial)` creates a writable signal with `.get()` and `.set()`. `computed(fn)` derives a read-only signal that recomputes when its dependencies change.

```js
// public/app/components/counter.js
import { computed, state } from "/nativefragments/signals.js";

const count = state(0);
const label = computed(() => `Count ${count.get()}`);

count.set(count.get() + 1);
label.get(); // "Count 1"
```

`isSignal(value)` tests whether a value is a signal. `read(value)` unwraps one: it calls `.get()` on a signal, invokes a function, or returns a plain value unchanged — which is why every binder below accepts a signal, a getter, or a static value.

## Effects

`effect(fn)` runs `fn` immediately, then re-runs it whenever a signal it read changes (batched on the microtask queue). Return a function from `fn` to clean up before the next run. `effect` returns a dispose function that stops it.

```js
import { effect, state } from "/nativefragments/signals.js";

const open = state(false);

const stop = effect(() => {
  document.body.classList.toggle("locked", open.get());
  return () => document.body.classList.remove("locked"); // cleanup
});

stop(); // tear the effect down
```

## DOM bindings

The `bind*` helpers wire a signal to the DOM with an effect. Each accepts a signal, a getter, or a plain value, and returns a dispose function.

- `bindText(node, value)` — sets `textContent`.
- `bindHTML(element, value)` — sets `innerHTML` (trusted markup only).
- `bindAttr(element, name, value)` — sets an attribute; `false`/`null`/`undefined` removes it, `true` renders it empty.
- `bindProperty(element, property, value)` — assigns a DOM property.
- `bindClass(element, name, value)` — toggles a class on truthiness.
- `bindStyle(element, name, value)` — sets a style property; nullish removes it.
- `model(element, signal, eventName = "input")` — two-way binds `element.value` to a signal.

```js
// public/app/components/search-box.js
import { bindClass, bindText, computed, model, state } from "/nativefragments/signals.js";

const query = state("");
const empty = computed(() => query.get() === "");

model(root.querySelector("input"), query);            // input -> signal -> input
bindText(root.querySelector("[data-echo]"), query);   // mirror the value
bindClass(root.querySelector(".hint"), "hidden", empty); // hide hint while typing
```

## Shared state across fragments

Put a signal in its own module and import it wherever you need it. Because the module stays loaded across [fragment navigation](/concepts/fragments), the same signal is shared between components — even ones in different fragments that swap in and out.

```js
// public/app/state/cart.js — one signal, imported everywhere
import { state } from "/nativefragments/signals.js";

export const cartCount = state(0);
```

A badge in the persistent shell reads it; a button inside a swapped-in product fragment writes it.

```js
// public/app/components/cart-badge.js — lives in the shell
import { bindText } from "/nativefragments/signals.js";
import { cartCount } from "/app/state/cart.js";

bindText(this.querySelector("[data-count]"), cartCount);
```

```js
// public/app/components/add-to-cart.js — lives in a product fragment
import { cartCount } from "/app/state/cart.js";

button.addEventListener("click", () => cartCount.set(cartCount.get() + 1));
```

The badge updates the moment the button fires, and it stays correct as product fragments navigate in and out, because both sides point at the same `cartCount`.

## Keep HTML canonical

Render meaningful HTML on the server first, then use state to hydrate the interactive part. Don't hide the page behind a client-only app shell — that breaks the things that make the output readable.

## See also

- [Components](/concepts/components) — where state usually lives.
- [Fragments](/concepts/fragments) — how shared state survives navigation.
