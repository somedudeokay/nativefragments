import { shadow, sheet } from "/nativefragments/component.js";

const styles = sheet(`
  :host {
    display: block;
  }

  .frame {
    background: color-mix(in srgb, var(--ink, #141414) 6%, transparent);
    border: 1px solid var(--line, rgba(20, 20, 20, 0.1));
    border-radius: 24px;
    padding: 8px;
  }

  .card {
    --c-shell: var(--green, #1ed760);
    --c-frag: var(--orange, #ff6b35);
    --c-sub: #5ca8ff;
    background: #16181d;
    border: 1px solid rgba(247, 243, 232, 0.08);
    border-radius: 18px;
    box-shadow:
      0 30px 60px -22px rgba(20, 20, 20, 0.4),
      inset 0 1px 0 rgba(247, 243, 232, 0.06);
    color: #f7f3e8;
    display: flex;
    flex-direction: column;
    gap: 0.95rem;
    min-height: 452px;
    overflow: hidden;
    padding: clamp(1rem, 2.6vw, 1.5rem);
    position: relative;
  }

  /* ---- top request bar ---- */
  .bar {
    align-items: center;
    display: flex;
    gap: 0.65rem;
  }

  .dots {
    display: inline-flex;
    flex: none;
    gap: 0.34rem;
  }

  .dots i {
    background: rgba(247, 243, 232, 0.16);
    border-radius: 50%;
    height: 0.55rem;
    width: 0.55rem;
  }

  .url {
    align-items: center;
    background: rgba(247, 243, 232, 0.05);
    border: 1px solid rgba(247, 243, 232, 0.08);
    border-radius: 999px;
    display: flex;
    flex: 1;
    font-family: var(--mono, "JetBrains Mono", ui-monospace, monospace);
    font-size: 0.7rem;
    gap: 0.5rem;
    min-width: 0;
    padding: 0.34rem 0.42rem 0.34rem 0.7rem;
  }

  .method {
    color: #8a8578;
    flex: none;
  }

  .path {
    color: var(--c-shell);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .xf {
    background: color-mix(in srgb, var(--c-frag) 22%, transparent);
    border-radius: 999px;
    color: var(--c-frag);
    flex: none;
    font-size: 0.56rem;
    letter-spacing: 0.06em;
    margin-left: auto;
    opacity: 0;
    padding: 0.14rem 0.42rem;
    text-transform: uppercase;
    transition: opacity 0.25s var(--ease, ease);
  }

  .spinner {
    border: 2px solid rgba(247, 243, 232, 0.18);
    border-radius: 50%;
    border-top-color: var(--c-frag);
    flex: none;
    height: 0.92rem;
    margin-left: 0.1rem;
    opacity: 0;
    transition: opacity 0.25s var(--ease, ease);
    width: 0.92rem;
  }

  /* ---- nested scopes ---- */
  .scope {
    border: 1.5px dashed;
    border-radius: 12px;
    padding: 1.05rem 0.85rem 0.85rem;
    position: relative;
    transition:
      box-shadow 0.45s var(--ease, ease),
      background 0.45s var(--ease, ease);
  }

  .lbl {
    background: #16181d;
    font-family: var(--mono, "JetBrains Mono", ui-monospace, monospace);
    font-size: 0.56rem;
    font-weight: 600;
    left: 0.7rem;
    letter-spacing: 0.12em;
    padding: 0 0.42rem;
    position: absolute;
    text-transform: uppercase;
    top: 0;
    transform: translateY(-50%);
    white-space: nowrap;
  }

  .shell {
    background: color-mix(in srgb, var(--c-shell) 5%, transparent);
    border-color: color-mix(in srgb, var(--c-shell) 52%, transparent);
  }

  .lbl-shell {
    color: var(--c-shell);
  }

  .fragment {
    background: color-mix(in srgb, var(--c-frag) 7%, transparent);
    border-color: color-mix(in srgb, var(--c-frag) 52%, transparent);
    margin-top: 0.95rem;
  }

  .lbl-fragment {
    color: var(--c-frag);
  }

  .subfragment {
    background: color-mix(in srgb, var(--c-sub) 12%, transparent);
    border-color: color-mix(in srgb, var(--c-sub) 58%, transparent);
    margin-top: 0.95rem;
  }

  .lbl-sub {
    color: var(--c-sub);
  }

  /* ---- persistent shell nav ---- */
  .nav {
    display: flex;
    gap: 0.3rem;
  }

  .tab {
    border-radius: 8px;
    color: #b0aa9c;
    font-family: var(--sans, "Geist", ui-sans-serif, system-ui, sans-serif);
    font-size: 0.74rem;
    font-weight: 500;
    padding: 0.3rem 0.58rem;
    transition:
      background 0.3s var(--ease, ease),
      color 0.3s var(--ease, ease);
  }

  .card[data-tab="overview"] .tab[data-tab="overview"],
  .card[data-tab="activity"] .tab[data-tab="activity"] {
    background: rgba(247, 243, 232, 0.12);
    color: #ffffff;
  }

  /* ---- fragment body (content + skeleton overlay) ---- */
  .frag-body {
    margin-top: 0.2rem;
    min-height: 156px;
    position: relative;
  }

  .frag-content {
    transition: opacity 0.4s var(--ease, ease);
  }

  .h {
    margin-bottom: 0.65rem;
  }

  .h-text {
    color: #ffffff;
    font-family: var(--display, "Space Grotesk", ui-sans-serif, sans-serif);
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .bar-line {
    background: rgba(247, 243, 232, 0.15);
    border-radius: 5px;
    height: 9px;
    margin: 0.5rem 0;
  }

  .bar-line.short {
    width: 56%;
  }

  .frag-skel {
    display: grid;
    gap: 0.62rem;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    transition: opacity 0.3s var(--ease, ease);
  }

  .sk {
    animation: nf-shimmer 1.15s linear infinite;
    background:
      linear-gradient(
        90deg,
        rgba(247, 243, 232, 0.05),
        rgba(247, 243, 232, 0.17),
        rgba(247, 243, 232, 0.05)
      );
    background-size: 200% 100%;
    border-radius: 5px;
    display: block;
    height: 10px;
  }

  .sk.tall {
    height: 15px;
    width: 42%;
  }

  .sk.short {
    width: 62%;
  }

  /* ---- subfragment body ---- */
  .sub-body {
    align-items: center;
    display: flex;
    min-height: 44px;
    position: relative;
  }

  .sub-content {
    align-items: center;
    display: flex;
    gap: 0.8rem;
    transition: opacity 0.4s var(--ease, ease);
    width: 100%;
  }

  .stat b {
    color: var(--c-sub);
    display: block;
    font-family: var(--mono, "JetBrains Mono", ui-monospace, monospace);
    font-size: 1.25rem;
    line-height: 1;
  }

  .stat i {
    color: #8a8578;
    font-family: var(--mono, "JetBrains Mono", ui-monospace, monospace);
    font-size: 0.6rem;
    font-style: normal;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .spark {
    align-items: flex-end;
    display: flex;
    gap: 3px;
    height: 26px;
    margin-left: auto;
  }

  .spark u {
    background: color-mix(in srgb, var(--c-sub) 55%, transparent);
    border-radius: 2px;
    width: 5px;
  }

  .spark u:nth-child(1) { height: 38%; }
  .spark u:nth-child(2) { height: 68%; }
  .spark u:nth-child(3) { height: 48%; }
  .spark u:nth-child(4) { height: 90%; }
  .spark u:nth-child(5) { height: 60%; }

  .sub-skel {
    align-items: center;
    display: flex;
    gap: 0.6rem;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    transition: opacity 0.3s var(--ease, ease);
  }

  /* ---- request log ---- */
  .log {
    align-items: center;
    color: #8a8578;
    display: flex;
    font-family: var(--mono, "JetBrains Mono", ui-monospace, monospace);
    font-size: 0.64rem;
    gap: 0.45rem;
    letter-spacing: 0.01em;
    margin-top: auto;
    padding-top: 0.2rem;
  }

  .log::before {
    background: var(--c-shell);
    border-radius: 50%;
    content: "";
    flex: none;
    height: 0.42rem;
    width: 0.42rem;
  }

  .log-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ---- step states ---- */
  .card[data-step="1"] .xf,
  .card[data-step="3"] .xf,
  .card[data-step="1"] .spinner,
  .card[data-step="3"] .spinner {
    opacity: 1;
  }

  .card[data-step="1"] .spinner,
  .card[data-step="3"] .spinner {
    animation: nf-spin 0.7s linear infinite;
  }

  /* fragment fetch: dim content, overlay skeleton, pulse the fragment border */
  .card[data-step="1"] .frag-content {
    opacity: 0.12;
  }

  .card[data-step="1"] .frag-skel {
    opacity: 1;
  }

  .card[data-step="1"] .fragment {
    background: color-mix(in srgb, var(--c-frag) 13%, transparent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--c-frag) 22%, transparent);
  }

  /* subfragment fetch: only the subfragment reloads */
  .card[data-step="3"] .sub-content {
    opacity: 0.12;
  }

  .card[data-step="3"] .sub-skel {
    opacity: 1;
  }

  .card[data-step="3"] .subfragment {
    background: color-mix(in srgb, var(--c-sub) 20%, transparent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--c-sub) 26%, transparent);
  }

  @keyframes nf-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes nf-shimmer {
    from {
      background-position: 200% 0;
    }
    to {
      background-position: -200% 0;
    }
  }

  @media (max-width: 360px) {
    .card {
      min-height: 430px;
    }

    .tab {
      font-size: 0.7rem;
      padding: 0.28rem 0.45rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .card *,
    .card .scope {
      animation: none !important;
      transition: none !important;
    }
  }
`);

const HTML = `<div class="frame">
  <div
    class="card"
    data-step="0"
    data-tab="overview"
    role="img"
    aria-label="Diagram of the Native Fragments runtime. An outer shell contains a fragment, which contains a subfragment. On navigation only the fragment's HTML is swapped while the shell stays mounted, and a nested subfragment can update on its own."
  >
    <div class="bar" aria-hidden="true">
      <span class="dots"><i></i><i></i><i></i></span>
      <span class="url">
        <span class="method">GET</span>
        <span class="path">/overview</span>
        <span class="xf">x-fragment</span>
        <span class="spinner"></span>
      </span>
    </div>

    <div class="scope shell">
      <span class="lbl lbl-shell">Shell</span>
      <div class="nav" aria-hidden="true">
        <span class="tab" data-tab="overview">Overview</span>
        <span class="tab" data-tab="activity">Activity</span>
        <span class="tab">Settings</span>
      </div>

      <div class="scope fragment">
        <span class="lbl lbl-fragment">Fragment</span>
        <div class="frag-body">
          <div class="frag-content">
            <div class="h"><span class="h-text">Overview</span></div>
            <div class="bar-line"></div>
            <div class="bar-line short"></div>

            <div class="scope subfragment">
              <span class="lbl lbl-sub">Subfragment</span>
              <div class="sub-body">
                <div class="sub-content">
                  <span class="stat"><b class="stat-num">128</b><i>events today</i></span>
                  <span class="spark"><u></u><u></u><u></u><u></u><u></u></span>
                </div>
                <div class="sub-skel" aria-hidden="true">
                  <span class="sk" style="width: 32%"></span>
                  <span class="sk" style="width: 44%; margin-left: auto"></span>
                </div>
              </div>
            </div>
          </div>

          <div class="frag-skel" aria-hidden="true">
            <span class="sk tall"></span>
            <span class="sk"></span>
            <span class="sk short"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="log" aria-hidden="true">
      <span class="log-text">idle &middot; shell stays mounted</span>
    </div>
  </div>
</div>`;

const STEPS = 5;
const TICK_MS = 1500;
const TABS = ["overview", "activity"];
const LABELS = { overview: "Overview", activity: "Activity" };
const COUNTS = { overview: "128", activity: "342" };
const LOG = {
  0: "idle · shell stays mounted",
  1: "GET {p} · x-fragment",
  2: "200 · fragment swapped",
  3: "GET {p} · x-fragment",
  4: "200 · subfragment swapped",
};

class RuntimeMap extends HTMLElement {
  connectedCallback() {
    const root = shadow(this, { styles: [styles], html: HTML });

    if (this._wired) return;
    this._wired = true;

    const card = root.querySelector(".card");
    if (!card) return;

    const hText = root.querySelector(".h-text");
    const pathEl = root.querySelector(".path");
    const statNum = root.querySelector(".stat-num");
    const logEl = root.querySelector(".log-text");

    let t = 0;
    const render = () => {
      const step = t % STEPS;
      const cycle = Math.floor(t / STEPS) % 2;
      const active = step === 0 ? TABS[cycle] : TABS[1 - cycle];
      const scoped = step >= 3;
      const path = "/" + active + (scoped ? "/stats" : "");

      card.dataset.step = String(step);
      card.dataset.tab = active;
      if (hText) hText.textContent = LABELS[active];
      if (pathEl) pathEl.textContent = path;
      if (statNum) statNum.textContent = COUNTS[active];
      if (logEl) logEl.textContent = LOG[step].replace("{p}", path);
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
