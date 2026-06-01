import { html } from "@nativefragments/core/server";
import { code, docPage } from "./blocks.js";

export const aiPage = () =>
  docPage({
    eyebrow: "AI Native",
    title: "Docs and apps should be easy for agents to read.",
    intro:
      "Native Fragments keeps source and runtime output close to the platform: HTML, links, modules, and small files. The docs expose agent entrypoints too.",
    body: html`
      <h2>Agent entrypoints</h2>
      ${code(`https://docs.nativefragments.org/llms.txt
https://docs.nativefragments.org/llms-full.txt
node_modules/@nativefragments/core/skills/nativefragments/SKILL.md`)}
      <h2>Runtime readability</h2>
      <p>
        Generated apps are easier to browse and scrape because the output is
        not hidden behind a large transpiled client bundle. Agents can follow
        anchors, inspect DOM, and map behavior back to small source files.
      </p>
    `,
  });
