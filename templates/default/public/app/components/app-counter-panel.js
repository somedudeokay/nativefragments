import { shadow, sheet } from "/nativefragments/component.js";
import { effect } from "/nativefragments/signals.js";
import {
  incrementClickCount,
  paddedClickCount,
  resetClickCount,
  startClickCountPersistence,
} from "../state/counter-state.js";

const styles = sheet(``);

class AppCounterPanel extends HTMLElement {
  #cleanup = [];

  connectedCallback() {
    const root = shadow(this, { styles: [styles] });
    const count = root.querySelector("[data-click-count]");
    const increment = root.querySelector("[data-increment]");
    const reset = root.querySelector("[data-reset]");

    startClickCountPersistence();

    this.#cleanup.push(
      effect(() => {
        if (count) count.textContent = paddedClickCount.get();
      }),
    );

    increment?.addEventListener("click", incrementClickCount);
    reset?.addEventListener("click", resetClickCount);
    this.#cleanup.push(() => {
      increment?.removeEventListener("click", incrementClickCount);
      reset?.removeEventListener("click", resetClickCount);
    });
  }

  disconnectedCallback() {
    for (const cleanup of this.#cleanup.splice(0)) cleanup();
  }
}

customElements.define("app-counter-panel", AppCounterPanel);
