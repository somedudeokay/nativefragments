import { html, raw } from "@nativefragments/core/server";

const features = [
  "Pure HTML",
  "Isolated styles",
  "Nested routes",
  "Reactive state",
  "Partial rerender",
  "Server-side rendering",
  "Zero dependencies",
];

export const featureList = () => raw(html`<ul
  class="feature-list"
  aria-label="Native Fragments starter features"
>
  ${raw(features.map((feature) => html`<li>${feature}</li>`).join(""))}
</ul>`);
