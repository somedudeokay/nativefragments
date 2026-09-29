import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";

const root = resolve(import.meta.dirname, "..");
const temp = await mkdtemp(join(tmpdir(), "nativefragments-packed-"));
const run = (command, args, cwd = root) => execFileSync(command, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });
let mf;
try {
  const tarballs = {};
  for (const name of ["core", "lit", "create-app"]) {
    const [packed] = JSON.parse(run("npm", ["pack", "--json", "--workspace", `packages/${name}`, "--pack-destination", temp]));
    tarballs[name] = join(temp, packed.filename);
    assert.ok(packed.files.every(file => !file.path.includes("node_modules/")));
  }
  const cli = join(temp, "cli");
  await mkdir(cli);
  run("tar", ["-xzf", tarballs["create-app"], "-C", cli]);
  const app = join(temp, "consumer");
  run(process.execPath, [join(cli, "package/bin/create-app.js"), app], temp);
  const manifest = JSON.parse(await readFile(join(app, "package.json"), "utf8"));
  for (const name of ["core", "lit"]) manifest.dependencies[`@nativefragments/${name}`] = `file:${tarballs[name]}`;
  manifest.devDependencies["@nativefragments/create-app"] = `file:${tarballs["create-app"]}`;
  await writeFile(join(app, "package.json"), JSON.stringify(manifest, null, 2));
  run("npm", ["install", "--no-audit", "--no-fund"], app);
  run("npm", ["run", "check"], app);
  await cp(join(root, "tests/types"), join(app, "type-test"), { recursive: true });
  run(process.execPath, [join(root, "node_modules/typescript/bin/tsc"), "-p", "type-test/tsconfig.json"], app);
  mf = new Miniflare(convertV4MiniflareOptions({ modules: true, modulesRoot: app, scriptPath: join(app, ".nativefragments/worker.js"), compatibilityDate: "2026-09-01", compatibilityFlags: ["nodejs_compat"] }));
  const document = await mf.dispatchFetch("https://example.test/");
  assert.equal(document.status, 200);
  assert.match(await document.text(), /shadowrootmode="open"/);
  const response = await mf.dispatchFetch("https://example.test/nested-route", { headers: { "x-fragment": "true", "x-nativefragments-protocol": "2" } });
  assert.equal(response.status, 200);
  assert.match(await response.text(), /data-fragment-meta/);
  console.log("Packed core, Lit and scaffold: clean install, build, strict consumer types and Workers SSR passed.");
} finally {
  try { await mf?.dispose(); }
  finally {
    if (process.env.NF_KEEP_PACKED) console.log(`Packed fixture retained at ${temp}`);
    else await rm(temp, { recursive: true, force: true });
  }
}
