import { LitElement, css, html } from "lit";

const storageKey = "nativefragments.demo.clicks";
const cookieName = "nf_demo_clicks";

export class AppCounter extends LitElement {
  static properties = {
    count: { type: Number },
  };

  static styles = css`
    :host { display: block; }
    .panel { background: #161616; border-radius: 20px; color: #f7f3e8; display: grid; gap: 1.2rem; overflow: hidden; padding: clamp(1.2rem,3vw,1.6rem); position: relative; }
    .panel::before { background: linear-gradient(90deg,#1ed760,#ff6b35); content: ""; height: 3px; inset: 0 0 auto; position: absolute; }
    .label { color: #b8b2a4; font: 500 .68rem ui-monospace,monospace; letter-spacing: .14em; text-transform: uppercase; }
    .value { color: #1ed760; font: 600 clamp(4rem,12vw,7rem)/.9 ui-monospace,monospace; }
    p { color: #d7d0c2; margin: 0; max-width: 54ch; }
    .actions { display: flex; flex-wrap: wrap; gap: .65rem; }
    button { background: #1ed760; border: 0; border-radius: 999px; color: #111; cursor: pointer; font: 700 1rem inherit; padding: .75rem 1rem; }
    button.secondary { background: transparent; border: 1px solid rgba(247,243,232,.22); color: #f7f3e8; }
  `;

  constructor() {
    super();
    this.count = 0;
  }

  persist() {
    try { localStorage.setItem(storageKey, String(this.count)); } catch {}
    document.cookie = `${cookieName}=${encodeURIComponent(String(this.count))}; path=/; max-age=31536000; SameSite=Lax`;
  }

  increment() {
    this.count += 1;
    this.persist();
  }

  reset() {
    this.count = 0;
    this.persist();
  }

  render() {
    return html`<section class="panel">
      <span class="label">Lit SSR component</span>
      <strong class="value">${String(this.count).padStart(3, "0").slice(-3)}</strong>
      <p>This Shadow DOM was rendered in the Worker and hydrated in place by Lit.</p>
      <div class="actions">
        <button type="button" @click=${this.increment}>Increment</button>
        <button type="button" class="secondary" @click=${this.reset}>Reset</button>
      </div>
    </section>`;
  }
}

customElements.define("app-counter", AppCounter);
