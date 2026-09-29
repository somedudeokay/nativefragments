const channel = "nativefragments.worker";
const transferMarker = Symbol("nativefragments.transfer");

const post = (target, message, transfer = []) => {
  target.postMessage(message, transfer);
};

const serializeError = (error) => ({
  message: error?.message ?? String(error),
  name: error?.name ?? "Error",
  stack: error?.stack,
});

const toError = (error) => {
  const next = new Error(error?.message ?? "Worker call failed");
  next.name = error?.name ?? "Error";
  if (error?.stack) next.stack = error.stack;
  return next;
};

const isWorkerUrl = (value) =>
  typeof value === "string" || value instanceof URL;

const isTransferResult = (value) =>
  Boolean(value?.[transferMarker]);

/**
 * Wrap a worker response with Transferable objects.
 *
 * @template T
 * @param {T} payload Response payload.
 * @param {Transferable[]} [transfer=[]] Transferable objects to move.
 * @returns {{ payload: T, transfer: Transferable[], [transferMarker]: true }}
 */
export const transferResult = (payload, transfer = []) => ({
  [transferMarker]: true,
  payload,
  transfer,
});

/**
 * @typedef {object} WorkerClientOptions
 * @property {number} [timeout=30000] Request timeout in milliseconds.
 */

/**
 * @typedef {object} NativeWorkerClient
 * @property {(type: string, payload?: unknown, transfer?: Transferable[]) => Promise<unknown>} call
 * Call a named worker handler.
 * @property {() => void} dispose Reject pending calls, remove listeners, and
 * terminate workers constructed by `createWorkerClient`.
 * @property {Worker} worker The wrapped Worker instance.
 */

/**
 * @typedef {object} NativeWorkerScope
 * @property {(message: unknown, transfer?: Transferable[]) => void} postMessage
 * Post a message to the paired thread.
 * @property {(type: "message", listener: (event: MessageEvent) => void) => void} addEventListener
 * Register a message listener.
 * @property {(type: "message", listener: (event: MessageEvent) => void) => void} removeEventListener
 * Remove a message listener.
 */

/**
 * Create a tiny RPC client for a dedicated Web Worker.
 *
 * @param {Worker} worker Worker instance.
 * @param {WorkerClientOptions & { owned?: boolean }} [options={}] Client options.
 * @returns {NativeWorkerClient} Worker client.
 */
export const workerClient = (worker, { timeout = 30_000, owned = false } = {}) => {
  let lastId = 0;
  let closed = false;
  const pending = new Map();

  const clear = (id) => {
    const request = pending.get(id);
    if (!request) return null;
    clearTimeout(request.timer);
    pending.delete(id);
    return request;
  };

  const onMessage = (event) => {
    const message = event.data;
    if (message?.channel !== channel || !message.id) return;

    const request = clear(message.id);
    if (!request) return;

    if (message.ok) {
      request.resolve(message.payload);
    } else {
      request.reject(toError(message.error));
    }
  };

  worker.addEventListener("message", onMessage);
  const close = (error) => {
    if (closed) return;
    closed = true;
    worker.removeEventListener("message", onMessage);
    worker.removeEventListener("error", onError);
    worker.removeEventListener("messageerror", onMessageError);
    for (const id of pending.keys()) clear(id)?.reject(error);
    if (owned) worker.terminate();
  };
  const onError = (event) => close(new Error(event.message || "Worker failed"));
  const onMessageError = () => close(new Error("Worker message could not be deserialized"));
  worker.addEventListener("error", onError);
  worker.addEventListener("messageerror", onMessageError);

  return {
    worker,
    call(type, payload, transfer = []) {
      if (closed) return Promise.reject(new DOMException("Worker client is closed", "InvalidStateError"));
      const id = ++lastId;

      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          pending.delete(id);
          reject(new Error(`Worker call timed out: ${type}`));
        }, timeout);

        pending.set(id, { resolve, reject, timer });
        try {
          post(worker, { channel, id, type, payload }, transfer);
        } catch (error) {
          clear(id)?.reject(error);
        }
      });
    },
    dispose() {
      close(new DOMException("Worker client disposed", "AbortError"));
    },
  };
};

/**
 * Create a module worker and wrap it with `workerClient`.
 *
 * @param {string | URL | Worker} workerOrUrl Existing Worker or worker module URL.
 * @param {WorkerClientOptions & { workerOptions?: WorkerOptions }} [options={}]
 * Client and Worker constructor options.
 * @returns {NativeWorkerClient} Worker client.
 */
export const createWorkerClient = (
  workerOrUrl,
  { workerOptions = { type: "module" }, ...clientOptions } = {},
) => {
  const owned = isWorkerUrl(workerOrUrl);
  const worker = owned ? new Worker(workerOrUrl, workerOptions) : workerOrUrl;
  return workerClient(worker, { ...clientOptions, owned });
};

/**
 * Expose named handlers inside a dedicated Web Worker.
 *
 * @param {Record<string, (payload: unknown, context: { event: MessageEvent, type: string }) => unknown | Promise<unknown>>} handlers
 * Worker handlers keyed by message type.
 * @param {NativeWorkerScope} [scope=globalThis] Worker global scope.
 * @returns {() => void} Cleanup function.
 */
export const exposeWorker = (handlers, scope = globalThis) => {
  const onMessage = async (event) => {
    const message = event.data;
    if (message?.channel !== channel || !message.id) return;

    try {
      const handler = Object.hasOwn(handlers, message.type) && handlers[message.type];
      if (!handler) throw new Error(`Unknown worker handler: ${message.type}`);

      const result = await handler(message.payload, { event, type: message.type });
      const response = isTransferResult(result)
        ? { payload: result.payload, transfer: result.transfer }
        : { payload: result, transfer: [] };

      post(scope, {
        channel,
        id: message.id,
        ok: true,
        payload: response.payload,
      }, response.transfer);
    } catch (error) {
      post(scope, {
        channel,
        id: message.id,
        ok: false,
        error: serializeError(error),
      });
    }
  };

  scope.addEventListener("message", onMessage);
  return () => scope.removeEventListener("message", onMessage);
};
