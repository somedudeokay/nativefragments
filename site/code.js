import { escapeHtml, html, raw } from "../src/server/index.js";

const jsKeywords = new Set([
  "await",
  "class",
  "const",
  "export",
  "extends",
  "from",
  "import",
  "new",
  "return",
]);

const wrap = (token, value) =>
  `<span class="tok ${token}">${escapeHtml(value)}</span>`;

const isIdentifierStart = (char) => /[A-Za-z_$]/.test(char);
const isIdentifier = (char) => /[A-Za-z0-9_$]/.test(char);
const isDigit = (char) => /[0-9]/.test(char);

const nextNonSpace = (source, index) => {
  let cursor = index;
  while (/\s/.test(source[cursor] ?? "")) cursor += 1;
  return source[cursor];
};

const readString = (source, index, quote) => {
  let cursor = index + 1;
  while (cursor < source.length) {
    if (source[cursor] === "\\") {
      cursor += 2;
      continue;
    }
    if (source[cursor] === quote) return cursor + 1;
    cursor += 1;
  }
  return cursor;
};

const highlightJs = (source) => {
  let output = "";
  let index = 0;

  while (index < source.length) {
    const char = source[index];

    if (source.startsWith("//", index)) {
      const end = source.indexOf("\n", index);
      const next = end === -1 ? source.length : end;
      output += wrap("comment", source.slice(index, next));
      index = next;
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      const end = readString(source, index, char);
      output += wrap("string", source.slice(index, end));
      index = end;
      continue;
    }

    if (isDigit(char)) {
      const match = source.slice(index).match(/^[0-9][0-9_.]*/);
      output += wrap("number", match[0]);
      index += match[0].length;
      continue;
    }

    if (isIdentifierStart(char)) {
      let end = index + 1;
      while (isIdentifier(source[end] ?? "")) end += 1;
      const word = source.slice(index, end);
      const token = jsKeywords.has(word)
        ? "keyword"
        : nextNonSpace(source, end) === "("
          ? "function"
          : null;
      output += token ? wrap(token, word) : escapeHtml(word);
      index = end;
      continue;
    }

    if ("{}[]()".includes(char)) {
      output += wrap("punctuation", char);
      index += 1;
      continue;
    }

    output += escapeHtml(char);
    index += 1;
  }

  return output;
};

const highlightShell = (source) =>
  source
    .split("\n")
    .map((line) => {
      if (line.trimStart().startsWith("#")) return wrap("comment", line);

      let commandSeen = false;
      return line
        .split(/(\s+)/)
        .map((part) => {
          if (!part || /^\s+$/.test(part)) return escapeHtml(part);
          if (part.startsWith("#")) return wrap("comment", part);
          if (part.startsWith("--") || part.startsWith("-")) {
            return wrap("option", part);
          }
          if (
            (part.startsWith('"') && part.endsWith('"')) ||
            (part.startsWith("'") && part.endsWith("'"))
          ) {
            return wrap("string", part);
          }
          if (!commandSeen) {
            commandSeen = true;
            return wrap("function", part);
          }
          return escapeHtml(part);
        })
        .join("");
    })
    .join("\n");

const highlightJson = (source) => {
  let output = "";
  let index = 0;

  while (index < source.length) {
    const char = source[index];

    if (char === '"') {
      const end = readString(source, index, char);
      const value = source.slice(index, end);
      output += nextNonSpace(source, end) === ":"
        ? wrap("property", value)
        : wrap("string", value);
      index = end;
      continue;
    }

    if (isDigit(char)) {
      const match = source.slice(index).match(/^[0-9][0-9_.]*/);
      output += wrap("number", match[0]);
      index += match[0].length;
      continue;
    }

    output += "{}[]:,".includes(char)
      ? wrap("punctuation", char)
      : escapeHtml(char);
    index += 1;
  }

  return output;
};

const highlight = (source, language) => {
  if (language === "shell") return highlightShell(source);
  if (language === "json") return highlightJson(source);
  return highlightJs(source);
};

export const codeBlock = (source, language = "js") =>
  raw(
    html`<pre class="code-block" data-language="${language}"><code>${raw(
      highlight(source.trim(), language),
    )}</code></pre>`,
  );
