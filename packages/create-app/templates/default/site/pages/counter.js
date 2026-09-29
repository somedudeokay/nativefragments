import { html, readSearch } from "@nativefragments/core/server";
import { renderLit } from "@nativefragments/lit/server";
import { html as lit } from "lit";
import "../../client/components/app-counter.js";
import { featureList } from "../features.js";
import { readClickCountCookie } from "../state.js";

export const counterPage = async ({ query, request }) => {
  const count = readClickCountCookie(request);
  const { mode } = readSearch(query, { mode: "default" });
  const counter = await renderLit(lit`<app-counter count=${count}></app-counter>`);

  return html`<section class="demo-hero counter-route">
    <div class="hero-copy">
      <p class="eyebrow">Counter route</p>
      ${featureList()}
      <p class="lede">
        Real HTML from the Worker, a hydrated Lit component, and streamed
        fragment navigation. Query mode: ${mode}.
      </p>
    </div>
    ${counter}
  </section>`;
};
