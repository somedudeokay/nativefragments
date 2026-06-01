import { declarativeShadow, html } from "@nativefragments/core/server";
import { readClickCountCookie } from "../state.js";

const counterPanelStyles = `
  :host {
    display: block;
  }

  .panel {
    background: #161616;
    border: 1px solid rgba(247, 243, 232, 0.12);
    border-radius: var(--radius-lg, 20px);
    box-shadow: var(--shadow-lg, 0 30px 60px -20px rgba(20, 20, 20, 0.25));
    color: var(--paper, #f7f3e8);
    display: grid;
    gap: 1.2rem;
    overflow: hidden;
    padding: clamp(1.2rem, 3vw, 1.6rem);
    position: relative;
  }

  .panel::before {
    background: linear-gradient(90deg, var(--green, #1ed760), var(--orange, #ff6b35));
    content: "";
    height: 3px;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  .label {
    color: #b8b2a4;
    font-family: var(--mono, ui-monospace, SFMono-Regular, Menlo, monospace);
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .value {
    color: var(--green, #1ed760);
    font-family: var(--mono, ui-monospace, SFMono-Regular, Menlo, monospace);
    font-size: clamp(4rem, 12vw, 7rem);
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 0.9;
  }

  p {
    color: #d7d0c2;
    font: inherit;
    margin: 0;
    max-width: 54ch;
  }

  button {
    background: var(--green, #1ed760);
    border: 0;
    border-radius: var(--radius-pill, 999px);
    color: #111111;
    cursor: pointer;
    font: inherit;
    font-weight: 700;
    justify-self: start;
    padding: 0.75rem 1rem;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
  }

  button.secondary {
    background: transparent;
    border: 1px solid rgba(247, 243, 232, 0.22);
    color: var(--paper, #f7f3e8);
  }
`;

const padSeconds = (count) => String(count).padStart(3, "0").slice(-3);

const counterPanelHtml = (count) => html`<section class="panel">
  <span class="label">Shared state</span>
  <strong class="value" data-click-count>${padSeconds(count)}</strong>
  <p>
    This click counter and the header read the same state. The value is saved
    to localStorage and mirrored to a cookie so refreshes render with the same
    state before JavaScript hydrates.
  </p>
  <div class="actions">
    <button type="button" data-increment>Increment click counter</button>
    <button type="button" class="secondary" data-reset>Reset</button>
  </div>
</section>`;

export const counterPage = ({ request }) => {
  const count = readClickCountCookie(request);

  return html`<section class="demo-hero counter-route">
    <div class="hero-copy">
      <p class="eyebrow">Counter route</p>
      <h1>State that survives partial rerenders.</h1>
      <p class="lede">
        The header is outside the page area. The content below can rerender in
        pieces, but the click counter stays shared across the app.
      </p>
    </div>
    <app-counter-panel>
      ${declarativeShadow({
        styles: [counterPanelStyles],
        html: counterPanelHtml(count),
      })}
    </app-counter-panel>
  </section>`;
};
