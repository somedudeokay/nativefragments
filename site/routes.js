import { route } from "@nativefragments/core/server";
import { demosPage } from "./pages/demos.js";
import { docsPage } from "./pages/docs.js";
import { examplesPage } from "./pages/examples.js";
import { homePage } from "./pages/home.js";
import { manifestoPage } from "./pages/manifesto.js";

const origin = "https://nativefragments.org";

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
        "Zero build web framework built for agents",
        "Native Fragments is a zero-dependency, zero-build frontend framework for agents building AI-friendly applications.",
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
        "Explore deployed Native Fragments demo applications built as small Cloudflare Worker packages.",
      ),
    render: examplesPage,
  }),
  route("/demos", {
    meta: () =>
      meta(
        "/demos",
        "Demos",
        "Inspect complete Native Fragments demos built with almost zero dependencies.",
      ),
    render: demosPage,
  }),
  route("/manifesto", {
    meta: () =>
      meta(
        "/manifesto",
        "Manifesto",
        "The Native Fragments goals: zero dependencies, zero build, blazing fast, built for agents, AI-friendly applications, zero maintenance, free to deploy, infinite scale.",
      ),
    render: manifestoPage,
  }),
];
