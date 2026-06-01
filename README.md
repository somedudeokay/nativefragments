# Create Native Fragments App

Scaffold a zero-build Native Fragments app.

```sh
npm create @nativefragments/app@latest my-app
cd my-app
npm run dev
```

The generated app uses `@nativefragments/core`, Cloudflare Workers, Hono API
routes, static assets, partial rerenders, nested partial areas, Shadow DOM
component helpers, worker helpers, and shared state. The starter UI includes a
persistent header that proves pages can update in pieces without rerendering
the document shell.
