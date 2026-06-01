import { shadow, sheet } from "/nativefragments/component.js";

const styles = sheet(`
  :host {
    display: block;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  header {
    align-items: center;
    backdrop-filter: blur(18px);
    background: color-mix(in srgb, #f7f3e8 86%, transparent);
    border-bottom: 1px solid #171717;
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    min-height: 64px;
    padding: 0 1rem;
  }

  .brand {
    align-items: center;
    color: #111111;
    display: inline-flex;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(1.05rem, 3vw, 1.45rem);
    font-weight: 800;
    text-decoration: none;
  }

  .brand::before {
    background: #1ed760;
    border: 1px solid #111111;
    content: "";
    display: inline-block;
    height: 0.75rem;
    margin-right: 0.55rem;
    transform: rotate(45deg);
    width: 0.75rem;
  }

  nav {
    align-items: center;
    display: flex;
    gap: clamp(0.4rem, 2vw, 1rem);
  }

  a {
    color: #111111;
    font-size: 0.82rem;
    font-weight: 800;
    text-decoration: none;
    text-transform: uppercase;
  }

  a[aria-current="page"] {
    background: #111111;
    color: #f7f3e8;
    padding: 0.35rem 0.55rem;
  }

  @media (max-width: 560px) {
    header {
      align-items: flex-start;
      flex-direction: column;
      gap: 0.35rem;
      padding: 0.75rem 1rem;
    }

    nav {
      flex-wrap: wrap;
    }
  }
`);

class NativeFragmentsHeader extends HTMLElement {
  connectedCallback() {
    this.sync();
  }

  sync() {
    const links = [
      { href: "/", label: "Native Fragments" },
      { href: "/docs", label: "Docs" },
      { href: "/examples", label: "Examples" },
      { href: "/demos", label: "Demos" },
      { href: "/manifesto", label: "Manifesto" },
    ];
    const path = window.location.pathname.replace(/\/$/, "") || "/";

    shadow(this, {
      styles: [styles],
      html: `<header>
        <a class="brand" href="/">Native Fragments</a>
        <nav aria-label="Primary">
          ${links
            .slice(1)
            .map(
              ({ href, label }) =>
                `<a href="${href}" ${
                  href === path ? 'aria-current="page"' : ""
                }>${label}</a>`,
            )
            .join("")}
        </nav>
      </header>`,
    });
  }
}

customElements.define("nf-site-header", NativeFragmentsHeader);
