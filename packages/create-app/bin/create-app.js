#!/usr/bin/env node
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templateDir = path.resolve(__dirname, "../templates/default");

const toPackageName = (target) => {
  const base = path.basename(path.resolve(target));
  return base
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "nativefragments-app";
};

const copyTemplate = async (source, destination, replacements) => {
  const info = await stat(source);

  if (info.isDirectory()) {
    await mkdir(destination, { recursive: true });
    const entries = await readdir(source);
    for (const entry of entries) {
      await copyTemplate(
        path.join(source, entry),
        path.join(destination, entry),
        replacements,
      );
    }
    return;
  }

  const text = await readFile(source, "utf8");
  const rendered = Object.entries(replacements).reduce(
    (output, [key, value]) => output.replaceAll(key, value),
    text,
  );
  await writeFile(destination, rendered);
};

const ensureEmptyTarget = async (target) => {
  await mkdir(target, { recursive: true });
  const entries = await readdir(target);
  const visibleEntries = entries.filter((entry) => entry !== ".DS_Store");
  if (visibleEntries.length > 0) {
    throw new Error(`${target} is not empty.`);
  }
};

const main = async () => {
  const target = process.argv[2] ?? ".";
  const targetDir = path.resolve(process.cwd(), target);
  const packageName = toPackageName(targetDir);

  await ensureEmptyTarget(targetDir);
  await copyTemplate(templateDir, targetDir, {
    __APP_NAME__: packageName,
    __WORKER_NAME__: packageName.replace(/[^a-z0-9-]+/g, "-"),
  });

  console.log(`Created ${packageName}`);
  console.log("");
  console.log(`cd ${path.relative(process.cwd(), targetDir) || "."}`);
  console.log("npm install");
  console.log("npm run dev");
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
