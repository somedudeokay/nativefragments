import { html, raw } from "@nativefragments/core/server";

export const demos = [
  {
    slug: "analytics-dashboard",
    title: "Analytics Dashboard",
    summary:
      "Server-rendered metrics with hydrated Shadow DOM filters and deterministic table summaries.",
    url: "https://analytics-dashboard.nativefragments.org",
  },
  {
    slug: "nested-routes",
    title: "Nested Routes",
    summary:
      "A settings workspace with parent navigation, child panels, and named fragment slots.",
    url: "https://nested-routes.nativefragments.org",
  },
  {
    slug: "todo-app",
    title: "Todo App",
    summary:
      "Local-first task state, form handling, filters, and a small custom element island.",
    url: "https://todo-app.nativefragments.org",
  },
  {
    slug: "theme-switcher",
    title: "Theme Switcher",
    summary:
      "CSS custom properties shared across document styles and server-rendered Shadow DOM.",
    url: "https://theme-switcher.nativefragments.org",
  },
  {
    slug: "signal-counter",
    title: "Signal Counter",
    summary:
      "Reactive counter state and derived values without a build step or virtual DOM.",
    url: "https://signal-counter.nativefragments.org",
  },
  {
    slug: "worker-search",
    title: "Worker Search",
    summary:
      "Search and sort 45,716 NASA meteorite landing records in a browser Worker.",
    url: "https://worker-search.nativefragments.org",
  },
  {
    slug: "worker-api",
    title: "Worker API",
    summary:
      "Native Worker JSON endpoints and server-rendered pages from the same deployment.",
    url: "https://worker-api.nativefragments.org",
  },
  {
    slug: "form-wizard",
    title: "Form Wizard",
    summary:
      "Multi-step progressive forms with real links, resumable state, and review output.",
    url: "https://form-wizard.nativefragments.org",
  },
  {
    slug: "activity-feed",
    title: "Activity Feed",
    summary:
      "Operational feed filters, fragment refreshes, and stable server-rendered timelines.",
    url: "https://activity-feed.nativefragments.org",
  },
  {
    slug: "content-site",
    title: "Content Site",
    summary:
      "Metadata-rich article routes, a compact index, and fast document-style navigation.",
    url: "https://content-site.nativefragments.org",
  },
  {
    slug: "command-palette",
    title: "Command Palette",
    summary:
      "Keyboard interaction, scoped Shadow DOM styling, and platform-native command search.",
    url: "https://command-palette.nativefragments.org",
  },
];

const tags = ["Cloudflare Worker", "Native Fragments", "Zero build"];

const repoBase =
  "https://github.com/somedudeokay/nativefragments-examples/tree/main/apps";

const webIcon = `<svg class="demo-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="12" cy="12" r="9" />
  <path d="M3 12h18" />
  <path d="M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18" />
</svg>`;

const githubIcon = `<svg class="demo-action-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
</svg>`;

export const demoRows = () =>
  raw(
    demos
      .map(
        (demo, index) => html`<article class="demo-row">
          <a class="demo-shot-link" href="${demo.url}" data-nativefragments-reload>
            <img
              alt="${demo.title} screenshot"
              class="demo-shot"
              height="832"
              loading="eager"
              src="/app/screenshots/${demo.slug}.webp"
              width="1280"
            />
          </a>
          <div class="demo-row-copy">
            <p class="demo-kicker">Demo ${String(index + 1).padStart(2, "0")}</p>
            <h2><a href="${demo.url}" data-nativefragments-reload>${demo.title}</a></h2>
            <p>${demo.summary}</p>
            <ul class="demo-tags">
              ${raw(tags.map((tag) => html`<li>${tag}</li>`).join(""))}
            </ul>
            <div class="demo-actions">
              <a
                class="demo-action demo-action--demo"
                href="${demo.url}"
                data-nativefragments-reload
              >
                ${raw(webIcon)} Open demo
              </a>
              <a
                class="demo-action demo-action--code"
                href="${repoBase}/${demo.slug}"
                target="_blank"
                rel="noopener noreferrer"
              >
                ${raw(githubIcon)} View code
              </a>
            </div>
          </div>
        </article>`,
      )
      .join(""),
  );
