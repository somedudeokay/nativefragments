import { LitElement, css, html, svg } from "lit";

const githubIcon = svg`<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
  <path d="M12 .5a12 12 0 0 0-3.8 23.38c.6.11.82-.26.82-.58v-2.08c-3.34.73-4.04-1.41-4.04-1.41-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.08 1.84 2.82 1.31 3.51 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.45 11.45 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z"/>
</svg>`;

export class NativeFragmentsDocsHeader extends LitElement {
  static styles = css`
    :host { display: block; position: sticky; top: 0; z-index: 10; }
    header { align-items: center; backdrop-filter: blur(18px); background: color-mix(in srgb, var(--paper, #f7f3e8) 82%, transparent); border-bottom: 1px solid var(--line, rgba(20,20,20,.1)); display: flex; justify-content: space-between; min-height: 64px; padding: 0 clamp(1.25rem,5vw,2.5rem); }
    .brand { align-items: center; color: var(--ink, #141414); display: inline-flex; font-family: var(--display, ui-sans-serif); font-size: 1.05rem; font-weight: 600; text-decoration: none; }
    .brand::before { background: var(--green, #1ed760); border-radius: 2px; content: ""; height: .7rem; margin-right: .6rem; transform: rotate(45deg); width: .7rem; }
    nav, .links, .icons, .icon { align-items: center; display: flex; }
    nav { gap: .25rem; } .links { gap: 1rem; } .icons { gap: .2rem; }
    a { border-radius: 8px; color: var(--muted, #5f5a50); font: 500 .88rem var(--sans, ui-sans-serif); padding: .4rem .6rem; text-decoration: none; }
    a:hover, a[aria-current="page"] { background: color-mix(in srgb, var(--ink, #141414) 6%, transparent); color: var(--ink, #141414); }
    .icon { height: 2.1rem; justify-content: center; padding: 0; width: 2.1rem; }
    .icon svg { height: 1.1rem; width: 1.1rem; }
    .npm { border: 1px solid currentColor; border-radius: 5px; font: 600 .6rem var(--mono, monospace); padding: .15rem; }
    @media (max-width: 860px) { nav { display: none; } }
  `;

  render() {
    const links = [
      ["https://docs.nativefragments.org", "Docs", true],
      ["https://nativefragments.org/examples", "Examples", false],
      ["https://nativefragments.org/manifesto", "Manifesto", false],
    ];
    return html`<header>
      <a class="brand" href="https://nativefragments.org/">Native Fragments</a>
      <div class="links">
        <nav aria-label="Primary">${links.map(([href, label, active]) => html`<a href=${href} aria-current=${active ? "page" : null}>${label}</a>`)}</nav>
        <div class="icons" aria-label="Package links">
          <a class="icon" href="https://github.com/somedudeokay/nativefragments" aria-label="GitHub">${githubIcon}</a>
          <a class="icon" href="https://www.npmjs.com/package/@nativefragments/core" aria-label="npm"><span class="npm">npm</span></a>
        </div>
      </div>
    </header>`;
  }
}

customElements.define("nf-site-header", NativeFragmentsDocsHeader);
