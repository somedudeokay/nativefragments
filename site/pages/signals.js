import { html } from "@nativefragments/core/server";
import { callout, code, docPage } from "./blocks.js";

export const signalsPage = () =>
  docPage({
    eyebrow: "Concepts",
    title: "Signals",
    intro:
      "Core has no reactive state. Add the optional @nativefragments/signals package when an island needs local state and DOM bindings — and keep the server-rendered HTML as the source of truth.",
    body: html`
      ${callout(
        "Note",
        "Signals are a separate package, not part of @nativefragments/core. Reach for them only where a component needs client-side reactivity.",
      )}

      <h2>Install</h2>
      <p>
        Add the package and copy its browser module next to the other helpers so
        it loads with no build step.
      </p>
      ${code(`npm i @nativefragments/signals
cp node_modules/@nativefragments/signals/public/nativefragments/*.js public/nativefragments/`, "shell")}

      <h2>State and bindings</h2>
      <p>
        <code>state</code> holds a value, <code>computed</code> derives one, and
        the <code>bind*</code> helpers wire a signal to the DOM. Pair them with a
        <a href="/concepts/components">Shadow DOM component</a> to drive a small
        interactive island.
      </p>
      ${code(`// public/app/components/counter.js
import { bindText, computed, state } from "/nativefragments/signals.js";

const count = state(0);
const label = computed(() => \`Count \${count.get()}\`);

bindText(root.querySelector("[data-count]"), label);
root.querySelector("button").addEventListener("click", () => {
  count.set(count.get() + 1);
});`)}

      <h2>Keep HTML canonical</h2>
      <p>
        Render meaningful HTML on the server first, then use signals to hydrate
        the interactive part. Don't hide the page behind a client-only app
        shell — that breaks the things that make the output readable.
      </p>

      <h2>See also</h2>
      <ul>
        <li><a href="/concepts/components">Components</a> — where signals usually live.</li>
        <li><a href="/concepts/agent-friendly">Agent-Friendly Apps</a> — keep content in the initial HTML.</li>
      </ul>
    `,
  });
