import { fragment, html, raw } from "@nativefragments/core/server";
import { featureList } from "../features.js";

const nestedPanelName = "nested-panel";
export const nestedPanelFragment = fragment(nestedPanelName, (context) =>
  nestedRegion(context),
);

const panel = (context) =>
  context.params?.panel === "activity" ? "activity" : "overview";

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
          The header and layout stay mounted. The server returns just this
          panel.
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
          Links here update only this panel. The shell and tabs stay put.
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
      href: "/nested-route/overview",
      label: "Overview",
    }),
    nestedLink({
      active: activePanel === "activity",
      href: "/nested-route/activity",
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
    ${featureList()}
    <p class="lede">
      The tabs fetch only the panel below. Everything else stays mounted — no
      client framework.
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
