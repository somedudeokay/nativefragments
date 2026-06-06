# docs.nativefragments.org

This repo contains the technical documentation site for Native Fragments.

## Structure

- `scripts/generate-api-reference.js`: extracts JSDoc from `@nativefragments/core`.
- `site/generated/api-reference.js`: generated API metadata consumed by pages.
- `site/pages`: docs page renderers.
- `public/llms.txt` and `public/llms-full.txt`: agent-friendly docs entrypoints.

Run `npm run check` before commit or deploy.

## Rendering Preference

For visible custom elements, prefer server-rendered declarative Shadow DOM and
hydrate with `shadow()` on the client. Empty client-only custom element shells
are a FOUC and layout-shift risk, especially in examples that agents may copy.

Keep shared component HTML and CSS in modules that can be imported by both
server renderers and browser components when the initial markup must match.
