# Workers

Move expensive work — search, filtering, parsing — off the main thread with a tiny RPC layer over Web Workers. No build step, no message-plumbing boilerplate.

Three helpers cover the whole loop: [exposeWorker](/reference#exposeWorker) registers handlers inside the worker, [createWorkerClient](/reference#createWorkerClient) calls them from the page, and [transferResult](/reference#transferResult) moves large buffers instead of copying them.

## Exposing handlers

In the worker module, pass [exposeWorker](/reference#exposeWorker) an object of named handlers. Each handler receives the call payload and returns a value (or a promise).

```js
// public/app/search-worker.js
import { exposeWorker } from "/nativefragments/worker.js";

exposeWorker({
  // "search" is the handler name the page will call.
  search: ({ rows, query }) =>
    rows.filter((row) =>
      row.title.toLowerCase().includes(query.toLowerCase())
    ),
});
```

## Calling from the page

[createWorkerClient](/reference#createWorkerClient) spins up a module worker and returns a client. `call(name, payload)` resolves with the handler's result and rejects on error or timeout.

```js
// public/app/client.js
import { createWorkerClient } from "/nativefragments/worker.js";

const search = createWorkerClient("/app/search-worker.js");

// Runs off the main thread — typing stays responsive.
const hits = await search.call("search", { rows, query: "native" });

search.dispose(); // detach listeners + reject pending calls when done
```

> **Good to know:** Calls time out after 30s by default. Pass { timeout } to createWorkerClient to change it.

## Transferring large buffers

By default the result is structured-cloned (copied). Wrap it in [transferResult](/reference#transferResult) to _transfer_ ownership of an `ArrayBuffer` or other Transferable instead — no copy.

```js
// public/app/decode-worker.js
import { exposeWorker, transferResult } from "/nativefragments/worker.js";

exposeWorker({
  decode: (buffer) => {
    const result = process(buffer); // returns an ArrayBuffer
    // Move the buffer back to the page instead of copying it.
    return transferResult(result, [result]);
  },
});
```

## See also

- [Components](/concepts/components) — the ⌘K palette on this site runs its search in a worker.
- [API Routes](/concepts/api-routes) — for work that belongs on the server instead.
- [Reference: exposeWorker](/reference#exposeWorker), [createWorkerClient](/reference#createWorkerClient), [transferResult](/reference#transferResult).
