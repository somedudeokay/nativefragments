import { shadow, sheet } from "/nativefragments/component.js";

const counterStyles = `
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
`;

const styles = sheet(counterStyles);

const counterMarkup = (count) =>
  `<button type="button">Count ${count}</button>`;

class AppCounter extends HTMLElement {
  count = 0;

  connectedCallback() {
    this.render();
  }

  render() {
    const root = shadow(this, {
      styles: [styles],
      html: counterMarkup(this.count),
    });

    root.querySelector("button").addEventListener("click", () => {
      this.count += 1;
      this.render();
    });
  }
}

customElements.define("app-counter", AppCounter);
