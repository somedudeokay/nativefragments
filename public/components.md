# Components

> Native Fragments uses Custom Elements and Shadow DOM for client-side islands.

```js
import { shadow, sheet } from "/nativefragments/component.js";

const styles = sheet(`
  button {
    border: 1px solid currentColor;
  }
`);

class CounterButton extends HTMLElement {
  connectedCallback() {
    shadow(this, {
      styles: [styles],
      html: `<button type="button">0</button>`,
    });
  }
}

customElements.define("counter-button", CounterButton);
```

Each component owns its DOM and styles. Shared variables can still come from normal CSS custom properties.

