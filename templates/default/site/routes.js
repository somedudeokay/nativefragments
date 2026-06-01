import { route } from "@nativefragments/core/server";
import { homePage } from "./pages/home.js";

const origin = "https://example.com";

const meta = (path, title, description) => ({
  canonical: `${origin}${path}`,
  description,
  title,
});

export const routes = [
  route("/", {
    meta: () =>
      meta(
        "/",
        "Native Fragments App",
        "A zero-build Native Fragments app.",
      ),
    render: homePage,
  }),
];
