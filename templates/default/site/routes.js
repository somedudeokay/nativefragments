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
        "Counter demo - Native Fragments App",
        "A zero-build Native Fragments app with shared signal state.",
      ),
    render: counterPage,
  }),
  route("/nested-route", {
    fragments: [nestedPanelFragment],
    meta: (context) =>
      meta(
        context,
        "/nested-route",
        "Nested route demo - Native Fragments App",
        "A Native Fragments app demonstrating nested fragment routing.",
      ),
    render: nestedRoutePage,
  }),
];
