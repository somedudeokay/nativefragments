import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { faviconSvg } from "./site/favicon.js";
import { routes } from "./site/routes.js";
import { shell } from "./site/shell.js";

const app = createCloudflareHandler({
  routes,
  shell,
});

export default {
  fetch(request, env, context) {
    const url = new URL(request.url);

    if (url.pathname === "/favicon.ico" || url.pathname === "/favicon.svg") {
      return new Response(faviconSvg, {
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
          "Content-Type": "image/svg+xml; charset=utf-8",
        },
      });
    }

    return app.fetch(request, env, context);
  },
};
