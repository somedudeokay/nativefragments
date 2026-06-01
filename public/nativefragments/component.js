/**
 * Create a constructable stylesheet for Shadow DOM components.
 *
 * @param {string} cssText CSS source.
 * @returns {CSSStyleSheet} Constructable stylesheet.
 */
export const sheet = (cssText) => {
  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(cssText);
  return styleSheet;
};

/**
 * @typedef {object} ShadowOptions
 * @property {CSSStyleSheet[]} [styles=[]] Constructable stylesheets to adopt.
 * @property {string} [html=""] Shadow root HTML.
 */

/**
 * Attach or reuse an open shadow root, adopt stylesheets, and set its HTML.
 *
 * @param {HTMLElement} element Custom element receiving the shadow root.
 * @param {ShadowOptions} [options={}] Shadow render options.
 * @returns {ShadowRoot} The element's shadow root.
 */
export const shadow = (element, { styles = [], html = "" } = {}) => {
  const root = element.shadowRoot ?? element.attachShadow({ mode: "open" });
  root.adoptedStyleSheets = styles;
  root.innerHTML = html;
  return root;
};
