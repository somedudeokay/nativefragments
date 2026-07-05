import { attrs, html, raw } from "./html.js";

const isFragmentDefinition = (value) =>
  Boolean(value && typeof value === "object" && value.name && value.render);

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

export const defaultDeferredTimeout = 15_000;

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
    ? String(result.body)
    : String(await renderError(task.definition, result.error, task.context));

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
 * Create the route context shared by renderers, actions, and deferred slots.
 *
 * @private
 * @param {{ deferred: unknown[], fallbackDeferredTimeout: number | null, match: import("./router.js").Route, request: Request }} options
 * Context options.
 * @returns {import("./router.js").RouteContext} Route context.
 */
export const createRouteContext = ({
  deferred,
  fallbackDeferredTimeout,
  match,
  request,
}) => {
  const context = {
    params: match.params ?? {},
    request,
    signal: request.signal,
    url: new URL(request.url),
    get query() {
      return this.url.searchParams;
    },
    defer(fragmentOrName, attributes = {}) {
      const definition = resolveDeferredFragment(match, fragmentOrName);
      if (!definition) {
        throw new Error(`Unknown deferred fragment: ${String(fragmentOrName)}`);
      }

      const id = deferredId(definition.name, deferred.length + 1);
      const loading = String(renderLoading(definition, context));
      const task = createDeferredTask({
        attributes,
        context,
        definition,
        id,
        loading,
        timeout: deferredTimeout(definition, fallbackDeferredTimeout),
      });

      task.placeholder = String(renderDeferredSlot({
        id,
        name: definition.name,
        content: loading,
        attributes,
        state: "loading",
      }));
      deferred.push(task);
      // Start the renderer immediately so data fetches overlap with the rest
      // of the route render and shell serialization. run() never rejects (it
      // resolves to an { ok, body | error } envelope).
      task.run();

      return raw(task.placeholder);
    },
  };

  return context;
};

/**
 * @private
 */
export const inlineDeferredFragments = async (rendered) => {
  if (!rendered.deferred?.length) return rendered;
  const replacements = await Promise.all(
    rendered.deferred.map(async (task) => [
      task,
      String((await renderResolvedDeferredSlot(task)).slot),
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
