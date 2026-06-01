import { declarativeShadow, html } from "@nativefragments/core/server";

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

const counterMarkup = (count) =>
  html`<button type="button"><span data-count>Count ${count}</span></button>`;

export const homePage = () => html`<section class="hero">
  <p class="eyebrow">Native Fragments</p>
  <h1>Zero build. Native web. Agent friendly.</h1>
  <p>
    Edit <code>site/pages/home.js</code> to change this page. Add browser
    behavior in <code>public/app/client.js</code>.
  </p>
  <app-counter>${declarativeShadow({
    styles: [counterStyles],
    html: counterMarkup(0),
  })}</app-counter>
</section>`;
