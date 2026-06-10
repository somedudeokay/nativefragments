---
"@nativefragments/core": minor
"@nativefragments/create-app": patch
---

Add deferred HTML streaming for server-rendered fragments.

Routes can use `context.defer(fragment)` to render a loading boundary immediately while the Cloudflare adapter streams the completed fragment later on the same response. Fragment navigation resolves deferred content before returning HTML, so client-side navigation receives a normal completed fragment response.

Deferred fragments support loading and error renderers, per-fragment timeouts, request cancellation signals, and a delegated browser reveal handler for streamed real DOM chunks.

The injected fragment manifest is removed: the Cloudflare adapter's `fragmentManifest` option no longer exists (it is ignored if passed), and the client router no longer reads `data-fragment-manifest`. Prefetching is now fully declarative — annotate real anchors with `data-fragment-prefetch` (or `fragment().prefetchAttrs()`) instead. The Cloudflare adapter also passes a per-request nonce to shells and internal streaming bootstrap scripts, and exposes `contentSecurityPolicy` for strict CSP policies.
