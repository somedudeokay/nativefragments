# nativefragments.org

The website is a Native Fragments application built from server HTML, the
browser router, and Lit custom elements.

## Structure

- `worker.js`: Cloudflare Worker entry.
- `site`: routes, shell, page renderers, and server helpers.
- `client`: hydration, router startup, and Lit elements.
- `public/app`: static CSS, fonts, images, and machine-readable docs.
- `public/build`: generated browser output; do not edit.

Server-render visible Lit elements with `renderLit()` and import
`@nativefragments/lit/client` before their definitions in the browser bundle.
Keep the value proposition focused on fast, explicit HTML applications. Do not
deploy unless explicitly requested.
