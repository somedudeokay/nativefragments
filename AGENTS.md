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

## Structure

- `src/server`: HTML helpers, route helpers, metadata, and rendering.
- `src/cloudflare`: Cloudflare Worker adapter.
- `public/nativefragments`: browser-loadable framework modules.
- `site`: this repo's docsite routes, shell, and page renderers.
- `public/app`: docsite browser modules and custom elements.

No Vite, no framework compiler, no test runner dependency. If a build escape
hatch is added later, use esbuild only.
