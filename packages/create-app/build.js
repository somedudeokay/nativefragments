import { mkdir, readFile, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { build } from "esbuild";

/** Build standard ESM entries; optional workers are explicit package.json entries. */
export const buildApp = async ({ root = process.cwd(), production = process.env.WRANGLER_COMMAND === "deploy" || process.env.NODE_ENV === "production" } = {}) => {
  const manifest = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
  const workers = manifest.nativefragments?.workers ?? {};
  await mkdir(resolve(root, ".nativefragments"), { recursive: true });
  // This directory contains generated assets only; stale maps/worker entries
  // must not survive into the next deployment.
  await rm(resolve(root, "public/build"), { recursive: true, force: true });
  await mkdir(resolve(root, "public/build"), { recursive: true });
  const shared = { bundle: true, format: "esm", legalComments: "none", logLevel: "info", minify: production, sourcemap: production ? false : "linked", target: "es2022" };
  const browserEntries = { client: "client/index.js", ...workers };
  for (const name of Object.keys(browserEntries)) {
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) throw new TypeError(`Invalid browser entry name: ${name}`);
  }
  await Promise.all([
    build({ ...shared, conditions: ["node"], entryPoints: [resolve(root, "worker.js")], outfile: resolve(root, ".nativefragments/worker.js"), platform: "node" }),
    ...Object.entries(browserEntries).map(([name, entry]) => build({ ...shared, entryPoints: [resolve(root, entry)], outfile: resolve(root, `public/build/${name}.js`), platform: "browser" })),
  ]);
};
