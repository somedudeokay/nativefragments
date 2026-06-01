import { shadow, sheet } from "/nativefragments/component.js";

const styles = sheet(`
  :host {
    display: inline-block;
  }

  button {
    background: #1ed760;
    border: 1px solid #111111;
    color: #111111;
    cursor: pointer;
    font: inherit;
    font-weight: 800;
    padding: 0.75rem 1rem;
  }
`);

class AppCounter extends HTMLElement {
  count = 0;

  connectedCallback() {
    this.render();
  }

  render() {
    const root = shadow(this, {
      styles: [styles],
      html: `<button type="button">Count ${this.count}</button>`,
    });

    root.querySelector("button").addEventListener("click", () => {
      this.count += 1;
      this.render();
    });
  }
}

customElements.define("app-counter", AppCounter);
