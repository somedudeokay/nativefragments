import assert from "node:assert/strict";
import test from "node:test";
import { LitElement, css, html } from "lit";
import { renderLit } from "../server.js";

class NativeFragmentsLitTest extends LitElement {
  static properties = { name: {} };
  static styles = css`:host { color: green; }`;

  render() {
    return html`<strong>Hello ${this.name}</strong>`;
  }
}

customElements.define("nativefragments-lit-test", NativeFragmentsLitTest);

test("renderLit emits declarative Shadow DOM and hydration markers", async () => {
  const rendered = String(
    await renderLit(html`<nativefragments-lit-test name="Worker"></nativefragments-lit-test>`),
  );

  assert.match(rendered, /<nativefragments-lit-test/);
  assert.match(rendered, /<template shadowroot/);
  assert.match(rendered, /Hello/);
  assert.match(rendered, /Worker/);
  assert.match(rendered, /<!--lit-part/);
});
