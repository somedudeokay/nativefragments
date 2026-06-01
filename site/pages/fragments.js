import { html } from "@nativefragments/core/server";
import { code, docPage } from "./blocks.js";

export const fragmentsPage = () =>
  docPage({
    eyebrow: "Concepts",
    title: "Fragments keep the document alive.",
    intro:
      "Normal requests return a full HTML document. Client navigations request only the route body and metadata with the x-fragment header.",
    body: html`
      <h2>Install navigation</h2>
      ${code(`import { installFragmentNavigation } from "/nativefragments/router.js";

installFragmentNavigation({
  prefetch: "intent",
  afterNavigate({ meta, url }) {
    console.log(meta.title, url.pathname);
  }
});`)}
      <h2>Why it matters</h2>
      <p>
        The app keeps browser-native navigation semantics: real links, real
        history, real HTML. JavaScript upgrades navigation without owning the
        whole page.
      </p>
      <p>
        External links, document-like URLs such as <code>/agents.txt</code>,
        modified clicks, and links marked with
        <code>data-nativefragments-reload</code> or
        <code>data-fragment-navigation="false"</code> keep normal browser
        navigation.
      </p>
      ${code(`<a href="/agents.txt" data-nativefragments-reload>Get started for agents</a>
<a href="/account/export" data-fragment-navigation="false">Export data</a>`)}
      <h2>Nested fragments</h2>
      <p>
        Add <code>data-fragment-slot</code> to a link and target container when
        only one region should update.
      </p>
      ${code(`<a href="/settings/profile" data-fragment-slot="settings-panel" data-fragment-prefetch="intent">
  Profile
</a>

<section data-fragment-slot="settings-panel">
  ...
</section>`)}
      <h2>Prefetch</h2>
      <p>
        Same-origin fragments are prefetched on hover and focus by default.
        Use declarative attributes for links that should prefetch when visible,
        immediately on page load, or never.
      </p>
      ${code(`<a href="/reports" data-fragment-prefetch="visible">Reports</a>
<a href="/settings" data-fragment-prefetch="load">Settings</a>
<a href="/logout" data-fragment-prefetch="none">Log out</a>`)}
      <h2>Declarative manifest</h2>
      <p>
        On Cloudflare, the Worker can use <code>HTMLRewriter</code> to detect
        fragment slots and prefetch links in the rendered markup, then append a
        <code>data-fragment-manifest</code> JSON script for the browser router
        and agents to inspect.
      </p>
    `,
  });
