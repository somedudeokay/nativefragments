import { createRoutes, route } from "./router.js";

const defaultOnError = (event) =>
  console.error("Native Fragments API:", event.error);

const methodName = (method) => String(method).toUpperCase();

const jsonError = (message, init) =>
  Response.json({ error: message }, init);

const isResponse = (value) => value instanceof Response;

/**
 * @typedef {object} ApiContext
 * @property {Request} request Original request.
 * @property {Record<string, unknown>} env Runtime environment bindings.
 * @property {unknown} context Runtime execution context.
 * @property {URL} url Parsed request URL.
 * @property {URLSearchParams} query Parsed query parameters from `url.searchParams`.
 * @property {Record<string, string>} params Path parameters captured from the API route.
 * @property {AbortSignal} signal Request cancellation signal.
 */

/**
 * @typedef {(context: ApiContext) => unknown | Response | Promise<unknown | Response>} ApiHandler
 */

/**
 * @typedef {object} ApiRoute
 * @property {string} method Upper-case HTTP method.
 * @property {string} path Normalized API route path.
 * @property {ApiHandler} handler API route handler.
 */

/**
 * Create a normalized API route.
 *
 * Paths use the same `:param` and trailing `:rest*` segment syntax as page
 * routes.
 *
 * @param {string} method Upper-case HTTP method.
 * @param {string} path API path pattern.
 * @param {ApiHandler} handler API handler.
 * @returns {ApiRoute} Normalized API route.
 */
export const apiRoute = (method, path, handler) => {
  const normalized = route(path, { render: () => "" });
  return {
    handler,
    method: methodName(method),
    path: normalized.path,
  };
};

const groupedRoutes = (routes) => {
  const groups = new Map();

  for (const item of routes) {
    const entries = groups.get(item.path) ?? [];
    entries.push(item);
    groups.set(item.path, entries);
  }

  return Array.from(groups, ([path, items]) => ({
    path,
    routes: items,
  }));
};

const allowedMethods = (routes) => {
  const methods = [];
  for (const item of routes) {
    if (!methods.includes(item.method)) methods.push(item.method);
    if (item.method === "GET" && !methods.includes("HEAD")) methods.push("HEAD");
  }
  return methods;
};

const handlerForMethod = (routes, method) => {
  const exact = routes.find((item) => item.method === method);
  if (exact) return exact;
  if (method === "HEAD") return routes.find((item) => item.method === "GET") ?? null;
  return null;
};

/**
 * Create a Fetch-compatible API router.
 *
 * @param {ApiRoute[]} routes API route definitions.
 * @param {{ onError?: (event: { error: unknown, request: Request, route?: ApiRoute }) => void }} [options={}]
 * API options.
 * @returns {{ fetch(request: Request, env?: Record<string, unknown>, context?: unknown): Promise<Response> }}
 * Fetch-compatible API router.
 */
export const createApi = (routes, { onError = defaultOnError } = {}) => {
  const manifest = createRoutes(groupedRoutes(routes));

  return {
    async fetch(request, env = {}, context) {
      const url = new URL(request.url);
      const match = manifest.match(url.pathname);

      if (!match) {
        return jsonError("Not found", { status: 404 });
      }

      const method = methodName(request.method);
      const routeMatch = handlerForMethod(match.routes, method);
      if (!routeMatch) {
        return jsonError("Method not allowed", {
          status: 405,
          headers: {
            Allow: allowedMethods(match.routes).join(", "),
          },
        });
      }

      try {
        const result = await routeMatch.handler({
          context,
          env,
          params: match.params ?? {},
          query: url.searchParams,
          request,
          signal: request.signal,
          url,
        });
        return isResponse(result) ? result : Response.json(result);
      } catch (error) {
        onError({ error, request, route: routeMatch });
        return jsonError("Internal error", { status: 500 });
      }
    },
  };
};
