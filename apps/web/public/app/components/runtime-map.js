import { shadow, sheet } from "/nativefragments/component.js";
import { runtimeMapHtml, runtimeMapStyles } from "./runtime-map-template.js";

const styles = sheet(runtimeMapStyles);

const PHASES = 4;
const TICK_MS = 1500;
const DESTS = ["overview", "activity", "settings"];
const DATA = {
  overview: {
    label: "Overview",
    base: { n: "128", range: "Today" },
    param: { n: "1.2k", range: "7 days", slug: "7d" },
  },
  activity: {
    label: "Activity",
    base: { n: "342", range: "Today" },
    param: { n: "2.6k", range: "7 days", slug: "7d" },
  },
  settings: {
    label: "Settings",
    base: { n: "9", range: "Active" },
    param: { n: "24", range: "All", slug: "all" },
  },
};

class RuntimeMap extends HTMLElement {
  connectedCallback() {
    const root = shadow(this, { styles: [styles], html: runtimeMapHtml });

    if (this._wired) return;
    this._wired = true;

    const card = root.querySelector(".card");
    if (!card) return;

    const hText = root.querySelector(".h-text");
    const pathEl = root.querySelector(".path");
    const statNum = root.querySelector(".stat-num");
    const rangeEl = root.querySelector(".stat-range");
    const logEl = root.querySelector(".log-text");

    // Each destination plays a full 4-phase navigation, so the active tab only
    // ever changes at phase 0 (while loading) — never silently. Phases 2-3 fetch
    // a nested route param, which swaps ONLY the subfragment's content (number,
    // range, sparkline) so it is clear what the param affects. Start on the first
    // destination's loaded state, then advance through every tab in turn.
    let t = 1;
    const render = () => {
      const phase = t % PHASES;
      const idx = Math.floor(t / PHASES);
      const dest = DESTS[idx % DESTS.length];
      const prev = DESTS[(idx + DESTS.length - 1) % DESTS.length];
      const d = DATA[dest];

      // The URL reflects the request in flight; the displayed content lags and
      // only swaps once the load completes, so the old content stays visible
      // (glimmering) during loading instead of changing early.
      const paramScope = phase >= 2;
      const path = "/" + dest + (paramScope ? "/" + d.param.slug : "");

      let label;
      let sub;
      let sv;
      if (phase === 0) {
        // fragment request in flight — keep the previous page's content
        label = DATA[prev].label;
        sub = DATA[prev].param;
        sv = "b";
      } else if (phase === 1) {
        // fragment loaded — new page, base subfragment
        label = d.label;
        sub = d.base;
        sv = "a";
      } else if (phase === 2) {
        // subfragment request in flight — keep the base subfragment content
        label = d.label;
        sub = d.base;
        sv = "a";
      } else {
        // subfragment loaded — param applied
        label = d.label;
        sub = d.param;
        sv = "b";
      }

      card.dataset.step = String(phase + 1);
      card.dataset.tab = dest;
      card.dataset.sv = sv;
      if (hText) hText.textContent = label;
      if (pathEl) pathEl.textContent = path;
      if (statNum) statNum.textContent = sub.n;
      if (rangeEl) rangeEl.textContent = sub.range;
      if (logEl) {
        logEl.textContent =
          phase === 0
            ? "GET " + path + " · x-fragment"
            : phase === 1
              ? "200 · fragment swapped"
              : phase === 2
                ? "GET " + path + " · x-fragment"
                : "idle · shell stays mounted";
      }
    };

    render();

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const start = () => {
      if (!this._timer) {
        this._timer = setInterval(() => {
          t += 1;
          render();
        }, TICK_MS);
      }
    };
    const stop = () => {
      if (this._timer) {
        clearInterval(this._timer);
        this._timer = null;
      }
    };

    this._io = new IntersectionObserver(
      (entries) => (entries[0] && entries[0].isIntersecting ? start() : stop()),
      { threshold: 0.1 },
    );
    this._io.observe(this);
  }

  disconnectedCallback() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
    if (this._io) {
      this._io.disconnect();
      this._io = null;
    }
  }
}

customElements.define("nf-runtime-map", RuntimeMap);
