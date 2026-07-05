export function transferResult<T>(payload: T, transfer?: Transferable[]): {
    payload: T;
    transfer: Transferable[];
    [transferMarker]: true;
};
export function workerClient(worker: Worker, { timeout, owned }?: WorkerClientOptions & {
    owned?: boolean;
}): NativeWorkerClient;
export function createWorkerClient(workerOrUrl: string | URL | Worker, { workerOptions, ...clientOptions }?: WorkerClientOptions & {
    workerOptions?: WorkerOptions;
}): NativeWorkerClient;
export function exposeWorker(handlers: Record<string, (payload: unknown, context: {
    event: MessageEvent;
    type: string;
}) => unknown | Promise<unknown>>, scope?: NativeWorkerScope): () => void;
export type WorkerClientOptions = {
    /**
     * Request timeout in milliseconds.
     */
    timeout?: number;
};
export type NativeWorkerClient = {
    /**
     * Call a named worker handler.
     */
    call: (type: string, payload?: unknown, transfer?: Transferable[]) => Promise<unknown>;
    /**
     * Reject pending calls, remove listeners, and
     * terminate workers constructed by `createWorkerClient`.
     */
    dispose: () => void;
    /**
     * The wrapped Worker instance.
     */
    worker: Worker;
};
export type NativeWorkerScope = {
    /**
     * Post a message to the paired thread.
     */
    postMessage: (message: unknown, transfer?: Transferable[]) => void;
    /**
     * Register a message listener.
     */
    addEventListener: (type: "message", listener: (event: MessageEvent) => void) => void;
    /**
     * Remove a message listener.
     */
    removeEventListener: (type: "message", listener: (event: MessageEvent) => void) => void;
};
declare const transferMarker: unique symbol;
export {};
