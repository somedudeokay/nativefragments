import { html } from "@nativefragments/core/server";
import { code, docPage } from "./blocks.js";

export const componentsPage = () =>
  docPage({
    eyebrow: "Concepts",
    title: "Components are native islands.",
    intro:
      "Use Custom Elements for behavior and Shadow DOM for scoped CSS. Global CSS stays small and page-oriented.",
    body: html`
      <h2>Shadow helper</h2>
      ${code(`import { shadow, sheet } from "/nativefragments/component.js";

const styles = sheet(\`
  :host { display: block; }
\`);

class AppCard extends HTMLElement {
  connectedCallback() {
    shadow(this, {
      styles: [styles],
      html: \`<article><slot></slot></article>\`
    });
  }
}

customElements.define("app-card", AppCard);`)}
    `,
  });
