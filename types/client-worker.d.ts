/** Options for the tiny Web Worker RPC client. */
export type WorkerClientOptions = {
  /** Request timeout in milliseconds. Defaults to `30000`. */
  timeout?: number;
};

/** Client wrapper around a dedicated Web Worker. */
export type NativeWorkerClient = {
  /** Call a named worker handler and resolve with its typed result. */
  call<T = unknown>(
    type: string,
    payload?: unknown,
    transfer?: Transferable[],
  ): Promise<T>;
  /** Reject pending calls and remove message listeners. */
  dispose(): void;
  /** Wrapped Worker instance. */
  worker: Worker;
};

/** Minimal Worker-like scope used by {@link exposeWorker}. */
export type NativeWorkerScope = {
  /** Post a message to the paired thread. */
  postMessage(message: unknown, transfer?: Transferable[]): void;
  /** Register a message listener. */
  addEventListener(
    type: "message",
    listener: (event: MessageEvent) => void,
  ): void;
  /** Remove a message listener. */
  removeEventListener(
    type: "message",
    listener: (event: MessageEvent) => void,
  ): void;
};

/**
 * Wrap a worker handler result with Transferable objects.
 *
 * Return this from an exposed handler when moving `ArrayBuffer`, `MessagePort`,
 * or another transferable back to the main thread without cloning.
 */
export function transferResult<T>(
  payload: T,
  transfer?: Transferable[],
): {
  payload: T;
  transfer: Transferable[];
};

/** Create a tiny RPC client around an existing dedicated Web Worker. */
export function workerClient(
  worker: Worker,
  options?: WorkerClientOptions,
): NativeWorkerClient;

/** Create a module Worker from a URL, or wrap an existing Worker instance. */
export function createWorkerClient(
  workerOrUrl: string | URL | Worker,
  options?: WorkerClientOptions & {
    /** Options passed to the Worker constructor when a URL is provided. */
    workerOptions?: WorkerOptions;
  },
): NativeWorkerClient;

/**
 * Expose named async handlers inside a dedicated Web Worker.
 *
 * The returned cleanup function removes the message listener.
 */
export function exposeWorker(
  handlers: Record<
    string,
    (
      payload: unknown,
      context: {
        event: MessageEvent;
        type: string;
      },
    ) => unknown | Promise<unknown>
  >,
  scope?: NativeWorkerScope,
): () => void;
