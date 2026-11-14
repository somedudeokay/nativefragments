import { route } from "@nativefragments/core/server";
import { counterAction, counterPage } from "./pages/counter.js";
import {
  nestedPanelFragment,
  nestedRoutePage,
} from "./pages/nested-route.js";

// The canonical URL follows the origin the app is served from. Pin it to your
// production origin here if the app is reachable on more than one host.
const meta = (context, path, title, description) => ({
  canonical: new URL(path, context.url.origin).href,
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
        "A Native Fragments app with streamed HTML and a server-rendered Lit component.",
      ),
    render: counterPage,
    action: counterAction,
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
