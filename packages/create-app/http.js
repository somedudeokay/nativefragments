import { once } from "node:events";
import { Readable } from "node:stream";

/** Bridge a Fetch handler to Node HTTP for local previews and contract tests. */
export const createNodeHandler = (fetchHandler) => async (req, res) => {
  const controller = new AbortController();
  const abort = () => { if (!res.writableEnded) controller.abort(); };
  req.once("aborted", abort);
  res.once("close", abort);
  let reader;
  try {
    const request = new Request(`http://${req.headers.host ?? "localhost"}${req.url}`, {
      method: req.method, headers: req.headers, signal: controller.signal,
      ...(req.method !== "GET" && req.method !== "HEAD" ? { body: Readable.toWeb(req), duplex: "half" } : {}),
    });
    const response = await fetchHandler(request);
    res.statusCode = response.status;
    for (const [name, value] of response.headers) if (name !== "set-cookie") res.setHeader(name, value);
    const cookies = response.headers.getSetCookie();
    if (cookies.length) res.setHeader("set-cookie", cookies);
    if (req.method === "HEAD" || !response.body) {
      await response.body?.cancel();
      res.end();
      return;
    }
    reader = response.body.getReader();
    const cancel = () => { void reader.cancel(controller.signal.reason).catch(() => {}); };
    controller.signal.addEventListener("abort", cancel, { once: true });
    try {
      while (!controller.signal.aborted) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!res.write(value)) await once(res, "drain", { signal: controller.signal });
      }
    } finally { controller.signal.removeEventListener("abort", cancel); }
    if (!controller.signal.aborted) res.end();
  } catch (error) {
    if (!controller.signal.aborted) {
      if (res.headersSent) res.destroy(error);
      else { res.statusCode = 500; res.end("Internal error"); }
    }
  } finally {
    if (controller.signal.aborted) await reader?.cancel().catch(() => {});
    reader?.releaseLock();
    req.off("aborted", abort);
    res.off("close", abort);
  }
};
