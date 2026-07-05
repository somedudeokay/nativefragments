# Native Fragments

Native Fragments is a zero-dependency, zero-build frontend framework for agents
building fast, maintainable, AI-friendly web applications.

## Goals

- Zero dependencies in the framework runtime.
- Zero app build by default.
- Blazing fast HTML-first pages with fragment navigation.
- Built for agents: explicit files, tiny APIs, obvious edit points.
- AI-friendly applications: real HTML, links, and browser modules that agents
  can inspect, click, scrape, and maintain after deploy.
- Zero maintenance by leaning on stable browser APIs.
- Free to deploy on Cloudflare Workers for small projects.
- Infinite scale as a design target: cacheable assets, edge fragments, and no
  always-on app server.
- Native HTML, CSS, JavaScript, Custom Elements, and Shadow DOM.
- Fragment-based navigation for fast document-style apps.
- Cloudflare Workers first, with more adapters later.
- Stable, boring modules that agents can edit safely.

## Rendering Preference

- Server-render any initially visible custom element with
  `declarativeShadow()` and hydrate it with `shadow()` in the browser.
- Treat empty above-the-fold custom element shells as a FOUC and layout-shift
  bug, not as something to hide with reserved height.
- Share component HTML and CSS between server and browser modules when that is
  the cleanest way to keep declarative Shadow DOM output identical to hydrated
  client output.

## Structure

- `src/server/router.js`: route definitions, matching, actions, redirects,
  query helpers, and render normalization.
- `src/server/defer.js`: deferred fragment streaming, timeouts, and reveal
  bootstrap.
- `src/server/api.js`: `apiRoute()` and `createApi()` helpers.
- `src/cloudflare`: Cloudflare Worker adapter.
- `public/nativefragments`: browser-loadable framework modules.
- `docs`: package API reference documentation.
- `skills`: agent skill shipped with the npm package.

No Vite, no framework compiler, no test runner dependency. The public docsite
lives in the separate `nativefragments.org` repo.

## API Conventions

- `html` returns a trusted wrapper; nested `html` and arrays compose directly.
- Use `raw()` only for external trusted strings such as SVG, CSS, highlighted
  code, and `jsonScript()` text.
- Use `apiRoute()`/`createApi()` for API handlers.
- Use route `action()` plus `redirect(..., 303)` for POST-redirect-GET forms.
- Keep query parsing in pure helpers built around `readSearch()`.
