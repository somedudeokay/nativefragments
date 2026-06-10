import { html } from "@nativefragments/core/server";
import { callout, code, docPage } from "./blocks.js";

export const streamingPage = () =>
  docPage({
    eyebrow: "Concepts",
    title: "Streaming",
    intro:
      "Deferred fragments stream a page in two phases on one connection: the shell and loading boundaries flush immediately, then each fragment's completed HTML arrives as soon as its data resolves — out of order, without blocking the others.",
    body: html`
      <h2>One connection, out of order</h2>
      <p>
        A route that waits for slow data normally holds the whole document
        hostage. With deferred streaming, the first chunk on the wire is the
        complete document skeleton — <code>&lt;head&gt;</code>, layout, and a
        loading boundary for every deferred fragment. The connection stays open
        and each fragment streams in when its renderer finishes. A fragment that
        takes two seconds never delays one that takes fifty milliseconds: the
        fastest fragment renders first regardless of the order it was deferred.
      </p>

      <h2>Deferring a fragment</h2>
      <p>
        Define the fragment with a <code>render</code> function and optional
        <code>loading</code> and <code>error</code> renderers, then call
        <code>context.defer(fragment)</code> where its content belongs.
        <code>defer()</code> returns the loading boundary synchronously, so it
        interpolates straight into the route body.
      </p>
      ${code(`import { fragment, html, route } from "@nativefragments/core/server";

const relatedPosts = fragment("related-posts", {
  loading: () => html\`<p class="skeleton">Finding related posts…</p>\`,
  error: () => html\`<p role="status">Related posts are unavailable.</p>\`,
  render: async (context) => {
    const posts = await loadRelated(context.params.slug, {
      signal: context.signal,
    });
    return html\`<ul>
      \${posts.map((post) => html\`<li><a href="\${post.url}">\${post.title}</a></li>\`).join("")}
    </ul>\`;
  },
});

export const postRoute = route("/posts/:slug", {
  render: (context) => html\`<article>
    <h1>…</h1>
    \${context.defer(relatedPosts, { class: "related" })}
  </article>\`,
  fragments: [relatedPosts],
});`)}
      <p>
        The second argument spreads attributes onto the boundary element, which
        carries <code>aria-busy</code> and <code>data-fragment-state</code>
        while loading. Deferred renderers start the moment
        <code>defer()</code> collects them, so data fetches overlap with the
        rest of the route render.
      </p>

      <h2>Loading, errors, and timeouts</h2>
      <p>
        <code>loading()</code> must be synchronous — it ships in the first
        chunk. <code>render()</code> and <code>error()</code> may be async. The
        HTTP status is committed with the first byte, so a fragment that fails
        mid-stream can never turn the page into a 500: it streams its
        <code>error()</code> boundary in place and the rest of the page is
        unaffected.
      </p>
      <p>
        Every deferred fragment has a timeout (default 15 seconds, configurable
        per fragment via <code>timeout</code> or per app via the adapter's
        <code>deferredTimeout</code> option), so a hung data source ends as an
        error boundary instead of a never-finishing response. Pass
        <code>context.signal</code> to <code>fetch</code> so timed-out or
        abandoned requests cancel their network work.
      </p>

      <h2>Streaming shells</h2>
      <p>
        To stream, the adapter needs to know where the route body sits inside
        your <a href="/concepts/shell">shell</a>. A shell that returns
        <code>{ before, after }</code> when called without a <code>body</code>
        makes the split explicit:
      </p>
      ${code(`import { html, raw } from "@nativefragments/core/server";

export const shell = ({ body, meta, nonce }) => {
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
      <p>
        Plain string shells keep working — the adapter locates the body
        automatically. If it cannot (for example the shell escapes
        <code>body</code>), the response falls back to buffered rendering and a
        warning is logged, so streaming never fails silently.
      </p>

      <h2>Fragment navigation is buffered</h2>
      <p>
        Client-side navigation requests (the <code>x-fragment: true</code> path)
        resolve all deferred work on the server and return completed HTML in
        one response. The deferred renderers still run in parallel; only the
        swap waits, because replacing a fragment slot is atomic. Direct visits
        and reloads stream; in-app navigation arrives complete.
      </p>

      <h2>Crawlers and SEO</h2>
      <p>
        Streamed fragments arrive as real, parseable HTML in the same response
        the crawler fetched — not inert templates and not client-side fetches.
        Stream <em>order</em> is invisible to anything that reads the final
        document; a single delegated script (carrying the adapter's CSP nonce)
        moves each fragment into its boundary for visual placement. Crawlability
        is determined by what is in the response, and the full content is in
        the response.
      </p>

      ${callout(
        "See it live",
        "met-gallery.nativefragments.org streams four museum-data fragments out of order on one connection — including one that intentionally fails to show the error boundary. The stream dock in the corner shows each fragment's arrival time.",
      )}

      <h2>See also</h2>
      <ul>
        <li><a href="/concepts/fragments">Fragments</a> — the navigation model deferred fragments build on.</li>
        <li><a href="/concepts/shell">Shell</a> — everything else the shell owns.</li>
        <li><a href="/concepts/api-routes">API Routes</a> — strict Content Security Policy with the per-request nonce.</li>
        <li><a href="/reference#RouteContext">Reference: <code>RouteContext.defer</code></a>, <a href="/reference#FragmentDefinition"><code>FragmentDefinition</code></a>, <a href="/reference#CloudflareHandlerOptions"><code>CloudflareHandlerOptions</code></a>.</li>
      </ul>
    `,
  });
