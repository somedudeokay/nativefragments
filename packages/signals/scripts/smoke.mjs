import {
  bindAttr,
  bindClass,
  computed,
  effect,
  state,
} from "../src/index.js";

const count = state(1);
const doubled = computed(() => count.get() * 2);
let latest = 0;

const stop = effect(() => {
  latest = doubled.get();
});

if (latest !== 2) throw new Error("initial effect failed");
count.set(3);
await new Promise((resolve) => setTimeout(resolve, 0));
if (latest !== 6) throw new Error("reactive effect failed");
stop();

const attributes = new Map();
const element = {
  classList: {
    values: new Set(),
    toggle(name, enabled) {
      if (enabled) this.values.add(name);
      else this.values.delete(name);
    },
  },
  removeAttribute(name) {
    attributes.delete(name);
  },
  setAttribute(name, value) {
    attributes.set(name, value);
  },
};

const enabled = state(false);
const stopClass = bindClass(element, "enabled", enabled);
enabled.set(true);
await new Promise((resolve) => setTimeout(resolve, 0));
if (!element.classList.values.has("enabled")) throw new Error("class binding failed");
stopClass();

const label = state("Save");
const stopAttr = bindAttr(element, "aria-label", label);
label.set("Saved");
await new Promise((resolve) => setTimeout(resolve, 0));
if (attributes.get("aria-label") !== "Saved") throw new Error("attr binding failed");
stopAttr();

console.log("signals smoke ok");
