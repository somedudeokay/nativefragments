# Native Fragments API Reference

> Generated from JSDoc comments in @nativefragments/core. For the full index, fetch https://docs.nativefragments.org/llms.txt.

## Server HTML

Module: `@nativefragments/core/server`

### RawHtml

`{ [RAW]: true, value: string }`



### DeclarativeShadowOptions

`object`



**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `styles` | `string[]` | `[]` | CSS text rendered into `<style>` tags inside the declarative shadow root. |
| `html` | `string` | `""` | Trusted shadow root HTML. Build dynamic HTML with [`html`](#html) before passing it here. |

### HtmlAttrs

`Record<string, string | number | boolean | null | undefined>`



### raw

```js
raw(value?) → RawHtml
```

Mark a value as trusted HTML. Use this only for framework-generated markup or content that has already been validated. Ordinary interpolated values in [`html`](#html) are escaped by default.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `unknown` | `""` | HTML to insert without escaping. |

**Returns** — `RawHtml`. Trusted HTML wrapper.

### escapeHtml

```js
escapeHtml(value) → string
```

Escape a value for safe insertion into HTML text or attribute context.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `unknown` | required | Value to escape. |

**Returns** — `string`. Escaped HTML string.

### html

```js
html(strings, ...values) → string
```

Server-side HTML template tag with escaped interpolation by default. Arrays are flattened, `null`, `undefined`, and `false` become empty strings, and values returned by [`raw`](#raw) are inserted as trusted HTML.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `strings` | `TemplateStringsArray` | required | Template literal string parts. |
| `values` | `...unknown` | required | Interpolated values. |

**Returns** — `string`. Rendered HTML.

### declarativeShadow

```js
declarativeShadow(options?) → RawHtml
```

Render a declarative Shadow DOM template for server-rendered components. Put this as the first child of a custom element to avoid a flash of unstyled light DOM before the component module loads. Pair it with the browser [`shadow`](#shadow) helper, which preserves an existing declarative shadow root on first upgrade and materializes declarative shadow templates inserted during fragment navigation.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `DeclarativeShadowOptions` | `{}` | Shadow template options. |

**Returns** — `RawHtml`. Trusted declarative shadow template.

### jsonScript

```js
jsonScript(value) → string
```

Serialize JSON for safe embedding inside an inline script tag. `<` characters are escaped so embedded JSON cannot accidentally terminate the script element.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `unknown` | required | Value to serialize. |

**Returns** — `string`. JSON string safe for script text.

### attrs

```js
attrs(attributes?) → RawHtml
```

Build escaped HTML attributes from an object. `false`, `null`, and `undefined` values are omitted. `true` values render as boolean attributes.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `attributes` | `HtmlAttrs` | `{}` | Attribute map. |

**Returns** — `RawHtml`. Trusted HTML attribute string.

## Server Routing

Module: `@nativefragments/core/server`

### RouteContext

`object`



**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `request` | `Request` | required | Original request. |
| `signal` | `AbortSignal` | required | Request cancellation signal. |
| `url` | `URL` | required | Parsed request URL. |
| `params` | `Record<string, string>` | required | Path parameters captured from a route pattern like `/posts/:slug`. |
| `defer` | `(fragment: FragmentDefinition | string, attributes?: import("./html.js").HtmlAttrs) => import("./html.js").RawHtml` | required | Render a stable loading boundary and collect a named fragment for deferred document streaming. |

### RouteMeta

`object`



**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Document title. |
| `description` | `string` | — | Meta description. |
| `canonical` | `string` | — | Canonical URL. |
| `alternates` | `{ hreflang: string, href: string }[]` | — | Alternate language URLs for `<link rel="alternate" hreflang="...">`. |

### FragmentRenderer

`(context: RouteContext) => string | Promise<string>`



### FragmentLoadingRenderer

`(context: RouteContext) => string`



### FragmentErrorRenderer

`(error: unknown, context: RouteContext) => string | Promise<string>`



### FragmentDefinition

`object`



**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | required | Fragment slot name. |
| `render` | `FragmentRenderer` | required | Fragment renderer. |
| `loading` | `FragmentLoadingRenderer` | — | Loading renderer used by deferred document streaming. |
| `error` | `FragmentErrorRenderer` | — | Error renderer used when a deferred fragment fails after the document response has started. |
| `timeout` | `number` | — | Maximum deferred render time in milliseconds. |
| `attrs` | `(attributes?: import("./html.js").HtmlAttrs) => import("./html.js").RawHtml` | required | Attributes for links and target containers using this fragment slot. |
| `prefetchAttrs` | `(mode?: "intent" | "visible" | "load" | "none", attributes?: import("./html.js").HtmlAttrs) => import("./html.js").RawHtml` | required | Attributes for links using this fragment slot with a prefetch mode. |

### RouteDefinition

`object`



**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `meta` | `(context: RouteContext) => RouteMeta | Promise<RouteMeta>` | — | Function that returns metadata for the route. |
| `render` | `(context: RouteContext) => string | Promise<string>` | required | Function that renders route body HTML. |
| `fragments` | `Record<string, FragmentRenderer | FragmentDefinition> | FragmentDefinition[]` | — | Named fragment renderers used by nested fragment slots. |

### Route

`RouteDefinition & { path: string, params?: Record<string, string> }`



### fragment

```js
fragment(name, definition) → FragmentDefinition
```

Create a named fragment definition. Use this when a route has a nested region with its own navigation. The returned object can be registered in `route(..., { fragments: [item] })` and its attributes can be reused on links and target containers.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | required | Fragment slot name. |
| `definition` | `FragmentRenderer | Omit<FragmentDefinition, "name" | "attrs" | "prefetchAttrs">` | required | Fragment renderer or full fragment definition. |

**Returns** — `FragmentDefinition`. Fragment definition.

### route

```js
route(path, definition) → Route
```

Create a normalized route definition.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `path` | `string` | required | URL path for the route. Use `:name` segments for path params, for example `/posts/:slug`. |
| `definition` | `RouteDefinition` | required | Route metadata and render functions. |

**Returns** — `Route`. Normalized route.

### createRoutes

```js
createRoutes(routes) → { all: Route[], match(pathname: string): Route | null }
```

Create a route manifest that can match normalized paths. Exact static routes win first, then parameterized routes are matched in declaration order.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `routes` | `Route[]` | required | Route definitions. |

**Returns** — `{ all: Route[], match(pathname: string): Route | null }`. Route manifest.

### fragmentMeta

```js
fragmentMeta(meta) → string
```

Render fragment metadata for the browser fragment router.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `meta` | `RouteMeta` | required | Metadata to embed in the fragment response. |

**Returns** — `string`. Script tag containing serialized metadata.

### renderRoute

```js
renderRoute(options) → Promise<{ body: string, meta: Required<RouteMeta>, deferred: unknown[] }>
```

Render a matched route and normalize metadata defaults.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `{ match: Route, request: Request, slot?: string | null, deferredTimeout?: number | null }` | required | Render options. When `slot` matches a registered named fragment, only that fragment renderer is used. Calls to `context.defer()` always collect deferred work for the adapter to stream or inline. |

**Returns** — `Promise<{ body: string, meta: Required<RouteMeta>, deferred: unknown[] }>`. Rendered route.

### renderFragment

```js
renderFragment(rendered) → string
```

Render a fragment response body with embedded metadata.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `rendered` | `{ body: string, meta: RouteMeta }` | required | Rendered route body and metadata. |

**Returns** — `string`. Fragment HTML.

### notFoundRoute

```js
notFoundRoute
```

Default 404 route used by adapters when a route is not matched.

Type: `{Route}`

## Cloudflare Adapter

Module: `@nativefragments/core/cloudflare`

### Route

`import("../server/router.js").Route`



### CloudflareHandlerOptions

`object`



**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `routes` | `Route[]` | required | App route definitions. |
| `shell` | `(rendered: { body?: string, meta: object, nonce?: string }) => string | { before: string, after: string }` | required | Function that wraps a rendered route body in a full HTML document. |
| `api` | `{ fetch(request: Request, env: Record<string, unknown>, context?: unknown): Promise<Response> | Response }` | — | Optional Web Standards API router. Hono apps work here because they expose a compatible `fetch` method. |
| `apiPrefix` | `string` | `"/api"` | URL prefix handled by `api`. |
| `notFound` | `Route` | — | Optional 404 route. |
| `assetsBinding` | `string` | `"ASSETS"` | Cloudflare assets binding name. |
| `deferredTimeout` | `number | null` | `15000` | Default timeout in milliseconds for each deferred fragment renderer. Set `null` to disable. |
| `contentSecurityPolicy` | `string | false | ((options: { nonce: string, request: Request }) => string | false)` | — | Content Security Policy header. Defaults to `frame-ancestors 'self'`. Pass a function to build a nonce-based strict policy. |

### createCloudflareHandler

```js
createCloudflareHandler(options) → { fetch(request: Request, env: Record<string, unknown>): Promise<Response> }
```

Create a Cloudflare Worker module for a Native Fragments app. Static assets are served from the configured assets binding. Normal document requests render the app shell. Requests with `x-fragment: true` return only the route body plus fragment metadata. Requests under `apiPrefix` are delegated to the optional API router before app route matching.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `CloudflareHandlerOptions` | required | Worker adapter options. |

**Returns** — `{ fetch(request: Request, env: Record<string, unknown>): Promise<Response> }`. Cloudflare Worker module.

## Browser Router

Module: `/nativefragments/router.js`

### FragmentNavigationOptions

`object`



**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `slot` | `string` | `"#content-slot"` | Selector for the element replaced by fragment responses. |
| `ttl` | `number` | `30000` | Fragment cache time in milliseconds. |
| `prefetch` | `boolean | "none" | "intent" | "visible" | "load"` | `"intent"` | Default fragment prefetch behavior. Links can override this with `data-fragment-prefetch="intent|visible|load|none"`. |
| `afterNavigate` | `(event: { meta: object | null, url: URL, slot: string }) => void` | — | Callback fired after a successful client-side navigation. |

### prefetchFragment

```js
prefetchFragment(href, options?) → Promise<string | null>
```

Prefetch a same-origin fragment into the shared fragment cache.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `href` | `string | URL` | required | URL to prefetch. |
| `options` | `{ slot?: string, ttl?: number, signal?: AbortSignal }` | `{}` | Prefetch options. |

**Returns** — `Promise<string | null>`. Prefetched fragment HTML, or `null` for skipped cross-origin URLs and document-like URLs such as `/agents.txt`.

### installFragmentNavigation

```js
installFragmentNavigation(options?) → ((href: string, pushState?: boolean, nextSlot?: string) => Promise<void>) | undefined
```

Install same-origin fragment navigation. Clicked links are fetched with `x-fragment: true`, the configured content slot is replaced, document metadata is updated, and history state is pushed. Links with `data-fragment-slot="name"` replace only the matching `[data-fragment-slot="name"]` container and send `x-fragment-slot: name`. External links, document-like URLs such as `/agents.txt`, modified clicks, and links with `data-nativefragments-reload` or `data-fragment-navigation="false"` keep normal browser behavior.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `FragmentNavigationOptions` | `{}` | Navigation options. |

**Returns** — `((href: string, pushState?: boolean, nextSlot?: string) => Promise<void>) | undefined`. Navigate function, or `undefined` if the slot does not exist.

## Shadow DOM Components

Module: `/nativefragments/component.js`

### ShadowOptions

`object`



**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `styles` | `CSSStyleSheet[]` | `[]` | Constructable stylesheets to adopt. |
| `html` | `string` | `""` | Shadow root HTML. |
| `hydrate` | `boolean` | `true` | Preserve an existing declarative shadow root on the first render so server-rendered components do not flash. |

### sheet

```js
sheet(cssText) → CSSStyleSheet
```

Create a constructable stylesheet for Shadow DOM components.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `cssText` | `string` | required | CSS source. |

**Returns** — `CSSStyleSheet`. Constructable stylesheet.

### shadow

```js
shadow(element, options?) → ShadowRoot
```

Attach or reuse an open shadow root, adopt stylesheets, and set its HTML. If the element already has declarative shadow DOM from server HTML, the first call preserves that DOM by default. Fragment navigation inserts HTML with `template.innerHTML`, so declarative shadow templates are materialized manually before hydration to keep server-rendered components visible.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `element` | `HTMLElement` | required | Custom element receiving the shadow root. |
| `options` | `ShadowOptions` | `{}` | Shadow render options. |

**Returns** — `ShadowRoot`. The element's shadow root.

## Web Workers

Module: `/nativefragments/worker.js`

### WorkerClientOptions

`object`



**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `timeout` | `number` | `30000` | Request timeout in milliseconds. |

### NativeWorkerClient

`object`



**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `call` | `(type: string, payload?: unknown, transfer?: Transferable[]) => Promise<unknown>` | required | Call a named worker handler. |
| `dispose` | `() => void` | required | Reject pending calls and remove listeners. |
| `worker` | `Worker` | required | The wrapped Worker instance. |

### transferResult

```js
transferResult(payload, transfer?) → { payload: T, transfer: Transferable[], [transferMarker]: true }
```

Wrap a worker response with Transferable objects.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `payload` | `T` | required | Response payload. |
| `transfer` | `Transferable[]` | `[]` | Transferable objects to move. |

**Returns** — `{ payload: T, transfer: Transferable[], [transferMarker]: true }`. 

### workerClient

```js
workerClient(worker, options?) → NativeWorkerClient
```

Create a tiny RPC client for a dedicated Web Worker.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `worker` | `Worker` | required | Worker instance. |
| `options` | `WorkerClientOptions` | `{}` | Client options. |

**Returns** — `NativeWorkerClient`. Worker client.

### createWorkerClient

```js
createWorkerClient(workerOrUrl, options?) → NativeWorkerClient
```

Create a module worker and wrap it with `workerClient`.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `workerOrUrl` | `string | URL | Worker` | required | Existing Worker or worker module URL. |
| `options` | `WorkerClientOptions & { workerOptions?: WorkerOptions }` | `{}` | Client and Worker constructor options. |

**Returns** — `NativeWorkerClient`. Worker client.

### exposeWorker

```js
exposeWorker(handlers, scope?) → () => void
```

Expose named handlers inside a dedicated Web Worker.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `handlers` | `Record<string, (payload: unknown, context: { event: MessageEvent, type: string }) => unknown | Promise<unknown>>` | required | Worker handlers keyed by message type. |
| `scope` | `DedicatedWorkerGlobalScope` | `globalThis` | Worker global scope. |

**Returns** — `() => void`. Cleanup function.

## State

Module: `@nativefragments/signals`


### state

```js
state(initial, options?) → Signal.State
```

Create a writable signal. Read it with `.get()` and update it with `.set()`.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `initial` | `unknown` | required | Initial value. |
| `options` | `object` | — | Signal options (custom equality, etc.). |

**Returns** — `Signal.State`. A writable signal.

### computed

```js
computed(callback, options?) → Signal.Computed
```

Create a read-only signal derived from other signals. It recomputes lazily when a dependency changes.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `callback` | `() => unknown` | required | Computation that reads other signals. |
| `options` | `object` | — | Signal options. |

**Returns** — `Signal.Computed`. A derived, read-only signal.

### isSignal

```js
isSignal(value) → boolean
```

Test whether a value is a signal (state or computed).

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `unknown` | required | Value to test. |

**Returns** — `boolean`. True for a state or computed signal.

### read

```js
read(value) → unknown
```

Resolve a value: call `.get()` on a signal, invoke a function, or return a plain value unchanged. Lets every binding helper accept a signal, a getter, or a static value.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `unknown` | required | Signal, getter, or plain value. |

**Returns** — `unknown`. The current value.

### effect

```js
effect(callback) → () => void
```

Run a callback immediately and re-run it whenever a signal it read changes (batched on the microtask queue). Return a function from the callback to run cleanup before the next run.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `callback` | `() => (void | (() => void))` | required | Effect; may return a cleanup. |

**Returns** — `() => void`. Dispose function that stops the effect.

### bindText

```js
bindText(node, value) → () => void
```

Bind a node's text content to a signal.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `node` | `Node` | required | Target node. |
| `value` | `unknown` | required | Signal, getter, or value. |

**Returns** — `() => void`. Dispose function.

### bindHTML

```js
bindHTML(element, value) → () => void
```

Bind an element's `innerHTML` to a signal. Use trusted HTML only.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `element` | `Element` | required | Target element. |
| `value` | `unknown` | required | Signal, getter, or value. |

**Returns** — `() => void`. Dispose function.

### bindAttr

```js
bindAttr(element, name, value) → () => void
```

Bind an attribute to a signal. `false`, `null`, and `undefined` remove the attribute; `true` renders it empty.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `element` | `Element` | required | Target element. |
| `name` | `string` | required | Attribute name. |
| `value` | `unknown` | required | Signal, getter, or value. |

**Returns** — `() => void`. Dispose function.

### bindProperty

```js
bindProperty(element, property, value) → () => void
```

Bind a DOM property to a signal.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `element` | `Element` | required | Target element. |
| `property` | `string` | required | Property name. |
| `value` | `unknown` | required | Signal, getter, or value. |

**Returns** — `() => void`. Dispose function.

### bindClass

```js
bindClass(element, name, value) → () => void
```

Toggle a class on an element based on a signal's truthiness.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `element` | `Element` | required | Target element. |
| `name` | `string` | required | Class name. |
| `value` | `unknown` | required | Signal, getter, or value. |

**Returns** — `() => void`. Dispose function.

### bindStyle

```js
bindStyle(element, name, value) → () => void
```

Bind a style property to a signal. `false`, `null`, and `undefined` remove the property.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `element` | `Element` | required | Target element. |
| `name` | `string` | required | CSS property name. |
| `value` | `unknown` | required | Signal, getter, or value. |

**Returns** — `() => void`. Dispose function.

### model

```js
model(element, signal, eventName?) → () => void
```

Two-way bind an input-like element's `value` to a writable signal: the signal drives the element, and the element updates the signal on `eventName`.

**Parameters**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `element` | `HTMLElement` | required | Target element with a `value`. |
| `signal` | `Signal.State` | required | Writable signal to sync. |
| `eventName` | `string` | `"input"` | DOM event that updates the signal. |

**Returns** — `() => void`. Dispose function.

