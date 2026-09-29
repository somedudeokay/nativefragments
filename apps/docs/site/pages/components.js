import { html } from "@nativefragments/core/server";
import { callout, code, docPage } from "./blocks.js";

export const componentsPage = () =>
  docPage({
    eyebrow: "Concepts",
    title: "Lit Components",
    intro:
      "Interactive regions are ordinary Lit custom elements. @nativefragments/lit renders them on the server and installs Lit's hydration support in the browser.",
    body: html`
      <h2>Define an element</h2>
      ${code(`// client/components/app-counter.js
import { LitElement, css, html } from "lit";

export class AppCounter extends LitElement {
  static properties = { count: { type: Number } };
  static styles = css\`
    :host { display: block }
    button { font: inherit }
  \`;

  constructor() {
    super();
    this.count = 0;
  }

  render() {
    return html\`
      <output>\${this.count}</output>
      <button @click=\${() => this.count += 1}>Increment</button>
    \`;
  }
}

customElements.define("app-counter", AppCounter);`)}

      <h2>Render it on the Worker</h2>
      ${code(`// site/pages/counter.js
import { renderLit } from "@nativefragments/lit/server";
import { html } from "lit";
import "../../client/components/app-counter.js";

export const counterPage = () =>
  renderLit(html\`<app-counter count="4"></app-counter>\`);`)}
      <p>
        <a href="/reference#renderLit"><code>renderLit</code></a> returns trusted
        server HTML containing Lit hydration markers and Declarative Shadow
        DOM. Route and shell renderers may therefore be asynchronous.
      </p>

      <h2>Hydrate in the browser</h2>
      ${code(`// client/index.js
import "@nativefragments/lit/client";
import "./components/app-counter.js";`)}
      <p>
        Import hydration support before the element definitions. Lit attaches
        event listeners to the server-rendered tree instead of replacing the
        first paint.
      </p>

      ${callout(
        "Adapter boundary",
        "Application components import from lit. Only server integration imports @nativefragments/lit/server. This keeps @lit-labs/ssr and its DOM shim out of core and behind a small replaceable contract.",
      )}

      <h2>State belongs to the element</h2>
      <p>
        Use Lit properties and normal JavaScript state for local interaction.
        Put durable state in your Worker, database, URL, or browser storage as
        appropriate. Native Fragments no longer ships a second reactive-state
        abstraction beside Lit.
      </p>

      <h2>Fragment navigation</h2>
      <p>
        Lit elements can arrive in any streamed fragment frame. Once inserted,
        the browser upgrades and hydrates them through the same registered
        custom element definition. Persistent elements outside the navigation
        target remain mounted.
      </p>

      <h2>See also</h2>
      <ul>
        <li><a href="/concepts/fragments">Fragments</a> — target and swap regions.</li>
        <li><a href="/concepts/streaming">Streaming</a> — components arriving in deferred frames.</li>
        <li><a href="/reference#renderLit">Reference: <code>renderLit</code></a>.</li>
      </ul>
    `,
  });
