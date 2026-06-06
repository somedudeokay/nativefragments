import { shadow, sheet } from "/nativefragments/component.js";
import { effect } from "/nativefragments/signals.js";
import {
  paddedClickCount,
  startClickCountPersistence,
} from "../state/counter-state.js";

const styles = sheet(``);

const currentTab = () =>
  window.location.pathname.startsWith("/nested-route") ? "/nested-route" : "/";

class DemoHeader extends HTMLElement {
  #cleanup = [];
  #seconds = 0;
  #timer;

  connectedCallback() {
    const root = shadow(this, { styles: [styles] });
    const digits = Array.from(root.querySelectorAll("[data-digit]"));
    const secondsCounter = root.querySelector(".counter");
    const clickCounter = root.querySelector("[data-click-count]");
    const nav = root.querySelector("nav");
    const tabs = Array.from(root.querySelectorAll("[data-tab]"));

    startClickCountPersistence();

    const renderTimer = () => {
      const next = String(this.#seconds).padStart(3, "0").slice(-3);
      secondsCounter?.setAttribute("aria-label", `${next} seconds since rerender`);

      digits.forEach((digit, index) => {
        const changed = digit.textContent !== next[index];
        digit.textContent = next[index];
        digit.classList.remove("is-flipping");
        if (changed) {
          void digit.offsetWidth;
          digit.classList.add("is-flipping");
        }
      });
    };

    renderTimer();
    this.#timer = window.setInterval(() => {
      this.#seconds += 1;
      renderTimer();
    }, 1000);
    this.#cleanup.push(() => window.clearInterval(this.#timer));

    this.#cleanup.push(
      effect(() => {
        if (clickCounter) clickCounter.textContent = paddedClickCount.get();
      }),
    );

    const updateTabs = () => {
      const active = currentTab();

      for (const tab of tabs) {
        if (tab.dataset.tab === active) {
          tab.setAttribute("aria-current", "page");
        } else {
          tab.removeAttribute("aria-current");
        }
      }

      if (!nav) return;
      nav.dataset.activeTab = active;
    };

    const scheduleTabs = () => requestAnimationFrame(updateTabs);
    scheduleTabs();

    window.addEventListener("nativefragments:navigate", scheduleTabs);
    window.addEventListener("popstate", scheduleTabs);
    this.#cleanup.push(() => {
      window.removeEventListener("nativefragments:navigate", scheduleTabs);
      window.removeEventListener("popstate", scheduleTabs);
    });
  }

  disconnectedCallback() {
    for (const cleanup of this.#cleanup.splice(0)) cleanup();
  }
}

customElements.define("nf-demo-header", DemoHeader);
