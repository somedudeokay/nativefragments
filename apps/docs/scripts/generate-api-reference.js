import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
// Read sibling workspace packages directly (monorepo layout: apps/docs/../../packages/*).
const coreRoot = path.resolve(root, "../../packages/core");
const signalsRoot = path.resolve(root, "../../packages/signals");
const outputPath = path.join(root, "site/generated/api-reference.js");
const markdownOutputPath = path.join(root, "public/reference.md");

// Each source: the package dir to read from, the file within it, its path in the
// monorepo (for GitHub links), and how it appears in the reference.
const sources = [
  { root: coreRoot, file: "src/server/html.js", repoPath: "packages/core/src/server/html.js", module: "@nativefragments/core/server", title: "Server HTML" },
  { root: coreRoot, file: "src/server/router.js", repoPath: "packages/core/src/server/router.js", module: "@nativefragments/core/server", title: "Server Routing" },
  { root: coreRoot, file: "src/cloudflare/index.js", repoPath: "packages/core/src/cloudflare/index.js", module: "@nativefragments/core/cloudflare", title: "Cloudflare Adapter" },
  { root: coreRoot, file: "public/nativefragments/router.js", repoPath: "packages/core/public/nativefragments/router.js", module: "/nativefragments/router.js", title: "Browser Router" },
  { root: coreRoot, file: "public/nativefragments/component.js", repoPath: "packages/core/public/nativefragments/component.js", module: "/nativefragments/component.js", title: "Shadow DOM Components" },
  { root: coreRoot, file: "public/nativefragments/worker.js", repoPath: "packages/core/public/nativefragments/worker.js", module: "/nativefragments/worker.js", title: "Web Workers" },
  { root: signalsRoot, file: "public/nativefragments/signals.js", repoPath: "packages/signals/public/nativefragments/signals.js", module: "@nativefragments/signals", title: "State" },
];

const cleanLine = (line) => line.replace(/^\s*\* ?/, "");

// Parse a JSDoc @param/@property string into structured columns. Handles
// nested-brace types like `{{ a: string }}` and optional `[name=default]`.
const parseParam = (rawText) => {
  let text = rawText.trim();
  let type = "";

  if (text.startsWith("{")) {
    let depth = 0;
    let index = 0;
    for (; index < text.length; index += 1) {
      if (text[index] === "{") depth += 1;
      else if (text[index] === "}") {
        depth -= 1;
        if (depth === 0) {
          index += 1;
          break;
        }
      }
    }
    type = text.slice(1, index - 1).trim();
    text = text.slice(index).trim();
  }

  let name = "";
  let defaultValue = "";
  let optional = false;
  let description = "";

  if (text.startsWith("[")) {
    optional = true;
    // Balance brackets so defaults containing "]" (e.g. [styles=[]]) parse.
    let bracketDepth = 0;
    let close = text.length - 1;
    for (let i = 0; i < text.length; i += 1) {
      if (text[i] === "[") bracketDepth += 1;
      else if (text[i] === "]") {
        bracketDepth -= 1;
        if (bracketDepth === 0) {
          close = i;
          break;
        }
      }
    }
    const inner = text.slice(1, close);
    const eq = inner.indexOf("=");
    if (eq === -1) name = inner.trim();
    else {
      name = inner.slice(0, eq).trim();
      defaultValue = inner.slice(eq + 1).trim();
    }
    description = text.slice(close + 1).trim();
  } else {
    const match = text.match(/^([A-Za-z0-9_$.]+)\s*([\s\S]*)$/);
    if (match) {
      name = match[1];
      description = match[2].trim();
    } else {
      description = text;
    }
  }

  const rest = type.startsWith("...");
  return { name, type, optional, default: defaultValue, description, rest };
};

const parseReturns = (rawText) => {
  if (!rawText) return null;
  const text = rawText.trim();
  if (!text.startsWith("{")) return { type: "", description: text };

  let depth = 0;
  let index = 0;
  for (; index < text.length; index += 1) {
    if (text[index] === "{") depth += 1;
    else if (text[index] === "}") {
      depth -= 1;
      if (depth === 0) {
        index += 1;
        break;
      }
    }
  }
  return {
    type: text.slice(1, index - 1).trim(),
    description: text.slice(index).trim(),
  };
};

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

  const returnsTag = tags.find(
    (tag) => tag.startsWith("@returns") || tag.startsWith("@return"),
  );

  return {
    description: description.join(" "),
    private: tags.some((tag) => tag.startsWith("@private")),
    params: tags
      .filter((tag) => tag.startsWith("@param"))
      .map((tag) => parseParam(tag.replace("@param", "").trim()))
      .filter((param) => !param.name.includes(".")), // skip nested option docs
    properties: tags
      .filter((tag) => tag.startsWith("@property"))
      .map((tag) => parseParam(tag.replace("@property", "").trim())),
    returns: parseReturns(
      returnsTag?.replace(/^@returns?/, "").trim() ?? "",
    ),
    type: tags.find((tag) => tag.startsWith("@type"))?.replace("@type", "").trim() ?? "",
  };
};

const buildSignature = (name, parsed) => {
  if (!parsed.params.length) {
    return parsed.returns?.type ? `${name} → ${parsed.returns.type}` : name;
  }
  const args = parsed.params
    .map((param) => `${param.rest ? "..." : ""}${param.name}${param.optional ? "?" : ""}`)
    .join(", ");
  const returnType = parsed.returns?.type ? ` → ${parsed.returns.type}` : "";
  return `${name}(${args})${returnType}`;
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
    if (blockStart === -1 || blockEnd === -1 || blockEnd < blockStart) continue;

    const parsed = parseBlock(source.slice(blockStart + 3, blockEnd));
    if (parsed.private) continue;
    exports.push({
      name: match[1],
      signature: buildSignature(match[1], parsed),
      line: beforeExport.split("\n").length,
      ...parsed,
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
    if (typedef) {
      typedef.line = source.slice(0, match.index).split("\n").length;
      typedefs.push(typedef);
    }
  }

  return typedefs;
};

// ---- Markdown rendering (public/reference.md, for AI + plain reading) ----

const mdLinks = (text) =>
  String(text).replace(/\{@link\s+([A-Za-z0-9_$]+)\}/g, "[`$1`](#$1)");

const mdParamRow = (param) =>
  `| \`${param.name}\` | ${param.type ? `\`${param.type}\`` : "—"} | ${
    param.default ? `\`${param.default}\`` : param.optional ? "—" : "required"
  } | ${mdLinks(param.description) || "—"} |`;

const mdParamTable = (params) =>
  params.length
    ? `\n**Parameters**\n\n| Name | Type | Default | Description |\n| --- | --- | --- | --- |\n${params
        .map(mdParamRow)
        .join("\n")}\n`
    : "";

const renderMarkdown = (sections) => `# Native Fragments API Reference

> Generated from JSDoc comments in @nativefragments/core. For the full index, fetch https://docs.nativefragments.org/llms.txt.

${sections
  .map(
    (section) => `## ${section.title}

Module: \`${section.module}\`

${section.types
  .map(
    (type) => `### ${type.name}

\`${type.type}\`

${mdLinks(type.description)}
${mdParamTable(type.properties)}`,
  )
  .join("\n")}
${section.symbols
  .map(
    (symbol) => `### ${symbol.name}

\`\`\`js
${symbol.signature}
\`\`\`

${mdLinks(symbol.description)}
${symbol.type ? `\nType: \`${symbol.type}\`\n` : ""}${mdParamTable(symbol.params)}${
      symbol.returns?.type || symbol.returns?.description
        ? `\n**Returns** — ${symbol.returns.type ? `\`${symbol.returns.type}\`. ` : ""}${mdLinks(symbol.returns.description)}\n`
        : ""
    }`,
  )
  .join("\n")}`,
  )
  .join("\n")}
`;

const REPO = "https://github.com/somedudeokay/nativefragments";

// ---- Resolve typedefs into the functions that use them ----
// Only functions/values are sections; option-bag typedefs fold into their
// parameter, single return shapes fold into Returns, and the rest become a
// de-emphasized "Types" appendix.

const stripWrappers = (typeText) => {
  let value = String(typeText ?? "").trim();
  const wrapped = value.match(/^(?:Promise|Required|Readonly|Partial)<([\s\S]+)>$/);
  if (wrapped) value = wrapped[1].trim();
  return value.replace(/\[\]$/, "").trim();
};

const baseTypeName = (typeText) => {
  const match = stripWrappers(typeText).match(/^([A-Za-z_$][\w$]*)/);
  return match ? match[1] : "";
};

// Parse the inline extras in `Base & { a?: T; b: U }` into field rows.
const intersectionExtras = (typeText) => {
  const match = String(typeText).match(/&\s*\{([\s\S]*)\}/);
  if (!match) return [];
  return match[1]
    .split(/[;,]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const field = part.match(/^([A-Za-z_$][\w$]*)(\?)?\s*:\s*([\s\S]+)$/);
      return field
        ? { name: field[1], type: field[3].trim(), optional: Boolean(field[2]), default: "", description: "" }
        : null;
    })
    .filter(Boolean);
};

const resolveTypes = (sections) => {
  const typeByName = new Map();
  for (const section of sections) {
    for (const type of section.types) {
      if (!typeByName.has(type.name)) typeByName.set(type.name, type);
    }
  }

  const inlined = new Set();

  // Option-bag params: fold the typedef's fields under the parameter.
  for (const section of sections) {
    for (const symbol of section.symbols) {
      for (const param of symbol.params) {
        const type = typeByName.get(baseTypeName(param.type));
        if (type && type.properties.length) {
          param.fields = [...type.properties, ...intersectionExtras(param.type)];
          inlined.add(type.name);
        }
      }
    }
  }

  // Return shapes: fold under Returns when not already used as an option.
  for (const section of sections) {
    for (const symbol of section.symbols) {
      const type = typeByName.get(baseTypeName(symbol.returns?.type));
      if (type && type.properties.length && !inlined.has(type.name)) {
        symbol.returnFields = type.properties;
        inlined.add(type.name);
      }
    }
  }

  // Everything else becomes the appendix.
  return [...typeByName.values()].filter((type) => !inlined.has(type.name));
};

const main = async () => {
  // Link to the monorepo on the default branch (paths are stable; individual
  // releases are tagged per package).
  const ref = "main";
  const blob = (repoPath, line) =>
    `${REPO}/blob/${ref}/${repoPath}${line ? `#L${line}` : ""}`;

  const sections = [];

  for (const source of sources) {
    const code = await readFile(path.join(source.root, source.file), "utf8");
    sections.push({
      module: source.module,
      title: source.title,
      file: source.repoPath,
      source: blob(source.repoPath),
      types: findTypedefs(code).map((type) => ({
        ...type,
        source: blob(source.repoPath, type.line),
      })),
      symbols: findExports(code).map((symbol) => ({
        ...symbol,
        source: blob(source.repoPath, symbol.line),
      })),
    });
  }

  const apiTypes = resolveTypes(sections);

  await mkdir(path.dirname(outputPath), { recursive: true });
  await mkdir(path.dirname(markdownOutputPath), { recursive: true });
  await writeFile(
    outputPath,
    `export const apiSections = ${JSON.stringify(sections, null, 2)};\n\nexport const apiTypes = ${JSON.stringify(apiTypes, null, 2)};\n`,
  );
  await writeFile(markdownOutputPath, renderMarkdown(sections));
  console.log(`api reference: ${sections.length} modules, ${apiTypes.length} appendix types`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
