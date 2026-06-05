import { shadow, sheet } from "/nativefragments/component.js";

/**
 * <nf-runtime-map>
 *
 * Animated illustration of the Native Fragments runtime model:
 *   SHELL  ⊃  FRAGMENT  ⊃  SUBFRAGMENT
 *
 * A faux miniature product UI inside browser chrome tells the runtime story on
 * a calm loop: a tab navigation fires a fragment request (x-fragment hint),
 * the targeted fragment shows a loading skeleton, new content swaps in while
 * the shell + nav stay mounted, and finally a nested subfragment refreshes on
 * its own. Distinct dashed colors + text labels name each layer so the
 * containment is unmistakable.
 *
 * Motion lives in CSS keyed off a `data-step` attribute on the host; a tiny JS
 * driver only advances the step on an interval. With JS disabled the markup
 * renders a valid, readable default state (the "Activity" view, fully loaded).
 */

const styles = sheet(`
  :host {
    /* Layer colors. Subfragment uses a brighter blue than brand --blue
       (which is too pale on dark). Everything else inherits brand tokens. */
    --shell: var(--green, #1ed760);
    --fragment: var(--orange, #ff6b35);
    --subfragment: #5ca8ff;

    --card: #16181d;
    --card-2: #1d2026;
    --card-3: #23262e;
    --hair: rgba(247, 243, 232, 0.1);
    --hair-strong: rgba(247, 243, 232, 0.16);
    --text: var(--paper, #f7f3e8);
    --text-dim: #9a958a;
    --text-faint: #6f6b62;

    --ease: var(--ease, cubic-bezier(0.16, 1, 0.3, 1));

    container-type: inline-size;
    display: block;
    min-height: 440px;
    width: 100%;
  }

  * {
    box-sizing: border-box;
  }

  .frame {
    background: linear-gradient(180deg, #fffdf6, #f4efe2);
    border: 1px solid var(--line, rgba(20, 20, 20, 0.1));
    border-radius: var(--radius-lg, 20px);
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.7) inset,
      0 30px 60px -22px rgba(20, 20, 20, 0.32);
    height: 100%;
    min-height: 440px;
    padding: clamp(0.7rem, 2.4cqw, 1.05rem);
    position: relative;
  }

  /* ---- Browser / app chrome = the SHELL ---------------------------------- */

  .app {
    background: var(--card);
    border: 1.5px dashed color-mix(in srgb, var(--shell) 60%, transparent);
    border-radius: var(--radius, 14px);
    box-shadow: 0 18px 40px -24px rgba(0, 0, 0, 0.8);
    display: grid;
    grid-template-rows: auto auto 1fr;
    height: 100%;
    min-height: 408px;
    overflow: hidden;
    position: relative;
  }

  .app::before {
    background: linear-gradient(90deg, var(--shell), var(--fragment));
    content: "";
    height: 3px;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 6;
  }

  /* Layer label chips ----------------------------------------------------- */

  .tag {
    align-items: center;
    border-radius: var(--radius-pill, 999px);
    display: inline-flex;
    font-family: var(--mono, ui-monospace, SFMono-Regular, Menlo, monospace);
    font-size: 0.56rem;
    font-weight: 600;
    gap: 0.32em;
    letter-spacing: 0.12em;
    line-height: 1;
    padding: 0.28em 0.6em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .tag::before {
    border-radius: 2px;
    content: "";
    height: 0.5em;
    width: 0.5em;
  }

  .tag-shell {
    background: color-mix(in srgb, var(--shell) 16%, var(--card));
    color: color-mix(in srgb, var(--shell) 75%, white);
  }
  .tag-shell::before { background: var(--shell); }

  .tag-fragment {
    background: color-mix(in srgb, var(--fragment) 18%, var(--card));
    color: color-mix(in srgb, var(--fragment) 78%, white);
  }
  .tag-fragment::before { background: var(--fragment); }

  .tag-sub {
    background: color-mix(in srgb, var(--subfragment) 18%, var(--card));
    color: color-mix(in srgb, var(--subfragment) 82%, white);
  }
  .tag-sub::before { background: var(--subfragment); }

  .layer-tag {
    left: 0.5rem;
    position: absolute;
    top: 0.5rem;
    z-index: 7;
  }

  /* URL bar --------------------------------------------------------------- */

  .topbar {
    align-items: center;
    border-bottom: 1px solid var(--hair);
    display: flex;
    gap: 0.55rem;
    padding: 0.6rem 0.7rem 0.55rem;
    padding-left: 6.6rem;
  }

  .dots {
    display: inline-flex;
    flex: 0 0 auto;
    gap: 0.3rem;
  }
  .dots i {
    border-radius: 50%;
    height: 0.5rem;
    width: 0.5rem;
  }
  .dots i:nth-child(1) { background: #ff5f57; }
  .dots i:nth-child(2) { background: #febc2e; }
  .dots i:nth-child(3) { background: #28c840; }

  .url {
    align-items: center;
    background: var(--card-2);
    border: 1px solid var(--hair);
    border-radius: var(--radius-pill, 999px);
    color: var(--text-dim);
    display: flex;
    flex: 1 1 auto;
    font-family: var(--mono, ui-monospace, SFMono-Regular, Menlo, monospace);
    font-size: 0.66rem;
    gap: 0.4rem;
    min-width: 0;
    overflow: hidden;
    padding: 0.32rem 0.5rem;
  }

  .url .path {
    color: var(--text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .url .path b {
    color: color-mix(in srgb, var(--fragment) 70%, white);
    font-weight: 600;
    opacity: 0;
    transition: opacity 0.3s var(--ease);
  }

  /* x-fragment request pill: appears only while a request is in flight */
  .xf {
    align-items: center;
    background: color-mix(in srgb, var(--fragment) 22%, var(--card));
    border: 1px solid color-mix(in srgb, var(--fragment) 45%, transparent);
    border-radius: var(--radius-pill, 999px);
    color: color-mix(in srgb, var(--fragment) 80%, white);
    display: inline-flex;
    flex: 0 0 auto;
    font-size: 0.56rem;
    font-weight: 600;
    gap: 0.32rem;
    letter-spacing: 0.06em;
    margin-left: auto;
    opacity: 0;
    padding: 0.18rem 0.42rem;
    transform: translateY(-2px) scale(0.94);
    transition: opacity 0.28s var(--ease), transform 0.28s var(--ease);
  }
  .xf .spin {
    animation: spin 0.8s linear infinite;
    border: 1.5px solid color-mix(in srgb, var(--fragment) 35%, transparent);
    border-radius: 50%;
    border-top-color: color-mix(in srgb, var(--fragment) 90%, white);
    height: 0.62rem;
    width: 0.62rem;
  }

  /* Nav row = part of the SHELL (persists) -------------------------------- */

  .nav {
    align-items: center;
    background: var(--card);
    border-bottom: 1px solid var(--hair);
    display: flex;
    gap: 0.3rem;
    padding: 0.5rem 0.7rem;
  }

  .tab {
    background: transparent;
    border: 0;
    border-radius: var(--radius-pill, 999px);
    color: var(--text-dim);
    cursor: default;
    font-family: var(--sans, ui-sans-serif, system-ui, sans-serif);
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.34rem 0.7rem;
    transition: background 0.3s var(--ease), color 0.3s var(--ease);
  }
  .tab[data-on="true"] {
    background: color-mix(in srgb, var(--shell) 22%, var(--card-2));
    color: var(--text);
  }

  .nav .pulse {
    background: var(--shell);
    border-radius: 50%;
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--shell) 60%, transparent);
    height: 0.4rem;
    margin-left: auto;
    width: 0.4rem;
  }
  .nav .pulse-label {
    color: var(--text-faint);
    font-family: var(--mono, ui-monospace, SFMono-Regular, Menlo, monospace);
    font-size: 0.52rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  /* FRAGMENT = swappable content region ----------------------------------- */

  .stage {
    padding: 0.7rem;
    position: relative;
  }

  .fragment {
    background: var(--card-2);
    border: 1.5px dashed color-mix(in srgb, var(--fragment) 62%, transparent);
    border-radius: var(--radius, 14px);
    display: grid;
    gap: 0.55rem;
    height: 100%;
    min-height: 232px;
    padding: 0.95rem 0.7rem 0.7rem;
    position: relative;
    transition: box-shadow 0.4s var(--ease), border-color 0.4s var(--ease);
  }

  .frag-head {
    align-items: baseline;
    display: flex;
    gap: 0.5rem;
    justify-content: space-between;
  }
  .frag-title {
    color: var(--text);
    font-family: var(--display, ui-sans-serif, system-ui, sans-serif);
    font-size: 0.95rem;
    font-weight: 700;
    transition: opacity 0.3s var(--ease);
  }
  .frag-sub {
    color: var(--text-dim);
    font-family: var(--mono, ui-monospace, SFMono-Regular, Menlo, monospace);
    font-size: 0.56rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  /* swap views: only one visible per step */
  .view { display: none; gap: 0.55rem; }
  .view[data-show="true"] { display: grid; }

  .row {
    align-items: center;
    background: var(--card-3);
    border: 1px solid var(--hair);
    border-radius: 9px;
    display: flex;
    gap: 0.55rem;
    padding: 0.5rem 0.6rem;
  }
  .row .ico {
    background: color-mix(in srgb, var(--fragment) 30%, var(--card-3));
    border-radius: 7px;
    flex: 0 0 auto;
    height: 1.5rem;
    width: 1.5rem;
  }
  .row .meta { display: grid; gap: 0.28rem; min-width: 0; flex: 1 1 auto; }
  .row .meta .l1, .row .meta .l2 {
    border-radius: 999px;
    height: 0.46rem;
  }
  .row .meta .l1 { background: var(--hair-strong); width: 62%; }
  .row .meta .l2 { background: var(--hair); width: 40%; height: 0.4rem; }

  /* enter animation for freshly swapped content */
  .fragment[data-swap="true"] .view[data-show="true"] .row {
    animation: rise 0.5s var(--ease) backwards;
  }
  .fragment[data-swap="true"] .view[data-show="true"] .row:nth-child(2) { animation-delay: 0.06s; }
  .fragment[data-swap="true"] .view[data-show="true"] .row:nth-child(3) { animation-delay: 0.12s; }

  /* skeleton / loading state for the FRAGMENT ----------------------------- */

  .skeleton { display: none; gap: 0.55rem; }
  .fragment[data-loading="true"] .view { display: none !important; }
  .fragment[data-loading="true"] .skeleton { display: grid; }
  .fragment[data-loading="true"] {
    border-color: var(--fragment);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--fragment) 22%, transparent);
    animation: borderPulse 1.1s ease-in-out infinite;
  }

  .sk {
    background: linear-gradient(
      100deg,
      var(--card-3) 30%,
      color-mix(in srgb, var(--fragment) 16%, var(--card-3)) 50%,
      var(--card-3) 70%
    );
    background-size: 220% 100%;
    border-radius: 9px;
    height: 2.5rem;
    animation: shimmer 1.2s linear infinite;
  }
  .sk.tall { height: 4.6rem; }

  /* SUBFRAGMENT = nested independently-updating region -------------------- */

  .subfragment {
    background: var(--card-3);
    border: 1.5px dashed color-mix(in srgb, var(--subfragment) 65%, transparent);
    border-radius: 11px;
    display: grid;
    gap: 0.45rem;
    margin-top: auto;
    padding: 0.85rem 0.65rem 0.6rem;
    position: relative;
    transition: box-shadow 0.4s var(--ease), border-color 0.4s var(--ease);
  }
  .sub-tag { left: 0.55rem; position: absolute; top: -0.62rem; }

  .stat {
    align-items: baseline;
    display: flex;
    gap: 0.5rem;
    justify-content: space-between;
  }
  .stat .k {
    color: var(--text-dim);
    font-family: var(--mono, ui-monospace, SFMono-Regular, Menlo, monospace);
    font-size: 0.58rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .stat .v {
    color: color-mix(in srgb, var(--subfragment) 75%, white);
    font-family: var(--mono, ui-monospace, SFMono-Regular, Menlo, monospace);
    font-size: 1.15rem;
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    transition: opacity 0.25s var(--ease), transform 0.25s var(--ease);
  }
  .bars { display: flex; align-items: flex-end; gap: 0.22rem; height: 1.5rem; }
  .bars span {
    background: color-mix(in srgb, var(--subfragment) 55%, var(--card-3));
    border-radius: 2px;
    flex: 1 1 0;
    transition: height 0.45s var(--ease), background 0.45s var(--ease);
  }

  /* subfragment-only refresh: scoped shimmer, parent untouched */
  .subfragment[data-loading="true"] {
    border-color: var(--subfragment);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--subfragment) 22%, transparent);
  }
  .subfragment[data-loading="true"] .v { opacity: 0.25; }
  .subfragment[data-loading="true"] .bars span {
    animation: subPulse 0.7s ease-in-out infinite;
    background: color-mix(in srgb, var(--subfragment) 30%, var(--card-3));
  }
  .subfragment[data-fresh="true"] .v {
    animation: pop 0.45s var(--ease);
  }

  /* caption strip --------------------------------------------------------- */

  .caption {
    align-items: center;
    color: var(--text-dim);
    display: flex;
    font-family: var(--mono, ui-monospace, SFMono-Regular, Menlo, monospace);
    font-size: 0.58rem;
    gap: 0.45rem;
    letter-spacing: 0.04em;
    justify-content: center;
    padding: 0.5rem 0.7rem 0.1rem;
    text-align: center;
    min-height: 1.7rem;
  }
  .caption .dot {
    background: var(--text-faint);
    border-radius: 50%;
    flex: 0 0 auto;
    height: 0.42rem;
    transition: background 0.3s var(--ease);
    width: 0.42rem;
  }

  /* ===== STEP CHOREOGRAPHY ============================================== */
  /* Default (no JS / step 0): Activity view loaded, calm. */

  /* step 1: navigation — Settings tab activates, url shows request + pill */
  :host([data-step="1"]) .tab[data-on] { color: var(--text-dim); background: transparent; }
  :host([data-step="1"]) .tab.s-settings { background: color-mix(in srgb, var(--shell) 22%, var(--card-2)); color: var(--text); }
  :host([data-step="1"]) .url .path b { opacity: 1; }
  :host([data-step="1"]) .xf,
  :host([data-step="2"]) .xf { opacity: 1; transform: translateY(0) scale(1); }
  :host([data-step="1"]) .caption .dot { background: var(--shell); }

  /* step 2: fragment loading (skeleton + border pulse). settings stays on */
  :host([data-step="2"]) .tab.s-settings { background: color-mix(in srgb, var(--shell) 22%, var(--card-2)); color: var(--text); }
  :host([data-step="2"]) .tab.s-activity { background: transparent; color: var(--text-dim); }
  :host([data-step="2"]) .url .path b { opacity: 1; }
  :host([data-step="2"]) .fragment { border-color: var(--fragment); box-shadow: 0 0 0 3px color-mix(in srgb, var(--fragment) 22%, transparent); }
  :host([data-step="2"]) .fragment .view { display: none !important; }
  :host([data-step="2"]) .fragment .skeleton { display: grid; }
  :host([data-step="2"]) .fragment .frag-title { opacity: 0.35; }
  :host([data-step="2"]) .skeleton .sk { animation: shimmer 1.2s linear infinite; }
  :host([data-step="2"]) .fragment { animation: borderPulse 1.1s ease-in-out infinite; }
  :host([data-step="2"]) .caption .dot { background: var(--fragment); }

  /* step 3: swap in new Settings content. shell + nav + subfragment persist */
  :host([data-step="3"]) .tab.s-settings { background: color-mix(in srgb, var(--shell) 22%, var(--card-2)); color: var(--text); }
  :host([data-step="3"]) .tab.s-activity { background: transparent; color: var(--text-dim); }
  :host([data-step="3"]) .v-activity { display: none; }
  :host([data-step="3"]) .v-settings,
  :host([data-step="4"]) .v-settings { display: grid; }
  :host([data-step="3"]) .v-activity[data-show],
  :host([data-step="4"]) .v-activity[data-show] { display: none; }
  :host([data-step="3"]) .v-settings .row,
  :host([data-step="4"]) .v-settings .row { }
  :host([data-step="3"]) .v-settings .row { animation: rise 0.5s var(--ease) backwards; }
  :host([data-step="3"]) .v-settings .row:nth-child(2) { animation-delay: 0.07s; }
  :host([data-step="3"]) .v-settings .row:nth-child(3) { animation-delay: 0.14s; }
  :host([data-step="3"]) .caption .dot { background: var(--fragment); }

  /* step 4: subfragment-only refresh. fragment content stays put. */
  :host([data-step="4"]) .subfragment {
    border-color: var(--subfragment);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--subfragment) 22%, transparent);
  }
  :host([data-step="4"]) .subfragment .v { opacity: 0.25; }
  :host([data-step="4"]) .subfragment .bars span {
    animation: subPulse 0.7s ease-in-out infinite;
    background: color-mix(in srgb, var(--subfragment) 30%, var(--card-3));
  }
  :host([data-step="4"]) .caption .dot { background: var(--subfragment); }

  /* step 5: subfragment fresh values pop in */
  :host([data-step="5"]) .v-settings { display: grid; }
  :host([data-step="5"]) .v-activity[data-show] { display: none; }
  :host([data-step="5"]) .tab.s-settings { background: color-mix(in srgb, var(--shell) 22%, var(--card-2)); color: var(--text); }
  :host([data-step="5"]) .tab.s-activity { background: transparent; color: var(--text-dim); }
  :host([data-step="5"]) .subfragment .v { animation: pop 0.45s var(--ease); }
  :host([data-step="5"]) .stat-a .v { color: color-mix(in srgb, var(--subfragment) 75%, white); }
  :host([data-step="5"]) .bars .b1 { height: 70%; }
  :host([data-step="5"]) .bars .b2 { height: 45%; }
  :host([data-step="5"]) .bars .b3 { height: 90%; }
  :host([data-step="5"]) .bars .b4 { height: 60%; }
  :host([data-step="5"]) .bars .b5 { height: 80%; }
  :host([data-step="5"]) .caption .dot { background: var(--subfragment); }

  /* keyframes ------------------------------------------------------------- */

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes shimmer {
    0% { background-position: 180% 0; }
    100% { background-position: -80% 0; }
  }
  @keyframes borderPulse {
    0%, 100% { box-shadow: 0 0 0 3px color-mix(in srgb, var(--fragment) 14%, transparent); }
    50% { box-shadow: 0 0 0 5px color-mix(in srgb, var(--fragment) 30%, transparent); }
  }
  @keyframes subPulse {
    0%, 100% { opacity: 0.55; }
    50% { opacity: 0.95; }
  }
  @keyframes rise {
    from { opacity: 0; transform: translateY(7px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pop {
    0% { opacity: 0.3; transform: translateY(4px) scale(0.96); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ===== REDUCED MOTION: static, fully-readable nested end-state ========= */
  @media (prefers-reduced-motion: reduce) {
    .xf, .nav .pulse { animation: none !important; }
    .url .path b { opacity: 1 !important; }
    .xf { opacity: 0 !important; }
    .fragment, .skeleton, .sk, .subfragment .bars span, .subfragment .v {
      animation: none !important;
    }
    .fragment .skeleton { display: none !important; }
    /* show settings fragment + populated subfragment, no shimmer/pulses */
    .v-activity { display: none !important; }
    .v-settings { display: grid !important; }
    .tab.s-settings { background: color-mix(in srgb, var(--shell) 22%, var(--card-2)); color: var(--text); }
    .tab.s-activity { background: transparent; color: var(--text-dim); }
    .bars .b1 { height: 70%; }
    .bars .b2 { height: 45%; }
    .bars .b3 { height: 90%; }
    .bars .b4 { height: 60%; }
    .bars .b5 { height: 80%; }
    .caption .dot { background: var(--subfragment); }
  }

  /* ===== container responsiveness ====================================== */
  @container (max-width: 360px) {
    .topbar { padding-left: 0.7rem; flex-wrap: wrap; }
    .layer-tag { position: static; margin: 0 0 0.4rem; }
    .url { font-size: 0.6rem; }
    .nav .pulse-label { display: none; }
    .tab { padding: 0.3rem 0.5rem; font-size: 0.66rem; }
  }
`);

const TEMPLATE = `
  <div class="frame">
    <div class="app" role="img"
         aria-label="Diagram of the Native Fragments runtime model. A persistent shell (green dashed outline) contains a swappable fragment (orange dashed outline) which contains an independently updating subfragment (blue dashed outline). On a loop: a tab navigation fires an x-fragment request, the fragment shows a loading skeleton, new content swaps in while the shell stays mounted, then the nested subfragment refreshes on its own.">

      <span class="tag tag-shell layer-tag" aria-hidden="true">Shell · stays mounted</span>

      <!-- URL bar (part of the shell) -->
      <div class="topbar">
        <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="url">
          <span class="path">/dashboard<b>/settings</b></span>
          <span class="xf" aria-hidden="true"><span class="spin"></span>x-fragment</span>
        </span>
      </div>

      <!-- Nav (part of the shell, persists across swaps) -->
      <div class="nav" aria-hidden="true">
        <button class="tab s-overview" type="button">Overview</button>
        <button class="tab s-activity" type="button" data-on="true">Activity</button>
        <button class="tab s-settings" type="button">Settings</button>
        <span class="pulse-label">shell</span>
        <span class="pulse"></span>
      </div>

      <!-- Stage holds the FRAGMENT -->
      <div class="stage">
        <div class="fragment">
          <span class="tag tag-fragment" style="position:absolute;top:-0.62rem;left:0.6rem" aria-hidden="true">Fragment · swaps in place</span>

          <div class="frag-head">
            <span class="frag-title">Activity</span>
            <span class="frag-sub">region</span>
          </div>

          <!-- swappable views -->
          <div class="view v-activity" data-show="true">
            <div class="row"><span class="ico"></span><span class="meta"><span class="l1"></span><span class="l2"></span></span></div>
            <div class="row"><span class="ico"></span><span class="meta"><span class="l1"></span><span class="l2"></span></span></div>
          </div>
          <div class="view v-settings">
            <div class="row"><span class="ico"></span><span class="meta"><span class="l1"></span><span class="l2"></span></span></div>
            <div class="row"><span class="ico"></span><span class="meta"><span class="l1"></span><span class="l2"></span></span></div>
          </div>

          <!-- loading skeleton for the fragment -->
          <div class="skeleton" aria-hidden="true">
            <div class="sk"></div>
            <div class="sk"></div>
          </div>

          <!-- SUBFRAGMENT nested inside the fragment -->
          <div class="subfragment">
            <span class="tag tag-sub sub-tag" aria-hidden="true">Subfragment · updates alone</span>
            <div class="stat stat-a">
              <span class="k">Sessions · last 5</span>
              <span class="v">1,284</span>
            </div>
            <div class="bars" aria-hidden="true">
              <span class="b1" style="height:55%"></span>
              <span class="b2" style="height:35%"></span>
              <span class="b3" style="height:70%"></span>
              <span class="b4" style="height:48%"></span>
              <span class="b5" style="height:62%"></span>
            </div>
          </div>
        </div>
      </div>

      <div class="caption" aria-hidden="true">
        <span class="dot"></span>
        <span class="cap-text">shell mounted · fragment ready</span>
      </div>
    </div>
  </div>
`;

const CAPTIONS = {
  0: "shell mounted · fragment ready",
  1: "navigate → request fires (x-fragment)",
  2: "fragment loading · shell stays mounted",
  3: "new fragment swapped in place",
  4: "subfragment refreshing · parent untouched",
  5: "nested partial rerender complete",
};

// Per-step caption wording keeps the story readable without color.
class RuntimeMap extends HTMLElement {
  connectedCallback() {
    shadow(this, { styles: [styles], html: TEMPLATE });

    // Render a valid default state immediately (also the no-JS state).
    if (!this.hasAttribute("data-step")) this.setAttribute("data-step", "0");

    const reduce =
      typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // CSS shows the static end-state; no driver.

    const caption = this.shadowRoot.querySelector(".cap-text");
    // 6 frames, ~1.4s each ≈ 8.4s loop. Calm, not frantic.
    const HOLD = [1700, 1300, 1500, 1500, 1300, 1700];
    let step = 0;

    const tick = () => {
      step = (step + 1) % 6;
      this.setAttribute("data-step", String(step));
      if (caption) caption.textContent = CAPTIONS[step];
      this._timer = setTimeout(tick, HOLD[step]);
    };
    this._timer = setTimeout(tick, HOLD[0]);
  }

  disconnectedCallback() {
    clearTimeout(this._timer);
    this._timer = null;
  }
}

if (!customElements.get("nf-runtime-map")) {
  customElements.define("nf-runtime-map", RuntimeMap);
}

export { RuntimeMap };
