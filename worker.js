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
      url.hostname = "nativefragments.org";
      return Response.redirect(url.toString(), 301);
    }

    return app.fetch(request, env, context);
  },
};
