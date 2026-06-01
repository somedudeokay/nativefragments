import { html } from "@nativefragments/core/server";
import { code, docPage } from "./blocks.js";

export const workersPage = () =>
  docPage({
    eyebrow: "Concepts",
    title: "Workers keep heavy browser work off the page.",
    intro:
      "Use the tiny worker RPC helper for search, filtering, parsing, and other work that should not block input or navigation.",
    body: html`
      <h2>Worker module</h2>
      ${code(`import { exposeWorker } from "/nativefragments/worker.js";

exposeWorker({
  search: ({ rows, query }) =>
    rows.filter((row) =>
      row.title.toLowerCase().includes(query.toLowerCase())
    )
});`)}
      <h2>Main thread</h2>
      ${code(`import { createWorkerClient } from "/nativefragments/worker.js";

const search = createWorkerClient("/app/search-worker.js");

const rows = await search.call("search", {
  rows: allRows,
  query: "native"
});`)}
      <h2>Transfer large buffers</h2>
      ${code(`import { exposeWorker, transferResult } from "/nativefragments/worker.js";

exposeWorker({
  bytes: (buffer) => transferResult(buffer, [buffer])
});`)}
    `,
  });
