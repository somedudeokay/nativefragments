import { html, jsonScript, raw } from "./html.js";

const normalizePath = (path) => {
  if (!path || path === "/") return "/";
  return path.replace(/\/+$/, "") || "/";
};

export const route = (path, definition) => ({
  ...definition,
  path: normalizePath(path),
});

export const createRoutes = (routes) => {
  const byPath = new Map(routes.map((item) => [normalizePath(item.path), item]));

  return {
    all: routes,
    match(pathname) {
      return byPath.get(normalizePath(pathname)) ?? null;
    },
  };
};

export const fragmentMeta = (meta) =>
  html`<script type="application/json" data-fragment-meta>${raw(
    jsonScript(meta),
  )}</script>`;

export const renderRoute = async ({ match, request }) => {
  const context = { request, url: new URL(request.url) };
  const meta = await match.meta?.(context);
  const body = await match.render(context);

  return {
    body,
    meta: {
      title: "",
      description: "",
      canonical: context.url.pathname,
      ...(meta ?? {}),
    },
  };
};

export const renderFragment = ({ body, meta }) =>
  html`${raw(body)}${raw(fragmentMeta(meta))}`;

export const notFoundRoute = route("404", {
  meta: ({ url }) => ({
    title: "404",
    description: "Page not found.",
    canonical: url.pathname,
  }),
  render: () => html`<main class="not-found">
    <p class="eyebrow">404</p>
    <h1>Nothing rendered here.</h1>
    <p>This route is not in the manifest.</p>
  </main>`,
});
