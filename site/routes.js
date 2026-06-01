import { route } from "../src/server/index.js";
import { docsPage } from "./pages/docs.js";
import { examplesPage } from "./pages/examples.js";
import { homePage } from "./pages/home.js";
import { manifestoPage } from "./pages/manifesto.js";

const origin = "https://native-fragments.dev";

const meta = (path, title, description) => ({
  canonical: `${origin}${path}`,
  description,
  title: `${title} · Native Fragments`,
});

export const routes = [
  route("/", {
    meta: () =>
      meta(
        "/",
        "Zero build web framework for agents",
        "Native Fragments is a zero-dependency, zero-build frontend framework for AI agents and Cloudflare Workers.",
      ),
    render: homePage,
  }),
  route("/docs", {
    meta: () =>
      meta(
        "/docs",
        "Docs",
        "Learn the Native Fragments route, shell, fragment, and Shadow DOM component model.",
      ),
    render: docsPage,
  }),
  route("/examples", {
    meta: () =>
      meta(
        "/examples",
        "Examples",
        "Copy minimal Native Fragments examples for routes, components, and optional browser tests.",
      ),
    render: examplesPage,
  }),
  route("/manifesto", {
    meta: () =>
      meta(
        "/manifesto",
        "Manifesto",
        "The Native Fragments goals: zero dependencies, zero build, blazing fast, built for agents, zero maintenance, free to deploy, infinite scale.",
      ),
    render: manifestoPage,
  }),
];
