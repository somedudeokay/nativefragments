# AI Docs

Native Fragments ships machine-readable docs so coding agents and IDEs can load the framework's knowledge directly, without scraping HTML.

## Entrypoints

Start with [/llms.txt](/llms.txt) — a curated index of every docs page and package link. For the full corpus in one request, fetch [/llms-full.txt](/llms-full.txt).

```shell
# Curated index — fetch this first
https://docs.nativefragments.org/llms.txt

# Full documentation in a single file
https://docs.nativefragments.org/llms-full.txt
```

## Markdown mirrors

Every docs page has a Markdown twin under the same host, so an agent can read the source instead of parsing the rendered page. Swap the route for a `.md` file.

```shell
https://docs.nativefragments.org/getting-started.md
https://docs.nativefragments.org/fragments.md
https://docs.nativefragments.org/reference.md   # generated from JSDoc
```

> **Good to know:** reference.md is generated from the same JSDoc as the HTML API reference, so it never drifts from the code.

## The bundled skill

The core package ships an agent skill describing how to build and edit a Native Fragments app. After install, read it straight from `node_modules`.

```shell
node_modules/@nativefragments/core/skills/nativefragments/SKILL.md
```

## See also

- [Agent-Friendly Apps](/concepts/agent-friendly) — why apps you build are easy for agents to operate.
- [API Reference](/reference) — the full generated symbol reference.
