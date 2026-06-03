import { html, raw } from "@nativefragments/core/server";
import { criticalStyles } from "./critical-styles.js";
import { siteHeader } from "./header.js";

const headLinks = ({ meta }) => html`
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}" />
    <meta name="google-site-verification" content="JjtSSqZr2dhqfTA7wWejjridMsTwUuGDTKPBdIRdBl4" />
  <link rel="canonical" href="${meta.canonical}" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <script>
    document.documentElement.classList.add("js");
  </script>
  <style>${raw(criticalStyles)}</style>
  <link
    rel="preload"
    href="/app/styles.css"
    as="style"
    onload="this.onload=null;this.rel='stylesheet'"
  />
  <noscript><link rel="stylesheet" href="/app/styles.css" /></noscript>
  <script type="module" src="/app/client.js"></script>
`;

const activePath = (canonical) =>
  canonical?.startsWith("http") ? new URL(canonical).pathname : (canonical ?? "/");

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
    ${siteHeader({ activePath: activePath(meta.canonical) })}
    <main id="content-slot">${raw(body)}</main>
  </body>
</html>`;
