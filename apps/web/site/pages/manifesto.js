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
    Explicit HTML. Stream the useful work. Keep native navigation. Put state
    where it belongs. Use modern tools without making the toolchain the product.
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
      <strong>Tooling should stay subordinate.</strong>
      <span>Use a fast ESM build to resolve packages, not a compiler-shaped application model.</span>
    </li>
    <li>
      <strong>HTML is the first payload.</strong>
      <span>JavaScript upgrades the page; it does not own the page.</span>
    </li>
    <li>
      <strong>Lit owns interactive islands.</strong>
      <span>Server-render them, hydrate in place, and keep local state local.</span>
    </li>
    <li>
      <strong>The edge is enough.</strong>
      <span>Cloudflare Workers, static assets, and fragments scale from zero.</span>
    </li>
  </ol>
</section>`;
