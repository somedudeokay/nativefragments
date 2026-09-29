import assert from "node:assert/strict";
import test from "node:test";
import { workerClient } from "../client/worker.js";

class WorkerDouble extends EventTarget {
  sent = [];
  terminated = 0;
  postMessage(message) { this.sent.push(message); }
  terminate() { this.terminated++; }
}

test("disposed clients reject immediately, reject pending work, and terminate only once", async () => {
  const worker = new WorkerDouble();
  const client = workerClient(worker, { owned: true });
  const pending = assert.rejects(client.call("wait"), { name: "AbortError" });
  client.dispose();
  client.dispose();
  await pending;
  await assert.rejects(client.call("late"), { name: "InvalidStateError" });
  assert.equal(worker.sent.length, 1);
  assert.equal(worker.terminated, 1);
});

test("worker transport failures reject pending calls and close the client", async () => {
  for (const type of ["error", "messageerror"]) {
    const worker = new WorkerDouble();
    const client = workerClient(worker);
    const pending = assert.rejects(client.call("wait"), /Worker/);
    worker.dispatchEvent(new Event(type));
    await pending;
    await assert.rejects(client.call("late"), { name: "InvalidStateError" });
    assert.equal(worker.terminated, 0);
  }
});

test("postMessage clone errors clear the pending timer without closing a usable worker", async () => {
  const worker = new WorkerDouble();
  worker.postMessage = () => { throw new DOMException("Cannot clone", "DataCloneError"); };
  const client = workerClient(worker);
  await assert.rejects(client.call("bad", () => {}), { name: "DataCloneError" });
  client.dispose();
});
