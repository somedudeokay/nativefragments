# __APP_NAME__

A Native Fragments HTML application on Cloudflare Workers.

```sh
npm install
npm run dev
```

The starter includes:

- Streamed server rendering and fragment navigation.
- Native links, GET filters, and POST-redirect-GET actions.
- Lit server rendering and browser hydration.
- Package-based ESM imports bundled with esbuild.
- Wrangler for the local Cloudflare runtime and deployment.

Nothing is published by `npm run dev` or `npm run build`. Deploy explicitly:

```sh
npm run deploy
```
