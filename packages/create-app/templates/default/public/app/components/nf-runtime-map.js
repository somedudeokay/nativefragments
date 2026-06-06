import { shadow, sheet } from "/nativefragments/component.js";

/**
 * <nf-runtime-map>
 *
 * Animated diagram of the Native Fragments runtime model, used in the homepage
 * hero. It shows three nested, dashed, labeled scopes:
 *
 *   SHELL (green) ⊃ FRAGMENT (orange) ⊃ SUBFRAGMENT (blue #5ca8ff)
 *
 * A step driver writes a `data-step` attribute on the host. CSS reads that
 * attribute to tell the runtime story on a calm loop:
 *
 *   0 idle      — everything mounted, resting state
 *   1 navigate  — a tab activates in the shell header
 *   2 request   — a fragment request fires (x-fragment hint)
 *   3 loading   — the FRAGMENT scope skeletons + its border pulses
 *   4 swapped   — new fragment content swaps in; SHELL stays mounted
 *   5 sub-load  — only the SUBFRAGMENT skeletons (parent untouched)
 *   6 sub-swap  — subfragment swaps in; then loop back to idle
 *
 * The motion is pure CSS keyed off `data-step`; JS only advances the step.
 * The HTML renders a valid resting diagram with no JS, and
 * prefers-reduced-motion shows a static, fully-swapped end state.
 */

const STEPS = 7;
const STEP_MS = 1300;

const styles = sheet(`
  :host {
    /* On-brand fallbacks; inherits the real tokens from :root. */
    --paper: #f7f3e8;
    --surface: #fffdf6;
    --ink: #141414;
    --muted: #5f5a50;
    --green: #1ed760;
    --orange: #ff6b35;
    --yellow: #f4d35e;
    --sub: #5ca8ff; /* brighter blue for the subfragment on dark */
    --radius: 14px;
    --radius-lg: 20px;
    --radius-pill: 999px;
    --ease: cubic-bezier(0.16, 1, 0.3, 1);
    --display: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
    --sans: "Geist", ui-sans-serif, system-ui, sans-serif;
    --mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;

    /* The light frame the dark card sits inside. */
    display: block;
    background: var(--surface);
    border: 1px solid rgba(20, 20, 20, 0.08);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg, 0 30px 60px -20px rgba(20, 20, 20, 0.25));
    padding: clamp(0.7rem, 2.4vw, 1rem);
    container-type: inline-size;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* ---- Dark premium card ---------------------------------------------- */
  .card {
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-rows: auto 1fr auto;
    gap: clamp(0.7rem, 2.2cqi, 1rem);
    min-height: 420px;
    padding: clamp(0.85rem, 3cqi, 1.25rem);
    background: #16181d;
    border-radius: var(--radius);
    color: var(--paper);
  }

  .card::before {
    content: "";
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: linear-gradient(90deg, var(--green), var(--orange) 55%, var(--sub));
    opacity: 0.9;
  }

  /* ---- Card header (window chrome + status) --------------------------- */
  .bar {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    min-width: 0;
  }

  .bar .title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }

  .dots {
    display: inline-flex;
    gap: 0.34rem;
  }

  .dots i {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: rgba(247, 243, 232, 0.22);
  }

  .dots i:nth-child(1) { background: color-mix(in srgb, var(--orange) 70%, #16181d); }
  .dots i:nth-child(2) { background: color-mix(in srgb, var(--yellow) 70%, #16181d); }
  .dots i:nth-child(3) { background: color-mix(in srgb, var(--green) 70%, #16181d); }

  .title {
    font-family: var(--mono);
    font-size: 0.62rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #b8b2a4;
  }

  /* Fragment request indicator (the x-fragment hint) */
  .req {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-family: var(--mono);
    font-size: 0.56rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #8f897c;
    border: 1px solid rgba(247, 243, 232, 0.14);
    border-radius: var(--radius-pill);
    padding: 0.22rem 0.5rem;
    white-space: nowrap;
    transition: color 0.3s var(--ease), border-color 0.3s var(--ease),
      background 0.3s var(--ease);
  }

  .req b {
    font-weight: 600;
    color: color-mix(in srgb, var(--paper) 55%, transparent);
  }

  .req .pip {
    width: 0.42rem;
    height: 0.42rem;
    border-radius: 50%;
    background: rgba(247, 243, 232, 0.3);
    transition: background 0.3s var(--ease), box-shadow 0.3s var(--ease);
  }

  /* request fires on steps 2 & 5 */
  :host([data-step="2"]) .req,
  :host([data-step="5"]) .req {
    color: var(--green);
    border-color: color-mix(in srgb, var(--green) 45%, transparent);
    background: color-mix(in srgb, var(--green) 12%, transparent);
  }

  :host([data-step="2"]) .req b,
  :host([data-step="5"]) .req b {
    color: color-mix(in srgb, var(--green) 90%, white);
  }

  :host([data-step="2"]) .req .pip,
  :host([data-step="5"]) .req .pip {
    background: var(--green);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--green) 22%, transparent);
    animation: ping 0.9s var(--ease) infinite;
  }

  /* ---- Nested scopes -------------------------------------------------- */
  .scope {
    position: relative;
    border-radius: var(--radius);
    border: 1.5px dashed var(--c);
    background:
      linear-gradient(color-mix(in srgb, var(--c) 7%, transparent),
        color-mix(in srgb, var(--c) 7%, transparent));
    transition: box-shadow 0.4s var(--ease), border-color 0.4s var(--ease),
      background 0.4s var(--ease);
  }

  .scope > .tag {
    position: absolute;
    top: -0.62rem;
    left: 0.7rem;
    display: inline-flex;
    align-items: center;
    gap: 0.34rem;
    padding: 0.12rem 0.46rem;
    font-family: var(--mono);
    font-size: 0.56rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink);
    background: var(--c);
    border-radius: var(--radius-pill);
  }

  .tag .ico {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 2px;
    border: 1.5px dashed rgba(20, 20, 20, 0.6);
  }

  .persist {
    margin-left: 0.3rem;
    font-size: 0.5rem;
    letter-spacing: 0.06em;
    color: color-mix(in srgb, var(--ink) 70%, var(--c));
    opacity: 0;
    transform: translateX(-2px);
    transition: opacity 0.4s var(--ease), transform 0.4s var(--ease);
  }

  /* Show "persists" while the shell holds steady through the swap. */
  :host([data-step="3"]) .shell > .tag .persist,
  :host([data-step="4"]) .shell > .tag .persist,
  :host([data-step="5"]) .shell > .tag .persist,
  :host([data-step="6"]) .shell > .tag .persist {
    opacity: 1;
    transform: translateX(0);
  }

  .shell {
    --c: var(--green);
    flex: 1;
    display: grid;
    grid-template-rows: auto 1fr;
    gap: clamp(0.55rem, 2cqi, 0.8rem);
    padding: clamp(0.8rem, 2.6cqi, 1.05rem) clamp(0.65rem, 2.4cqi, 0.9rem)
      clamp(0.7rem, 2.4cqi, 0.9rem);
  }

  /* Shell header = nav/chrome that never re-renders */
  .nav {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .nav .crumb {
    font-family: var(--mono);
    font-size: 0.55rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #8f897c;
    margin-right: auto;
  }

  .tab {
    font-family: var(--mono);
    font-size: 0.58rem;
    letter-spacing: 0.04em;
    color: #cfc8ba;
    padding: 0.24rem 0.55rem;
    border-radius: var(--radius-pill);
    border: 1px solid rgba(247, 243, 232, 0.12);
    transition: color 0.3s var(--ease), border-color 0.3s var(--ease),
      background 0.3s var(--ease);
  }

  .tab[data-active] {
    color: #16181d;
    background: var(--green);
    border-color: var(--green);
  }

  /* The activating tab on "navigate" */
  .tab .pen {
    display: inline-block;
    width: 0.3rem;
    height: 0.3rem;
    margin-right: 0.32rem;
    border-radius: 50%;
    background: currentColor;
    vertical-align: middle;
    opacity: 0.5;
  }

  /* Pre-nav: first tab is active. From step 1 on: second tab is active,
     and the shell tab swap is the only thing that "moves" in the shell. */
  .tab.t1 { color: #16181d; background: var(--green); border-color: var(--green); }
  .tab.t2 { }
  :host([data-step]:not([data-step="0"])) .tab.t1 {
    color: #cfc8ba;
    background: transparent;
    border-color: rgba(247, 243, 232, 0.12);
  }
  :host([data-step]:not([data-step="0"])) .tab.t2 {
    color: #16181d;
    background: var(--green);
    border-color: var(--green);
  }
  /* navigate flash on the newly active tab */
  :host([data-step="1"]) .tab.t2 {
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--green) 26%, transparent);
  }

  .fragment {
    --c: var(--orange);
    display: grid;
    grid-template-rows: auto 1fr;
    gap: clamp(0.5rem, 1.8cqi, 0.7rem);
    padding: clamp(0.8rem, 2.6cqi, 1.05rem) clamp(0.6rem, 2.2cqi, 0.85rem)
      clamp(0.6rem, 2.2cqi, 0.85rem);
    min-height: 0;
  }

  .frag-head {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  .frag-head .h {
    font-family: var(--display);
    font-weight: 600;
    font-size: clamp(0.82rem, 3cqi, 0.98rem);
    color: var(--paper);
    transition: opacity 0.3s var(--ease);
  }

  .frag-head .sub {
    font-family: var(--mono);
    font-size: 0.52rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #8f897c;
    margin-left: auto;
  }

  .subfragment {
    --c: var(--sub);
    display: grid;
    gap: clamp(0.4rem, 1.6cqi, 0.55rem);
    padding: clamp(0.75rem, 2.4cqi, 1rem) clamp(0.6rem, 2.2cqi, 0.8rem)
      clamp(0.6rem, 2cqi, 0.75rem);
    min-height: 0;
  }

  .subfragment .sf-head {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .subfragment .sf-head .h {
    font-family: var(--display);
    font-weight: 600;
    font-size: clamp(0.72rem, 2.6cqi, 0.86rem);
    color: var(--paper);
  }

  .subfragment .badge {
    margin-left: auto;
    font-family: var(--mono);
    font-size: 0.5rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--sub) 90%, white);
    border: 1px solid color-mix(in srgb, var(--sub) 45%, transparent);
    border-radius: var(--radius-pill);
    padding: 0.1rem 0.4rem;
  }

  /* ---- Content rows (lines that get swapped) -------------------------- */
  .rows {
    display: grid;
    gap: clamp(0.42rem, 1.7cqi, 0.6rem);
    align-content: start;
  }

  .row {
    height: 0.52rem;
    border-radius: var(--radius-pill);
    background: color-mix(in srgb, var(--paper) 16%, transparent);
  }

  .row.w90 { width: 90%; }
  .row.w75 { width: 75%; }
  .row.w60 { width: 60%; }
  .row.w45 { width: 45%; }

  /* fresh content (post-swap) gets a faint scope tint */
  .rows.fresh .row {
    background: color-mix(in srgb, var(--c, var(--paper)) 32%, rgba(247,243,232,0.16));
  }

  /* ---- Skeleton shimmer ---------------------------------------------- */
  .skeleton .row {
    position: relative;
    overflow: hidden;
    background: color-mix(in srgb, var(--c) 14%, rgba(247, 243, 232, 0.1));
  }

  .skeleton .row::after {
    content: "";
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(90deg, transparent,
      color-mix(in srgb, var(--c) 38%, transparent), transparent);
    animation: shimmer 1.1s var(--ease) infinite;
  }

  /* loading state: the scope being swapped pulses its border + dims content */
  .loading {
    border-color: color-mix(in srgb, var(--c) 90%, white);
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--c) 45%, transparent);
    animation: borderPulse 1.1s var(--ease) infinite;
  }

  /* content groups: only one is visible per scope per step */
  .grp { display: none; }
  .grp.on { display: grid; }

  /* swap-in entrance for fresh content */
  .swap-in {
    animation: swapIn 0.5s var(--ease) both;
  }

  /* ---- Caption / log line -------------------------------------------- */
  .log {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--mono);
    font-size: 0.6rem;
    letter-spacing: 0.04em;
    color: #cfc8ba;
    min-height: 1.1rem;
  }

  .log .k {
    flex: none;
    color: #16181d;
    background: color-mix(in srgb, var(--green) 88%, white);
    border-radius: var(--radius-pill);
    padding: 0.12rem 0.45rem;
    font-size: 0.52rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: background 0.3s var(--ease);
  }

  .log .line {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* color the log chip to the scope in play */
  :host([data-step="5"]) .log .k,
  :host([data-step="6"]) .log .k {
    background: color-mix(in srgb, var(--sub) 90%, white);
  }
  :host([data-step="2"]) .log .k,
  :host([data-step="3"]) .log .k,
  :host([data-step="4"]) .log .k {
    background: color-mix(in srgb, var(--orange) 90%, white);
  }

  /* Each .step* line shows only at its step. */
  .log .msg { display: none; }
  :host([data-step="0"]) .log .s0,
  :host([data-step="1"]) .log .s1,
  :host([data-step="2"]) .log .s2,
  :host([data-step="3"]) .log .s3,
  :host([data-step="4"]) .log .s4,
  :host([data-step="5"]) .log .s5,
  :host([data-step="6"]) .log .s6 { display: inline; }
  /* no-JS / unknown step default */
  :host(:not([data-step])) .log .s0 { display: inline; }

  /* ===== Per-step content visibility ================================== */
  /* FRAGMENT: original rows vs skeleton vs fresh rows */
  .fragment .frag-orig.on,
  .fragment .frag-skel.on,
  .fragment .frag-fresh.on { display: grid; }

  /* default (no data-step / idle / navigate / request): original content */
  .fragment .frag-skel,
  .fragment .frag-fresh { display: none; }
  .fragment .frag-orig { display: grid; }

  :host([data-step="3"]) .fragment .frag-orig { display: none; }
  :host([data-step="3"]) .fragment .frag-skel { display: grid; }

  :host([data-step="4"]) .fragment .frag-orig,
  :host([data-step="5"]) .fragment .frag-orig,
  :host([data-step="6"]) .fragment .frag-orig { display: none; }
  :host([data-step="4"]) .fragment .frag-fresh,
  :host([data-step="5"]) .fragment .frag-fresh,
  :host([data-step="6"]) .fragment .frag-fresh { display: grid; }

  /* loading pulse + skeleton attach to the FRAGMENT scope on step 3 */
  :host([data-step="3"]) .fragment {
    border-color: color-mix(in srgb, var(--orange) 90%, white);
    animation: borderPulse 1.1s var(--ease) infinite;
  }
  :host([data-step="4"]) .fragment .h { /* refreshed heading */ }

  /* SUBFRAGMENT: original vs skeleton vs fresh */
  .subfragment .sf-skel,
  .subfragment .sf-fresh { display: none; }
  .subfragment .sf-orig { display: grid; }

  /* after the fragment swap (step 4) the subfragment shows its post-swap baseline */
  :host([data-step="5"]) .subfragment .sf-orig { display: none; }
  :host([data-step="5"]) .subfragment .sf-skel { display: grid; }
  :host([data-step="6"]) .subfragment .sf-orig { display: none; }
  :host([data-step="6"]) .subfragment .sf-fresh { display: grid; }

  :host([data-step="5"]) .subfragment {
    border-color: color-mix(in srgb, var(--sub) 95%, white);
    animation: borderPulse 1.1s var(--ease) infinite;
  }

  /* swap-in entrances */
  :host([data-step="4"]) .fragment .frag-fresh,
  :host([data-step="6"]) .subfragment .sf-fresh {
    animation: swapIn 0.5s var(--ease) both;
  }

  /* ---- Keyframes ----------------------------------------------------- */
  @keyframes shimmer {
    to { transform: translateX(100%); }
  }

  @keyframes borderPulse {
    0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--c) 40%, transparent); }
    50% { box-shadow: 0 0 0 5px color-mix(in srgb, var(--c) 0%, transparent); }
  }

  @keyframes ping {
    0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--green) 40%, transparent); }
    70%, 100% { box-shadow: 0 0 0 6px color-mix(in srgb, var(--green) 0%, transparent); }
  }

  @keyframes swapIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ---- Responsive tightening ----------------------------------------- */
  @container (max-width: 360px) {
    .card { min-height: 440px; }
    .req b { display: none; }
    .nav .crumb { width: 100%; margin: 0 0 0.1rem; }
  }

  /* ---- Reduced motion: static, fully-swapped nested end state -------- */
  @media (prefers-reduced-motion: reduce) {
    .req .pip,
    .skeleton .row::after,
    .loading,
    .swap-in { animation: none !important; }

    :host * { transition: none !important; }

    /* Force the resolved end state: everything swapped, nothing loading. */
    .fragment,
    .subfragment { animation: none !important; box-shadow: none !important; }

    .fragment .frag-orig,
    .fragment .frag-skel { display: none !important; }
    .fragment .frag-fresh { display: grid !important; }

    .subfragment .sf-orig,
    .subfragment .sf-skel { display: none !important; }
    .subfragment .sf-fresh { display: grid !important; }

    .shell > .tag .persist { opacity: 1 !important; transform: none !important; }
    .req .pip { background: var(--green) !important; }

    .log .msg { display: none !important; }
    .log .s4 { display: inline !important; }
    .log .k { background: color-mix(in srgb, var(--orange) 90%, white) !important; }
  }
`);

const html = `
  <div class="card" role="img"
    aria-label="Diagram of the Native Fragments runtime. An outer shell region (green) contains a fragment region (orange) which contains a subfragment region (blue). On a fragment navigation the fragment swaps its content while the shell stays mounted, then the subfragment reloads on its own without re-rendering its parent.">
    <div class="bar" aria-hidden="true">
      <span class="dots"><i></i><i></i><i></i></span>
      <span class="title">runtime model</span>
      <span class="req">
        <span class="pip"></span><span>x-fragment</span> <b>: scope</b>
      </span>
    </div>

    <!-- SHELL: stays mounted across navigations -->
    <div class="scope shell" aria-hidden="true">
      <span class="tag">
        <span class="ico"></span>shell
        <span class="persist">· persists</span>
      </span>

      <div class="nav">
        <span class="crumb">app /</span>
        <span class="tab t1"><span class="pen"></span>overview</span>
        <span class="tab t2">activity</span>
      </div>

      <!-- FRAGMENT: a swappable region inside the shell -->
      <div class="scope fragment">
        <span class="tag"><span class="ico"></span>fragment</span>

        <div class="frag-head">
          <span class="h">Activity</span>
          <span class="sub">/activity</span>
        </div>

        <!-- fragment content states -->
        <div class="rows frag-orig grp">
          <div class="row w90"></div>
          <div class="row w60"></div>
        </div>
        <div class="rows frag-skel skeleton grp">
          <div class="row w90"></div>
          <div class="row w75"></div>
        </div>
        <div class="rows frag-fresh fresh grp swap-in">
          <div class="row w75"></div>
          <div class="row w90"></div>
        </div>

        <!-- SUBFRAGMENT: a smaller region nested inside the fragment -->
        <div class="scope subfragment">
          <div class="sf-head">
            <span class="tag"><span class="ico"></span>subfragment</span>
            <span class="h" style="visibility:hidden">x</span>
            <span class="badge">live</span>
          </div>

          <div class="rows sf-orig grp">
            <div class="row w60"></div>
            <div class="row w45"></div>
          </div>
          <div class="rows sf-skel skeleton grp">
            <div class="row w45"></div>
            <div class="row w60"></div>
          </div>
          <div class="rows sf-fresh fresh grp swap-in">
            <div class="row w60"></div>
            <div class="row w45"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Narrating log line -->
    <div class="log" aria-hidden="true">
      <span class="k">step</span>
      <span class="line">
        <span class="msg s0">idle — shell, fragment & subfragment mounted</span>
        <span class="msg s1">navigate — activity tab activated in shell</span>
        <span class="msg s2">request — x-fragment: fragment scope</span>
        <span class="msg s3">loading — fragment skeleton, border pulses</span>
        <span class="msg s4">swapped — fragment in · shell stayed mounted</span>
        <span class="msg s5">request — x-fragment: subfragment only</span>
        <span class="msg s6">swapped — subfragment in · parent untouched</span>
      </span>
    </div>
  </div>
`;

class RuntimeMap extends HTMLElement {
  #timer;

  connectedCallback() {
    shadow(this, { styles: [styles], html });

    // Render a valid resting state immediately (also the no-JS default).
    if (!this.hasAttribute("data-step")) this.setAttribute("data-step", "0");

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Respect reduced motion: hold a static, resolved end state. CSS forces
    // the fully-swapped diagram regardless of the data-step value.
    if (reduce) {
      this.setAttribute("data-step", "4");
      return;
    }

    // Step driver: advance data-step on a calm interval (~9s full loop).
    let step = 0;
    this.#timer = window.setInterval(() => {
      step = (step + 1) % STEPS;
      this.setAttribute("data-step", String(step));
    }, STEP_MS);
  }

  disconnectedCallback() {
    if (this.#timer) {
      window.clearInterval(this.#timer);
      this.#timer = undefined;
    }
  }
}

if (!customElements.get("nf-runtime-map")) {
  customElements.define("nf-runtime-map", RuntimeMap);
}
