import { computed, effect, state } from "/nativefragments/signals.js";

const storageKey = "nativefragments.demo.clicks";
const cookieName = "nf_demo_clicks";

const toCount = (value) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

const readInitialClickCount = () => {
  const serverValue = globalThis.__NATIVEFRAGMENTS_STATE__?.clickCount;
  if (serverValue != null) return toCount(serverValue);

  try {
    return toCount(globalThis.localStorage?.getItem(storageKey));
  } catch {
    return 0;
  }
};

export const clickCount = state(readInitialClickCount());

export const paddedClickCount = computed(() =>
  String(clickCount.get()).padStart(3, "0").slice(-3),
);

let persistenceStarted = false;

const persistCount = (count) => {
  try {
    globalThis.localStorage?.setItem(storageKey, String(count));
  } catch {}

  document.cookie = `${cookieName}=${encodeURIComponent(
    String(count),
  )}; path=/; max-age=31536000; SameSite=Lax`;
};

export const incrementClickCount = () => {
  clickCount.set(clickCount.get() + 1);
};

export const resetClickCount = () => {
  clickCount.set(0);
};

export const startClickCountPersistence = () => {
  if (persistenceStarted) return;
  persistenceStarted = true;

  effect(() => {
    persistCount(clickCount.get());
  });
};
