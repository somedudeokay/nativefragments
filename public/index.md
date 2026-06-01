# Native Fragments Docs

> Technical documentation for Native Fragments. For the agent index, fetch https://docs.nativefragments.org/llms.txt.

Native Fragments builds edge-first Cloudflare Worker apps with server-rendered HTML, fragment navigation, and native Shadow DOM components. It has no build step by default and keeps application code close to the Web Platform.

## Start

```sh
npm create @nativefragments/app@latest my-app
cd my-app
npm run dev
```

## Model

- HTML is the first payload.
- Fragment navigation upgrades ordinary same-origin links.
- Custom Elements own behavior.
- Shadow DOM scopes component CSS.
- Small source files make apps easier for agents to inspect and maintain.
- Cloudflare Workers are the default deployment target, so pages, fragments, and API routes can run at the edge.
