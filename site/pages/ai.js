import { html } from "@nativefragments/core/server";
import { callout, code, docPage } from "./blocks.js";

export const aiPage = () =>
  docPage({
    eyebrow: "Reference",
    title: "AI Docs",
    intro:
      "Native Fragments ships machine-readable docs so coding agents and IDEs can load the framework's knowledge directly, without scraping HTML.",
    body: html`
      <h2>Entrypoints</h2>
      <p>
        Start with <a href="/llms.txt"><code>/llms.txt</code></a> — a curated
        index of every docs page and package link. For the full corpus in one
        request, fetch <a href="/llms-full.txt"><code>/llms-full.txt</code></a>.
      </p>
      ${code(`# Curated index — fetch this first
https://docs.nativefragments.org/llms.txt

# Full documentation in a single file
https://docs.nativefragments.org/llms-full.txt`, "shell")}

      <h2>Markdown mirrors</h2>
      <p>
        Every docs page has a Markdown twin under the same host, so an agent can
        read the source instead of parsing the rendered page. Swap the route for
        a <code>.md</code> file.
      </p>
      ${code(`https://docs.nativefragments.org/getting-started.md
https://docs.nativefragments.org/fragments.md
https://docs.nativefragments.org/reference.md   # generated from JSDoc`, "shell")}
      ${callout(
        "Good to know",
        "reference.md is generated from the same JSDoc as the HTML API reference, so it never drifts from the code.",
      )}

      <h2>The bundled skill</h2>
      <p>
        The core package ships an agent skill describing how to build and edit a
        Native Fragments app. After install, read it straight from
        <code>node_modules</code>.
      </p>
      ${code(`node_modules/@nativefragments/core/skills/nativefragments/SKILL.md`, "shell")}

      <h2>See also</h2>
      <ul>
        <li><a href="/concepts/agent-friendly">Agent-Friendly Apps</a> — why apps you build are easy for agents to operate.</li>
        <li><a href="/reference">API Reference</a> — the full generated symbol reference.</li>
      </ul>
    `,
  });
