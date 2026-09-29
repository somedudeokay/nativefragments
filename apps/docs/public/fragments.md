# Fragment Navigation

The router upgrades native links into streamed HTML navigation. It returns explicit navigate, prefetch, and invalidate capabilities and can be torn down with an AbortSignal.

## Start once

```js
// client/index.js
import "@nativefragments/lit/client";
import { startRouter } from "@nativefragments/core/client/router.js";

const lifetime = new AbortController();
export const router = startRouter({
  target: "#content-slot",
  prefetch: "intent",
  viewTransitions: true,
  signal: lifetime.signal,
});
```

There is one active router per document. Aborting the lifetime signal removes listeners, disconnects observers, cancels in-flight requests, and permits another router to start.

## Native links are the baseline

```js
<a href="/reports">Reports</a>
<a href="/settings" data-fragment-prefetch="visible">Settings</a>
<a href="/export.csv" data-nativefragments-reload>Export</a>
```

Same-origin application links are upgraded. External URLs, downloads, modified clicks, document-like assets, explicit reload links, and opted out links retain browser navigation.

## Named targets

Use a named fragment when one route owns a smaller independently navigable region. The server and HTML share the same slot name.

```js
const panel = fragment("settings-panel", renderSettings);

route("/settings/profile", {
  render: () => html`
    <a href="/settings/profile"${panel.prefetchAttrs("intent")}>Profile</a>
    <section${panel.attrs()}>${renderSettings()}</section>
  `,
  fragments: [panel],
});
```

Different targets may navigate concurrently. A newer navigation to the same target supersedes the older consumer without cancelling shared prefetched work used elsewhere.

## Imperative capabilities

Completed HTML is bounded by `cacheTtl` (30 seconds), `cacheMaxEntries` (100 responses) and `cacheMaxBytes` (2 MB). Response no-store/no-cache, max-age and Age further restrict reuse. Redirect aliases share invalidation. Authenticated pages should send `Cache-Control: private, no-store`.

```js
await router.navigate("/reports", { history: "push" });
await router.navigate("/settings/profile", { slot: "settings-panel" });
await router.prefetch("/reports");
router.invalidate("/reports");
router.invalidate(); // all cached and in-flight fragments
```

`navigate` and `prefetch` accept a consumer AbortSignal. `invalidate` is explicit; mutations decide which cached HTML became stale.

## GET forms

```js
<form action="/search" method="get" data-fragment-form>
  <input name="q" />
  <button>Search</button>
</form>
```

Opted-in GET forms navigate as fragments. POST forms remain native and use route actions plus redirects, preserving a reliable no-JavaScript mutation path.

## Lifecycle events

```js
document.addEventListener("nativefragments:navigation-complete", (event) => {
  console.log(event.detail.url, event.detail.target);
});

// navigation-start → navigation-swap → fragment-reveal* → navigation-complete
// navigation-start → navigation-abort | navigation-error
```

Events bubble and cross shadow boundaries. During a request the target exposes `aria-busy="true"` and a `data-nativefragments-navigation` state.

## Protocol negotiation

Protocol 2 redirect envelopes apply Set-Cookie in the browser before fetching the destination. Ancestor and descendant navigations cancel one another. Back/Forward restores the primary route and all changed named targets. A queued view transition cannot commit after cancellation.

Router requests send `X-NativeFragments-Protocol: 2`. A compatible server may return a framed stream and echoes the version. Missing or unknown versions receive one completed buffered fragment, so an old tab cannot mistake stream frames for one HTML document.

> **Failure behavior:** Non-HTML responses, request failures, invalid stream framing, and cross-origin redirects emit navigation-error and fall back to a normal document navigation.

## See also

- [Streaming](/concepts/streaming) — framed navigation and deferred reveals.
- [Routing](/concepts/routing) — routes and named fragment definitions.
- [Reference: startRouter](/reference#startRouter).
