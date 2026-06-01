# Native Fragments Core

Zero dependencies. Zero build. Blazing fast. Built for agents. AI-friendly
applications. Zero maintenance.

Native Fragments Core is the runtime package for building fast, maintainable web
applications with native browser APIs: HTML, CSS, JavaScript, Custom Elements,
Shadow DOM, Fetch, History, and standard server-side `Response` objects.

For a new app, start with the scaffold:

```sh
npm create @nativefragments/app@latest my-app
cd my-app
npm run dev
```

Install the core package directly when you are wiring Native Fragments into an
existing app:

```sh
npm i @nativefragments/core
```

## What Core Provides

- Escaped server-side HTML templates.
- Explicit route helpers.
- Full-page and fragment render helpers.
- Cloudflare Worker adapter.
- Browser fragment navigation.
- Shadow DOM component helpers, including declarative Shadow DOM support to
  avoid refresh FOUC.
- Agent skill shipped with the package.

## Package Exports

```js
import { declarativeShadow, html, route } from "@nativefragments/core/server";
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
```

Browser helpers are plain ES modules that can be served from your app's
`public/nativefragments` directory:

```js
import { installFragmentNavigation } from "/nativefragments/router.js";
import { shadow, sheet } from "/nativefragments/component.js";
```

## No-FOUC Components

For components visible on first paint, render a declarative shadow template on
the server and hydrate it with `shadow()` in the browser:

```js
html`<app-card>${declarativeShadow({
  styles: [`:host { display: block; }`],
  html: html`<article>Ready at first paint</article>`
})}</app-card>`;
```

The browser `shadow()` helper preserves that server-rendered shadow root on the
first upgrade, then updates normally on later renders.

## Agent Skill

Agents can read the shipped framework conventions from:

```sh
node_modules/@nativefragments/core/skills/nativefragments/SKILL.md
```

Use that file as the editing brief before changing a Native Fragments app.

## API Reference

See [docs/api-reference.md](docs/api-reference.md).

## Links

- Docs: https://nativefragments.org
- GitHub: https://github.com/somedudeokay/nativefragments
- npm: https://www.npmjs.com/package/@nativefragments/core
