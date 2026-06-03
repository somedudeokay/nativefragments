# @nativefragments/core

## 0.4.2

### Patch Changes

- 4d12658: Document declarative Shadow DOM server rendering as the preferred pattern for initially visible custom elements.

## 0.4.1

### Patch Changes

- b680557: Add JSDoc descriptions to the public type declarations so IDEs, language
  servers, and coding agents can read framework API guidance inline while
  building apps.
- Skip fragment navigation and prefetch for document-like same-origin URLs, and
  add explicit link opt-outs with `data-nativefragments-reload` and
  `data-fragment-navigation="false"`.

## 0.4.0

### Minor Changes

- cd810d2: Add path parameter matching for server routes and expose captured values on `context.params`.

### Patch Changes

- 0e6f955: Materialize declarative Shadow DOM templates inserted through fragment navigation before hydrating components.

## 0.3.1

### Patch Changes

- Ship TypeScript declarations for all public exports and update alternate link tags during fragment navigation.

## 0.3.0

### Minor Changes

- 9399345: Add a server-side `fragment(name, render)` helper that can register nested route fragments and reuse slot/prefetch attributes in markup.
- b688cb7: Add optional Cloudflare `HTMLRewriter` support that injects a declarative fragment manifest from `data-fragment-slot` and `data-fragment-prefetch` markup.
- 738884e: Add first-class fragment prefetching with shared in-flight request deduplication, exported `prefetchFragment()`, default intent prefetch, and declarative `data-fragment-prefetch` modes.

### Patch Changes

- 0350cf7: Deepen the browser fragment router internals so fetching, caching, parsing, applying, history, and fallback behavior are easier to evolve independently.

## 0.2.0

### Minor Changes

- Added Hono-compatible API route dispatch through the Cloudflare adapter.
- Added nested fragment slots with `data-fragment-slot` and route-level `fragments`.
- Added zero-dependency Web Worker RPC helpers.
