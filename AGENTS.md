# Native Fragments

Native Fragments is a zero-dependency, zero-build frontend framework aimed at
AI agents and long-lived web apps.

## Goals

- Zero dependencies in the framework runtime.
- Zero app build by default.
- Blazing fast HTML-first pages with fragment navigation.
- Built for AI agents: explicit files, tiny APIs, obvious edit points.
- Zero maintenance by leaning on stable browser APIs.
- Free to deploy on Cloudflare Workers for small projects.
- Infinite scale as a design target: cacheable assets, edge fragments, and no
  always-on app server.
- Native HTML, CSS, JavaScript, Custom Elements, and Shadow DOM.
- Fragment-based navigation for fast document-style apps.
- Cloudflare Workers first, with more adapters later.
- Stable, boring modules that agents can edit safely.

## Structure

- `src/server`: HTML helpers, route helpers, metadata, and rendering.
- `src/cloudflare`: Cloudflare Worker adapter.
- `public/native-fragments`: browser-loadable framework modules.
- `site`: this repo's docsite routes, shell, and page renderers.
- `public/app`: docsite browser modules and custom elements.

No Vite, no framework compiler, no test runner dependency. If a build escape
hatch is added later, use esbuild only.
