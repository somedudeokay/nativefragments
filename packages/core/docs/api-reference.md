# Native Fragments API Reference

The complete generated reference is available at
https://docs.nativefragments.org/reference and ships as Markdown at
https://docs.nativefragments.org/reference.md.

## Server HTML

```js
import { attrs, escapeHtml, html, jsonScript, raw } from "@nativefragments/core/server";
```

## Server routing

```js
import {
  createRoutes,
  errorRoute,
  fragment,
  fragmentMeta,
  notFoundRoute,
  readSearch,
  redirect,
  renderFragment,
  renderRoute,
  route,
} from "@nativefragments/core/server";
```

## Server API

```js
import { apiRoute, createApi } from "@nativefragments/core/server";
```

## Cloudflare adapter

```js
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
```

Route `headers` override default response headers. `Vary` fields are combined
with `x-fragment`, `x-fragment-slot`, and `x-nativefragments-protocol`, with
case-insensitive deduplication. `Vary: *` remains `*`.

## Browser router

```js
import { startRouter } from "@nativefragments/core/client/router.js";

const router = startRouter(options);
await router.navigate(href, options);
await router.prefetch(href, options);
router.invalidate(href, options);
```

HTML cache entries are shared across anchors, while each consumer keeps its
requested hash unless redirected to an explicit anchor. Already-aborted signals
reject before frame delivery. Invalidated pending requests cannot repopulate
the cache when they finish.

### Accessibility and platform behavior

- A primary navigation moves focus to the first `<h1>` in the new content, or
  to the target when there is none. A named-slot navigation leaves focus where
  it is unless the swap removed the focused element. The router adds no
  permanent `tabindex`.
- `aria-current="page"` is kept in sync on `nav a[href]` links outside the
  swapped region: the exact pathname wins, otherwise the longest section
  prefix. Opt a `<nav>` out with
  `data-fragment-current="manual"`.
- The target is `aria-busy` only until the first frame commits; deferred slots
  stay `aria-busy` until they resolve. Assistive technology suppresses live
  regions inside a busy container, so keep `loading()` content plain and
  announce long waits from a live region outside the slot.
- View transitions are skipped under `prefers-reduced-motion: reduce` and after
  a browser-animated history gesture. Named slots transition on their own
  element where `Element.startViewTransition()` exists. Document transitions
  carry a `nativefragments-forward`, `-back` or `-replace` type.
- `visible` and `load` prefetches use `fetch` priority `low`.
- Framework HTML and worker-URL sinks go through a Trusted Types policy named
  `nativefragments`. To enforce Trusted Types, send
  `require-trusted-types-for 'script'; trusted-types nativefragments` (plus any
  policies your components need, such as `lit-html`).
- HTML responses send `X-Frame-Options: SAMEORIGIN` next to the default
  `frame-ancestors 'self'`; override it per route with `headers`.

## Web Worker RPC

```js
import {
  createWorkerClient,
  exposeWorker,
  transferResult,
  workerClient,
} from "@nativefragments/core/client/worker.js";
```

Lit integration is documented separately in `@nativefragments/lit`.
