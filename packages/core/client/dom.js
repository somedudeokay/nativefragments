let policy;

// One pass-through Trusted Types policy for framework sinks. Fragment HTML is a
// same-origin text/html response and worker URLs are application-authored, so
// the policy adds no sanitization; it lets apps enforce
// `require-trusted-types-for 'script'` with `trusted-types nativefragments`.
const trustedPolicy = () => {
  if (policy !== undefined) return policy;
  policy = null;
  try {
    policy = globalThis.trustedTypes?.createPolicy("nativefragments", {
      createHTML: (value) => value,
      createScriptURL: (value) => value,
    }) ?? null;
  } catch {
    // The page's CSP does not allow this policy name; sinks receive strings.
  }
  return policy;
};

/** @private */
export const trustedHtml = (html) => trustedPolicy()?.createHTML(html) ?? html;

/** @private */
export const trustedScriptUrl = (url) =>
  trustedPolicy()?.createScriptURL(String(url)) ?? url;

// Build shadow roots while the fragment is inert, before custom elements connect.
// Moving these nodes preserves SSR identity; cloning would drop non-clonable roots.
const materializeShadows = (root) => {
  for (const template of root.querySelectorAll("template[shadowrootmode]")) {
    const host = template.parentElement;
    const mode = template.getAttribute("shadowrootmode");
    if (!host || (mode !== "open" && mode !== "closed")) continue;
    try {
      const shadow = host.attachShadow({
        mode,
        delegatesFocus: template.hasAttribute("shadowrootdelegatesfocus"),
        clonable: template.hasAttribute("shadowrootclonable"),
        serializable: template.hasAttribute("shadowrootserializable"),
      });
      materializeShadows(template.content);
      shadow.append(template.content);
      template.remove();
    } catch {
      // Hosts that cannot attach a shadow root keep their original template.
    }
  }
};

export const parseHtml = (html) => {
  const template = document.createElement("template");
  const markup = trustedHtml(html);
  if (typeof template.setHTMLUnsafe === "function") {
    // The parser attaches declarative shadow roots itself, keeping every flag.
    template.setHTMLUnsafe(markup);
  } else {
    template.innerHTML = markup;
    materializeShadows(template.content);
  }
  return template.content;
};

/**
 * Move a parsed or connected source's children into a target. Connected nodes
 * use moveBefore() where available so iframes, animations and custom element
 * state survive the reveal.
 * @private
 */
export const adoptChildren = (source, target) => {
  if (
    source.isConnected && target.isConnected && !target.contains(source) &&
    typeof target.moveBefore === "function"
  ) {
    try {
      target.replaceChildren();
      while (source.firstChild) target.moveBefore(source.firstChild, null);
      return;
    } catch {
      // Fall through to remove-and-insert for nodes that cannot be moved.
    }
  }
  const fragment = document.createDocumentFragment();
  while (source.firstChild) fragment.appendChild(source.firstChild);
  target.replaceChildren(fragment);
};
