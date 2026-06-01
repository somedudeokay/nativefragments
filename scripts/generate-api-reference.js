import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const coreRoot = path.join(root, "node_modules/@nativefragments/core");
const outputPath = path.join(root, "site/generated/api-reference.js");
const markdownOutputPath = path.join(root, "public/reference.md");

const sources = [
  {
    file: "src/server/html.js",
    module: "@nativefragments/core/server",
    title: "Server HTML",
  },
  {
    file: "src/server/router.js",
    module: "@nativefragments/core/server",
    title: "Server Routing",
  },
  {
    file: "src/cloudflare/index.js",
    module: "@nativefragments/core/cloudflare",
    title: "Cloudflare Adapter",
  },
  {
    file: "public/nativefragments/router.js",
    module: "/nativefragments/router.js",
    title: "Browser Router",
  },
  {
    file: "public/nativefragments/component.js",
    module: "/nativefragments/component.js",
    title: "Shadow DOM Components",
  },
];

const cleanLine = (line) => line.replace(/^\s*\* ?/, "");

const parseBlock = (block) => {
  const lines = block.split("\n").map(cleanLine);
  const description = [];
  const tags = [];
  let currentTag = null;

  for (const line of lines) {
    if (line.startsWith("@")) {
      currentTag = line;
      tags.push(currentTag);
      continue;
    }
    if (currentTag && line.trim()) {
      tags[tags.length - 1] = `${tags[tags.length - 1]} ${line.trim()}`;
      continue;
    }
    if (line.trim()) description.push(line.trim());
  }

  return {
    description: description.join(" "),
    params: tags
      .filter((tag) => tag.startsWith("@param"))
      .map((tag) => tag.replace("@param", "").trim()),
    properties: tags
      .filter((tag) => tag.startsWith("@property"))
      .map((tag) => tag.replace("@property", "").trim()),
    returns:
      tags
        .find((tag) => tag.startsWith("@returns") || tag.startsWith("@return"))
        ?.replace(/^@returns?/, "")
        .trim() ?? "",
    type: tags.find((tag) => tag.startsWith("@type"))?.replace("@type", "").trim() ?? "",
  };
};

const parseTypedef = (block) => {
  const parsed = parseBlock(block);
  const typedef = block
    .split("\n")
    .map(cleanLine)
    .find((line) => line.startsWith("@typedef"));

  if (!typedef) return null;

  const match = typedef.match(/^@typedef\s+\{(.+)\}\s+([A-Za-z0-9_$]+)/);
  if (!match) return null;

  return {
    name: match[2],
    description: parsed.description,
    properties: parsed.properties,
    type: match[1],
  };
};

const findExports = (source) => {
  const pattern = /export const ([A-Za-z0-9_$]+)\s*=/g;
  const exports = [];
  let match;

  while ((match = pattern.exec(source)) !== null) {
    const beforeExport = source.slice(0, match.index);
    const blockStart = beforeExport.lastIndexOf("/**");
    const blockEnd = beforeExport.lastIndexOf("*/");

    if (blockStart === -1 || blockEnd === -1 || blockEnd < blockStart) {
      continue;
    }

    exports.push({
      name: match[1],
      ...parseBlock(source.slice(blockStart + 3, blockEnd)),
    });
  }

  return exports;
};

const findTypedefs = (source) => {
  const pattern = /\/\*\*([\s\S]*?)\*\//g;
  const typedefs = [];
  let match;

  while ((match = pattern.exec(source)) !== null) {
    const typedef = parseTypedef(match[1]);
    if (typedef) typedefs.push(typedef);
  }

  return typedefs;
};

const markdownList = (items) =>
  items.length ? items.map((item) => `- \`${item}\``).join("\n") : "";

const renderMarkdown = (sections) => `# Native Fragments API Reference

> Generated from JSDoc comments in @nativefragments/core. For the full index, fetch https://docs.nativefragments.org/llms.txt.

${sections
  .map(
    (section) => `## ${section.title}

Module: \`${section.module}\`

Source: \`${section.file}\`

${section.types
  .map(
    (type) => `### ${type.name}

Type: \`${type.type}\`

${type.description}
${type.properties.length ? `\nProperties:\n\n${markdownList(type.properties)}\n` : ""}`,
  )
  .join("\n")}
${section.symbols
  .map(
    (symbol) => `### ${symbol.name}

${symbol.description}
${symbol.type ? `\nType: \`${symbol.type}\`\n` : ""}
${symbol.params.length ? `Parameters:\n\n${markdownList(symbol.params)}\n` : ""}
${symbol.returns ? `Returns: \`${symbol.returns}\`\n` : ""}`,
  )
  .join("\n")}`,
  )
  .join("\n")}
`;

const main = async () => {
  const sections = [];

  for (const source of sources) {
    const code = await readFile(path.join(coreRoot, source.file), "utf8");
    sections.push({
      ...source,
      types: findTypedefs(code),
      symbols: findExports(code),
    });
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await mkdir(path.dirname(markdownOutputPath), { recursive: true });
  await writeFile(
    outputPath,
    `export const apiSections = ${JSON.stringify(sections, null, 2)};\n`,
  );
  await writeFile(markdownOutputPath, renderMarkdown(sections));
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
