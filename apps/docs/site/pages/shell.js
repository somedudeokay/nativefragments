import { html } from "@nativefragments/core/server";
import { callout, code, docPage } from "./blocks.js";

export const shellPage = () =>
  docPage({
    eyebrow: "Concepts",
    title: "Shell",
    intro:
      "The shell is the one function that wraps every route body in a full HTML document. It owns the head, the persistent chrome, and the content slot — everything that survives navigation.",
    body: html`
      <h2>What the shell owns</h2>
      <p>
        A route renders the part of the page that changes. The shell renders
        everything around it: the doctype, the <code>&lt;head&gt;</code> built
        from route metadata, stylesheets and scripts, persistent chrome like
        the site header, and the slot the body lands in. It runs once per
        document request — fragment navigation swaps the slot's content and
        leaves the rest of the shell untouched.
      </p>

      <h2>A minimal shell</h2>
      <p>
        A shell is a plain function from <code>{ body, meta, nonce }</code> to a
        document string. Interpolate <code>body</code> with
        <a href="/reference#raw"><code>raw</code></a> — it is already rendered,
        escaped HTML.
      </p>
      ${code(`// site/shell.js
import { html, raw } from "@nativefragments/core/server";

export const shell = ({ body, meta }) => html\`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>\${meta.title}</title>
    <meta name="description" content="\${meta.description}" />
    <link rel="canonical" href="\${meta.canonical}" />
    <link rel="stylesheet" href="/app/styles.css" />
    <script type="module" src="/app/client.js"></script>
  </head>
  <body>
    <header>…site chrome…</header>
    <main id="content-slot">\${raw(body)}</main>
  </body>
</html>\`;`)}

      <h2>The content slot</h2>
      <p>
        <code>#content-slot</code> is the default target for
        <a href="/concepts/fragments">fragment navigation</a>: link clicks fetch
        the next route's body and replace the slot's children. Anything outside
        the slot persists across navigation — the header stays mounted,
        components in the chrome keep their state, and module scope survives.
        That is why persistent UI belongs in the shell, not in route bodies.
      </p>

      <h2>Metadata</h2>
      <p>
        <code>meta</code> arrives normalized from the route's
        <a href="/concepts/routing"><code>meta()</code></a> function —
        <code>title</code>, <code>description</code>, and
        <code>canonical</code> always exist (empty string or the pathname when
        unset). On fragment navigation the browser router updates the document
        head from the fragment response, so the shell's head markup stays
        correct without re-rendering.
      </p>

      <h2>Streaming shells</h2>
      <p>
        For <a href="/concepts/streaming">streamed documents</a> the adapter
        needs the document split around the body. Return
        <code>{ before, after }</code> when called without a <code>body</code>;
        keep the string form for everything else.
      </p>
      ${code(`export const shell = ({ body, meta, nonce }) => {
  const parts = {
    before: html\`<!doctype html>
<html lang="en">
  <head><title>\${meta.title}</title></head>
  <body><main id="content-slot">\`,
    after: html\`</main></body></html>\`,
  };
  if (body === undefined) return parts;
  return html\`\${raw(parts.before)}\${raw(body)}\${raw(parts.after)}\`;
};`)}
      ${callout(
        "Good to know",
        "Plain string shells stream too — the adapter finds the body's position automatically. If it can't (for example the shell escapes body), the response falls back to buffered rendering and a warning is logged.",
      )}

      <h2>The CSP nonce</h2>
      <p>
        The Cloudflare adapter passes a per-request <code>nonce</code>. Put it
        on inline scripts and styles with
        <a href="/reference#attrs"><code>attrs</code></a> if you enable a strict
        <a href="/concepts/api-routes"><code>contentSecurityPolicy</code></a> —
        the framework's own streaming bootstrap uses the same nonce.
      </p>
      ${code(`export const shell = ({ body, meta, nonce }) => html\`<!doctype html>
<html lang="en">
  <head>
    <title>\${meta.title}</title>
    <script\${attrs({ nonce })}>
      document.documentElement.classList.add("js");
    </script>
  </head>
  <body><main id="content-slot">\${raw(body)}</main></body>
</html>\`;`)}

      <h2>See also</h2>
      <ul>
        <li><a href="/concepts/routing">Routing</a> — where <code>meta</code> comes from.</li>
        <li><a href="/concepts/fragments">Fragments</a> — how the content slot is swapped.</li>
        <li><a href="/concepts/streaming">Streaming</a> — the full streamed-document model.</li>
        <li><a href="/reference#CloudflareHandlerOptions">Reference: <code>CloudflareHandlerOptions</code></a>, <a href="/reference#raw"><code>raw</code></a>, <a href="/reference#attrs"><code>attrs</code></a>.</li>
      </ul>
    `,
  });
