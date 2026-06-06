import { html, jsonScript, raw } from "@nativefragments/core/server";
import { appHeader } from "./header.js";

const fontHref =
  "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&family=Space+Grotesk:wght@600;700&display=swap";

const faviconHref =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23f7f3e8'/%3E%3Crect x='18' y='18' width='28' height='28' rx='6' fill='%231ed760' transform='rotate(45 32 32)'/%3E%3C/svg%3E";

const activePath = (canonical) =>
  canonical?.startsWith("http") ? new URL(canonical).pathname : (canonical ?? "/");

const clickCount = (meta) => Number(meta.clickCount ?? 0);

export const shell = ({ body, meta }) => html`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}" />
    <link rel="canonical" href="${meta.canonical}" />
    <meta name="color-scheme" content="light" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="icon" href="${faviconHref}" />
    <link rel="stylesheet" href="${fontHref}" />
    <link rel="stylesheet" href="/app/styles.css" />
    <script>
      window.__NATIVEFRAGMENTS_STATE__ = ${raw(
        jsonScript({ clickCount: clickCount(meta) }),
      )};
    </script>
    <script type="module" src="/app/client.js"></script>
  </head>
  <body>
    ${appHeader({
      activePath: activePath(meta.canonical),
      clickCount: clickCount(meta),
    })}
    <main id="content-slot">${raw(body)}</main>
  </body>
</html>`;
