import { apiRoute, createApi } from "@nativefragments/core/server";

export const api = createApi([
  apiRoute("GET", "/api/health", () => ({
    ok: true,
    name: "__APP_NAME__",
  })),
]);
