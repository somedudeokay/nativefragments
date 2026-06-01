import { shadow, sheet } from "/nativefragments/component.js";
import { bindText, computed, state } from "/nativefragments/signals.js";

const counterStyles = `
  :host {
    display: inline-block;
  }

  button {
    background: #1ed760;
    border: 1px solid #111111;
    color: #111111;
    cursor: pointer;
    font: inherit;
    font-weight: 800;
    padding: 0.75rem 1rem;
  }
`;

const styles = sheet(counterStyles);

const counterMarkup = (count) =>
  `<button type="button"><span data-count>Count ${count}</span></button>`;

class AppCounter extends HTMLElement {
  #count = state(0);
  #cleanup = [];
  #increment = () => {
    this.#count.set(this.#count.get() + 1);
  };

  connectedCallback() {
    const root = shadow(this, {
      styles: [styles],
      html: counterMarkup(this.#count.get()),
    });

    const label = computed(() => `Count ${this.#count.get()}`);
    const button = root.querySelector("button");

    this.#cleanup.push(bindText(root.querySelector("[data-count]"), label));
    button.addEventListener("click", this.#increment);
    this.#cleanup.push(() => button.removeEventListener("click", this.#increment));
  }

  disconnectedCallback() {
    for (const cleanup of this.#cleanup.splice(0)) cleanup();
  }
}

customElements.define("app-counter", AppCounter);
