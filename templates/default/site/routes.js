import { route } from "@nativefragments/core/server";
import { counterPage } from "./pages/counter.js";
import {
  nestedPanelFragment,
  nestedRoutePage,
} from "./pages/nested-route.js";
import { clickCounterMeta } from "./state.js";

const origin = "https://example.com";

const meta = (context, path, title, description) => ({
  canonical: `${origin}${path}`,
  ...clickCounterMeta(context),
  description,
  title,
});

export const routes = [
  route("/", {
    meta: (context) =>
      meta(
        context,
        "/",
        "Counter route - Native Fragments starter",
        "A zero-build Native Fragments app with pure HTML shared state.",
      ),
    render: counterPage,
  }),
  route("/nested-route", {
    fragments: [nestedPanelFragment],
    meta: (context) =>
      meta(
        context,
        "/nested-route",
        "Nested route - Native Fragments starter",
        "A Native Fragments app demonstrating nested pure HTML partial rerenders.",
      ),
    render: nestedRoutePage,
  }),
  route("/nested-route/:panel", {
    fragments: [nestedPanelFragment],
    meta: (context) =>
      meta(
        context,
        context.url.pathname,
        "Nested route - Native Fragments starter",
        "A Native Fragments app demonstrating nested pure HTML partial rerenders.",
      ),
    render: nestedRoutePage,
  }),
];
