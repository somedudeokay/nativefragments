import { declarativeShadow, html, raw } from "@nativefragments/core/server";

export const headerStyles = `
  :host {
    display: block;
    position: sticky;
    top: 0;
    z-index: 20;
  }

  header {
    align-items: center;
    backdrop-filter: blur(18px);
    background: color-mix(in srgb, var(--paper, #f7f3e8) 84%, transparent);
    border-bottom: 1px solid var(--line, rgba(20, 20, 20, 0.1));
    display: grid;
    gap: 1rem;
    grid-template-columns: minmax(0, 1fr) auto auto;
    min-height: 72px;
    padding: 0 max(var(--pad, 1.25rem), calc((100% - var(--container, 1160px)) / 2));
  }

  .render-meter {
    align-items: center;
    display: flex;
    gap: 0.85rem;
    min-width: 0;
  }

  .mark {
    background: var(--green, #1ed760);
    border-radius: 3px;
    box-shadow: 0 0 0 5px color-mix(in srgb, var(--green, #1ed760) 18%, transparent);
    flex: 0 0 auto;
    height: 0.72rem;
    transform: rotate(45deg);
    width: 0.72rem;
  }

  .render-copy {
    display: grid;
    gap: 0.16rem;
    min-width: 0;
  }

  .render-copy strong {
    color: var(--ink, #141414);
    font-family: var(--display, ui-sans-serif, system-ui, sans-serif);
    font-size: clamp(0.98rem, 2vw, 1.08rem);
    font-weight: 700;
    letter-spacing: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .render-copy span {
    color: var(--muted, #5f5a50);
    font-family: var(--mono, ui-monospace, SFMono-Regular, Menlo, monospace);
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .counter {
    align-items: center;
    background: #161616;
    border: 1px solid rgba(20, 20, 20, 0.24);
    border-radius: 0.6rem;
    box-shadow: var(--shadow-sm, 0 1px 2px rgba(20, 20, 20, 0.05));
    color: var(--paper, #f7f3e8);
    display: inline-flex;
    font-family: var(--mono, ui-monospace, SFMono-Regular, Menlo, monospace);
    font-size: 0.88rem;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    gap: 0.18rem;
    height: 2.5rem;
    justify-content: center;
    padding: 0 0.45rem;
    perspective: 260px;
  }

  .digit {
    align-items: center;
    background: linear-gradient(180deg, #242424 0%, #171717 48%, #0f0f0f 52%, #202020 100%);
    border: 1px solid rgba(247, 243, 232, 0.14);
    border-radius: 0.35rem;
    box-shadow:
      inset 0 1px rgba(255, 255, 255, 0.08),
      inset 0 -1px rgba(0, 0, 0, 0.45);
    display: inline-flex;
    height: 1.78rem;
    justify-content: center;
    line-height: 1;
    overflow: hidden;
    position: relative;
    transform-origin: 50% 50%;
    width: 1.32rem;
  }

  .digit::after {
    background: rgba(0, 0, 0, 0.42);
    content: "";
    height: 1px;
    left: 0;
    position: absolute;
    right: 0;
    top: 50%;
  }

  .digit.is-flipping {
    animation: digit-flip 0.42s var(--ease, cubic-bezier(0.16, 1, 0.3, 1));
  }

  .click-state {
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    display: inline-flex;
    gap: 0.55rem;
    justify-self: end;
    min-height: 2.45rem;
    padding: 0;
  }

  .click-state span {
    color: var(--muted, #5f5a50);
    font-family: var(--mono, ui-monospace, SFMono-Regular, Menlo, monospace);
    font-size: 0.64rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .click-state strong {
    color: var(--ink, #141414);
    font-family: var(--mono, ui-monospace, SFMono-Regular, Menlo, monospace);
    font-size: 0.88rem;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
  }

  nav {
    --tab-left: 0.25rem;
    --tab-width: calc((100% - 0.5rem) / 2);

    background: color-mix(in srgb, var(--surface, #fffdf6) 72%, transparent);
    border: 1px solid var(--line, rgba(20, 20, 20, 0.1));
    border-radius: var(--radius-pill, 999px);
    box-shadow: var(--shadow-sm, 0 1px 2px rgba(20, 20, 20, 0.05));
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 0.25rem;
    position: relative;
  }

  nav[data-active-tab="/nested-route"] {
    --tab-left: 50%;
  }

  .tab-indicator {
    background: var(--ink, #141414);
    border-radius: var(--radius-pill, 999px);
    bottom: 0.25rem;
    box-shadow: var(--shadow-md, 0 10px 30px -12px rgba(20, 20, 20, 0.18));
    left: var(--tab-left);
    position: absolute;
    top: 0.25rem;
    transition:
      left 0.42s var(--ease, cubic-bezier(0.16, 1, 0.3, 1)),
      width 0.42s var(--ease, cubic-bezier(0.16, 1, 0.3, 1));
    width: var(--tab-width);
  }

  a {
    align-items: center;
    border-radius: var(--radius-pill, 999px);
    color: var(--muted, #5f5a50);
    display: inline-flex;
    font-family: var(--sans, ui-sans-serif, system-ui, sans-serif);
    font-size: 0.88rem;
    font-weight: 600;
    justify-content: center;
    min-height: 2.25rem;
    min-width: 8.5rem;
    padding: 0 1rem;
    position: relative;
    text-decoration: none;
    transition: color 0.22s var(--ease, ease);
    z-index: 1;
  }

  a[aria-current="page"] {
    color: var(--paper, #f7f3e8);
  }

  @keyframes digit-flip {
    0% {
      transform: rotateX(0deg) translateY(0);
    }

    42% {
      color: color-mix(in srgb, var(--paper, #f7f3e8) 70%, transparent);
      transform: rotateX(-72deg) translateY(-0.04rem);
    }

    100% {
      transform: rotateX(0deg) translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .digit.is-flipping {
      animation: none;
    }
  }

  @media (max-width: 760px) {
    header {
      align-items: stretch;
      grid-template-columns: 1fr;
      padding-block: 0.85rem;
    }

    .render-meter {
      align-items: flex-start;
    }

    .click-state {
      justify-content: space-between;
      justify-self: stretch;
    }

    .render-copy strong {
      white-space: normal;
    }

    nav {
      width: 100%;
    }

    a {
      min-width: 0;
      padding-inline: 0.7rem;
    }
  }
`;

const padSeconds = (count) => String(count).padStart(3, "0").slice(-3);

const headerHtml = ({ activePath = "/", seconds = 0, clickCount = 0 } = {}) => {
  const padded = padSeconds(seconds);
  const paddedClicks = padSeconds(clickCount);
  const active = activePath.startsWith("/nested-route") ? "/nested-route" : "/";
  const digits = [...padded]
    .map(
      (digit, index) =>
        html`<span class="digit" data-digit="${index}">${digit}</span>`,
    )
    .join("");

  return html`<header>
    <div class="render-meter">
      <span class="mark" aria-hidden="true"></span>
      <span
        class="counter"
        aria-label="${padded} seconds since rerender"
        title="seconds since rerender"
      >
        ${raw(digits)}
      </span>
      <span class="render-copy">
        <strong>header stays mounted during partial rerenders</strong>
        <span>seconds since rerender</span>
      </span>
    </div>
    <div class="click-state" aria-label="${paddedClicks} shared clicks">
      <span>click counter</span>
      <strong data-click-count>${paddedClicks}</strong>
    </div>
    <nav aria-label="Demo routes" data-active-tab="${active}">
      <span class="tab-indicator" aria-hidden="true"></span>
      <a href="/" data-tab="/" ${active === "/" ? raw('aria-current="page"') : ""}>Counter</a>
      <a
        href="/nested-route"
        data-tab="/nested-route"
        ${active === "/nested-route" ? raw('aria-current="page"') : ""}
        >Nested route</a
      >
    </nav>
  </header>`;
};

export const appHeader = ({ activePath = "/", clickCount = 0 } = {}) =>
  raw(html`<nf-demo-header data-initial-click-count="${clickCount}">
    ${declarativeShadow({
      styles: [headerStyles],
      html: headerHtml({ activePath, seconds: 0, clickCount }),
    })}
  </nf-demo-header>`);
