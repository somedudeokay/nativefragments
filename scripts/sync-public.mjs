import { copyFile, mkdir, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const source = join(root, "packages/core/public/nativefragments");
const targets = [
  "packages/create-app/templates/default/public/nativefragments",
  "apps/docs/public/nativefragments",
  "apps/web/public/nativefragments",
].map((target) => join(root, target));

const files = await readdir(source);

for (const target of targets) {
  await mkdir(target, { recursive: true });
  await Promise.all(
    files.map((file) => copyFile(join(source, file), join(target, file))),
  );
}
