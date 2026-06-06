import { shadow, sheet } from "/nativefragments/component.js";

// <docs-search> — zero-dependency ⌘K command palette for the docs. Lazily loads
// the static search index (built by scripts/generate-search-index.js), scores
// pages + sections against the query, and deep-links to a heading via the
// fragment router when available (falling back to a normal navigation).

const styles = sheet(`
  :host { display: contents; }

  .overlay {
    align-items: flex-start;
    background: color-mix(in srgb, var(--ink, #141414) 38%, transparent);
    backdrop-filter: blur(4px);
    display: flex;
    inset: 0;
    justify-content: center;
    padding: clamp(3rem, 12vh, 9rem) 1rem 1rem;
    position: fixed;
    z-index: 100;
  }

  .overlay[hidden] { display: none; }

  .dialog {
    animation: pop 0.16s var(--ease, ease) both;
    background: var(--surface, #fffdf6);
    border: 1px solid var(--line-strong, rgba(20, 20, 20, 0.24));
    border-radius: var(--radius-lg, 20px);
    box-shadow: var(--shadow-lg, 0 30px 60px -20px rgba(20, 20, 20, 0.3));
    display: flex;
    flex-direction: column;
    max-height: min(70vh, 34rem);
    overflow: hidden;
    width: min(640px, 100%);
  }

  @keyframes pop {
    from { opacity: 0; transform: translateY(-8px) scale(0.99); }
    to { opacity: 1; transform: none; }
  }

  .field {
    align-items: center;
    border-bottom: 1px solid var(--line, rgba(20, 20, 20, 0.1));
    display: flex;
    gap: 0.6rem;
    padding: 0.85rem 1rem;
  }

  .field svg { color: var(--muted, #5f5a50); flex: none; height: 1.05rem; width: 1.05rem; }

  input {
    background: transparent;
    border: 0;
    color: var(--ink, #141414);
    flex: 1;
    font-family: var(--sans, sans-serif);
    font-size: 1rem;
    min-width: 0;
    outline: none;
  }

  input::placeholder { color: color-mix(in srgb, var(--muted, #5f5a50) 80%, transparent); }

  kbd {
    background: color-mix(in srgb, var(--ink, #141414) 5%, transparent);
    border: 1px solid var(--line, rgba(20, 20, 20, 0.1));
    border-radius: 6px;
    color: var(--muted, #5f5a50);
    font-family: var(--mono, monospace);
    font-size: 0.62rem;
    line-height: 1;
    padding: 0.22rem 0.36rem;
  }

  .results { overflow-y: auto; padding: 0.4rem; }

  .group + .group { margin-top: 0.25rem; }

  .group-label {
    color: var(--muted, #5f5a50);
    font-family: var(--mono, monospace);
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    padding: 0.55rem 0.7rem 0.3rem;
    text-transform: uppercase;
  }

  .item {
    align-items: baseline;
    border-radius: 10px;
    color: var(--ink, #141414);
    cursor: pointer;
    display: flex;
    gap: 0.6rem;
    justify-content: space-between;
    padding: 0.55rem 0.7rem;
    text-decoration: none;
  }

  .item .label { font-size: 0.95rem; font-weight: 500; }
  .item .ctx { color: var(--muted, #5f5a50); font-size: 0.78rem; }
  .item.section .label { color: var(--muted, #5f5a50); font-weight: 500; }
  .item.section .label::before {
    color: var(--green, #1ed760);
    content: "#";
    margin-right: 0.4rem;
  }

  .item[aria-selected="true"] {
    background: color-mix(in srgb, var(--green, #1ed760) 16%, transparent);
  }

  .empty { color: var(--muted, #5f5a50); font-size: 0.92rem; padding: 1.5rem 0.7rem; text-align: center; }

  .foot {
    border-top: 1px solid var(--line, rgba(20, 20, 20, 0.1));
    color: var(--muted, #5f5a50);
    display: flex;
    font-size: 0.72rem;
    gap: 1rem;
    padding: 0.55rem 0.85rem;
  }

  .foot span { align-items: center; display: inline-flex; gap: 0.35rem; }

  @media (max-width: 560px) { .foot { display: none; } }
`);

const SEARCH_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m21 21-4.3-4.3"></path></svg>`;

const TEMPLATE = `<div class="overlay" hidden>
  <div class="dialog" role="dialog" aria-modal="true" aria-label="Search documentation">
    <label class="field">
      ${SEARCH_ICON}
      <input type="search" placeholder="Search the docs…" aria-label="Search documentation" autocomplete="off" spellcheck="false" />
      <kbd>Esc</kbd>
    </label>
    <div class="results" role="listbox"></div>
    <div class="foot">
      <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
      <span><kbd>↵</kbd> Open</span>
      <span><kbd>esc</kbd> Close</span>
    </div>
  </div>
</div>`;

const escape = (value) =>
  String(value).replace(/[&<>"]/g, (char) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char],
  );

class DocsSearch extends HTMLElement {
  connectedCallback() {
    const root = shadow(this, { styles: [styles], html: TEMPLATE });
    if (this._wired) return;
    this._wired = true;

    this.index = null;
    this.flat = []; // flat list of selectable { path, id } for keyboard nav
    this.active = 0;

    this.overlay = root.querySelector(".overlay");
    this.input = root.querySelector("input");
    this.list = root.querySelector(".results");

    this.input.addEventListener("input", () => this.render());
    this.input.addEventListener("keydown", (event) => this.onKeydown(event));
    this.overlay.addEventListener("mousedown", (event) => {
      if (event.target === this.overlay) this.close();
    });
    this.list.addEventListener("mousedown", (event) => {
      const item = event.target.closest(".item");
      if (!item) return;
      event.preventDefault();
      this.go(item.dataset.path, item.dataset.id || "");
    });

    this._onGlobalKey = (event) => {
      const cmdK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (cmdK) {
        event.preventDefault();
        this.isOpen() ? this.close() : this.open();
        return;
      }
      if (event.key === "Escape" && this.isOpen()) this.close();
    };
    document.addEventListener("keydown", this._onGlobalKey);

    this._onTrigger = (event) => {
      if (event.target.closest("[data-search-trigger]")) {
        event.preventDefault();
        this.open();
      }
    };
    document.addEventListener("click", this._onTrigger);
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this._onGlobalKey);
    document.removeEventListener("click", this._onTrigger);
  }

  isOpen() {
    return !this.overlay.hasAttribute("hidden");
  }

  async open() {
    this.overlay.removeAttribute("hidden");
    document.documentElement.style.overflow = "hidden";
    await this.load();
    this.input.value = "";
    this.render();
    this.input.focus();
  }

  close() {
    this.overlay.setAttribute("hidden", "");
    document.documentElement.style.overflow = "";
  }

  async load() {
    if (this.index) return;
    try {
      const response = await fetch("/app/search-index.json");
      this.index = response.ok ? await response.json() : [];
    } catch {
      this.index = [];
    }
  }

  score(query, page) {
    const q = query.toLowerCase();
    const inTitle = page.title.toLowerCase().includes(q);
    const inIntro = page.intro.toLowerCase().includes(q);
    const inText = page.text.toLowerCase().includes(q);
    const headings = page.headings.filter((heading) =>
      heading.text.toLowerCase().includes(q),
    );
    let score = 0;
    if (inTitle) score += 100;
    if (headings.length) score += 40;
    if (inIntro) score += 20;
    if (inText) score += 10;
    return { score, headings };
  }

  results() {
    const pages = this.index ?? [];
    const query = this.input.value.trim();

    if (!query) {
      return pages.map((page) => ({ page, headings: [] }));
    }

    return pages
      .map((page) => ({ page, ...this.score(query, page) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => ({ page: entry.page, headings: entry.headings.slice(0, 4) }));
  }

  render() {
    const groups = this.results();
    this.flat = [];

    if (!groups.length) {
      this.list.innerHTML = `<p class="empty">No results for “${escape(this.input.value.trim())}”.</p>`;
      return;
    }

    const html = groups
      .map(({ page, headings }) => {
        const pageIndex = this.flat.length;
        this.flat.push({ path: page.path });
        const pageItem = `<a class="item" role="option" data-index="${pageIndex}" data-path="${escape(page.path)}" href="${escape(page.path)}">
          <span class="label">${escape(page.title)}</span>
          <span class="ctx">${escape(page.eyebrow || "Docs")}</span>
        </a>`;

        const sectionItems = headings
          .map((heading) => {
            const index = this.flat.length;
            this.flat.push({ path: page.path, id: heading.id });
            return `<a class="item section" role="option" data-index="${index}" data-path="${escape(page.path)}" data-id="${escape(heading.id)}" href="${escape(page.path)}#${escape(heading.id)}">
              <span class="label">${escape(heading.text)}</span>
            </a>`;
          })
          .join("");

        return `<div class="group">
          <p class="group-label">${escape(page.eyebrow || "Docs")}</p>
          ${pageItem}${sectionItems}
        </div>`;
      })
      .join("");

    this.list.innerHTML = html;
    this.active = 0;
    this.highlight();
  }

  highlight() {
    const items = [...this.list.querySelectorAll(".item")];
    items.forEach((item, index) => {
      const selected = index === this.active;
      item.setAttribute("aria-selected", selected ? "true" : "false");
      if (selected) item.scrollIntoView({ block: "nearest" });
    });
  }

  onKeydown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      this.active = Math.min(this.active + 1, this.flat.length - 1);
      this.highlight();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      this.active = Math.max(this.active - 1, 0);
      this.highlight();
    } else if (event.key === "Enter") {
      event.preventDefault();
      const target = this.flat[this.active];
      if (target) this.go(target.path, target.id || "");
    }
  }

  async go(path, id) {
    this.close();
    const current = window.location.pathname.replace(/\/$/, "") || "/";

    const scrollToHeading = () => {
      if (!id) {
        window.scrollTo({ top: 0 });
        return;
      }
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    if (path === current) {
      scrollToHeading();
      return;
    }

    const navigate = window.__nfNavigate;
    if (typeof navigate === "function") {
      await navigate(path);
      scrollToHeading();
    } else {
      window.location.href = id ? `${path}#${id}` : path;
    }
  }
}

if (!customElements.get("docs-search")) {
  customElements.define("docs-search", DocsSearch);
}
