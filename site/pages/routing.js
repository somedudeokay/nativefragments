import { html } from "@nativefragments/core/server";
import { code, docPage } from "./blocks.js";

export const routingPage = () =>
  docPage({
    eyebrow: "Concepts",
    title: "Routes are explicit objects.",
    intro:
      "A route has a path, optional metadata, and a render function. Keeping routes as plain objects makes them easy for humans and agents to inspect.",
    body: html`
      <h2>Route shape</h2>
      ${code(`import { html, route } from "@nativefragments/core/server";

export const homeRoute = route("/", {
  meta: () => ({
    title: "Home",
    description: "Home page",
    canonical: "https://example.com/"
  }),
  render: () => html\`<h1>Home</h1>\`
});`)}
      <h2>Manifest</h2>
      <p>
        Apps export an array of routes. The Cloudflare adapter normalizes paths,
        matches requests, and renders the matched route.
      </p>
      <h2>Nested route regions</h2>
      <p>
        A route can define named fragments for sub-regions. The full route still
        renders a complete page, while fragment links can request only the
        named region.
      </p>
      ${code(`route("/settings/profile", {
  render: settingsPage,
  fragments: {
    "settings-panel": profilePanel
  }
});`)}
    `,
  });
