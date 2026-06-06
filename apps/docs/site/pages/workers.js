import { html } from "@nativefragments/core/server";
import { callout, code, docPage } from "./blocks.js";

export const workersPage = () =>
  docPage({
    eyebrow: "Concepts",
    title: "Workers",
    intro:
      "Move expensive work — search, filtering, parsing — off the main thread with a tiny RPC layer over Web Workers. No build step, no message-plumbing boilerplate.",
    body: html`
      <p>
        Three helpers cover the whole loop:
        <a href="/reference#exposeWorker"><code>exposeWorker</code></a> registers
        handlers inside the worker,
        <a href="/reference#createWorkerClient"><code>createWorkerClient</code></a>
        calls them from the page, and
        <a href="/reference#transferResult"><code>transferResult</code></a> moves
        large buffers instead of copying them.
      </p>

      <h2>Exposing handlers</h2>
      <p>
        In the worker module, pass
        <a href="/reference#exposeWorker"><code>exposeWorker</code></a> an object
        of named handlers. Each handler receives the call payload and returns a
        value (or a promise).
      </p>
      ${code(`// public/app/search-worker.js
import { exposeWorker } from "/nativefragments/worker.js";

exposeWorker({
  // "search" is the handler name the page will call.
  search: ({ rows, query }) =>
    rows.filter((row) =>
      row.title.toLowerCase().includes(query.toLowerCase())
    ),
});`)}

      <h2>Calling from the page</h2>
      <p>
        <a href="/reference#createWorkerClient"><code>createWorkerClient</code></a>
        spins up a module worker and returns a client.
        <code>call(name, payload)</code> resolves with the handler's result and
        rejects on error or timeout.
      </p>
      ${code(`// public/app/client.js
import { createWorkerClient } from "/nativefragments/worker.js";

const search = createWorkerClient("/app/search-worker.js");

// Runs off the main thread — typing stays responsive.
const hits = await search.call("search", { rows, query: "native" });

search.dispose(); // detach listeners + reject pending calls when done`)}
      ${callout(
        "Good to know",
        "Calls time out after 30s by default. Pass { timeout } to createWorkerClient to change it.",
      )}

      <h2>Transferring large buffers</h2>
      <p>
        By default the result is structured-cloned (copied). Wrap it in
        <a href="/reference#transferResult"><code>transferResult</code></a> to
        <em>transfer</em> ownership of an <code>ArrayBuffer</code> or other
        Transferable instead — no copy.
      </p>
      ${code(`// public/app/decode-worker.js
import { exposeWorker, transferResult } from "/nativefragments/worker.js";

exposeWorker({
  decode: (buffer) => {
    const result = process(buffer); // returns an ArrayBuffer
    // Move the buffer back to the page instead of copying it.
    return transferResult(result, [result]);
  },
});`)}

      <h2>See also</h2>
      <ul>
        <li><a href="/concepts/components">Components</a> — the ⌘K palette on this site runs its search in a worker.</li>
        <li><a href="/concepts/api-routes">API Routes</a> — for work that belongs on the server instead.</li>
        <li><a href="/reference#exposeWorker">Reference: <code>exposeWorker</code></a>, <a href="/reference#createWorkerClient"><code>createWorkerClient</code></a>, <a href="/reference#transferResult"><code>transferResult</code></a>.</li>
      </ul>
    `,
  });
