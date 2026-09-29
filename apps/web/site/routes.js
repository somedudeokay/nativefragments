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
        "Fast applications. Explicit HTML.",
        "Native Fragments is an HTML application framework for Cloudflare Workers with streamed navigation, native links and forms, and Lit-powered interactive islands.",
      ),
    render: homePage,
  }),
  route("/docs", {
    meta: () =>
      meta(
        "/docs",
        "Docs",
        "Learn the Native Fragments route, shell, streaming fragment, router, and Lit component model.",
      ),
    render: docsPage,
  }),
  route("/examples", {
    meta: () =>
      meta(
        "/examples",
        "Examples",
        "Explore deployed Native Fragments HTML applications built for Cloudflare Workers.",
      ),
    render: examplesPage,
  }),
  route("/demos", {
    meta: () =>
      meta(
        "/demos",
        "Demos",
        "Inspect complete Native Fragments demos with streamed HTML and modern ESM tooling.",
      ),
    render: demosPage,
  }),
  route("/manifesto", {
    meta: () =>
      meta(
        "/manifesto",
        "Manifesto",
        "The Native Fragments goals: explicit HTML, native navigation, small framework contracts, fast work, and fast web applications.",
      ),
    render: manifestoPage,
  }),
];
