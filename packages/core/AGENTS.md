# Native Fragments Core

Native Fragments builds fast, explicit HTML applications. Core owns server
HTML, routing, fragments, streaming, actions, APIs, browser navigation, and Web
Worker RPC.

## Constraints

- HTML is useful in the initial response.
- Native anchors and forms remain the fallback.
- Browser APIs are explicit and returned from `startRouter()`; do not add
  compatibility globals.
- Keep Lit independent from core. Lit SSR and hydration belong in
  `@nativefragments/lit`.
- Source uses standards-based ESM. esbuild resolves packages; there is no
  framework compiler.
- Do not deploy or publish unless explicitly requested.

## Structure

- `src/server`: HTML, routes, fragments, actions, APIs, and streaming.
- `src/cloudflare`: Cloudflare Worker adapter and protocol negotiation.
- `client/router.js`: browser navigation controller.
- `client/fragment-loader.js`: private framed transport, cache, and dedupe.
- `client/worker.js`: browser Worker RPC.
- `types`: generated declarations.
- `docs`: package reference.
- `skills`: agent instructions shipped with the package.

Use `raw()` only for trusted markup. Use POST actions with 303 redirects for
native form mutations. Verify navigation changes in a real browser.
