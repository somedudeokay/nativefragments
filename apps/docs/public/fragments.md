# Fragments

A normal request returns a full HTML document. A fragment request returns only a region of the page plus its metadata, so navigation swaps content without reloading the document.

## The navigation model

A link click is fetched with an `x-fragment: true` header. The server runs the _same_ route, returns just the body and metadata, and the browser swaps it into the content slot and updates the document head. The same route still serves a full page for a direct visit.

## Installing navigation

Call [installFragmentNavigation](/reference#installFragmentNavigation) once after the shell loads. It upgrades real links into fragment swaps.

```js
// public/app/client.js
import { installFragmentNavigation } from "/nativefragments/router.js";

installFragmentNavigation({
  prefetch: "intent", // warm the cache on hover/focus (the default)
  afterNavigate({ meta, url }) {
    console.log(meta.title, url.pathname);
  },
});
```

## Opting out

External links, document-like URLs such as `/agents.txt`, modified clicks, and links marked `data-nativefragments-reload` or `data-fragment-navigation="false"` use normal browser navigation.

```js
<a href="/agents.txt" data-nativefragments-reload>Agent guide</a>
<a href="/account/export" data-fragment-navigation="false">Export data</a>
```

## Nested fragments

To update one region instead of the whole body, define a named [fragment](/reference#fragment) on the route and mark the link and target with the same slot. The link sends `x-fragment-slot`; only the matching container is replaced.

```js
<a href="/settings/profile"
   data-fragment-slot="settings-panel"
   data-fragment-prefetch="intent">Profile</a>

<section data-fragment-slot="settings-panel">…</section>
```

## Prefetch modes

Prefetching warms the fragment cache so the swap is instant. Set a default in `installFragmentNavigation`, or per link with `data-fragment-prefetch`.

```js
<a href="/reports" data-fragment-prefetch="visible">Reports</a> <!-- when scrolled into view -->
<a href="/settings" data-fragment-prefetch="load">Settings</a>   <!-- immediately on load -->
<a href="/logout" data-fragment-prefetch="none">Log out</a>      <!-- never -->
```

For imperative control, call [prefetchFragment](/reference#prefetchFragment). `visible` and `load` prefetch re-bind after each navigation, so links that swap into the slot start prefetching too.

## GET forms

A search or filter `<form method="get">` opts into fragment navigation with `data-fragment-form`. The router serializes the fields into the query string, fragment-navigates to the result, and includes the submitter's `name`/`value` when a specific button submits.

```js
<form action="/search" method="get" data-fragment-form>
  <input name="q" />
  <button>Search</button>
</form>
```

> **Note:** POST forms are never fragment-intercepted. They post to a route action() and return through a redirect — see Routing.

## Clearing the cache

After a mutation, drop stale fragment HTML with [clearFragmentCache](/reference#clearFragmentCache). With no argument it clears every cached and in-flight fragment; with an `href` it clears every slot for that pathname and search.

```js
import { clearFragmentCache } from "/nativefragments/router.js";

await fetch("/api/todos", { method: "POST", body });
clearFragmentCache(); // next navigation refetches
```

## Scroll, focus, and transitions

Fragment navigation preserves the platform feel: back/forward restores the saved scroll position (including hash-only history entries), in-page hash links keep native behavior, and a cross-page hash scrolls to the anchor after the swap. Focus moves to the swapped container for keyboard and screen-reader users. When the browser supports it, the swap runs inside `document.startViewTransition()` — toggle it with the `viewTransitions` option (default `true`).

```js
installFragmentNavigation({
  prefetch: "intent",
  viewTransitions: true, // the default
});
```

> **Good to know:** Fragment responses are validated by Content-Type: a non-text/html response falls back to a full document navigation instead of swapping garbage into the slot. Server redirects are followed, and the final URL lands in the address bar.

## Window globals

Module imports are preferred, but the router also exposes globals for inline handlers and console debugging: `window.nativeFragmentsNavigate(href, pushState?, slot?)`, `window.nativeFragmentsPrefetch(href, slot?)`, and `window.nativeFragmentsClearFragmentCache(href?)`.

## Prefetch discovery

Prefetching uses the real anchors in the document. The router scans same-origin links and reads `data-fragment-prefetch` directly, so browsers, developers, and agents inspect the same HTML.

> **Good to know:** Fragment responses are produced by renderFragment — the route body plus a data-fragment-meta script the router uses to update the head.

## Deferred fragments

Fragments can also stream. When a route calls `context.defer(fragment)`, the document flushes immediately with a loading boundary and the fragment's completed HTML streams in when its data resolves — out of order, on the same connection, with error boundaries and timeouts built in. See [Streaming](/concepts/streaming) for the full model.

## See also

- [Routing](/concepts/routing) — define the routes fragments navigate between.
- [Streaming](/concepts/streaming) — defer slow fragments and stream them out of order.
- [Components](/concepts/components) — keep components alive across swaps.
- [Reference: installFragmentNavigation](/reference#installFragmentNavigation), [prefetchFragment](/reference#prefetchFragment), [clearFragmentCache](/reference#clearFragmentCache).
