import { html } from "@nativefragments/core/server";

export const manifestoPage = () => html`<section class="page-hero manifesto">
  <p class="eyebrow">Manifesto</p>
  <h1>Make the stable layer the default layer.</h1>
  <p>
    Browsers have already shipped the frontend runtime: HTML, CSS, JavaScript,
    Custom Elements, Shadow DOM, URL, Fetch, Streams, and History. Native
    Fragments is a small agreement to use those primitives directly.
  </p>
</section>

<section class="goal-wall" aria-label="Native Fragments goals">
  <p>
    Zero dependencies. Zero build. Blazing fast. Built for agents. AI-friendly
    applications. Zero maintenance. Free to deploy. Infinite scale.
  </p>
</section>

<section class="principles">
  <ol>
    <li>
      <strong>Agents need locality.</strong>
      <span>One route, one renderer, one component file, one obvious edit.</span>
    </li>
    <li>
      <strong>Applications should be readable by agents.</strong>
      <span>Native HTML and browser modules are easier to click, scrape, inspect, and maintain than opaque transpiled bundles.</span>
    </li>
    <li>
      <strong>Maintenance comes from deletion.</strong>
      <span>No compiler pipeline unless the app earns it.</span>
    </li>
    <li>
      <strong>HTML is the first payload.</strong>
      <span>JavaScript upgrades the page; it does not own the page.</span>
    </li>
    <li>
      <strong>Shadow DOM is the style boundary.</strong>
      <span>Components should not leak styling problems into the app.</span>
    </li>
    <li>
      <strong>The edge is enough.</strong>
      <span>Cloudflare Workers, static assets, and fragments scale from zero.</span>
    </li>
  </ol>
</section>`;
