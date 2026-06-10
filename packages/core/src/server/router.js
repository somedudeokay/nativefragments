import { attrs, html, jsonScript, raw } from "./html.js";

/**
 * @typedef {object} RouteContext
 * @property {Request} request Original request.
 * @property {AbortSignal} signal Request cancellation signal.
 * @property {URL} url Parsed request URL.
 * @property {Record<string, string>} params Path parameters captured from a
 * route pattern like `/posts/:slug`.
 * @property {(fragment: FragmentDefinition | string, attributes?: import("./html.js").HtmlAttrs) => import("./html.js").RawHtml} defer
 * Render a stable loading boundary and collect a named fragment for deferred
 * document streaming.
 */

/**
 * @typedef {object} RouteMeta
 * @property {string} [title] Document title.
 * @property {string} [description] Meta description.
 * @property {string} [canonical] Canonical URL.
 * @property {{ hreflang: string, href: string }[]} [alternates] Alternate
 * language URLs for `<link rel="alternate" hreflang="...">`.
 */

/**
 * @typedef {(context: RouteContext) => string | Promise<string>} FragmentRenderer
 */

/**
 * @typedef {(context: RouteContext) => string} FragmentLoadingRenderer
 */

/**
 * @typedef {(error: unknown, context: RouteContext) => string | Promise<string>} FragmentErrorRenderer
 */

/**
 * @typedef {object} FragmentDefinition
 * @property {string} name Fragment slot name.
 * @property {FragmentRenderer} render Fragment renderer.
 * @property {FragmentLoadingRenderer} [loading] Loading renderer used by
 * deferred document streaming.
 * @property {FragmentErrorRenderer} [error] Error renderer used when a
 * deferred fragment fails after the document response has started.
 * @property {number} [timeout] Maximum deferred render time in milliseconds.
 * @property {(attributes?: import("./html.js").HtmlAttrs) => import("./html.js").RawHtml} attrs
 * Attributes for links and target containers using this fragment slot.
 * @property {(mode?: "intent" | "visible" | "load" | "none", attributes?: import("./html.js").HtmlAttrs) => import("./html.js").RawHtml} prefetchAttrs
 * Attributes for links using this fragment slot with a prefetch mode.
 */

/**
 * @typedef {object} RouteDefinition
 * @property {(context: RouteContext) => RouteMeta | Promise<RouteMeta>} [meta]
 * Function that returns metadata for the route.
 * @property {(context: RouteContext) => string | Promise<string>} render
 * Function that renders route body HTML.
 * @property {Record<string, FragmentRenderer | FragmentDefinition> | FragmentDefinition[]} [fragments]
 * Named fragment renderers used by nested fragment slots.
 */

/**
 * @typedef {RouteDefinition & { path: string, params?: Record<string, string> }} Route
 */

const normalizePath = (path) => {
  if (!path || path === "/") return "/";
  return path.replace(/\/+$/, "") || "/";
};

const isFragmentDefinition = (value) =>
  Boolean(value && typeof value === "object" && value.name && value.render);

const normalizeFragmentDefinition = (name, value) =>
  isFragmentDefinition(value)
    ? value
    : {
        name,
        render: value,
      };

const normalizeFragmentDefinitions = (fragments) => {
  if (!fragments) return {};
  if (Array.isArray(fragments)) {
    return Object.fromEntries(fragments.map((item) => [item.name, item]));
  }
  return Object.fromEntries(
    Object.entries(fragments).map(([name, render]) => [
      name,
      normalizeFragmentDefinition(name, render),
    ]),
  );
};

const decodeSegment = (segment) => {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
};

const pathSegments = (path) =>
  normalizePath(path).split("/").filter(Boolean).map(decodeSegment);

const paramName = (segment) => (segment.startsWith(":") ? segment.slice(1) : null);

const compileRoutePattern = (item) => {
  const segments = pathSegments(item.path);
  const hasParams = segments.some((segment) => paramName(segment));
  if (!hasParams) return null;

  return { item, segments };
};

const matchRoutePattern = (compiled, pathname) => {
  const requestSegments = pathSegments(pathname);
  if (compiled.segments.length !== requestSegments.length) return null;

  const params = {};

  for (const [index, segment] of compiled.segments.entries()) {
    const name = paramName(segment);
    if (name) {
      params[name] = requestSegments[index] ?? "";
      continue;
    }
    if (segment !== requestSegments[index]) return null;
  }

  return { ...compiled.item, params };
};

/**
 * Create a named fragment definition.
 *
 * Use this when a route has a nested region with its own navigation. The
 * returned object can be registered in `route(..., { fragments: [item] })` and
 * its attributes can be reused on links and target containers.
 *
 * @param {string} name Fragment slot name.
 * @param {FragmentRenderer | Omit<FragmentDefinition, "name" | "attrs" | "prefetchAttrs">} definition
 * Fragment renderer or full fragment definition.
 * @returns {FragmentDefinition} Fragment definition.
 */
export const fragment = (name, definition) => {
  const normalized =
    typeof definition === "function" ? { render: definition } : definition;

  return {
    name,
    ...normalized,
    attrs: (attributes = {}) => attrs({ ...attributes, "data-fragment-slot": name }),
    prefetchAttrs: (mode = "intent", attributes = {}) =>
      attrs({
        ...attributes,
        "data-fragment-slot": name,
        "data-fragment-prefetch": mode,
      }),
  };
};

/**
 * Create a normalized route definition.
 *
 * @param {string} path URL path for the route. Use `:name` segments for path
 * params, for example `/posts/:slug`.
 * @param {RouteDefinition} definition Route metadata and render functions.
 * @returns {Route} Normalized route.
 */
export const route = (path, definition) => {
  const { fragments, ...routeDefinition } = definition;

  return {
    ...routeDefinition,
    fragments: normalizeFragmentDefinitions(fragments),
    path: normalizePath(path),
  };
};

/**
 * Create a route manifest that can match normalized paths. Exact static routes
 * win first, then parameterized routes are matched in declaration order.
 *
 * @param {Route[]} routes Route definitions.
 * @returns {{ all: Route[], match(pathname: string): Route | null }} Route manifest.
 */
export const createRoutes = (routes) => {
  const byPath = new Map(routes.map((item) => [normalizePath(item.path), item]));
  const patterns = routes.map(compileRoutePattern).filter(Boolean);

  return {
    all: routes,
    match(pathname) {
      const exact = byPath.get(normalizePath(pathname));
      if (exact) return exact;

      for (const pattern of patterns) {
        const match = matchRoutePattern(pattern, pathname);
        if (match) return match;
      }

      return null;
    },
  };
};

/**
 * Render fragment metadata for the browser fragment router.
 *
 * @param {RouteMeta} meta Metadata to embed in the fragment response.
 * @returns {string} Script tag containing serialized metadata.
 */
export const fragmentMeta = (meta) =>
  html`<script type="application/json" data-fragment-meta>${raw(
    jsonScript(meta),
  )}</script>`;

const validTagName = (value) =>
  typeof value === "string" && /^[a-z][a-z0-9-]*$/i.test(value);

const unsafeDeferredTags = new Set([
  "base",
  "body",
  "head",
  "html",
  "iframe",
  "link",
  "meta",
  "script",
  "style",
  "template",
  "textarea",
  "title",
]);

const deferredTagName = (value) => {
  const tag = String(value ?? "").toLowerCase();
  return validTagName(tag) && !unsafeDeferredTags.has(tag) ? tag : "section";
};

const deferredId = (name, index) => {
  const slug = String(name)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `nf-${slug || "fragment"}-${index}`;
};

const defaultDeferredLoading = () => html`<div data-fragment-loading role="status">
  Loading...
</div>`;

const defaultDeferredError = () => html`<div data-fragment-error role="status">
  This section could not be rendered.
</div>`;

const resolveDeferredFragment = (match, fragmentOrName) => {
  if (typeof fragmentOrName === "string") {
    return match.fragments?.[fragmentOrName] ?? null;
  }

  return isFragmentDefinition(fragmentOrName) ? fragmentOrName : null;
};

const renderLoading = (definition, context) => {
  const loading = definition.loading?.(context) ?? defaultDeferredLoading(context);

  if (loading && typeof loading.then === "function") {
    throw new Error(
      `Deferred fragment "${definition.name}" loading() must be synchronous. Do async work in render().`,
    );
  }

  return loading;
};

const renderError = async (definition, error, context) => {
  try {
    return await (definition.error?.(error, context) ?? defaultDeferredError(error, context));
  } catch {
    return defaultDeferredError(error, context);
  }
};

const defaultDeferredTimeout = 15_000;

const deferredTimeout = (definition, fallback) => {
  const timeout = definition.timeout ?? fallback;
  return Number.isFinite(timeout) && timeout > 0 ? timeout : null;
};

const runWithSignal = ({ context, definition, timeout }) => {
  const controller = new AbortController();
  const parentSignal = context.signal;
  let timeoutId = null;
  let removeParentAbort = null;
  const races = [];

  if (parentSignal) {
    races.push(
      new Promise((_, reject) => {
        const abort = () => {
          const reason = parentSignal.reason ?? new Error("Request aborted");
          controller.abort(reason);
          reject(reason);
        };

        if (parentSignal.aborted) {
          abort();
          return;
        }

        parentSignal.addEventListener("abort", abort, { once: true });
        removeParentAbort = () =>
          parentSignal.removeEventListener("abort", abort);
      }),
    );
  }

  if (timeout) {
    races.push(
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          const error = new Error(
            `Deferred fragment "${definition.name}" timed out after ${timeout}ms`,
          );
          controller.abort(error);
          reject(error);
        }, timeout);
      }),
    );
  }

  const render = Promise.resolve().then(() =>
    definition.render({
      ...context,
      signal: controller.signal,
    }),
  );

  return Promise.race([render, ...races]).finally(() => {
    if (timeoutId) clearTimeout(timeoutId);
    removeParentAbort?.();
  });
};

const createDeferredTask = ({ id, definition, context, attributes, loading, timeout }) => ({
  id,
  name: definition.name,
  attributes,
  context,
  definition,
  loading,
  placeholder: "",
  promise: null,
  run() {
    this.promise ??= runWithSignal({
      context,
      definition,
      timeout,
    })
      .then(
        (body) => ({ ok: true, body }),
        (error) => ({ ok: false, error }),
      );
    return this.promise;
  },
});

const renderDeferredSlot = ({ id, name, content, attributes = {}, state = "loading" }) => {
  const { as, ...htmlAttributes } = attributes;
  const tag = deferredTagName(as);
  const isLoading = state === "loading";

  return html`<${raw(tag)}${attrs({
    ...htmlAttributes,
    ...(isLoading ? { "aria-busy": "true" } : {}),
    "data-fragment-slot": name,
    "data-fragment-state": state,
    "data-nativefragments-deferred": id,
  })}>${raw(content)}</${raw(tag)}>`;
};

const renderResolvedDeferredSlot = async (task) => {
  const result = await task.run();
  const state = result.ok ? "ready" : "error";
  const body = result.ok
    ? result.body
    : await renderError(task.definition, result.error, task.context);

  return {
    body,
    state,
    slot: renderDeferredSlot({
      id: task.id,
      name: task.name,
      content: body,
      attributes: task.attributes,
      state,
    }),
  };
};

/**
 * Render a matched route and normalize metadata defaults.
 *
 * @param {{ match: Route, request: Request, slot?: string | null, deferredTimeout?: number | null }} options
 * Render options. When `slot` matches a registered named fragment, only that
 * fragment renderer is used. Calls to `context.defer()` always collect
 * deferred work for the adapter to stream or inline.
 * @returns {Promise<{ body: string, meta: Required<RouteMeta>, deferred: unknown[] }>} Rendered route.
 */
export const renderRoute = async ({
  match,
  request,
  slot = null,
  deferredTimeout: fallbackDeferredTimeout = defaultDeferredTimeout,
}) => {
  const deferred = [];
  const context = {
    params: match.params ?? {},
    request,
    signal: request.signal,
    url: new URL(request.url),
    defer(fragmentOrName, attributes = {}) {
      const definition = resolveDeferredFragment(match, fragmentOrName);
      if (!definition) {
        throw new Error(`Unknown deferred fragment: ${String(fragmentOrName)}`);
      }

      const id = deferredId(definition.name, deferred.length + 1);
      const loading = renderLoading(definition, context);
      const task = createDeferredTask({
        attributes,
        context,
        definition,
        id,
        loading,
        timeout: deferredTimeout(definition, fallbackDeferredTimeout),
      });

      task.placeholder = renderDeferredSlot({
        id,
        name: definition.name,
        content: loading,
        attributes,
        state: "loading",
      });
      deferred.push(task);
      // Start the renderer immediately so data fetches overlap with the rest
      // of the route render and shell serialization. run() never rejects (it
      // resolves to an { ok, body | error } envelope).
      task.run();

      return raw(task.placeholder);
    },
  };
  const meta = await match.meta?.(context);
  const fragmentDefinition = slot ? match.fragments?.[slot] : null;
  const render = fragmentDefinition ? fragmentDefinition.render : match.render;
  const body = await render(context);

  return {
    body,
    deferred,
    meta: {
      title: "",
      description: "",
      canonical: context.url.pathname,
      ...(meta ?? {}),
    },
  };
};

/**
 * Render a fragment response body with embedded metadata.
 *
 * @param {{ body: string, meta: RouteMeta }} rendered Rendered route body and metadata.
 * @returns {string} Fragment HTML.
 */
export const renderFragment = ({ body, meta }) =>
  html`${raw(body)}${raw(fragmentMeta(meta))}`;

/**
 * @private
 */
export const inlineDeferredFragments = async (rendered) => {
  if (!rendered.deferred?.length) return rendered;
  const replacements = await Promise.all(
    rendered.deferred.map(async (task) => [
      task,
      (await renderResolvedDeferredSlot(task)).slot,
    ]),
  );
  let body = rendered.body;

  for (const [task, resolved] of replacements) {
    if (!body.includes(task.placeholder)) {
      console.warn(
        `Native Fragments: the loading boundary for deferred fragment "${task.name}" was not found in the rendered body, so its resolved content was dropped. Interpolate the value returned by context.defer() into the render output unmodified.`,
      );
      continue;
    }
    body = body.split(task.placeholder).join(resolved);
  }

  return {
    ...rendered,
    body,
    deferred: [],
  };
};

/**
 * @private
 */
export const renderDeferredFragment = async (task) => {
  const resolved = await renderResolvedDeferredSlot(task);

  return html`<div hidden data-nativefragments-deferred-content="${task.id}" data-fragment-state="${resolved.state}">${raw(
    resolved.body,
  )}</div>`;
};

/**
 * Single source of the deferred reveal logic. It streams inline (with the CSP
 * nonce) on every deferred document response, before any content chunk, so the
 * browser router does not need its own copy.
 *
 * @private
 */
export const deferredFragmentBootstrap = ({ nonce } = {}) => html`<script${attrs({
  nonce,
  "data-nativefragments-deferred-bootstrap": true,
})}>
(() => {
  if (window.__nativeFragmentsDeferredFragments) return;
  window.__nativeFragmentsDeferredFragments = true;

  const escapeValue = (value) => String(value).replace(/["\\\\]/g, "\\\\$&");
  const reveal = (node) => {
    if (!(node instanceof Element)) return;
    const id = node.getAttribute("data-nativefragments-deferred-content");
    if (!id) return;
    const target = document.querySelector('[data-nativefragments-deferred="' + escapeValue(id) + '"]');
    if (!target) return;
    const fragment = document.createDocumentFragment();
    while (node.firstChild) fragment.appendChild(node.firstChild);
    target.replaceChildren(fragment);
    target.setAttribute("data-fragment-state", node.getAttribute("data-fragment-state") || "ready");
    target.removeAttribute("aria-busy");
    node.remove();
  };

  const process = (root) => {
    reveal(root);
    root.querySelectorAll?.("[data-nativefragments-deferred-content]").forEach(reveal);
  };

  document.querySelectorAll("[data-nativefragments-deferred-content]").forEach(reveal);
  new MutationObserver((records) => {
    for (const record of records) {
      record.addedNodes.forEach(process);
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
</script>`;

/**
 * Default 404 route used by adapters when a route is not matched.
 *
 * @type {Route}
 */
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
