// Build shadow roots while the fragment is inert, before custom elements connect.
// Moving these nodes preserves SSR identity; cloning would drop non-clonable roots.
const materializeShadows = (root) => {
  for (const template of root.querySelectorAll("template[shadowrootmode]")) {
    const host = template.parentElement;
    const mode = template.getAttribute("shadowrootmode");
    if (!host || (mode !== "open" && mode !== "closed")) continue;
    try {
      const shadow = host.attachShadow({ mode, delegatesFocus: template.hasAttribute("shadowrootdelegatesfocus") });
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
  template.innerHTML = html;
  materializeShadows(template.content);
  return template.content;
};
