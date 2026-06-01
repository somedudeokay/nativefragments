import { html, raw } from "@nativefragments/core/server";

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
      <a href="https://docs.nativefragments.org">Docs</a>
      <a href="/examples">Examples</a>
      <a href="/demos">Demos</a>
      <a href="/manifesto">Manifesto</a>
      <a href="https://github.com/somedudeokay/nativefragments">GitHub</a>
      <a href="https://www.npmjs.com/package/@nativefragments/core">npm</a>
    </nf-site-header>
    <main id="content-slot">${raw(body)}</main>
  </body>
</html>`;
