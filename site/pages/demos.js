import { html } from "@nativefragments/core/server";

export const demosPage = () => html`<section class="page-hero compact">
  <p class="eyebrow">Demos</p>
  <h1>Reference apps are coming soon.</h1>
  <p>
    This page will collect small, inspectable demos built with Native Fragments:
    forms, dashboards, content sites, realtime screens, and agent-generated app
    patterns.
  </p>
</section>

<section class="coming-soon-grid">
  <article>
    <span>Coming soon</span>
    <h2>Starter Worker</h2>
    <p>A minimal Cloudflare Worker app with fragments, metadata, and assets.</p>
  </article>
  <article>
    <span>Coming soon</span>
    <h2>Shadow DOM Form</h2>
    <p>A native custom element form with scoped CSS and no framework state.</p>
  </article>
  <article>
    <span>Coming soon</span>
    <h2>Agent Task Board</h2>
    <p>A denser app surface built from small browser-native islands.</p>
  </article>
</section>`;
