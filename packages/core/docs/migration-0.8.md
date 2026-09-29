# Native Fragments 0.8

Upgrade core and rebuild both the server and browser bundle. The scaffolder is
0.7 and the Lit adapter is 0.1.1. Protocol negotiation is now version 2.

## Request preparation

```js
export default createCloudflareHandler({
  routes, shell, api,
  prepare: async ({ request, env, context }) => ({
    user: await readSession(request, env.DB),
  }),
});
```

Metadata, headers, renderers, actions, array-based API routes and deferred work
receive `env`, `context`, `locals`, `request`, `url`, `query` and `signal`; route
contexts also have `params` and `defer`. Preparation runs once for each application
request, after static asset handling. Return or throw a Response to end the request.
External API routers receive their usual fetch arguments and manage their own
request state. Observer errors cannot break error responses.

## Navigation and cache

Navigation commits DOM, history and focus only while its transaction owns the
target. Ancestor/descendant navigations cancel each other; separate named targets
can run concurrently. Back/Forward reconstructs the primary route and each changed
named target. Link/form slot attributes identify destinations; only non-interactive
containers are selected as automatic named targets.

`startRouter({ cacheTtl: 30000, cacheMaxEntries: 100, cacheMaxBytes: 2000000 })`
bounds completed HTML by TTL, response groups and UTF-8 bytes. `no-store`,
`no-cache`, `max-age` and `Age` constrain reuse. Expired entries are released;
redirect aliases share eviction/invalidation. This is a per-document convenience
cache, not a general HTTP cache. After mutations call `router.invalidate()` or
invalidate affected URLs. Use `private, no-store` for authenticated pages.

Protocol 2 redirect envelopes preserve cookies and headers, then fetch the
destination in the browser (up to eight redirects). Cross-origin destinations use
document navigation. Plain requests and unsupported clients retain native 3xx.
GET rendering and prefetch routes must remain free of application mutations.

## Streaming and hydration

Document reveals wait for a completion sentinel after the closing payload tag.
Targets and IDs are response-scoped; detached nodes cannot be replayed. Observers
retire at stream completion. Cancelling a body aborts its deferred context signal;
pass that signal into downstream I/O. On Cloudflare enable the
`enable_request_signal` compatibility flag so socket disconnects propagate;
this flag is included in the starter and maintained examples. Timeouts still render fragment error boundaries.

No-JavaScript documents expose resolved sections after the initial route body via
noscript fallbacks. Loading placeholders are hidden by a nonce-bearing style. A
strict CSP must allow that nonce in both script-src and style-src. JavaScript
reveals preserve original DOM nodes, including Lit SSR shadow trees.

Both initial document streams and router navigation emit
`nativefragments:fragment-reveal` with target, slot, fragmentId, state, URL and
streaming. Navigation IDs are present only for router events. A completed cache
replay reports streaming=false. Use lifecycle events for telemetry; DOM mutation
timing cannot reliably distinguish a cached response from a new stream.

Worker RPC calls after dispose reject immediately with InvalidStateError. Pending
calls reject on disposal or transport failure; failed postMessage clears its timer.

## HTML trust boundary

`html` escapes text; it is not a contextual sanitizer. Always quote interpolated
attributes. Validate URL schemes before placing untrusted URLs into href or src:

```js
const url = new URL(userUrl, request.url);
if (!["https:", "http:"].includes(url.protocol)) throw new Error("Unsupported URL");
const markup = html`<a href="${url.href}">${userLabel}</a>`;
```

Use `attrs()` for attribute objects and `jsonScript()` for serialized data, then
parse textContent in client code. Never interpolate untrusted JavaScript/CSS,
attribute names, tag names or markup into `raw()`. RawHtml is an explicit trust
boundary; rich user HTML needs an application-selected sanitizer.

## Verification

`npm run verify` checks unit/runtime tests, generated declarations, strict consumer
fixtures, three browser engines and clean npm tarball installs. `npm run
eval:streaming` repeats core streaming scenarios five times and writes JSON/traces
under test-results. The examples repository independently evaluates the actual
gallery with deterministic upstream data and records reveal/navigation timings.
