import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { prepare } from "./site/auth.js";
import { routes, api } from "./site/routes.js";
import { shell } from "./site/shell.js";

export default createCloudflareHandler({ routes, api, shell, prepare });
