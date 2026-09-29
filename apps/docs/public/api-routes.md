# API Routes

Serve a JSON API alongside your pages. Define endpoints with apiRoute and createApi — the same :param and :rest* matcher as page routes, dependency-free — or delegate the prefix to any router with a Web Standards fetch method.

## Shared request preparation

See the [Fieldwork D1 workspace](https://task-board.nativefragments.org) for sign-in, persistent mutations and native form fallbacks. Its [source and migrations](https://github.com/somedudeokay/nativefragments/tree/main/apps/task-board) are included in the framework repository.

Pass `prepare` to the adapter to initialize application locals once per request. Routes, metadata, headers, actions, deferred fragments and array-based APIs receive the same locals and runtime bindings. External API routers keep their native fetch interface.

```js
createCloudflareHandler({
  routes, shell, api,
  prepare: async ({ request, env }) => ({
    user: await readSession(request, env.DB),
  }),
});
// In any renderer/action: context.locals.user, context.env.DB,
// context.context (runtime execution context), context.signal.
```

## Defining routes

[apiRoute(method, path, handler)](/reference#apiRoute) creates one endpoint; [createApi(routes, options)](/reference#createApi) assembles them into a Fetch-compatible router. Handlers receive `{ request, env, context, url, params, query, signal }`. A returned `Response` passes through; any other value becomes `Response.json(value)`.

```js
// site/api.js
import { apiRoute, createApi } from "@nativefragments/core/server";

export const api = createApi([
  apiRoute("GET", "/api/todos", ({ query }) => listTodos(query.get("filter"))),
  apiRoute("POST", "/api/todos", async ({ request }) =>
    Response.json(await createTodo(await request.json()), { status: 201 }),
  ),
  apiRoute("DELETE", "/api/todos/:id", ({ params }) => removeTodo(params.id)),
]);
```

API paths use the same matcher as pages: `:id` captures one segment onto `params`, and a trailing `:rest*` captures the remainder.

## Mounting an API

Pass the `api` to [createCloudflareHandler](/reference#createCloudflareHandler). Requests under `apiPrefix` (default `/api`) go to the API; everything else renders pages. The adapter also accepts an array of `apiRoute()` items directly and calls `createApi` for you.

```js
// worker.js
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { api } from "./site/api.js";
import { routes } from "./site/routes.js";
import { shell } from "./site/shell.js";

export default createCloudflareHandler({ routes, shell, api });
```

> **Note:** API-prefixed requests are delegated to api.fetch before page method handling. The shell does not wrap them, so the API owns its own request and response.

## Dispatch semantics

[createApi](/reference#createApi) resolves each request against the matched path:

- No path match returns JSON `404`.
- A path match with an unsupported method returns `405` with an `Allow` header listing the methods.
- `HEAD` falls back to the `GET` handler when no `HEAD` handler exists.
- A handler that throws calls `onError` and returns JSON `500` without leaking the message.

```js
export const api = createApi(routes, {
  onError: ({ error, request, route }) =>
    console.error(request.url, route?.path, error),
});
```

## Any Web Standards router

You are not limited to `createApi`. `api` only needs a `fetch(request, env, context)` method, so anything that speaks the Workers fetch contract works — a Hono app, or a plain object.

```js
import { Hono } from "hono";

const app = new Hono();
app.get("/api/health", (c) => c.json({ ok: true }));

export default createCloudflareHandler({ routes, shell, api: app });
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
  <body>${body}</body>
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

- [Routing](/concepts/routing) — page routes, and `action` for form mutations.
- [Workers](/concepts/workers) — offload client-side work instead.
- [Reference: apiRoute](/reference#apiRoute), [createApi](/reference#createApi), [createCloudflareHandler](/reference#createCloudflareHandler).
