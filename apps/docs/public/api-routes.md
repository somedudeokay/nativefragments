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

## See also

- [Routing](/concepts/routing) — page routes the adapter renders.
- [Workers](/concepts/workers) — offload client-side work instead.
- [Reference: createCloudflareHandler](/reference#createCloudflareHandler).
