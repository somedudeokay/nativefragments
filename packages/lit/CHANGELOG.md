# @nativefragments/lit

## 0.1.1

### Patch Changes

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

- Updated dependencies
- Updated dependencies
  - @nativefragments/core@0.8.0

## 0.1.0

### Minor Changes

- Introduce the explicit HTML application architecture. Fragment navigation now
  streams framed HTML with protocol negotiation, the browser API is
  `startRouter()` with navigate/prefetch/invalidate capabilities, and stale clients
  receive a safe buffered fallback. Add the pinned Lit SSR/hydration adapter and
  move the scaffold to package imports, esbuild, and Wrangler's local runtime.

  This intentionally removes the copied browser helpers, component helper, and
  signals package surface in favor of Lit and standard package exports.

### Patch Changes

- Updated dependencies
  - @nativefragments/core@0.7.0
