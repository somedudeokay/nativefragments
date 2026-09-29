import { createNavigationScope } from "./navigation.js";
import { parseHtml } from "./dom.js";
import { createFragmentLoader } from "./fragment-loader.js";

const defaultTarget = "#content-slot";
const fragmentUrl = (url) => `${url.pathname}${url.search}`;
const historyUrl = (url) => `${url.pathname}${url.search}${url.hash}`;

const isSelectorSlot = (slot) =>
  typeof slot === "string" &&
  (slot.startsWith("#") || slot.startsWith(".") || slot.startsWith("["));

const escapeSlot = (value) => String(value).replace(/["\\]/g, "\\$&");

const namedSlotTarget = (slot) =>
  isSelectorSlot(slot)
    ? document.querySelector(slot)
    : document.querySelector(`[data-fragment-slot="${escapeSlot(slot)}"]:not(a):not(form):not(button):not(input)`);

const sameRoute = (url) =>
  url.pathname === window.location.pathname &&
  url.search === window.location.search;

const consumeMeta = (fragment) => {
  const node = fragment.querySelector("script[data-fragment-meta]");
  if (!node?.textContent) return null;
  const meta = JSON.parse(node.textContent);
  node.remove();
  return meta;
};

const setHead = (meta) => {
  if (!meta) return;
  if (meta.title) document.title = meta.title;

  const description = document.head.querySelector('meta[name="description"]');
  if (description && meta.description) {
    description.setAttribute("content", meta.description);
  }

  const canonical = document.head.querySelector('link[rel="canonical"]');
  if (canonical && meta.canonical) canonical.setAttribute("href", meta.canonical);

  if (Array.isArray(meta.alternates)) {
    document.head
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((node) => node.remove());

    for (const alternate of meta.alternates) {
      if (!alternate?.hreflang || !alternate?.href) continue;
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = alternate.hreflang;
      link.href = alternate.href;
      document.head.appendChild(link);
    }
  }
};

const parseFragment = (html) => {
  const content = parseHtml(html);
  return {
    content,
    meta: consumeMeta(content),
  };
};

const deferredContentSelector = "[data-nativefragments-deferred-content]";

const revealDeferredContent = (content, root) => {
  const revealed = [];
  for (const source of content.querySelectorAll?.(deferredContentSelector) ?? []) {
    const id = source.getAttribute("data-nativefragments-deferred-content");
    if (!id) continue;
    const selector = `[data-nativefragments-deferred="${escapeSlot(id)}"]`;
    const target = root.matches?.(selector) ? root : root.querySelector?.(selector);
    if (!target) continue;

    const fragment = document.createDocumentFragment();
    while (source.firstChild) fragment.appendChild(source.firstChild);
    target.replaceChildren(fragment);
    const state = source.getAttribute("data-fragment-state") || "ready";
    target.setAttribute("data-fragment-state", state);
    target.removeAttribute("aria-busy");
    source.remove();
    content.querySelector(`[data-nativefragments-deferred-complete="${escapeSlot(id)}"]`)?.remove();
    revealed.push({ fragmentId: id, state, target });
  }
  return revealed;
};

const decodeHash = (hash) => {
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return hash.slice(1);
  }
};

const scrollToHash = (url) => {
  if (!url.hash) return false;
  const id = decodeHash(url.hash);
  const target = document.getElementById(id) ?? document.getElementsByName(id)[0];
  if (!target) return false;
  target.scrollIntoView();
  return true;
};

const scrollToTop = () =>
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });

const restoreScroll = (position) => {
  if (!Array.isArray(position)) return false;
  window.scrollTo({
    left: Number(position[0]) || 0,
    top: Number(position[1]) || 0,
    behavior: "instant",
  });
  return true;
};

const focusTarget = (target) => {
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
};

const saveCurrentScrollPosition = () => {
  const state =
    history.state && typeof history.state === "object" ? history.state : {};
  history.replaceState(
    { ...state, scroll: [window.scrollX, window.scrollY] },
    "",
  );
};

const applyFragment = async ({
  bindPrefetch,
  fragment,
  historyMode,
  restore,
  scroll,
  slot,
  target,
  url,
  userInitiated,
  viewTransitions,
  transaction,
  commitNavigation,
}) => {
  let revealed = [];
  const swap = () => transaction.commit(() => {
    target.removeAttribute("data-nativefragments-deferred");
    target.replaceChildren(fragment.content);
    revealed = revealDeferredContent(target, target);
    setHead(fragment.meta);
    bindPrefetch(target);
    commitNavigation(url, slot, historyMode);
  });

  if (viewTransitions && typeof document.startViewTransition === "function") {
    const transition = document.startViewTransition(swap);
    void transition.ready?.catch(() => {});
    void transition.finished?.catch(() => {});
    await transaction.wait(transition.updateCallbackDone);
  } else {
    swap();
  }

  transaction.check();
  if (!restoreScroll(restore) && !scrollToHash(url) && scroll) {
    scrollToTop();
  }
  if (userInitiated) focusTarget(target);
  return revealed;
};

const routeTo = (href) =>
  href instanceof URL ? new URL(href.href) : new URL(href, window.location.href);

const documentNavigationPattern =
  /\.(?:avif|br|css|gif|gz|html?|ico|jpe?g|json|m?js|map|md|mp3|mp4|ogg|otf|pdf|png|svg|tar|ttf|txt|wasm|wav|webm|webp|woff2?|xml|zip)$/i;

const requestsDocumentNavigation = (url) => documentNavigationPattern.test(url.pathname);

const linkOptedOut = (link) => {
  const mode = link.dataset.fragmentNavigation;
  return (
    link.hasAttribute("data-nativefragments-reload") ||
    mode === "false" ||
    mode === "off"
  );
};

const shouldHandleLink = (event) =>
  !event.defaultPrevented &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey &&
  event.button === 0;

const linkFromEvent = (event) =>
  event
    .composedPath()
    .find((item) => item instanceof Element && item.matches?.("a[href]"));

const fallbackToDocument = (url) => {
  window.location.href = url.href;
};

const shouldUseDocumentNavigation = (link) => {
  if (!link || link.target || link.hasAttribute("download") || linkOptedOut(link)) {
    return true;
  }

  const url = routeTo(link.href);
  return url.origin !== window.location.origin || requestsDocumentNavigation(url);
};

const prefetchMode = (value) => {
  if (value === true || value === undefined) return "intent";
  if (value === false || value === "false" || value === "off") return "none";
  return value;
};

const linkPrefetchMode = (link, fallback) => {
  const value = link.dataset.fragmentPrefetch;
  return prefetchMode(value === undefined ? fallback : value);
};

const shouldPrefetchLink = (link) =>
  link &&
  !shouldUseDocumentNavigation(link);

const formFromEvent = (event) =>
  event
    .composedPath()
    .find(
      (item) =>
        item instanceof Element &&
        item.matches?.("form[data-fragment-form]"),
    );

const submitterFromEvent = (event) =>
  event.submitter instanceof HTMLElement ? event.submitter : null;

const effectiveFormMethod = (form, submitter) =>
  String(submitter?.getAttribute("formmethod") ?? form.getAttribute("method") ?? "get")
    .toUpperCase();

const effectiveFormAction = (form, submitter) =>
  routeTo(submitter?.getAttribute("formaction") ?? form.getAttribute("action") ?? window.location.href);

const effectiveFormTarget = (form, submitter) =>
  submitter?.getAttribute("formtarget") ?? form.getAttribute("target") ?? "";

const formDataSearch = (form, submitter) => {
  const params = new URLSearchParams();
  for (const [name, value] of new FormData(form, submitter)) {
    params.append(name, String(value));
  }
  return params;
};

let activeRouter = null;

const dispatchNavigationEvent = (target, type, detail) =>
  target.dispatchEvent(
    new CustomEvent(`nativefragments:${type}`, {
      bubbles: true,
      composed: true,
      detail,
    }),
  );

const navigationPhase = (error) =>
  /stream/i.test(error?.message) ? "stream" : "request";

/**
 * @typedef {"none" | "intent" | "visible" | "load"} PrefetchMode
 */

/**
 * @typedef {object} FragmentRouterOptions
 * @property {string | Element} [target="#content-slot"] Primary navigation target.
 * @property {number} [cacheTtl=30000] Maximum completed fragment cache lifetime.
 * @property {number} [cacheMaxEntries=100] Maximum cached response groups (including redirect aliases).
 * @property {number} [cacheMaxBytes=2000000] Maximum retained HTML bytes.
 * @property {PrefetchMode | boolean} [prefetch="intent"]
 * Default automatic prefetch policy.
 * @property {boolean} [viewTransitions=true] Use View Transitions when available.
 * @property {AbortSignal} [signal] Aborting this signal tears down the router.
 */

/**
 * @typedef {object} NavigateOptions
 * @property {string} [slot] Named fragment target; omit for the primary target.
 * @property {"push" | "replace" | "none"} [history="push"] History behavior.
 * @property {AbortSignal} [signal] Abort this navigation consumer.
 */

/**
 * @typedef {object} FragmentRequestOptions
 * @property {string} [slot] Named fragment target.
 * @property {AbortSignal} [signal] Abort this request consumer.
 */

/**
 * @typedef {object} InvalidateOptions
 * @property {string} [slot] Limit invalidation to one named fragment target.
 */

/**
 * @typedef {object} FragmentRouter
 * @property {(href: string | URL, options?: NavigateOptions) => Promise<void>} navigate
 * Navigate to a route or named fragment.
 * @property {(href: string | URL, options?: FragmentRequestOptions) => Promise<void>} prefetch
 * Warm a completed fragment in the shared cache.
 * @property {(href?: string | URL, options?: InvalidateOptions) => void} invalidate
 * Drop matching cached and in-flight fragments, or all fragments when omitted.
 */

/**
 * Start document navigation and return a small imperative controller.
 *
 * Links and opted-in GET forms retain their native behavior when JavaScript is
 * unavailable. While active, same-origin navigation is upgraded with streamed
 * HTML fragments, history, metadata, focus, scrolling, and prefetching.
 *
 * @param {FragmentRouterOptions} [options={}] Router options.
 * @returns {Readonly<FragmentRouter>} Router controller.
 */
export const startRouter = ({
  target = defaultTarget,
  cacheTtl = 30_000,
  cacheMaxEntries = 100,
  cacheMaxBytes = 2_000_000,
  prefetch = "intent",
  viewTransitions = true,
  signal: lifetimeSignal,
} = {}) => {
  if (activeRouter) {
    throw new DOMException(
      "Native Fragments already has an active router for this document",
      "InvalidStateError",
    );
  }
  if (lifetimeSignal?.aborted) throw new DOMException("Router lifetime aborted", "AbortError");

  const primaryTarget =
    target instanceof Element ? target : document.querySelector(target);
  if (!primaryTarget) {
    throw new DOMException(
      `Native Fragments target not found: ${String(target)}`,
      "NotFoundError",
    );
  }

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  const loader = createFragmentLoader({ maxEntries: cacheMaxEntries, maxBytes: cacheMaxBytes });
  const navigation = createNavigationScope();
  const listeners = new AbortController();
  const activeByTarget = new WeakMap();
  const loadedLinks = new WeakSet();
  const visibleLinks = new WeakSet();
  const intentTimers = new Map();
  const defaultPrefetch = prefetchMode(prefetch);
  let historyRevision = 0;
  let restoringHistory = 0;
  let renderedRoute = fragmentUrl(new URL(window.location.href));
  let destroyed = false;
  let snapshot = { primary: window.location.href, slots: {}, key: ++historyRevision };
  history.replaceState({ ...history.state, nativefragments: snapshot }, "");

  const commitNavigation = (url, slot, mode) => {
    const next = slot
      ? { ...snapshot, slots: { ...snapshot.slots, [slot]: url.href } }
      : { primary: url.href, slots: {}, key: snapshot.key };
    if (mode !== "none") next.key = ++historyRevision;
    if (mode === "push") {
      saveCurrentScrollPosition();
      history.pushState({ nativefragments: next, fragmentSlot: slot }, "", historyUrl(url));
    } else if (mode === "replace") {
      history.replaceState({ ...history.state, nativefragments: next, fragmentSlot: slot }, "", historyUrl(url));
    }
    snapshot = next;
    renderedRoute = fragmentUrl(url);
  };

  const targetFor = (slot) => (slot ? namedSlotTarget(slot) : primaryTarget);

  const prefetchFragment = async (href, { slot, signal } = {}) => {
    if (destroyed) throw new DOMException("Router lifetime ended", "InvalidStateError");
    const url = routeTo(href);
    if (url.origin !== window.location.origin || requestsDocumentNavigation(url)) return;
    await loader.prefetch({ signal, slot, ttl: cacheTtl, url });
  };

  const visibleObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const link = entry.target;
            visibleObserver.unobserve(link);
            void prefetchFragment(link.href, {
              slot: link.dataset.fragmentSlot || undefined,
            }).catch(() => {});
          }
        }, { rootMargin: "240px" })
      : null;

  const linksIn = (root) => {
    const links = [];
    if (root instanceof Element && root.matches("a[href]")) links.push(root);
    root.querySelectorAll?.("a[href]").forEach((link) => links.push(link));
    return links;
  };

  const bindPrefetch = (root) => {
    for (const link of linksIn(root)) {
      if (!shouldPrefetchLink(link)) continue;
      const mode = linkPrefetchMode(link, defaultPrefetch);
      if (mode === "load" && !loadedLinks.has(link)) {
        loadedLinks.add(link);
        void prefetchFragment(link.href, {
          slot: link.dataset.fragmentSlot || undefined,
        }).catch(() => {});
      }
      if (mode === "visible" && visibleObserver && !visibleLinks.has(link)) {
        visibleLinks.add(link);
        visibleObserver.observe(link);
      }
    }
  };

  const revealEvents = (revealed, detail) => {
    for (const reveal of revealed) {
      bindPrefetch(reveal.target);
      dispatchNavigationEvent(reveal.target, "fragment-reveal", {
        ...detail,
        fragmentId: reveal.fragmentId,
        slot: reveal.target.getAttribute("data-fragment-slot"),
        state: reveal.state,
        target: reveal.target,
      });
    }
  };

  const navigateInternal = async (
    href,
    { slot, history: historyMode = "push", signal, restore, userInitiated = historyMode !== "none" } = {},
  ) => {
    if (destroyed) throw new DOMException("Router lifetime ended", "InvalidStateError");
    const requestedUrl = routeTo(href);
    if (
      requestedUrl.origin !== window.location.origin ||
      requestsDocumentNavigation(requestedUrl)
    ) {
      fallbackToDocument(requestedUrl);
      return;
    }
    if (historyMode === "push" && !slot && sameRoute(requestedUrl) && !requestedUrl.hash) return;

    const root = targetFor(slot);
    if (!root) {
      fallbackToDocument(requestedUrl);
      return;
    }

    const transaction = navigation.begin(root, signal);
    const controller = transaction.controller;
    activeByTarget.set(root, controller);
    const id = transaction.id;
    const requestedDetail = { id, slot: slot ?? null, target: root, url: requestedUrl };

    root.setAttribute("aria-busy", "true");
    root.setAttribute("data-nativefragments-navigation", "loading");
    dispatchNavigationEvent(root, "navigation-start", requestedDetail);

    let navigationMeta = null;
    let streaming = false;
    let finalUrl = requestedUrl;

    try {
      const result = await loader.consume({
        signal: controller.signal,
        slot,
        ttl: cacheTtl,
        url: requestedUrl,
        onFrame: async (frame) => {
          transaction.check();
          finalUrl = frame.url;
          streaming = frame.streaming;
          if (frame.url.origin !== window.location.origin) {
            const error = new Error("Fragment response redirected across origins");
            error.name = "NativeFragmentsCrossOriginRedirectError";
            error.url = frame.url;
            throw error;
          }

          const fragment = parseFragment(frame.html);
          const detail = { id, slot: slot ?? null, target: root, url: frame.url, streaming: frame.streaming };
          if (frame.index === 0) {
            navigationMeta = fragment.meta;
            if (frame.streaming) {
              root.setAttribute("data-nativefragments-navigation", "streaming");
            }
            const revealed = await applyFragment({
              bindPrefetch,
              fragment,
              historyMode,
              restore,
              scroll: !slot,
              slot: slot ?? null,
              target: root,
              url: frame.url,
              userInitiated,
              viewTransitions,
              transaction,
              commitNavigation,
            });
            transaction.check();
            dispatchNavigationEvent(root, "navigation-swap", {
              ...detail,
              meta: navigationMeta,
              streaming: frame.streaming,
            });
            revealEvents(revealed, detail);
            return;
          }

          revealEvents(revealDeferredContent(fragment.content, root), detail);
        },
      });

      transaction.check();
      finalUrl = result.url;
      dispatchNavigationEvent(root, "navigation-complete", {
        id,
        meta: navigationMeta,
        slot: slot ?? null,
        streaming,
        target: root,
        url: result.url,
      });
    } catch (error) {
      if (error.name === "AbortError" || controller.signal.aborted) {
        dispatchNavigationEvent(root, "navigation-abort", {
          ...requestedDetail,
          reason: error,
        });
        throw new DOMException("Navigation cancelled", "AbortError");
      }

      dispatchNavigationEvent(root, "navigation-error", {
        ...requestedDetail,
        error,
        phase: navigationPhase(error),
      });
      fallbackToDocument(
        error.name === "NativeFragmentsCrossOriginRedirectError"
          ? error.url
          : finalUrl,
      );
    } finally {
      transaction.finish();
      if (activeByTarget.get(root) === controller) {
        activeByTarget.delete(root);
        root.removeAttribute("aria-busy");
        root.removeAttribute("data-nativefragments-navigation");
      }
    }
  };

  const navigate = (href, options = {}) => {
    restoringHistory++;
    return navigateInternal(href, options);
  };

  const invalidate = (href, options = {}) => {
    if (destroyed) throw new DOMException("Router lifetime ended", "InvalidStateError");
    loader.invalidate(href === undefined ? undefined : routeTo(href), options);
  };

  const queueIntent = (link) => {
    if (!shouldPrefetchLink(link) || linkPrefetchMode(link, defaultPrefetch) !== "intent") return;
    if (intentTimers.has(link)) return;
    const timer = window.setTimeout(() => {
      intentTimers.delete(link);
      void prefetchFragment(link.href, {
        slot: link.dataset.fragmentSlot || undefined,
      }).catch(() => {});
    }, 65);
    intentTimers.set(link, timer);
  };

  const cancelIntent = (link) => {
    const timer = intentTimers.get(link);
    if (!timer) return;
    window.clearTimeout(timer);
    intentTimers.delete(link);
  };

  document.addEventListener("pointerover", (event) => queueIntent(linkFromEvent(event)), { signal: listeners.signal });
  document.addEventListener("focusin", (event) => queueIntent(linkFromEvent(event)), { signal: listeners.signal });
  document.addEventListener("pointerout", (event) => cancelIntent(linkFromEvent(event)), { signal: listeners.signal });
  document.addEventListener("focusout", (event) => cancelIntent(linkFromEvent(event)), { signal: listeners.signal });

  document.addEventListener("click", (event) => {
    if (!shouldHandleLink(event)) return;
    const link = linkFromEvent(event);
    if (shouldUseDocumentNavigation(link)) return;
    const url = routeTo(link.href);
    if (sameRoute(url) && url.hash) {
      navigation.abortAll();
      restoringHistory++;
      saveCurrentScrollPosition();
      return;
    }
    event.preventDefault();
    void navigate(url, {
      slot: link.dataset.fragmentSlot || undefined,
    }).catch(() => {});
  }, { signal: listeners.signal });

  document.addEventListener("submit", (event) => {
    if (event.defaultPrevented) return;
    const form = formFromEvent(event);
    if (!form) return;
    const submitter = submitterFromEvent(event);
    if (effectiveFormTarget(form, submitter)) return;
    if (effectiveFormMethod(form, submitter) !== "GET") return;
    const url = effectiveFormAction(form, submitter);
    if (url.origin !== window.location.origin) return;
    const search = formDataSearch(form, submitter).toString();
    url.search = search ? `?${search}` : "";
    event.preventDefault();
    void navigate(url, {
      slot: form.dataset.fragmentSlot || undefined,
    }).catch(() => {});
  }, { signal: listeners.signal });

  window.addEventListener("popstate", (event) => {
    const url = new URL(window.location.href);
    const desired = event.state?.nativefragments;
    const revision = ++restoringHistory;
    navigation.abortAll();
    if (fragmentUrl(url) === renderedRoute && (!desired || desired.key === snapshot.key)) {
      if (!restoreScroll(event.state?.scroll) && !scrollToHash(url)) scrollToTop();
      return;
    }
    void (async () => {
      // Reconstruct the full route recipe, not just the last changed slot.
      await navigateInternal(desired?.primary ?? url, { history: "none", userInitiated: false });
      for (const [slot, href] of Object.entries(desired?.slots ?? {})) {
        if (revision !== restoringHistory) return;
        await navigateInternal(href, { slot, history: "none", userInitiated: false });
      }
      if (revision !== restoringHistory) return;
      if (desired) snapshot = desired;
      renderedRoute = fragmentUrl(url);
      if (!restoreScroll(event.state?.scroll) && !scrollToHash(url)) scrollToTop();
    })().catch(() => {});
  }, { signal: listeners.signal });

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    navigation.close();
    listeners.abort();
    visibleObserver?.disconnect();
    for (const timer of intentTimers.values()) window.clearTimeout(timer);
    intentTimers.clear();
    loader.invalidate();
    if (activeRouter === controller) activeRouter = null;
  };

  if (lifetimeSignal) lifetimeSignal.addEventListener("abort", destroy, { once: true });
  bindPrefetch(document);

  const controller = Object.freeze({
    invalidate,
    navigate,
    prefetch: prefetchFragment,
  });
  activeRouter = controller;
  return controller;
};
