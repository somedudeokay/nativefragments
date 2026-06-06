# Getting Started

Create and run a Native Fragments app on Cloudflare Workers. The scaffold ships routes, a shell, browser helpers, and a Shadow DOM component.

## Prerequisites

Node.js and npm to develop; a Cloudflare account to deploy. The app runs on Wrangler — run `npx wrangler login` before your first deploy if this machine is not authenticated yet.

## Create

```shell
npm create @nativefragments/app@latest my-app
cd my-app
npm install
npm run dev
```

`npm run dev` starts a local Worker and prints a URL.

## Project structure

```shell
worker.js                     # Cloudflare entrypoint — createCloudflareHandler
site/routes.js                # the route manifest
site/shell.js                 # the full HTML document
site/pages/home.js            # one renderer per route
public/app/client.js          # installs fragment navigation
public/app/components/         # Custom Elements
public/nativefragments/        # browser helpers (router, component, worker)
```

One route, one renderer, one component file — the layout stays obvious.

## Deploy

The Worker renders pages, fragments, and API routes at the edge.

```shell
npm run deploy
```

## See also

- [Routing](/concepts/routing) — structure your URLs.
- [Fragments](/concepts/fragments) — fast partial navigation.
- [Components](/concepts/components) — build UI with Shadow DOM.
