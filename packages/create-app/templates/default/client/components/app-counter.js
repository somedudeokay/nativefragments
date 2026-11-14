import { LitElement, css, html } from "lit";

const storageKey = "nativefragments.demo.clicks";
const cookieName = "nf_demo_clicks";

export class AppCounter extends LitElement {
  static properties = {
    count: { type: Number },
  };

  static styles = css`
    :host { display: block; }
    .panel { background: var(--counter-surface, #161616); border-radius: 20px; color: var(--counter-ink, #f7f3e8); display: grid; gap: 1.2rem; overflow: hidden; padding: clamp(1.2rem,3vw,1.6rem); position: relative; }
    .panel::before { background: linear-gradient(90deg,#1ed760,#ff6b35); content: ""; height: 3px; inset: 0 0 auto; position: absolute; }
    .label { color: #b8b2a4; font: 500 .68rem ui-monospace,monospace; letter-spacing: .14em; text-transform: uppercase; }
    .value { color: var(--counter-accent, #1ed760); margin: 0; font: 600 clamp(4rem,12vw,7rem)/.9 ui-monospace,monospace; }
    p { color: #d7d0c2; margin: 0; max-width: 54ch; }
    .actions { display: flex; flex-wrap: wrap; gap: .65rem; }
    form { margin: 0; }
    /* Form controls do not inherit typography; "inherit" is not valid inside the font shorthand. */
    button { background: var(--counter-accent, #1ed760); border: 0; border-radius: 999px; color: #111; cursor: pointer; font: inherit; font-size: 1rem; font-weight: 700; padding: .75rem 1rem; }
    button.secondary { background: transparent; border: 1px solid rgba(247,243,232,.45); color: var(--counter-ink, #f7f3e8); }
    button:focus-visible { outline: 2px solid var(--counter-ink, #f7f3e8); outline-offset: 3px; }
    .visually-hidden { clip-path: inset(50%); height: 1px; overflow: hidden; position: absolute; white-space: nowrap; width: 1px; }
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

  // Without JavaScript the form posts to the route action, which updates the
  // same cookie and redirects back. Once hydrated, the element handles it locally.
  submit(event) {
    event.preventDefault();
    if (event.submitter?.value === "reset") this.reset();
    else this.increment();
  }

  render() {
    return html`<section class="panel">
      <span class="label">Lit SSR component</span>
      <p class="value" role="status">
        <span aria-hidden="true">${String(this.count).padStart(3, "0").slice(-3)}</span>
        <span class="visually-hidden">Count: ${this.count}</span>
      </p>
      <p>This Shadow DOM was rendered in the Worker and hydrated in place by Lit.</p>
      <form class="actions" method="post" action="/" @submit=${this.submit}>
        <button name="op" value="increment">Increment</button>
        <button name="op" value="reset" class="secondary">Reset</button>
      </form>
    </section>`;
  }
}

customElements.define("app-counter", AppCounter);
