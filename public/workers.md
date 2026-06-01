# Workers

> Use worker helpers for search, filtering, parsing, and background work.

Worker module:

```js
import { exposeWorker } from "/nativefragments/worker.js";

exposeWorker({
  search: ({ rows, query }) =>
    rows.filter((row) => row.title.toLowerCase().includes(query.toLowerCase())),
});
```

Main thread:

```js
import { createWorkerClient } from "/nativefragments/worker.js";

const search = createWorkerClient("/app/search-worker.js");
const rows = await search.call("search", { rows: allRows, query: "native" });
```

Use `transferResult(payload, transfer)` when returning large transferable buffers.
