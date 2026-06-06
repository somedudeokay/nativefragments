import { html } from "@nativefragments/core/server";
import { demoRows } from "../demo-catalog.js";

export const demosPage = () => html`<section class="page-hero compact demos-hero">
  <p class="eyebrow">Demos</p>
  <h1>Complete Workers you can inspect.</h1>
  <p>
    The demos are separate packages under <code>apps</code>. Each one has
    a Worker entrypoint, a route manifest, browser modules, and Node tests.
  </p>
</section>

<section class="demo-list" aria-label="Native Fragments demos">
  ${demoRows()}
</section>`;
