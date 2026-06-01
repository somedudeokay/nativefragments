# Native Fragments

Zero dependencies. Zero build. Blazing fast. Built for agents. Zero
maintenance. Free to deploy. Infinite scale.

Native Fragments is a tiny frontend framework for building robust web apps with
the native Web Platform: HTML, CSS, JavaScript, Custom Elements, Shadow DOM, and
standard server-side `Response` objects.

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
    "@somedudeokay/native-fragments": "file:../native-fragments"
  }
}
```

Server code imports from `@somedudeokay/native-fragments/server` or
`@somedudeokay/native-fragments/cloudflare`. Browser helpers can be copied or
served from `public/native-fragments` with no bundler.

## What It Does Not Ship

- No Vite.
- No JSX.
- No virtual DOM.
- No runtime dependencies.
- No bundled test framework.

For tests, the docs recommend plain HTTP smoke checks and optional Web Test
Runner examples for component tests.
