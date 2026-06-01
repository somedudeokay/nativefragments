const defaultSlot = "#content-slot";
let currentController = null;
const cache = new Map();

const fragmentUrl = (url) => `${url.pathname}${url.search}`;

const sameRoute = (url) =>
  url.pathname === window.location.pathname && url.search === window.location.search;

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
};

const fetchFragment = async (url, signal, ttl) => {
  const key = fragmentUrl(url);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) return cached.html;

  const response = await fetch(key, {
    headers: { "x-fragment": "true" },
    signal,
  });
  if (!response.ok) throw new Error(`Fragment request failed: ${response.status}`);

  const html = await response.text();
  cache.set(key, { html, timestamp: Date.now() });
  return html;
};

export const installFragmentNavigation = ({
  slot = defaultSlot,
  ttl = 30_000,
  afterNavigate = () => {},
} = {}) => {
  const root = document.querySelector(slot);
  if (!root) return;

  const navigate = async (href, pushState = true) => {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) {
      window.location.href = url.href;
      return;
    }
    if (pushState && sameRoute(url)) return;

    currentController?.abort();
    currentController = new AbortController();

    try {
      const html = await fetchFragment(url, currentController.signal, ttl);
      const template = document.createElement("template");
      template.innerHTML = html;
      const meta = consumeMeta(template.content);

      if (pushState) history.pushState({}, "", fragmentUrl(url));
      root.replaceChildren(template.content);
      setHead(meta);
      afterNavigate({ meta, url });
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } catch (error) {
      if (error.name !== "AbortError") window.location.href = fragmentUrl(url);
    }
  };

  document.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    const link = event
      .composedPath()
      .find((item) => item instanceof Element && item.matches?.("a[href]"));
    if (!link || link.target || link.hasAttribute("download")) return;

    const url = new URL(link.href);
    if (url.origin !== window.location.origin) return;

    event.preventDefault();
    navigate(fragmentUrl(url));
  });

  window.addEventListener("popstate", () => {
    navigate(fragmentUrl(new URL(window.location.href)), false);
  });

  window.nativeFragmentsNavigate = navigate;
  return navigate;
};
