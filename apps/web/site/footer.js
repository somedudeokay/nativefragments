import { html, raw } from "@nativefragments/core/server";

const groups = [
  {
    title: "Docs",
    links: [
      { href: "https://docs.nativefragments.org/getting-started", label: "Getting started" },
      { href: "https://docs.nativefragments.org/concepts/streaming", label: "Streaming" },
      { href: "https://docs.nativefragments.org/reference", label: "API reference" },
      { href: "https://docs.nativefragments.org/ai", label: "AI docs" },
    ],
  },
  {
    title: "Project",
    links: [
      { href: "https://github.com/somedudeokay/nativefragments", label: "GitHub" },
      { href: "https://www.npmjs.com/package/@nativefragments/core", label: "npm" },
      { href: "/examples", label: "Examples" },
      { href: "/manifesto", label: "Manifesto" },
    ],
  },
  {
    title: "Agents",
    links: [
      { href: "/agents.txt", label: "agents.txt", reload: true },
      { href: "https://docs.nativefragments.org/llms.txt", label: "llms.txt" },
      { href: "https://docs.nativefragments.org/llms-full.txt", label: "llms-full.txt" },
    ],
  },
];

const footerLink = ({ href, label, reload }) =>
  html`<li><a href="${href}"${reload ? raw(" data-nativefragments-reload") : ""}>${label}</a></li>`;

const footerGroup = ({ title, links }) => html`<nav class="footer-group" aria-label="${title}">
  <p class="footer-title">${title}</p>
  <ul>
    ${raw(links.map(footerLink).join(""))}
  </ul>
</nav>`;

export const siteFooter = () => html`<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <p class="footer-mark">Native Fragments</p>
      <p class="footer-line">
        A zero-dependency web framework that streams server-rendered HTML from
        the edge. This site is built with it.
      </p>
    </div>
    ${raw(groups.map(footerGroup).join(""))}
  </div>
  <div class="footer-meta">
    <p>MIT licensed.</p>
    <p>Runs on Cloudflare Workers. No build step was harmed — or used.</p>
  </div>
</footer>`;
