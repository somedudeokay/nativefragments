# @nativefragments/core

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
