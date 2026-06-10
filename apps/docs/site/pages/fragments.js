import { html } from "@nativefragments/core/server";
import { callout, code, docPage } from "./blocks.js";

export const fragmentsPage = () =>
  docPage({
    eyebrow: "Concepts",
    title: "Fragments",
    intro:
      "A normal request returns a full HTML document. A fragment request returns only a region of the page plus its metadata, so navigation swaps content without reloading the document.",
    body: html`
      <h2>The navigation model</h2>
      <p>
        A link click is fetched with an <code>x-fragment: true</code> header. The
        server runs the <em>same</em> route, returns just the body and metadata,
        and the browser swaps it into the content slot and updates the document
        head. The same route still serves a full page for a direct visit.
      </p>

      <h2>Installing navigation</h2>
      <p>
        Call <a href="/reference#installFragmentNavigation"><code>installFragmentNavigation</code></a>
        once after the shell loads. It upgrades real links into fragment swaps.
      </p>
      ${code(`// public/app/client.js
import { installFragmentNavigation } from "/nativefragments/router.js";

installFragmentNavigation({
  prefetch: "intent", // warm the cache on hover/focus (the default)
  afterNavigate({ meta, url }) {
    console.log(meta.title, url.pathname);
  },
});`)}

      <h2>Opting out</h2>
      <p>
        External links, document-like URLs such as <code>/agents.txt</code>,
        modified clicks, and links marked
        <code>data-nativefragments-reload</code> or
        <code>data-fragment-navigation="false"</code> use normal browser
        navigation.
      </p>
      ${code(`<a href="/agents.txt" data-nativefragments-reload>Agent guide</a>
<a href="/account/export" data-fragment-navigation="false">Export data</a>`, "js")}

      <h2>Nested fragments</h2>
      <p>
        To update one region instead of the whole body, define a named
        <a href="/reference#fragment"><code>fragment</code></a> on the route and
        mark the link and target with the same slot. The link sends
        <code>x-fragment-slot</code>; only the matching container is replaced.
      </p>
      ${code(`<a href="/settings/profile"
   data-fragment-slot="settings-panel"
   data-fragment-prefetch="intent">Profile</a>

<section data-fragment-slot="settings-panel">…</section>`, "js")}

      <h2>Prefetch modes</h2>
      <p>
        Prefetching warms the fragment cache so the swap is instant. Set a
        default in <code>installFragmentNavigation</code>, or per link with
        <code>data-fragment-prefetch</code>.
      </p>
      ${code(`<a href="/reports" data-fragment-prefetch="visible">Reports</a> <!-- when scrolled into view -->
<a href="/settings" data-fragment-prefetch="load">Settings</a>   <!-- immediately on load -->
<a href="/logout" data-fragment-prefetch="none">Log out</a>      <!-- never -->`, "js")}
      <p>
        For imperative control, call
        <a href="/reference#prefetchFragment"><code>prefetchFragment</code></a>.
      </p>

      <h2>Prefetch discovery</h2>
      <p>
        Prefetching uses the real anchors in the document. The router scans
        same-origin links and reads <code>data-fragment-prefetch</code> directly,
        so browsers, developers, and agents inspect the same HTML.
      </p>
      ${callout(
        "Good to know",
        "Fragment responses are produced by renderFragment — the route body plus a data-fragment-meta script the router uses to update the head.",
      )}

      <h2>See also</h2>
      <ul>
        <li><a href="/concepts/routing">Routing</a> — define the routes fragments navigate between.</li>
        <li><a href="/concepts/components">Components</a> — keep components alive across swaps.</li>
        <li><a href="/reference#installFragmentNavigation">Reference: <code>installFragmentNavigation</code></a>, <a href="/reference#fragment"><code>fragment</code></a>, <a href="/reference#prefetchFragment"><code>prefetchFragment</code></a>.</li>
      </ul>
    `,
  });
