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

For imperative control, call [prefetchFragment](/reference#prefetchFragment).

## Prefetch discovery

Prefetching uses the real anchors in the document. The router scans same-origin links and reads `data-fragment-prefetch` directly, so browsers, developers, and agents inspect the same HTML.

> **Good to know:** Fragment responses are produced by renderFragment — the route body plus a data-fragment-meta script the router uses to update the head.

## See also

- [Routing](/concepts/routing) — define the routes fragments navigate between.
- [Components](/concepts/components) — keep components alive across swaps.
- [Reference: installFragmentNavigation](/reference#installFragmentNavigation), [fragment](/reference#fragment), [prefetchFragment](/reference#prefetchFragment).
