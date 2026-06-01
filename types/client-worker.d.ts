export type WorkerClientOptions = {
  timeout?: number;
};

export type NativeWorkerClient = {
  call<T = unknown>(
    type: string,
    payload?: unknown,
    transfer?: Transferable[],
  ): Promise<T>;
  dispose(): void;
  worker: Worker;
};

export type NativeWorkerScope = {
  postMessage(message: unknown, transfer?: Transferable[]): void;
  addEventListener(
    type: "message",
    listener: (event: MessageEvent) => void,
  ): void;
  removeEventListener(
    type: "message",
    listener: (event: MessageEvent) => void,
  ): void;
};

export function transferResult<T>(
  payload: T,
  transfer?: Transferable[],
): {
  payload: T;
  transfer: Transferable[];
};

export function workerClient(
  worker: Worker,
  options?: WorkerClientOptions,
): NativeWorkerClient;

export function createWorkerClient(
  workerOrUrl: string | URL | Worker,
  options?: WorkerClientOptions & {
    workerOptions?: WorkerOptions;
  },
): NativeWorkerClient;

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
