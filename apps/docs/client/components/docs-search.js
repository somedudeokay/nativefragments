import { LitElement, html as lit, unsafeCSS } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { searchPages } from "../../site/search-score.js";

// <docs-search> — zero-dependency ⌘K command palette for the docs. Lazily loads
// the static search index (built by scripts/generate-search-index.js), scores
// pages + sections against the query, and deep-links to a heading via the
// fragment router when available (falling back to a normal navigation).

const searchStyles = `
  :host { display: contents; }

  dialog {
    background: transparent;
    border: 0;
    color: inherit;
    margin: clamp(3rem, 12vh, 9rem) auto auto;
    max-height: none;
    max-width: calc(100% - 2rem);
    outline: 0;
    overscroll-behavior: contain;
    padding: 0;
    width: min(640px, 100%);
  }

  input[type="search"]::-webkit-search-cancel-button { display: none; }

  dialog::backdrop {
    backdrop-filter: blur(4px);
    background: color-mix(in srgb, var(--ink, #141414) 38%, transparent);
    overscroll-behavior: contain;
  }

  .panel {
    background: var(--surface, #fffdf6);
    border: 1px solid var(--line-strong, rgba(20, 20, 20, 0.24));
    border-radius: var(--radius-lg, 20px);
    box-shadow: var(--shadow-lg, 0 30px 60px -20px rgba(20, 20, 20, 0.3));
    display: flex;
    flex-direction: column;
    max-height: min(70vh, 34rem);
    overflow: hidden;
  }

  @media (prefers-reduced-motion: no-preference) {
    dialog[open] .panel { animation: pop 0.16s var(--ease, ease) both; }
  }

  @keyframes pop {
    from { opacity: 0; transform: translateY(-8px) scale(0.99); }
    to { opacity: 1; transform: none; }
  }

  .field {
    align-items: center;
    border-bottom: 1px solid var(--line, rgba(20, 20, 20, 0.1));
    border-radius: var(--radius-lg, 20px) var(--radius-lg, 20px) 0 0;
    display: flex;
    gap: 0.6rem;
    padding: 0.6rem 0.6rem 0.6rem 1rem;
  }

  .field:has(input:focus-visible) {
    outline: 2px solid var(--ink, #141414);
    outline-offset: -2px;
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
    outline: none; /* the indicator is drawn on .field */
    padding: 0.35rem 0;
  }

  input::placeholder { color: var(--muted, #5f5a50); }

  form { display: contents; }

  .close {
    align-items: center;
    background: color-mix(in srgb, var(--ink, #141414) 5%, transparent);
    border: 1px solid var(--line, rgba(20, 20, 20, 0.1));
    border-radius: 8px;
    color: var(--muted, #5f5a50);
    cursor: pointer;
    display: inline-flex;
    flex: none;
    font-family: var(--sans, sans-serif);
    font-size: 0.78rem;
    font-weight: 500;
    gap: 0.4rem;
    min-height: 2rem;
    padding: 0.25rem 0.55rem;
  }

  .close:hover { color: var(--ink, #141414); }

  .close:focus-visible {
    outline: 2px solid var(--ink, #141414);
    outline-offset: 2px;
  }

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

  .close kbd { background: transparent; border: 0; padding: 0; }

  .visually-hidden {
    clip-path: inset(50%);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }

  .results { overflow-y: auto; overscroll-behavior: contain; padding: 0.4rem; }
  .results:empty { display: none; }

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
    color: #137a37;
    content: "#";
    content: "#" / "";
    margin-right: 0.4rem;
  }

  .item[aria-selected="true"] {
    background: color-mix(in srgb, var(--green, #1ed760) 16%, transparent);
  }

  @media (forced-colors: active) {
    .item[aria-selected="true"] {
      outline: 2px solid Highlight;
      outline-offset: -2px;
    }
  }

  .empty { color: var(--muted, #5f5a50); font-size: 0.92rem; margin: 0; padding: 1.5rem 0.7rem; text-align: center; }
  .empty:empty { display: none; }

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
`;

const SEARCH_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m21 21-4.3-4.3"></path></svg>`;

const TEMPLATE = `<dialog aria-label="Search documentation">
  <div class="panel">
    <div class="field">
      ${SEARCH_ICON}
      <input type="search" placeholder="Search the docs…" aria-label="Search documentation" role="combobox" aria-expanded="false" aria-controls="search-results" aria-autocomplete="list" autocomplete="off" spellcheck="false" autofocus />
      <form method="dialog"><button class="close" type="submit">Close <kbd aria-hidden="true">Esc</kbd></button></form>
    </div>
    <p class="visually-hidden" role="status"></p>
    <div class="results" id="search-results" role="listbox" aria-label="Search results"></div>
    <p class="empty"></p>
    <div class="foot" aria-hidden="true">
      <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
      <span><kbd>↵</kbd> Open</span>
      <span><kbd>esc</kbd> Close</span>
    </div>
  </div>
</dialog>`;

const escape = (value) =>
  String(value).replace(/[&<>"]/g, (char) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char],
  );

class DocsSearch extends LitElement {
  static styles = unsafeCSS(searchStyles);

  render() {
    return lit`${unsafeHTML(TEMPLATE)}`;
  }

  connectedCallback() {
    super.connectedCallback();
    void this.updateComplete.then(() => this.wire());
  }

  wire() {
    if (this._wired) return;
    this._wired = true;

    const root = this.renderRoot;

    this.index = null;
    this.flat = []; // flat list of selectable { path, id } for keyboard nav
    this.active = 0;

    this.dialog = root.querySelector("dialog");
    this.input = root.querySelector("input");
    this.list = root.querySelector(".results");
    this.empty = root.querySelector(".empty");
    this.status = root.querySelector('[role="status"]');

    this.input.addEventListener("input", () => this.renderResults());
    this.input.addEventListener("keydown", (event) => this.onKeydown(event));
    // A click that lands on the dialog itself is a click on the backdrop.
    this.dialog.addEventListener("click", (event) => {
      if (event.target === this.dialog) this.close();
    });
    this.list.addEventListener("click", (event) => {
      const item = event.target.closest(".item");
      if (!item) return;
      // Leave modified clicks (new tab, etc.) to the browser.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      this.go(item.dataset.path, item.dataset.id || "");
    });

    this._onGlobalKey = (event) => {
      const cmdK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (!cmdK) return;
      event.preventDefault();
      this.isOpen() ? this.close() : this.open();
    };
    document.addEventListener("keydown", this._onGlobalKey);

    // Triggers are links to /search, so they work before (or without) this
    // script. Capture so the fragment router sees the click as handled.
    this._onTrigger = (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!event.target.closest?.("[data-search-trigger]")) return;
      event.preventDefault();
      this.open();
    };
    document.addEventListener("click", this._onTrigger, true);

    // Any navigation that starts while the palette is open closes it.
    this._onNavigation = () => this.close();
    document.addEventListener("nativefragments:navigation-start", this._onNavigation);
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this._onGlobalKey);
    document.removeEventListener("click", this._onTrigger, true);
    document.removeEventListener("nativefragments:navigation-start", this._onNavigation);
    clearTimeout(this._statusTimer);
    this._wired = false;
    super.disconnectedCallback();
  }

  isOpen() {
    return this.dialog.open;
  }

  async open() {
    if (this.isOpen()) return;
    this.input.value = "";
    // Focus first so keystrokes typed while the index loads are kept.
    this.dialog.showModal();
    this.input.focus();
    this.renderResults();
    if (!this.index) {
      await this.load();
      if (this.isOpen()) this.renderResults();
    }
  }

  close() {
    // dialog.close() returns focus to the element that opened it.
    if (this.isOpen()) this.dialog.close();
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

  announce(message) {
    clearTimeout(this._statusTimer);
    this._statusTimer = setTimeout(() => {
      this.status.textContent = message;
    }, 500);
  }

  renderResults() {
    const query = this.input.value.trim();
    this.flat = [];
    this.active = 0;

    if (!this.index) {
      this.list.innerHTML = "";
      this.empty.textContent = "Loading search…";
      this.syncCombobox();
      return;
    }

    const groups = searchPages(this.index, query);

    if (!groups.length) {
      this.list.innerHTML = "";
      this.empty.textContent = `No results for “${query}”.`;
      this.syncCombobox();
      this.announce(`No results for ${query}.`);
      return;
    }

    this.empty.textContent = "";
    const html = groups
      .map(({ page, headings }, groupIndex) => {
        const pageIndex = this.flat.length;
        this.flat.push({ path: page.path });
        const pageItem = `<a class="item" role="option" tabindex="-1" id="search-option-${pageIndex}" data-path="${escape(page.path)}" href="${escape(page.path)}">
          <span class="label">${escape(page.title)}</span>
          <span class="ctx" aria-hidden="true">${escape(page.eyebrow || "Docs")}</span>
        </a>`;

        const sectionItems = headings
          .map((heading) => {
            const index = this.flat.length;
            this.flat.push({ path: page.path, id: heading.id });
            return `<a class="item section" role="option" tabindex="-1" id="search-option-${index}" data-path="${escape(page.path)}" data-id="${escape(heading.id)}" href="${escape(page.path)}#${escape(heading.id)}">
              <span class="label">${escape(heading.text)}</span>
            </a>`;
          })
          .join("");

        return `<div class="group" role="group" aria-labelledby="search-group-${groupIndex}">
          <div class="group-label" id="search-group-${groupIndex}">${escape(page.eyebrow || "Docs")}</div>
          ${pageItem}${sectionItems}
        </div>`;
      })
      .join("");

    this.list.innerHTML = html;
    this.highlight();
    if (query) {
      const count = this.flat.length;
      this.announce(`${count} ${count === 1 ? "result" : "results"}.`);
    } else {
      this.announce("");
    }
  }

  syncCombobox() {
    const has = this.flat.length > 0;
    this.input.setAttribute("aria-expanded", has ? "true" : "false");
    if (has) {
      this.input.setAttribute("aria-activedescendant", `search-option-${this.active}`);
    } else {
      this.input.removeAttribute("aria-activedescendant");
    }
  }

  highlight() {
    const items = [...this.list.querySelectorAll(".item")];
    items.forEach((item, index) => {
      const selected = index === this.active;
      item.setAttribute("aria-selected", selected ? "true" : "false");
      if (selected) item.scrollIntoView({ block: "nearest" });
    });
    this.syncCombobox();
  }

  onKeydown(event) {
    // Enter that confirms an IME composition must not open a result. keyCode
    // 229 covers Safari, which fires keydown after compositionend.
    if (event.isComposing || event.keyCode === 229) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      this.active = Math.min(this.active + 1, Math.max(this.flat.length - 1, 0));
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

    if (path === current) {
      if (!id) {
        window.scrollTo({ top: 0 });
        return;
      }
      // Same page: a native hash navigation scrolls, sets :target and focus
      // start point, and records history. CSS decides whether it is smooth.
      if (window.location.hash === `#${id}`) {
        document.getElementById(id)?.scrollIntoView();
      } else {
        window.location.hash = id;
      }
      return;
    }

    const href = id ? `${path}#${id}` : path;
    try {
      const { router } = await import("../navigation.js");
      await router.navigate(href);
    } catch (error) {
      if (error?.name !== "AbortError") window.location.href = href;
    }
  }
}

if (!customElements.get("docs-search")) {
  customElements.define("docs-search", DocsSearch);
}
