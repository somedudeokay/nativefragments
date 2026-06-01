import { attrs, fragment, html, raw } from "@nativefragments/core/server";

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
          The request carries <code>x-fragment-slot: nested-panel</code>, so the
          server returns this panel only.
        </p>
        <ul>
          <li>real links</li>
          <li>real history</li>
          <li>small HTML responses</li>
        </ul>
      </article>`
    : html`<article class="nested-copy">
        <span>01</span>
        <h2>Fragments can live inside fragments.</h2>
        <p>
          This route renders a nested slot. Links inside it update the slot
          without touching the document shell or the route-level header tabs.
        </p>
        <ul>
          <li>declarative slot attributes</li>
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

export const nestedRoutePage = (context) => html`<section class="demo-hero">
  <div class="hero-copy">
    <p class="eyebrow">Nested route</p>
    <h1>Replace one region, keep everything else alive.</h1>
    <p class="lede">
      This page demonstrates nested fragment routing. Use the controls below to
      request only the nested panel from the server.
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
  <aside class="route-note" ${attrs({ "data-fragment-prefetch": "visible" })}>
    <strong>Header state check</strong>
    <p>
      The shell timer keeps moving, and the shared click counter remains
      available in the header while this route and the nested panel navigate.
    </p>
  </aside>
</section>`;
