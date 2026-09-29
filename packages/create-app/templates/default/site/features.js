import { html } from "@nativefragments/core/server";

const features = [
  { name: "Explicit HTML", note: "Readable server output" },
  { name: "Lit islands", note: "SSR + hydration" },
  { name: "Nested routes", note: "Real, crawlable URLs" },
  { name: "Local state", note: "Owned by Lit elements" },
  { name: "Partial rerender", note: "Swap one fragment" },
  { name: "Server-side rendering", note: "Instant first paint" },
  { name: "Modern ESM", note: "Resolved by esbuild" },
];

export const featureList = () =>
  html`<ul
  class="feature-grid"
  aria-label="Native Fragments starter features"
>
  ${features.map(
    (feature) => html`<li>
        <span class="feature-name">${feature.name}</span>
        <span class="feature-note">${feature.note}</span>
      </li>`,
  )}
</ul>`;
