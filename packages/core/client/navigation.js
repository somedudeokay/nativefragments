// A transaction owns permission to mutate its target, history, and completion.
// Ancestors and descendants conflict; independent named regions may run together.
export const createNavigationScope = () => {
  const active = new Set();
  let nextId = 0;
  let closed = false;
  const abortAll = () => { for (const item of active) item.controller.abort(); };
  return {
    abortAll,
    close() { closed = true; abortAll(); },
    begin(target, signal) {
      for (const item of active) {
        if (target.contains(item.target) || item.target.contains(target)) item.controller.abort();
      }
      const controller = new AbortController();
      const abort = () => controller.abort(signal?.reason);
      if (signal?.aborted) abort();
      else signal?.addEventListener("abort", abort, { once: true });
      const transaction = {
        id: ++nextId, target, controller,
        get signal() { return controller.signal; },
        check() {
          if (closed || controller.signal.aborted || !target.isConnected || !active.has(transaction)) {
            throw new DOMException("Navigation superseded or cancelled", "AbortError");
          }
        },
        commit(update) { transaction.check(); return update(); },
        wait(promise) {
          transaction.check();
          return new Promise((resolve, reject) => {
            const cancelled = () => reject(new DOMException("Navigation cancelled", "AbortError"));
            controller.signal.addEventListener("abort", cancelled, { once: true });
            Promise.resolve(promise).then(resolve, reject).finally(() => controller.signal.removeEventListener("abort", cancelled));
          });
        },
        finish() {
          signal?.removeEventListener("abort", abort);
          active.delete(transaction);
        },
      };
      active.add(transaction);
      return transaction;
    },
  };
};
