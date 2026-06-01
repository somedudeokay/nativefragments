# Native Fragments API Reference

> Generated from JSDoc comments in @nativefragments/core. For the full index, fetch https://docs.nativefragments.org/llms.txt.

## Server HTML

Module: `@nativefragments/core/server`

Source: `src/server/html.js`

### RawHtml

Type: `{ [RAW]: true, value: string }`



### DeclarativeShadowOptions

Type: `object`



Properties:

- `{string[]} [styles=[]] CSS text rendered into `<style>` tags inside the declarative shadow root.`
- `{string} [html=""] Trusted shadow root HTML. Build dynamic HTML with {@link html} before passing it here.`

### HtmlAttrs

Type: `Record<string, string | number | boolean | null | undefined>`



### raw

Mark a value as trusted HTML. Use this only for framework-generated markup or content that has already been validated. Ordinary interpolated values in {@link html} are escaped by default.

Parameters:

- `{unknown} [value=""] HTML to insert without escaping.`

Returns: `{RawHtml} Trusted HTML wrapper.`

### escapeHtml

Escape a value for safe insertion into HTML text or attribute context.

Parameters:

- `{unknown} value Value to escape.`

Returns: `{string} Escaped HTML string.`

### html

Server-side HTML template tag with escaped interpolation by default. Arrays are flattened, `null`, `undefined`, and `false` become empty strings, and values returned by {@link raw} are inserted as trusted HTML.

Parameters:

- `{TemplateStringsArray} strings Template literal string parts.`
- `{...unknown} values Interpolated values.`

Returns: `{string} Rendered HTML.`

### declarativeShadow

Render a declarative Shadow DOM template for server-rendered components. Put this as the first child of a custom element to avoid a flash of unstyled light DOM before the component module loads. Pair it with the browser {@link shadow} helper, which preserves an existing declarative shadow root on first upgrade and materializes declarative shadow templates inserted during fragment navigation.

Parameters:

- `{DeclarativeShadowOptions} [options={}] Shadow template options.`

Returns: `{RawHtml} Trusted declarative shadow template.`

### jsonScript

Serialize JSON for safe embedding inside an inline script tag. `<` characters are escaped so embedded JSON cannot accidentally terminate the script element.

Parameters:

- `{unknown} value Value to serialize.`

Returns: `{string} JSON string safe for script text.`

### attrs

Build escaped HTML attributes from an object. `false`, `null`, and `undefined` values are omitted. `true` values render as boolean attributes.

Parameters:

- `{HtmlAttrs} [attributes={}] Attribute map.`

Returns: `{RawHtml} Trusted HTML attribute string.`

## Server Routing

Module: `@nativefragments/core/server`

Source: `src/server/router.js`

### RouteContext

Type: `object`



Properties:

- `{Request} request Original request.`
- `{URL} url Parsed request URL.`
- `{Record<string, string>} params Path parameters captured from a route pattern like `/posts/:slug`.`

### RouteMeta

Type: `object`



Properties:

- `{string} [title] Document title.`
- `{string} [description] Meta description.`
- `{string} [canonical] Canonical URL.`
- `{{ hreflang: string, href: string }[]} [alternates] Alternate language URLs for `<link rel="alternate" hreflang="...">`.`

### FragmentRenderer

Type: `(context: RouteContext) => string | Promise<string>`



### FragmentDefinition

Type: `object`



Properties:

- `{string} name Fragment slot name.`
- `{FragmentRenderer} render Fragment renderer.`
- `{(attributes?: import("./html.js").HtmlAttrs) => import("./html.js").RawHtml} attrs Attributes for links and target containers using this fragment slot.`
- `{(mode?: "intent" | "visible" | "load" | "none", attributes?: import("./html.js").HtmlAttrs) => import("./html.js").RawHtml} prefetchAttrs Attributes for links using this fragment slot with a prefetch mode.`

### RouteDefinition

Type: `object`



Properties:

- `{(context: RouteContext) => RouteMeta | Promise<RouteMeta>} [meta] Function that returns metadata for the route.`
- `{(context: RouteContext) => string | Promise<string>} render Function that renders route body HTML.`
- `{Record<string, FragmentRenderer> | FragmentDefinition[]} [fragments] Named fragment renderers used by nested fragment slots.`

### Route

Type: `RouteDefinition & { path: string, params?: Record<string, string> }`



### fragment

Create a named fragment definition. Use this when a route has a nested region with its own navigation. The returned object can be registered in `route(..., { fragments: [item] })` and its attributes can be reused on links and target containers.

Parameters:

- `{string} name Fragment slot name.`
- `{FragmentRenderer} render Fragment renderer.`

Returns: `{FragmentDefinition} Fragment definition.`

### route

Create a normalized route definition.

Parameters:

- `{string} path URL path for the route. Use `:name` segments for path params, for example `/posts/:slug`.`
- `{RouteDefinition} definition Route metadata and render functions.`

Returns: `{Route} Normalized route.`

### createRoutes

Create a route manifest that can match normalized paths. Exact static routes win first, then parameterized routes are matched in declaration order.

Parameters:

- `{Route[]} routes Route definitions.`

Returns: `{{ all: Route[], match(pathname: string): Route | null }} Route manifest.`

### fragmentMeta

Render fragment metadata for the browser fragment router.

Parameters:

- `{RouteMeta} meta Metadata to embed in the fragment response.`

Returns: `{string} Script tag containing serialized metadata.`

### renderRoute

Render a matched route and normalize metadata defaults.

Parameters:

- `{{ match: Route, request: Request, slot?: string | null }} options Render options. When `slot` matches `RouteDefinition.fragments`, only that named fragment is rendered.`

Returns: `{Promise<{ body: string, meta: Required<RouteMeta> }>} Rendered route.`

### renderFragment

Render a fragment response body with embedded metadata.

Parameters:

- `{{ body: string, meta: RouteMeta }} rendered Rendered route body and metadata.`

Returns: `{string} Fragment HTML.`

### notFoundRoute

Default 404 route used by adapters when a route is not matched.

Type: `{Route}`



## Cloudflare Adapter

Module: `@nativefragments/core/cloudflare`

Source: `src/cloudflare/index.js`

### Route

Type: `import("../server/router.js").Route`



### CloudflareHandlerOptions

Type: `object`



Properties:

- `{Route[]} routes App route definitions.`
- `{(rendered: { body: string, meta: object }) => string} shell Function that wraps a rendered route body in a full HTML document.`
- `{{ fetch(request: Request, env: Record<string, unknown>, context?: unknown): Promise<Response> | Response }} [api] Optional Web Standards API router. Hono apps work here because they expose a compatible `fetch` method.`
- `{string} [apiPrefix="/api"] URL prefix handled by `api`.`
- `{Route} [notFound] Optional 404 route.`
- `{string} [assetsBinding="ASSETS"] Cloudflare assets binding name.`
- `{boolean} [fragmentManifest=true] Whether to inject a declarative fragment manifest with Cloudflare `HTMLRewriter` when available.`

### createCloudflareHandler

Create a Cloudflare Worker module for a Native Fragments app. Static assets are served from the configured assets binding. Normal document requests render the app shell. Requests with `x-fragment: true` return only the route body plus fragment metadata. Requests under `apiPrefix` are delegated to the optional API router before app route matching.

Parameters:

- `{CloudflareHandlerOptions} options Worker adapter options.`

Returns: `{{ fetch(request: Request, env: Record<string, unknown>): Promise<Response> }} Cloudflare Worker module.`

## Browser Router

Module: `/nativefragments/router.js`

Source: `public/nativefragments/router.js`

### FragmentNavigationOptions

Type: `object`



Properties:

- `{string} [slot="#content-slot"] Selector for the element replaced by fragment responses.`
- `{number} [ttl=30000] Fragment cache time in milliseconds.`
- `{boolean | "none" | "intent" | "visible" | "load"} [prefetch="intent"] Default fragment prefetch behavior. Links can override this with `data-fragment-prefetch="intent|visible|load|none"`.`
- `{(event: { meta: object | null, url: URL, slot: string }) => void} [afterNavigate] Callback fired after a successful client-side navigation.`

### prefetchFragment

Prefetch a same-origin fragment into the shared fragment cache.

Parameters:

- `{string | URL} href URL to prefetch.`
- `{{ slot?: string, ttl?: number, signal?: AbortSignal }} [options={}] Prefetch options.`

Returns: `{Promise<string | null>} Prefetched fragment HTML, or `null` for skipped cross-origin URLs and document-like URLs such as `/agents.txt`.`

### installFragmentNavigation

Install same-origin fragment navigation. Clicked links are fetched with `x-fragment: true`, the configured content slot is replaced, document metadata is updated, and history state is pushed. Links with `data-fragment-slot="name"` replace only the matching `[data-fragment-slot="name"]` container and send `x-fragment-slot: name`. External links, document-like URLs such as `/agents.txt`, modified clicks, and links with `data-nativefragments-reload` or `data-fragment-navigation="false"` keep normal browser behavior.

Parameters:

- `{FragmentNavigationOptions} [options={}] Navigation options.`

Returns: `{((href: string, pushState?: boolean, nextSlot?: string) => Promise<void>) | undefined} Navigate function, or `undefined` if the slot does not exist.`

## Shadow DOM Components

Module: `/nativefragments/component.js`

Source: `public/nativefragments/component.js`

### ShadowOptions

Type: `object`



Properties:

- `{CSSStyleSheet[]} [styles=[]] Constructable stylesheets to adopt.`
- `{string} [html=""] Shadow root HTML.`
- `{boolean} [hydrate=true] Preserve an existing declarative shadow root on the first render so server-rendered components do not flash.`

### sheet

Create a constructable stylesheet for Shadow DOM components.

Parameters:

- `{string} cssText CSS source.`

Returns: `{CSSStyleSheet} Constructable stylesheet.`

### shadow

Attach or reuse an open shadow root, adopt stylesheets, and set its HTML. If the element already has declarative shadow DOM from server HTML, the first call preserves that DOM by default. Fragment navigation inserts HTML with `template.innerHTML`, so declarative shadow templates are materialized manually before hydration to keep server-rendered components visible.

Parameters:

- `{HTMLElement} element Custom element receiving the shadow root.`
- `{ShadowOptions} [options={}] Shadow render options.`

Returns: `{ShadowRoot} The element's shadow root.`

## Web Workers

Module: `/nativefragments/worker.js`

Source: `public/nativefragments/worker.js`

### WorkerClientOptions

Type: `object`



Properties:

- `{number} [timeout=30000] Request timeout in milliseconds.`

### NativeWorkerClient

Type: `object`



Properties:

- `{(type: string, payload?: unknown, transfer?: Transferable[]) => Promise<unknown>} call Call a named worker handler.`
- `{() => void} dispose Reject pending calls and remove listeners.`
- `{Worker} worker The wrapped Worker instance.`

### transferResult

Wrap a worker response with Transferable objects.

Parameters:

- `{T} payload Response payload.`
- `{Transferable[]} [transfer=[]] Transferable objects to move.`

Returns: `{{ payload: T, transfer: Transferable[], [transferMarker]: true }}`

### workerClient

Create a tiny RPC client for a dedicated Web Worker.

Parameters:

- `{Worker} worker Worker instance.`
- `{WorkerClientOptions} [options={}] Client options.`

Returns: `{NativeWorkerClient} Worker client.`

### createWorkerClient

Create a module worker and wrap it with `workerClient`.

Parameters:

- `{string | URL | Worker} workerOrUrl Existing Worker or worker module URL.`
- `{WorkerClientOptions & { workerOptions?: WorkerOptions }} [options={}] Client and Worker constructor options.`

Returns: `{NativeWorkerClient} Worker client.`

### exposeWorker

Expose named handlers inside a dedicated Web Worker.

Parameters:

- `{Record<string, (payload: unknown, context: { event: MessageEvent, type: string }) => unknown | Promise<unknown>>} handlers Worker handlers keyed by message type.`
- `{DedicatedWorkerGlobalScope} [scope=globalThis] Worker global scope.`

Returns: `{() => void} Cleanup function.`

