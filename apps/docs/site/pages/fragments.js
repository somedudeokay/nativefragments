import { html } from "@nativefragments/core/server";
import { callout, code, docPage } from "./blocks.js";

export const fragmentsPage = () =>
  docPage({
    eyebrow: "Concepts",
    title: "Fragment Navigation",
    intro:
      "The router upgrades native links into streamed HTML navigation. It returns explicit navigate, prefetch, and invalidate capabilities and can be torn down with an AbortSignal.",
    body: html`
      <h2>Start once</h2>
      ${code(`// client/index.js
import "@nativefragments/lit/client";
import { startRouter } from "@nativefragments/core/client/router.js";

const lifetime = new AbortController();
export const router = startRouter({
  target: "#content-slot",
  prefetch: "intent",
  viewTransitions: true,
  signal: lifetime.signal,
});`)}
      <p>
        There is one active router per document. Aborting the lifetime signal
        removes listeners, disconnects observers, cancels in-flight requests,
        and permits another router to start.
      </p>

      <h2>Native links are the baseline</h2>
      ${code(`<a href="/reports">Reports</a>
<a href="/settings" data-fragment-prefetch="visible">Settings</a>
<a href="/export.csv" data-nativefragments-reload>Export</a>`, "js")}
      <p>
        Same-origin application links are upgraded. External URLs, downloads,
        modified clicks, document-like assets, explicit reload links, and opted
        out links retain browser navigation.
      </p>

      <h2>Named targets</h2>
      <p>
        Use a named fragment when one route owns a smaller independently
        navigable region. The server and HTML share the same slot name.
      </p>
      ${code(`const panel = fragment("settings-panel", renderSettings);

route("/settings/profile", {
  render: () => html\`
    <a href="/settings/profile"\${panel.prefetchAttrs("intent")}>Profile</a>
    <section\${panel.attrs()}>\${renderSettings()}</section>
  \`,
  fragments: [panel],
});`)}
      <p>
        Different targets may navigate concurrently. A newer navigation to the
        same target supersedes the older consumer without cancelling shared
        prefetched work used elsewhere.
      </p>

      <h2>Imperative capabilities</h2>
      <p>
        Completed HTML is bounded by <code>cacheTtl</code> (30 seconds),
        <code>cacheMaxEntries</code> (100 responses) and <code>cacheMaxBytes</code>
        (2 MB). Response no-store/no-cache, max-age and Age further restrict reuse.
        Redirect aliases share invalidation. Authenticated pages should send
        <code>Cache-Control: private, no-store</code>.
      </p>
      ${code(`await router.navigate("/reports", { history: "push" });
await router.navigate("/settings/profile", { slot: "settings-panel" });
await router.prefetch("/reports");
router.invalidate("/reports");
router.invalidate(); // all cached and in-flight fragments`)}
      <p>
        <code>navigate</code> and <code>prefetch</code> accept a consumer
        AbortSignal. <code>invalidate</code> is explicit; mutations decide which
        cached HTML became stale.
      </p>

      <h2>GET forms</h2>
      ${code(`<form action="/search" method="get" data-fragment-form>
  <input name="q" />
  <button>Search</button>
</form>`, "js")}
      <p>
        Opted-in GET forms navigate as fragments. POST forms remain native and
        use route actions plus redirects, preserving a reliable no-JavaScript
        mutation path.
      </p>

      <h2>Lifecycle events</h2>
      ${code(`document.addEventListener("nativefragments:navigation-complete", (event) => {
  console.log(event.detail.url, event.detail.target);
});

// navigation-start → navigation-swap → fragment-reveal* → navigation-complete
// navigation-start → navigation-abort | navigation-error`)}
      <p>
        Events bubble and cross shadow boundaries. During a request the target
        exposes <code>aria-busy="true"</code> and a
        <code>data-nativefragments-navigation</code> state.
      </p>

      <h2>Protocol negotiation</h2>
      <p>
        Protocol 2 redirect envelopes apply Set-Cookie in the browser before
        fetching the destination. Ancestor and descendant navigations cancel one
        another. Back/Forward restores the primary route and all changed named
        targets. A queued view transition cannot commit after cancellation.
      </p>
      <p>
        Router requests send <code>X-NativeFragments-Protocol: 2</code>. A
        compatible server may return a framed stream and echoes the version.
        Missing or unknown versions receive one completed buffered fragment, so
        an old tab cannot mistake stream frames for one HTML document.
      </p>

      ${callout(
        "Failure behavior",
        "Non-HTML responses, request failures, invalid stream framing, and cross-origin redirects emit navigation-error and fall back to a normal document navigation.",
      )}

      <h2>See also</h2>
      <ul>
        <li><a href="/concepts/streaming">Streaming</a> — framed navigation and deferred reveals.</li>
        <li><a href="/concepts/routing">Routing</a> — routes and named fragment definitions.</li>
        <li><a href="/reference#startRouter">Reference: <code>startRouter</code></a>.</li>
      </ul>
    `,
  });
