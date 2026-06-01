import { html } from "@nativefragments/core/server";

export const homePage = () => html`<section class="hero">
  <p class="eyebrow">Native Fragments</p>
  <h1>Zero build. Native web. Agent friendly.</h1>
  <p>
    Edit <code>site/pages/home.js</code> to change this page. Add browser
    behavior in <code>public/app/client.js</code>.
  </p>
  <app-counter></app-counter>
</section>`;
