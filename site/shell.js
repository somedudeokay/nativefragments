import { html, raw } from "../src/server/index.js";

const headLinks = ({ meta }) => html`
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}" />
  <link rel="canonical" href="${meta.canonical}" />
  <link rel="stylesheet" href="/app/styles.css" />
  <script type="module" src="/app/client.js"></script>
`;

export const shell = ({ body, meta }) => html`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="dark light" />
    ${raw(headLinks({ meta }))}
  </head>
  <body>
    <a class="skip-link" href="#content-slot">Skip to content</a>
    <nf-site-header>
      <a href="/">Native Fragments</a>
      <a href="/docs">Docs</a>
      <a href="/examples">Examples</a>
      <a href="/manifesto">Manifesto</a>
    </nf-site-header>
    <main id="content-slot">${raw(body)}</main>
  </body>
</html>`;
