# __APP_NAME__

A zero-build Native Fragments app.

```sh
npm install
npm run dev
```

Deploy with:

```sh
npm run deploy
```

The starter includes:

- Cloudflare Worker rendering through `@nativefragments/core`.
- Hono mounted under `/api/*`.
- Fragment navigation with route-level and nested slot demos.
- A persistent shell header that is not replaced during navigation.
- Server-rendered Shadow DOM components with no refresh FOUC.
- Shared state in `/nativefragments/signals.js`.
- LocalStorage and cookie-backed counter state for refresh-safe SSR.
- Worker RPC helpers in `/nativefragments/worker.js`.
