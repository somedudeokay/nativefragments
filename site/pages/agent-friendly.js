import { html } from "@nativefragments/core/server";
import { callout, code, docPage } from "./blocks.js";

export const agentFriendlyPage = () =>
  docPage({
    eyebrow: "Concepts",
    title: "Agent-Friendly Apps",
    intro:
      "Native Fragments apps are easy for AI agents to read and operate for the same reasons they are easy for people: real URLs, server-rendered HTML, and no client-only state.",
    body: html`
      <p>
        An agent browsing your app sees what a browser sees on the first
        response — not a blank shell waiting for a bundle to boot. That falls
        out of the architecture, not a special mode.
      </p>

      <h2>Why it works</h2>
      <ul>
        <li>
          Every route is a real <code>GET</code> URL rendered by
          <a href="/reference#route"><code>route</code></a>, so any page can be
          fetched directly.
        </li>
        <li>
          Content is in the initial HTML. There is no
          “wait for JavaScript” step before the text exists.
        </li>
        <li>
          Navigation uses real <code>&lt;a href&gt;</code> links. Fragment
          requests are an enhancement; the same route still returns a full page.
        </li>
        <li>
          Components expose ordinary DOM that agents can inspect, even when
          styling lives in Shadow DOM.
        </li>
      </ul>

      <h2>Patterns to keep</h2>
      <p>
        Return meaningful metadata from each route's
        <a href="/reference#RouteMeta"><code>meta</code></a> so titles, links,
        and descriptions are accurate.
      </p>
      ${code(`// site/pages/blog.js
import { html, route } from "@nativefragments/core/server";

export const post = route("/blog/:slug", {
  meta: (ctx) => ({
    title: ctx.params.slug,
    description: "A post on the Native Fragments blog.",
    canonical: \`https://example.com/blog/\${ctx.params.slug}\`,
  }),
  render: (ctx) => html\`<article><h1>\${ctx.params.slug}</h1></article>\`,
});`)}

      <h2>Anti-patterns to avoid</h2>
      <ul>
        <li>Content that only appears after a client fetch.</li>
        <li>State that exists only in memory, with no URL to reach it.</li>
        <li>Buttons that navigate via JavaScript instead of real links.</li>
      </ul>
      ${callout(
        "Note",
        "If a region updates via a fragment request, make sure its route still renders a complete page for a direct visit. The same render runs in both modes.",
      )}

      <h2>See also</h2>
      <ul>
        <li><a href="/ai">AI Docs</a> — machine-readable entrypoints for agents.</li>
        <li><a href="/concepts/routing">Routing</a> — real URLs and metadata.</li>
      </ul>
    `,
  });
