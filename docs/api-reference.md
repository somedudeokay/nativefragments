# Native Fragments API Reference

Native Fragments Core is split into server helpers, a Cloudflare adapter, and
browser-loadable helpers.

## `@nativefragments/core/server`

### `html(strings, ...values)`

Escaped HTML template tag. Interpolated values are escaped by default.

```js
import { html } from "@nativefragments/core/server";

const view = (name) => html`<h1>Hello ${name}</h1>`;
```

### `raw(value)`

Marks a value as trusted HTML. Use only for framework-generated or already
validated markup.

```js
import { html, raw } from "@nativefragments/core/server";

html`<main>${raw(pageBody)}</main>`;
```

### `attrs(attributes)`

Builds escaped HTML attributes from an object. `false`, `null`, and `undefined`
values are skipped. `true` renders a boolean attribute.

```js
import { attrs, html } from "@nativefragments/core/server";

html`<button${attrs({ disabled: true, "data-id": "save" })}>Save</button>`;
```

### `declarativeShadow(options)`

Renders a native declarative Shadow DOM template for server-rendered custom
elements. Put it as the first child of a custom element to avoid a flash of
unstyled light DOM while the browser module loads.

```js
import { declarativeShadow, html } from "@nativefragments/core/server";

const styles = `
  :host { display: inline-block; }
  button { border: 1px solid currentColor; }
`;

html`<app-counter>${declarativeShadow({
  styles: [styles],
  html: html`<button type="button">Count 0</button>`
})}</app-counter>`;
```

### `jsonScript(value)`

Serializes JSON for safe embedding in an inline script payload.

### `route(path, definition)`

Creates a route definition. A route usually provides `meta` and `render`
functions.

```js
import { html, route } from "@nativefragments/core/server";

export const homeRoute = route("/", {
  meta: () => ({
    title: "Home",
    description: "Home page",
    canonical: "https://example.com/"
  }),
  render: () => html`<h1>Home</h1>`
});
```

### `createRoutes(routes)`

Creates a normalized route manifest with a `match(pathname)` method.

### `renderRoute({ match, request })`

Renders a matched route and returns `{ body, meta }`.

### `renderFragment({ body, meta })`

Combines route body HTML with fragment metadata for client-side fragment
navigation.

### `notFoundRoute`

Default 404 route used by adapters unless an app provides its own.

## `@nativefragments/core/cloudflare`

### `createCloudflareHandler(options)`

Creates a Cloudflare Worker module with a `fetch` handler.

```js
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { routes } from "./routes.js";
import { shell } from "./shell.js";

export default createCloudflareHandler({
  routes,
  shell
});
```

Options:

- `routes`: Array of route definitions.
- `shell`: Function receiving `{ body, meta }` and returning a full document.
- `notFound`: Optional 404 route.
- `assetsBinding`: Optional Cloudflare assets binding name. Defaults to
  `ASSETS`.

Fragment requests use the `x-fragment: true` request header.

## `/nativefragments/router.js`

### `installFragmentNavigation(options)`

Installs same-origin link interception and fragment navigation in the browser.

```js
import { installFragmentNavigation } from "/nativefragments/router.js";

installFragmentNavigation({
  afterNavigate({ meta, url }) {
    console.log(meta.title, url.pathname);
  }
});
```

Options:

- `slot`: CSS selector for the content slot. Defaults to `#content-slot`.
- `ttl`: Fragment cache TTL in milliseconds. Defaults to `30000`.
- `afterNavigate`: Callback after a successful fragment swap.

## `/nativefragments/component.js`

### `sheet(cssText)`

Creates a constructable stylesheet from CSS text.

### `shadow(element, options)`

Attaches or reuses an open Shadow Root, applies constructable stylesheets, and
sets the shadow HTML. If the element already has a server-rendered declarative
shadow root, the first call preserves it by default so the component hydrates
without a refresh flash. Later calls update the HTML normally.

```js
import { shadow, sheet } from "/nativefragments/component.js";

const styles = sheet(`
  :host { display: block; }
`);

class AppCard extends HTMLElement {
  connectedCallback() {
    shadow(this, {
      styles: [styles],
      html: `<article><slot></slot></article>`
    });
  }
}

customElements.define("app-card", AppCard);
```
