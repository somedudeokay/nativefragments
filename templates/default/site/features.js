import { html, raw } from "@nativefragments/core/server";

const features = [
  { name: "Pure HTML", note: "Readable, no build step" },
  { name: "Isolated styles", note: "Scoped with Shadow DOM" },
  { name: "Nested routes", note: "Real, crawlable URLs" },
  { name: "Reactive state", note: "Signals, opt-in" },
  { name: "Partial rerender", note: "Swap one fragment" },
  { name: "Server-side rendering", note: "Instant first paint" },
  { name: "Zero dependencies", note: "Just the platform" },
];

export const featureList = () =>
  raw(html`<ul
  class="feature-grid"
  aria-label="Native Fragments starter features"
>
  ${raw(
    features
      .map(
        (feature) => html`<li>
        <span class="feature-name">${feature.name}</span>
        <span class="feature-note">${feature.note}</span>
      </li>`,
      )
      .join(""),
  )}
</ul>`);
