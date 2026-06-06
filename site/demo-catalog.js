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
      "Large-list filtering through the Native Fragments worker RPC helper.",
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
            <a class="demo-open" href="${demo.url}" data-nativefragments-reload>
              Open demo <span aria-hidden="true">→</span>
            </a>
          </div>
        </article>`,
      )
      .join(""),
  );
