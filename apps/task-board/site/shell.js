import { html } from "@nativefragments/core/server";

export const shell = ({ body, meta }) => html`<!doctype html><html lang="en"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${meta.title || "Fieldwork · Private tasks"}</title><link rel="stylesheet" href="/app/styles.css">
  <script type="module" src="/build/client.js"></script>
</head><body><header class="masthead"><a href="/workspace" class="brand">Fieldwork<span>PRIVATE TASKS</span></a><a href="/login">Open a workspace</a></header>
<main id="content-slot">${body}</main><footer>A Native Fragments example · Your workspace stays separate from everyone else's.</footer></body></html>`;
