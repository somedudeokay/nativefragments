import "@nativefragments/lit/client";
import { LitElement, html } from "lit";

class TestIsland extends LitElement {
  createRenderRoot() {
    const root = super.createRenderRoot();
    this.serverButton = root.querySelector("button");
    return root;
  }
  render() { return html`<button @click=${() => this.setAttribute("clicked", "yes")}>Server button</button>`; }
}
if (!customElements.get("test-island")) customElements.define("test-island", TestIsland);
