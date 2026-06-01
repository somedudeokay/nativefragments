import { fragment, html, raw } from "@nativefragments/core/server";

const nestedPanelName = "nested-panel";
export const nestedPanelFragment = fragment(nestedPanelName, (context) =>
  nestedRegion(context),
);

const panel = (context) =>
  context.url.searchParams.get("panel") === "activity" ? "activity" : "overview";

const nestedLink = ({ active, href, label }) => html`<a
  href="${href}"
  ${nestedPanelFragment.prefetchAttrs("intent", {
    "aria-current": active ? "page" : null,
  })}
  >${label}</a
>`;

const panelContent = (activePanel) =>
  activePanel === "activity"
    ? html`<article class="nested-copy">
        <span>02</span>
        <h2>Only this nested region changed.</h2>
        <p>
          The page route, the top header, and the outer layout stay mounted.
          The app requests a named partial rerender, so the server returns this
          panel only.
        </p>
        <ul>
          <li>real links</li>
          <li>real history</li>
          <li>small HTML responses</li>
        </ul>
      </article>`
    : html`<article class="nested-copy">
        <span>01</span>
        <h2>One partial rerender can live inside another.</h2>
        <p>
          This route renders a nested content area. Links inside it update only
          that area without touching the document shell or the route-level tabs.
        </p>
        <ul>
          <li>declarative partial areas</li>
          <li>automatic intent prefetch</li>
          <li>server-rendered HTML</li>
        </ul>
      </article>`;

export const nestedRegion = (context) => {
  const activePanel = panel(context);
  const links = [
    nestedLink({
      active: activePanel === "overview",
      href: "/nested-route?panel=overview",
      label: "Overview",
    }),
    nestedLink({
      active: activePanel === "activity",
      href: "/nested-route?panel=activity",
      label: "Activity",
    }),
  ].join("");

  return html`<div class="nested-tabs" aria-label="Nested panels">
      ${raw(links)}
    </div>
    ${raw(panelContent(activePanel))}`;
};

export const nestedRoutePage = (context) => html`<section class="demo-hero nested-route">
  <div class="hero-copy">
    <p class="eyebrow">Nested route</p>
    <h1>Pure HTML partial rerenders. Zero dependencies.</h1>
    <p class="lede">
      Use the controls below to request only the nested panel from the server.
      The rest of the page stays mounted without a client framework.
    </p>
  </div>
  <section
    ${nestedPanelFragment.attrs({
      class: "nested-frame",
      "aria-label": "Nested fragment panel",
    })}
  >
    ${raw(nestedRegion(context))}
  </section>
</section>`;
