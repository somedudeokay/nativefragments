# Signals

> Add signal-based reactivity only where an app needs it.

```sh
npm i @nativefragments/signals
cp node_modules/@nativefragments/signals/public/nativefragments/*.js public/nativefragments/
```

```js
import { bindText, computed, state } from "/nativefragments/signals.js";

const count = state(0);
const label = computed(() => `Count ${count.get()}`);

bindText(root.querySelector("[data-count]"), label);
root.querySelector("button").addEventListener("click", () => {
  count.set(count.get() + 1);
});
```

Keep server-rendered HTML canonical, then use signals to hydrate interactive islands.
