import { html } from "@nativefragments/core/server";

export const appHeader = ({ activePath = "/" } = {}) => html`<header class="app-header">
  <a class="brand" href="/">Native Fragments</a>
  <nav aria-label="Primary">
    <a href="/" ${activePath === "/" ? html`aria-current="page"` : ""}>Counter</a>
    <a href="/nested-route" ${activePath.startsWith("/nested-route") ? html`aria-current="page"` : ""}>Nested route</a>
  </nav>
</header>`;
