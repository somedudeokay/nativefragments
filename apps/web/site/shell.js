import { attrs, html, raw } from "@nativefragments/core/server";
import { criticalStyles } from "./critical-styles.js";
import { siteFooter } from "./footer.js";
import { siteHeader } from "./header.js";

const headLinks = ({ meta, nonce }) => html`
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}" />
    <meta name="google-site-verification" content="JjtSSqZr2dhqfTA7wWejjridMsTwUuGDTKPBdIRdBl4" />
  <link rel="canonical" href="${meta.canonical}" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="preload" href="/app/fonts/bricolage-grotesque-700.woff2" as="font" type="font/woff2" crossorigin />
  <script${attrs({ nonce })}>
    document.documentElement.classList.add("js");
  </script>
  <style${attrs({ nonce })}>${raw(criticalStyles)}</style>
  <link rel="stylesheet" href="/app/styles.css" />
  <script${attrs({ nonce })} type="module" src="/app/client.js"></script>
`;

const activePath = (canonical) =>
  canonical?.startsWith("http") ? new URL(canonical).pathname : (canonical ?? "/");

export const shell = ({ body, meta, nonce }) => html`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="dark light" />
    ${raw(headLinks({ meta, nonce }))}
  </head>
  <body>
    <a class="skip-link" href="#content-slot">Skip to content</a>
    ${siteHeader({ activePath: activePath(meta.canonical) })}
    <main id="content-slot">${raw(body)}</main>
    ${raw(siteFooter())}
  </body>
</html>`;
