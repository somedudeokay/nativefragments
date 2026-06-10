# Routing

A route maps a URL path to a render function and optional metadata. Routes are plain objects, so humans and agents can read the whole map at a glance.

## Defining a route

[route](/reference#route) takes a path and a definition with a `render` function and an optional `meta` function.

```js
// site/pages/home.js
import { html, route } from "@nativefragments/core/server";

export const home = route("/", {
  meta: () => ({ title: "Home", description: "Welcome." }),
  render: () => html`<h1>Home</h1>`,
});
```

## Path parameters

Use `:name` segments. Matched values arrive on `ctx.params`.

```js
// site/pages/blog.js
export const post = route("/blog/:slug", {
  render: (ctx) => html`<h1>${ctx.params.slug}</h1>`,
});
```

## The route context

Every `render` and `meta` receives a [RouteContext](/reference#RouteContext):

- `ctx.params` — captured path parameters.
- `ctx.url` — the parsed `URL`.
- `ctx.request` — the original `Request`.
- `ctx.signal` — an `AbortSignal` that fires on cancellation or a deferred timeout; pass it to `fetch`.
- `ctx.defer(fragment)` — render a loading boundary now, [stream the fragment](/concepts/streaming) when its data resolves.

## Metadata

`meta` returns a [RouteMeta](/reference#RouteMeta) object — `title`, `description`, `canonical`, and `alternates`. The shell renders it into the document head, and fragment responses carry it so the browser can update the head on navigation.

## The route manifest

An app exports an array of routes. The Cloudflare adapter builds a manifest with [createRoutes](/reference#createRoutes); exact paths match first, then parameterized routes in declaration order.

```js
// site/routes.js
import { createRoutes } from "@nativefragments/core/server";

export const routes = [home, post];
// createCloudflareHandler calls createRoutes(routes) for you.
```

> **Note:** When no route matches, the adapter renders notFoundRoute with a 404 status. Override it with the notFound option on createCloudflareHandler.

## See also

- [Fragments](/concepts/fragments) — partial navigation within a route.
- [Streaming](/concepts/streaming) — defer slow regions with `ctx.defer()`.
- [API Routes](/concepts/api-routes) — JSON endpoints alongside pages.
- [Reference: route](/reference#route), [createRoutes](/reference#createRoutes), [notFoundRoute](/reference#notFoundRoute).
