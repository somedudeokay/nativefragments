import { html } from "@nativefragments/core/server";
import { callout, code, docPage } from "./blocks.js";

export const componentsPage = () =>
  docPage({
    eyebrow: "Concepts",
    title: "Components",
    intro:
      "A component is a Custom Element that renders into a Shadow DOM. Styles stay scoped to the element, and you can ship the shadow root in server HTML so it never flashes unstyled.",
    body: html`
      <p>
        Native Fragments adds two browser helpers —
        <a href="/reference#shadow"><code>shadow</code></a> and
        <a href="/reference#sheet"><code>sheet</code></a> — plus the server
        helper <a href="/reference#declarativeShadow"><code>declarativeShadow</code></a>.
        Everything else is the platform: <code>customElements.define</code>,
        <code>HTMLElement</code>, and adopted stylesheets.
      </p>

      <h2>A minimal component</h2>
      <p>
        Define a Custom Element and call
        <a href="/reference#shadow"><code>shadow</code></a> in
        <code>connectedCallback</code>. It attaches an open shadow root, adopts
        your stylesheets, and sets the inner HTML.
      </p>
      ${code(`// public/app/components/reading-progress.js
import { shadow, sheet } from "/nativefragments/component.js";

const styles = sheet(\`
  :host { display: block; height: 3px; background: #eee; }
  .bar { height: 100%; width: var(--progress, 0%); background: #1ed760; }
\`);

class ReadingProgress extends HTMLElement {
  connectedCallback() {
    // Scoped CSS + markup, isolated from the page.
    shadow(this, { styles: [styles], html: \`<div class="bar"></div>\` });
  }
}

customElements.define("reading-progress", ReadingProgress);`)}
      <p>
        Use it like any element: <code>&lt;reading-progress&gt;&lt;/reading-progress&gt;</code>.
        The <code>.bar</code> class can never collide with page CSS.
      </p>

      <h2>Sharing styles with sheet()</h2>
      <p>
        <a href="/reference#sheet"><code>sheet</code></a> builds a
        <code>CSSStyleSheet</code> once and returns it. Create it at module
        scope so every instance adopts the <em>same</em> stylesheet object
        instead of re-parsing CSS per element.
      </p>
      ${code(`// One stylesheet, shared by every <reading-progress> on the page.
const styles = sheet(\`:host { display: block }\`);`)}

      <h2>Server-rendered components</h2>
      <p>
        Render the shadow root on the server with
        <a href="/reference#declarativeShadow"><code>declarativeShadow</code></a>.
        It emits a <code>&lt;template shadowrootmode="open"&gt;</code> the
        browser upgrades before your module loads, so there is no flash of
        unstyled content.
      </p>
      ${code(`// site/pages/article.js — on the server
import { declarativeShadow, html } from "@nativefragments/core/server";

export const article = () => html\`<reading-progress>
  \${declarativeShadow({
    styles: [\`:host { display: block } .bar { background: #1ed760 }\`],
    html: \`<div class="bar"></div>\`,
  })}
</reading-progress>\`;`)}
      <p>
        Pair it with the same <a href="/reference#shadow"><code>shadow</code></a>
        call on the client. On first upgrade <code>shadow</code> preserves the
        server-rendered root instead of replacing it.
      </p>
      ${callout(
        "Good to know",
        "shadow() also materializes declarative shadow templates that arrive during a fragment swap, so server-rendered components keep working after client navigation.",
      )}

      <h2>Hydration across fragment navigation</h2>
      <p>
        Fragment responses are inserted as HTML, which does not activate
        declarative shadow templates on its own.
        <a href="/reference#shadow"><code>shadow</code></a> handles this for you:
        with <code>hydrate</code> left on (the default), it adopts the existing
        root the first time the element upgrades and only writes
        <code>html</code> when there is nothing to preserve.
      </p>
      ${code(`shadow(this, { styles: [styles], html: markup });        // hydrate: true (default)
shadow(this, { styles: [styles], html: markup, hydrate: false }); // always overwrite`)}

      <h2>See also</h2>
      <ul>
        <li><a href="/concepts/fragments">Fragments</a> — how components survive partial navigation.</li>
        <li><a href="/concepts/signals">Signals</a> — add local reactive state inside a component.</li>
        <li><a href="/reference#shadow">Reference: <code>shadow</code></a>, <a href="/reference#sheet"><code>sheet</code></a>, <a href="/reference#declarativeShadow"><code>declarativeShadow</code></a>.</li>
      </ul>
    `,
  });
