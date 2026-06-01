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
- Fragment navigation with nested slot support.
- Shadow DOM component helpers with no refresh FOUC.
- Optional signals in `/nativefragments/signals.js`.
- Worker RPC helpers in `/nativefragments/worker.js`.
