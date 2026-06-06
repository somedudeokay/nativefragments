import { html } from "@nativefragments/core/server";
import { demoRows } from "../demo-catalog.js";

export const examplesPage = () => html`<section class="page-hero compact examples-hero">
  <p class="eyebrow">Examples</p>
  <h1>Modern apps, almost no dependencies.</h1>
  <p>
    Each example is its own Cloudflare Worker package in the examples monorepo.
    The apps use Native Fragments, platform APIs, and focused Node tests.
  </p>
</section>

<section class="demo-list" aria-label="Native Fragments examples">
  ${demoRows()}
</section>`;
