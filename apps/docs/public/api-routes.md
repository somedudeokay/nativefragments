# API Routes

Serve a JSON or HTTP API alongside your pages. The Cloudflare adapter delegates a URL prefix to any router with a Web Standards fetch method — Hono works directly, and core stays dependency-free.

## Mounting an API

Pass an `api` to [createCloudflareHandler](/reference#createCloudflareHandler). Requests under `apiPrefix` (default `/api`) go to the API; everything else renders pages.

```js
// worker.js
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { Hono } from "hono";
import { routes } from "./site/routes.js";
import { shell } from "./site/shell.js";

const api = new Hono();
api.get("/api/health", (c) => c.json({ ok: true }));

export default createCloudflareHandler({ routes, shell, api });
```

> **Note:** Requests under apiPrefix are delegated to api.fetch before route matching. The shell does not parse them, so the API owns its own request/response handling.

## Any Web Standards router

`api` only needs a `fetch(request, env, context)` method, so anything that speaks the Workers fetch contract works — Hono is one option, a plain function is another.

```js
const api = {
  fetch(request) {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
```

## Changing the prefix

```js
export default createCloudflareHandler({
  routes,
  shell,
  api,
  apiPrefix: "/rpc", // /rpc and /rpc/* now go to the API
});
```

## Content Security Policy

The Cloudflare adapter passes a per-request `nonce` to the shell and to framework streaming scripts. Keep the default compatible policy, or opt into a strict nonce-based policy with `contentSecurityPolicy`.

```js
import { attrs, html, raw } from "@nativefragments/core/server";

export const shell = ({ body, meta, nonce }) => html`<!doctype html>
<html>
  <head>
    <title>${meta.title}</title>
    <script${attrs({ nonce })}>
      document.documentElement.classList.add("js");
    </script>
  </head>
  <body>${raw(body)}</body>
</html>`;

export default createCloudflareHandler({
  routes,
  shell,
  contentSecurityPolicy: ({ nonce }) =>
    [
      "default-src 'self'",
      "base-uri 'none'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      `script-src 'self' 'nonce-${nonce}'`,
      `style-src 'self' 'nonce-${nonce}'`
    ].join("; ")
});
```

## See also

- [Routing](/concepts/routing) — page routes the adapter renders.
- [Workers](/concepts/workers) — offload client-side work instead.
- [Reference: createCloudflareHandler](/reference#createCloudflareHandler).
