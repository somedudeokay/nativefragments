# docs.nativefragments.org

This repo contains the technical documentation site for Native Fragments.

## Structure

- `scripts/generate-api-reference.js`: extracts JSDoc from `@nativefragments/core`.
- `site/generated/api-reference.js`: generated API metadata consumed by pages.
- `site/pages`: docs page renderers.
- `public/llms.txt` and `public/llms-full.txt`: agent-friendly docs entrypoints.

Run `npm run check` before commit or deploy.
