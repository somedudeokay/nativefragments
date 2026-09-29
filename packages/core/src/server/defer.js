import { attrs, html, raw } from "./html.js";
import { createRequestContext } from "./context.js";

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

const deferredId = (name, index, scope) => {
  const slug = String(name)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `nf-${slug || "fragment"}-${index}-${scope}`;
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
 * @param {{ deferred: unknown[], fallbackDeferredTimeout: number | null, match: import("./router.js").Route, request: Request, scope?: import("./context.js").RequestContext }} options
 * Context options.
 * @returns {import("./router.js").RouteContext} Route context.
 */
export const createRouteContext = ({
  deferred,
  fallbackDeferredTimeout,
  match,
  request,
  scope = createRequestContext({ request }),
}) => {
  const renderId = crypto.randomUUID();
  const context = {
    ...scope,
    params: match.params ?? {},
    defer(fragmentOrName, attributes = {}) {
      const definition = resolveDeferredFragment(match, fragmentOrName);
      if (!definition) {
        throw new Error(`Unknown deferred fragment: ${String(fragmentOrName)}`);
      }

      const id = deferredId(definition.name, deferred.length + 1, renderId);
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
export const warnForMissingDeferredSlots = (rendered) => {
  for (const task of rendered.deferred ?? []) {
    if (rendered.body.includes(task.placeholder)) continue;
    console.warn(
      `Native Fragments: the loading boundary for deferred fragment "${task.name}" was not found in the rendered body, so its resolved content was dropped. Interpolate the value returned by context.defer() into the render output unmodified.`,
    );
  }
};

/**
 * @private
 */
export const inlineDeferredFragments = async (rendered) => {
  if (!rendered.deferred?.length) return rendered;
  warnForMissingDeferredSlots(rendered);
  const replacements = await Promise.all(
    rendered.deferred.map(async (task) => [
      task,
      String((await renderResolvedDeferredSlot(task)).slot),
    ]),
  );
  let body = rendered.body;

  for (const [task, resolved] of replacements) {
    if (!body.includes(task.placeholder)) continue;
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
export const renderDeferredFragment = async (task, { document = false } = {}) => {
  const resolved = await renderResolvedDeferredSlot(task);

  return html`<div hidden data-nativefragments-deferred-content="${task.id}" data-fragment-state="${resolved.state}">${raw(
    resolved.body,
  )}</div><template data-nativefragments-deferred-complete="${task.id}"></template>${document ? html`<noscript><section data-fragment-fallback="${task.name}">${raw(resolved.body)}</section></noscript>` : ""}`;
};

// Keep this framework-authored program as literal source. Serializing a function
// with toString() can capture helpers injected by production bundlers (keepNames).
const documentRevealScript = String.raw`(() => {
  const targets = new Map([...document.querySelectorAll("[data-nativefragments-deferred]")]
    .map(target => [target.getAttribute("data-nativefragments-deferred"), target]));
  const process = () => {
    for (const marker of document.querySelectorAll("template[data-nativefragments-deferred-complete]")) {
      if (!marker.isConnected) continue;
      const id = marker.getAttribute("data-nativefragments-deferred-complete");
      const source = marker.previousElementSibling;
      if (!source?.isConnected || source.getAttribute("data-nativefragments-deferred-content") !== id) continue;
      const target = targets.get(id);
      if (target?.isConnected && target.getAttribute("data-nativefragments-deferred") === id) {
        const content = document.createDocumentFragment();
        while (source.firstChild) content.appendChild(source.firstChild);
        target.replaceChildren(content);
        const state = source.getAttribute("data-fragment-state") || "ready";
        target.setAttribute("data-fragment-state", state);
        target.removeAttribute("aria-busy");
        target.dispatchEvent(new CustomEvent("nativefragments:fragment-reveal", {
          bubbles: true, composed: true,
          detail: { fragmentId: id, state, target, slot: target.getAttribute("data-fragment-slot"), url: new URL(location.href), streaming: true },
        }));
      }
      source.remove();
      marker.remove();
      targets.delete(id);
    }
    if (document.querySelector("[data-nativefragments-stream-complete]")) finish();
  };
  const observer = new MutationObserver(process);
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    observer.disconnect();
    document.removeEventListener("DOMContentLoaded", loaded);
    document.querySelector("[data-nativefragments-stream-complete]")?.remove();
    document.dispatchEvent(new CustomEvent("nativefragments:document-stream-complete"));
  };
  const loaded = () => { process(); finish(); };
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", loaded, { once: true });
  process();
})();`;

/** Install response-scoped reveals that wait for complete parser payloads. @private */
export const deferredFragmentBootstrap = ({ nonce } = {}) => html`<noscript><style${attrs({ nonce })}>[data-nativefragments-deferred][data-fragment-state="loading"]{display:none}</style></noscript><script${attrs({
  nonce,
  "data-nativefragments-deferred-bootstrap": true,
})}>${raw(documentRevealScript)}</script>`;
