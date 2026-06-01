import { html } from "@nativefragments/core/server";
import { code, docPage } from "./blocks.js";

export const signalsPage = () =>
  docPage({
    eyebrow: "Concepts",
    title: "Signals are optional reactive islands.",
    intro:
      "Core does not need reactive state. Add @nativefragments/signals when a custom element or island needs local state and DOM bindings.",
    body: html`
      <h2>Install</h2>
      ${code(`npm i @nativefragments/signals
cp node_modules/@nativefragments/signals/public/nativefragments/*.js public/nativefragments/`)}
      <h2>Use in a component</h2>
      ${code(`import { bindText, computed, state } from "/nativefragments/signals.js";

const count = state(0);
const label = computed(() => \`Count \${count.get()}\`);

bindText(root.querySelector("[data-count]"), label);
root.querySelector("button").addEventListener("click", () => {
  count.set(count.get() + 1);
});`)}
      <h2>Keep HTML canonical</h2>
      <p>
        Render meaningful HTML on the server first. Use signals to hydrate the
        interactive part, not to hide the page behind a client-only app shell.
      </p>
    `,
  });
