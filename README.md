# Native Fragments

Zero dependencies. Zero build. Blazing fast. Built for agents. Zero
maintenance. Free to deploy. Infinite scale.

Native Fragments is a tiny frontend framework for agents building robust,
AI-friendly web applications with the native Web Platform: HTML, CSS,
JavaScript, Custom Elements, Shadow DOM, and standard server-side `Response`
objects.

The apps are also easier for agents to browse after they ship: real links, real
HTML, native custom elements, and readable browser modules instead of opaque
transpiled bundles.

It starts with Cloudflare Workers and static assets, but keeps the server
adapter small enough to port elsewhere.

## Run the Docsite

```sh
npm run dev
```

The script runs `npx wrangler dev`. There is no install step for framework
dependencies and no build step for the app.

## Deploy

```sh
wrangler deploy
```

## Install

```sh
npm i @nativefragments/nativefragments
```

## Getting Started

```js
import { createCloudflareHandler } from "@nativefragments/nativefragments/cloudflare";
import { routes } from "./site/routes.js";
import { shell } from "./site/shell.js";

export default createCloudflareHandler({
  routes,
  shell
});
```

## Links

- Docs: https://nativefragments.org/docs
- GitHub: https://github.com/somedudeokay/nativefragments
- npm: https://www.npmjs.com/package/@nativefragments/nativefragments

## What It Gives You

- Server-rendered pages and fragments.
- Client-side fragment navigation.
- Metadata updates on navigation.
- Native custom element islands.
- Shadow DOM scoped styles.
- Cloudflare Worker adapter.

## Local Package Development

Apps can point at this folder while the package is still local:

```json
{
    "dependencies": {
    "@nativefragments/nativefragments": "file:../nativefragments"
  }
}
```

Server code imports from `@nativefragments/nativefragments/server` or
`@nativefragments/nativefragments/cloudflare`. Browser helpers can be copied or
served from `public/nativefragments` with no bundler.

## Agent Skill

The package ships a skill that agents can read from:

```sh
node_modules/@nativefragments/nativefragments/skills/nativefragments/SKILL.md
```

Use it as the project convention brief before editing a Native Fragments app.

## What It Does Not Ship

- No Vite.
- No JSX.
- No virtual DOM.
- No runtime dependencies.
- No bundled test framework.

For tests, the docs recommend plain HTTP smoke checks and optional Web Test
Runner examples for component tests.
