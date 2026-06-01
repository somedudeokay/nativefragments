import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { routes } from "./site/routes.js";
import { shell } from "./site/shell.js";

const app = createCloudflareHandler({
  routes,
  shell,
});

export default {
  fetch(request, env, context) {
    const url = new URL(request.url);

    if (url.hostname === "www.nativefragments.org") {
      return Response.redirect(
        `https://nativefragments.org${url.pathname}${url.search}`,
        301,
      );
    }

    if (url.pathname === "/docs" || url.pathname.startsWith("/docs/")) {
      const pathname = url.pathname === "/docs" ? "/" : url.pathname.slice(5);
      return Response.redirect(
        `https://docs.nativefragments.org${pathname}${url.search}`,
        301,
      );
    }

    return app.fetch(request, env, context);
  },
};
