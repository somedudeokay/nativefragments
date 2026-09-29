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
