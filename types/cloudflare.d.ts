import type { Route } from "./server.d.ts";

export type FetchRouter = {
  fetch(
    request: Request,
    env: Record<string, unknown>,
    context?: unknown,
  ): Response | Promise<Response>;
};

export type CloudflareHandlerOptions = {
  routes: Route[];
  shell(rendered: { body: string; meta: object }): string;
  api?: FetchRouter;
  apiPrefix?: string;
  notFound?: Route;
  assetsBinding?: string;
  fragmentManifest?: boolean;
};

export function createCloudflareHandler(
  options: CloudflareHandlerOptions,
): {
  fetch(
    request: Request,
    env: Record<string, unknown>,
    context?: unknown,
  ): Promise<Response>;
};
