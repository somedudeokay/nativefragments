export const sheet = (cssText) => {
  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(cssText);
  return styleSheet;
};

export const shadow = (element, { styles = [], html = "" } = {}) => {
  const root = element.shadowRoot ?? element.attachShadow({ mode: "open" });
  root.adoptedStyleSheets = styles;
  root.innerHTML = html;
  return root;
};
