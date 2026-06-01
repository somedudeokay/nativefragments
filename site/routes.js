import { route } from "@nativefragments/core/server";
import { aiPage } from "./pages/ai.js";
import { componentsPage } from "./pages/components.js";
import { fragmentsPage } from "./pages/fragments.js";
import { gettingStartedPage } from "./pages/getting-started.js";
import { homePage } from "./pages/home.js";
import { referencePage } from "./pages/reference.js";
import { routingPage } from "./pages/routing.js";

const origin = "https://docs.nativefragments.org";

const meta = (path, title, description) => ({
  canonical: `${origin}${path}`,
  description,
  title: `${title} · Native Fragments Docs`,
});

export const routes = [
  route("/", {
    meta: () =>
      meta("/", "Introduction", "Technical documentation for Native Fragments."),
    render: homePage,
  }),
  route("/getting-started", {
    meta: () =>
      meta(
        "/getting-started",
        "Getting Started",
        "Create and run a Native Fragments app.",
      ),
    render: gettingStartedPage,
  }),
  route("/concepts/routing", {
    meta: () =>
      meta("/concepts/routing", "Routing", "Native Fragments route concepts."),
    render: routingPage,
  }),
  route("/concepts/fragments", {
    meta: () =>
      meta(
        "/concepts/fragments",
        "Fragments",
        "How fragment navigation works in Native Fragments.",
      ),
    render: fragmentsPage,
  }),
  route("/concepts/components", {
    meta: () =>
      meta(
        "/concepts/components",
        "Components",
        "Custom Elements and Shadow DOM component patterns.",
      ),
    render: componentsPage,
  }),
  route("/concepts/agent-friendly", {
    meta: () =>
      meta(
        "/concepts/agent-friendly",
        "Agent-Friendly Applications",
        "Why Native Fragments output is easy for agents to inspect and maintain.",
      ),
    render: aiPage,
  }),
  route("/reference", {
    meta: () =>
      meta(
        "/reference",
        "API Reference",
        "Generated API reference for Native Fragments Core.",
      ),
    render: referencePage,
  }),
  route("/ai", {
    meta: () =>
      meta(
        "/ai",
        "AI Docs",
        "Agent entrypoints and llms.txt files for Native Fragments.",
      ),
    render: aiPage,
  }),
];
