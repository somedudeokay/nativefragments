import { shadow, sheet } from "/nativefragments/component.js";

const styles = sheet(`
  :host {
    display: block;
  }

  .map {
    background: #111111;
    border: 1px solid #111111;
    box-shadow: 12px 12px 0 #ff6b35;
    color: #f7f3e8;
    min-height: 430px;
    padding: clamp(1rem, 3vw, 1.5rem);
    position: relative;
  }

  .label {
    border-bottom: 1px solid #f7f3e8;
    color: #1ed760;
    display: flex;
    font-size: 0.75rem;
    font-weight: 800;
    justify-content: space-between;
    padding-bottom: 0.75rem;
    text-transform: uppercase;
  }

  .flow {
    display: grid;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .node {
    border: 1px solid #f7f3e8;
    display: grid;
    gap: 0.4rem;
    padding: 1rem;
  }

  .node strong {
    color: #ffffff;
    font-size: clamp(1.15rem, 3vw, 1.65rem);
    line-height: 1;
  }

  .node span {
    color: #c9c3b5;
    font-size: 0.9rem;
    line-height: 1.45;
  }

  .arrow {
    color: #1ed760;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 1.25rem;
    font-weight: 900;
  }

  .stamp {
    border: 1px solid #1ed760;
    bottom: 1rem;
    color: #1ed760;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.75rem;
    padding: 0.45rem 0.55rem;
    position: absolute;
    right: 1rem;
  }
`);

class RuntimeMap extends HTMLElement {
  connectedCallback() {
    shadow(this, {
      styles: [styles],
      html: `<section class="map" aria-label="Native Fragments request flow">
        <div class="label">
          <span>fragment runtime</span>
          <span>no build</span>
        </div>
        <div class="flow">
          <div class="node">
            <strong>Worker route</strong>
            <span>Match an explicit manifest entry. Render HTML and metadata.</span>
          </div>
          <div class="arrow">↓ x-fragment: true</div>
          <div class="node">
            <strong>Content slot</strong>
            <span>Swap only the page fragment. Keep the document alive.</span>
          </div>
          <div class="arrow">↓ customElements.define()</div>
          <div class="node">
            <strong>Shadow island</strong>
            <span>Native behavior and scoped CSS, with no app-wide style leaks.</span>
          </div>
        </div>
        <div class="stamp">0 deps · 0 build</div>
      </section>`,
    });
  }
}

customElements.define("nf-runtime-map", RuntimeMap);
