# Create Native Fragments App

Scaffold a zero-build Native Fragments app.

```sh
npm create @nativefragments/app@latest my-app
cd my-app
npm run dev
```

The generated app uses `@nativefragments/core`, Cloudflare Workers, Hono API
routes, static assets, fragment navigation, nested-fragment capable routing,
Shadow DOM component helpers, worker helpers, and shared signal state. The
starter UI includes a persistent header that proves route fragments can
navigate without rerendering the document shell.
