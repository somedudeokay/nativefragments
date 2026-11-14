import { html, readSearch } from "@nativefragments/core/server";
import { renderLit } from "@nativefragments/lit/server";
import { html as lit } from "lit";
import "../../client/components/app-counter.js";
import { featureList } from "../features.js";
import { clickCountCookie, readClickCountCookie } from "../state.js";

// No-JavaScript path for the counter buttons: update the cookie the page
// already reads, then redirect back (POST-redirect-GET).
export const counterAction = async ({ request, url }) => {
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) return new Response("Origin not allowed", { status: 403 });
  const form = await request.formData();
  const count = form.get("op") === "reset" ? 0 : readClickCountCookie(request) + 1;
  return new Response(null, {
    status: 303,
    headers: { Location: "/", "Set-Cookie": clickCountCookie(count) },
  });
};

export const counterPage = async ({ query, request }) => {
  const count = readClickCountCookie(request);
  const { mode } = readSearch(query, { mode: "default" });
  const counter = await renderLit(lit`<app-counter count=${count}></app-counter>`);

  return html`<section class="demo-hero counter-route">
    <div class="hero-copy">
      <p class="eyebrow">Counter route</p>
      <h1>Server HTML with a Lit island.</h1>
      ${featureList()}
      <p class="lede">
        Real HTML from the Worker, a hydrated Lit component, and streamed
        fragment navigation. Query mode: ${mode}.
      </p>
    </div>
    ${counter}
  </section>`;
};
