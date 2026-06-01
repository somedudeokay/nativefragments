import { createCloudflareHandler } from "./src/cloudflare/index.js";
import { routes } from "./site/routes.js";
import { shell } from "./site/shell.js";

export default createCloudflareHandler({
  routes,
  shell,
});
