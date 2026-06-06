import { html } from "@nativefragments/core/server";
import { callout, code, docPage } from "./blocks.js";

export const signalsPage = () =>
  docPage({
    eyebrow: "Concepts",
    title: "State",
    intro:
      "Core has no reactive state. Add the optional @nativefragments/signals package when an island needs local state and DOM bindings. Its API is a thin layer over the TC39 Signals proposal (shipped with a polyfill).",
    body: html`
      ${callout(
        "Note",
        "State is a separate package, not part of @nativefragments/core. Reach for it only where a component needs client-side reactivity.",
      )}

      <h2>Install</h2>
      <p>
        Add the package and copy its browser module next to the other helpers so
        it loads with no build step.
      </p>
      ${code(`npm i @nativefragments/signals
cp node_modules/@nativefragments/signals/public/nativefragments/*.js public/nativefragments/`, "shell")}

      <h2>Signals</h2>
      <p>
        <code>state(initial)</code> creates a writable signal with
        <code>.get()</code> and <code>.set()</code>. <code>computed(fn)</code>
        derives a read-only signal that recomputes when its dependencies change.
      </p>
      ${code(`// public/app/components/counter.js
import { computed, state } from "/nativefragments/signals.js";

const count = state(0);
const label = computed(() => \`Count \${count.get()}\`);

count.set(count.get() + 1);
label.get(); // "Count 1"`)}
      <p>
        <code>isSignal(value)</code> tests whether a value is a signal.
        <code>read(value)</code> unwraps one: it calls <code>.get()</code> on a
        signal, invokes a function, or returns a plain value unchanged — which is
        why every binder below accepts a signal, a getter, or a static value.
      </p>

      <h2>Effects</h2>
      <p>
        <code>effect(fn)</code> runs <code>fn</code> immediately, then re-runs it
        whenever a signal it read changes (batched on the microtask queue).
        Return a function from <code>fn</code> to clean up before the next run.
        <code>effect</code> returns a dispose function that stops it.
      </p>
      ${code(`import { effect, state } from "/nativefragments/signals.js";

const open = state(false);

const stop = effect(() => {
  document.body.classList.toggle("locked", open.get());
  return () => document.body.classList.remove("locked"); // cleanup
});

stop(); // tear the effect down`)}

      <h2>DOM bindings</h2>
      <p>
        The <code>bind*</code> helpers wire a signal to the DOM with an effect.
        Each accepts a signal, a getter, or a plain value, and returns a dispose
        function.
      </p>
      <ul>
        <li><code>bindText(node, value)</code> — sets <code>textContent</code>.</li>
        <li><code>bindHTML(element, value)</code> — sets <code>innerHTML</code> (trusted markup only).</li>
        <li><code>bindAttr(element, name, value)</code> — sets an attribute; <code>false</code>/<code>null</code>/<code>undefined</code> removes it, <code>true</code> renders it empty.</li>
        <li><code>bindProperty(element, property, value)</code> — assigns a DOM property.</li>
        <li><code>bindClass(element, name, value)</code> — toggles a class on truthiness.</li>
        <li><code>bindStyle(element, name, value)</code> — sets a style property; nullish removes it.</li>
        <li><code>model(element, signal, eventName = "input")</code> — two-way binds <code>element.value</code> to a signal.</li>
      </ul>
      ${code(`// public/app/components/search-box.js
import { bindClass, bindText, computed, model, state } from "/nativefragments/signals.js";

const query = state("");
const empty = computed(() => query.get() === "");

model(root.querySelector("input"), query);            // input -> signal -> input
bindText(root.querySelector("[data-echo]"), query);   // mirror the value
bindClass(root.querySelector(".hint"), "hidden", empty); // hide hint while typing`)}

      <h2>Shared state across fragments</h2>
      <p>
        Put a signal in its own module and import it wherever you need it.
        Because the module stays loaded across
        <a href="/concepts/fragments">fragment navigation</a>, the same signal is
        shared between components — even ones in different fragments that swap in
        and out.
      </p>
      ${code(`// public/app/state/cart.js — one signal, imported everywhere
import { state } from "/nativefragments/signals.js";

export const cartCount = state(0);`)}
      <p>
        A badge in the persistent shell reads it; a button inside a swapped-in
        product fragment writes it.
      </p>
      ${code(`// public/app/components/cart-badge.js — lives in the shell
import { bindText } from "/nativefragments/signals.js";
import { cartCount } from "/app/state/cart.js";

bindText(this.querySelector("[data-count]"), cartCount);`)}
      ${code(`// public/app/components/add-to-cart.js — lives in a product fragment
import { cartCount } from "/app/state/cart.js";

button.addEventListener("click", () => cartCount.set(cartCount.get() + 1));`)}
      <p>
        The badge updates the moment the button fires, and it stays correct as
        product fragments navigate in and out, because both sides point at the
        same <code>cartCount</code>.
      </p>

      <h2>Keep HTML canonical</h2>
      <p>
        Render meaningful HTML on the server first, then use state to hydrate the
        interactive part. Don't hide the page behind a client-only app shell —
        that breaks the things that make the output readable.
      </p>

      <h2>See also</h2>
      <ul>
        <li><a href="/concepts/components">Components</a> — where state usually lives.</li>
        <li><a href="/concepts/fragments">Fragments</a> — how shared state survives navigation.</li>
      </ul>
    `,
  });
