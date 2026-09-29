# @nativefragments/create-app

## 0.7.0

### Minor Changes

- Harden navigation, request lifetimes and streaming. Protocol 2 applies redirect
  cookies before following the destination. Navigation transactions guard DOM,
  history and delayed view transitions; named targets restore on Back/Forward.
  The bounded cache honors response freshness and invalidates redirect aliases.

  Add request-scoped prepare/locals, environment bindings and execution context to
  pages, actions, APIs and deferred fragments. Isolate error hooks and close Worker
  RPC clients deterministically.

  Reveal deferred documents only after complete payloads, scope identities to each
  response, retire observers, preserve Lit SSR shadow nodes during navigation, and
  provide visible no-JavaScript results. Add shared ESM build and streaming Node
  HTTP utilities to create-app. Export public server types used by the Lit adapter.

  Verify with cross-browser navigation/streaming tests, a real D1 task workspace,
  strict TypeScript consumers and clean tarball/scaffold installations.

## 0.6.0

### Minor Changes

- Introduce the explicit HTML application architecture. Fragment navigation now
  streams framed HTML with protocol negotiation, the browser API is
  `startRouter()` with navigate/prefetch/invalidate capabilities, and stale clients
  receive a safe buffered fallback. Add the pinned Lit SSR/hydration adapter and
  move the scaffold to package imports, esbuild, and Wrangler's local runtime.

  This intentionally removes the copied browser helpers, component helper, and
  signals package surface in favor of Lit and standard package exports.

## 0.5.0

### Minor Changes

- Scaffold the 0.6 API surface: `site/api.js` with `apiRoute`/`createApi`, composable `html` shells without `raw(body)`, query params on route contexts, and the updated fragment router.

## 0.4.1

### Patch Changes

- 4e035a2: Add deferred HTML streaming for server-rendered fragments.

  Routes can use `context.defer(fragment)` to render a loading boundary immediately while the Cloudflare adapter streams the completed fragment later on the same response. Fragment navigation resolves deferred content before returning HTML, so client-side navigation receives a normal completed fragment response.

  Deferred fragments support loading and error renderers, per-fragment timeouts, request cancellation signals, and a delegated browser reveal handler for streamed real DOM chunks.

  The injected fragment manifest is removed: the Cloudflare adapter's `fragmentManifest` option no longer exists (it is ignored if passed), and the client router no longer reads `data-fragment-manifest`. Prefetching is now fully declarative — annotate real anchors with `data-fragment-prefetch` (or `fragment().prefetchAttrs()`) instead. The Cloudflare adapter also passes a per-request nonce to shells and internal streaming bootstrap scripts, and exposes `contentSecurityPolicy` for strict CSP policies.

## 0.4.0

### Minor Changes

- 1ab7c54: Update the default app template with a persistent shell header, shared state,
  refresh-safe counter persistence, nested partial rerenders, and fragment-safe
  declarative Shadow DOM hydration. Polish the scaffold copy and header clock
  treatment around state and partial rerender demos, including correct
  server-rendered tab indicator state, path-based nested subroutes, and fade-only
  nested panel transitions. Replace the starter hero titles with a concise
  feature list covering pure HTML, isolated styles, nested routes, reactive state,
  partial rerenders, server-side rendering, and zero dependencies.

## 0.3.0

### Minor Changes

- 157ae05: Update the scaffold to `@nativefragments/core` 0.3 and include the latest fragment router with prefetch and declarative manifest support.

## 0.2.1

### Patch Changes

- Made the generated app self-contained for signal browser helpers while keeping install dependencies minimal.

## 0.2.0

### Minor Changes

- Added Hono API routing to the scaffold.
- Added nested-fragment capable router helpers.
- Added worker RPC helpers.
- Updated the starter counter to use signal-based DOM bindings.
