const protocolHeader = "x-nativefragments-protocol";
const protocolVersion = "2";
const streamHeader = "x-nativefragments-stream";

const fragmentUrl = (url) => `${url.pathname}${url.search}`;

const isSelectorSlot = (slot) =>
  typeof slot === "string" &&
  (slot.startsWith("#") || slot.startsWith(".") || slot.startsWith("["));

const requestedSlot = (slot) =>
  slot && !isSelectorSlot(slot) ? String(slot) : null;

const cacheKey = (url, slot) => {
  const name = requestedSlot(slot);
  return name ? `${fragmentUrl(url)}::${name}` : fragmentUrl(url);
};

const abortError = (signal) =>
  signal?.reason instanceof Error
    ? signal.reason
    : new DOMException("The operation was aborted", "AbortError");

const waitFor = (promise, signal) => {
  if (!signal) return promise;
  if (signal.aborted) return Promise.reject(abortError(signal));

  return new Promise((resolve, reject) => {
    const abort = () => reject(abortError(signal));
    signal.addEventListener("abort", abort, { once: true });
    promise.then(resolve, reject).finally(() => {
      signal.removeEventListener("abort", abort);
    });
  });
};

const streamBoundary = (token) => `<!--nativefragments-stream-${token}-->`;
const streamEnd = (token) => `<!--nativefragments-stream-${token}-end-->`;

const readFragmentStream = async (body, token, onFrame) => {
  const boundary = streamBoundary(token);
  const endBoundary = streamEnd(token);
  const decoder = new TextDecoder();
  const reader = body.getReader();
  let buffer = "";
  let complete = false;
  let frameIndex = 0;
  let html = "";
  let started = false;
  let terminated = false;

  const consumeFrames = async () => {
    if (terminated) return;
    if (!started) {
      const start = buffer.indexOf(boundary);
      if (start === -1) return;
      if (buffer.slice(0, start).trim()) {
        throw new Error("Fragment stream contained content before its first boundary");
      }
      buffer = buffer.slice(start + boundary.length);
      started = true;
    }

    let end = buffer.indexOf(boundary);
    while (end !== -1) {
      const frame = buffer.slice(0, end);
      buffer = buffer.slice(end + boundary.length);
      html += frame;
      await onFrame(frame, frameIndex);
      frameIndex += 1;
      end = buffer.indexOf(boundary);
    }

    const terminal = buffer.indexOf(endBoundary);
    if (terminal !== -1) {
      if (buffer.slice(0, terminal).trim()) {
        throw new Error("Fragment stream ended with an unterminated frame");
      }
      buffer = "";
      terminated = true;
    }
  };

  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      buffer += decoder.decode(chunk.value, { stream: true });
      await consumeFrames();
    }
    buffer += decoder.decode();
    await consumeFrames();
    if (!started || !terminated || frameIndex === 0) {
      throw new Error("Fragment stream ended before its final boundary");
    }
    complete = true;
    return html;
  } finally {
    if (!complete) await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
};

const responseUrl = (response, requestedUrl) => {
  const url = new URL(
    response.headers.get("x-nativefragments-url") ||
      response.url ||
      fragmentUrl(requestedUrl),
    requestedUrl.href,
  );

  return url;
};

// Request anchors belong to consumers, not the shared transport or cache.
const consumerResult = (result, requestedUrl) => {
  const url = new URL(result.url);

  if (
    !url.hash &&
    requestedUrl.hash &&
    url.origin === requestedUrl.origin &&
    url.pathname === requestedUrl.pathname &&
    url.search === requestedUrl.search
  ) {
    url.hash = requestedUrl.hash;
  }

  return { ...result, url };
};

const cacheLifetime = (headers) => {
  const policy = headers.get("cache-control") ?? "";
  if (/(?:^|,)\s*(?:no-store|no-cache)(?:\s*(?:,|$|=))/i.test(policy)) return 0;
  const maxAge = /(?:^|,)\s*max-age\s*=\s*"?(\d+)/i.exec(policy);
  const age = Number(headers.get("age")) || 0;
  return maxAge ? Math.max(0, Number(maxAge[1]) - age) * 1000 : Infinity;
};

const requestFragment = async ({ controller, onFrame, onUrl, slot, url }) => {
  const name = requestedSlot(slot);
  let current = url;
  let lifetime = Infinity;
  for (let redirects = 0; redirects <= 8; redirects++) {
    onUrl(current);
    const response = await fetch(fragmentUrl(current), {
      headers: {
        "x-fragment": "true",
        [protocolHeader]: protocolVersion,
        ...(name ? { "x-fragment-slot": name } : {}),
      },
      signal: controller.signal,
    });
    lifetime = Math.min(lifetime, cacheLifetime(response.headers));
    const redirect = response.headers.get("x-nativefragments-redirect");
    if (redirect) {
      await response.body?.cancel();
      const next = new URL(redirect, current);
      if (!redirect.includes("#")) next.hash = current.hash;
      if (next.origin !== url.origin) {
        const error = new Error("Fragment response redirected across origins");
        error.name = "NativeFragmentsCrossOriginRedirectError";
        error.url = next;
        throw error;
      }
      current = next;
      continue;
    }
    if (!response.ok) throw new Error(`Fragment request failed: ${response.status}`);
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().startsWith("text/html")) {
      await response.body?.cancel();
      const error = new Error(`Fragment response was not HTML: ${contentType || "unknown"}`);
      error.name = "NativeFragmentsNonHtmlResponseError";
      throw error;
    }
    const finalUrl = responseUrl(response, current);
    if (redirects && !finalUrl.hash) finalUrl.hash = current.hash;
    onUrl(finalUrl);
    const token = response.headers.get(streamHeader);
    if (token && response.body) {
      const html = await readFragmentStream(response.body, token, (frame, index) =>
        onFrame({ html: frame, index, streaming: true, url: finalUrl }));
      return { html, streaming: true, url: finalUrl, lifetime };
    }
    const html = await response.text();
    await onFrame({ html, index: 0, streaming: false, url: finalUrl });
    return { html, streaming: false, url: finalUrl, lifetime };
  }
  throw new Error("Too many fragment redirects");
};

const queueFrame = (subscriber, frame) => {
  subscriber.queue = subscriber.queue.then(async () => {
    if (!subscriber.active || subscriber.error) return;
    try {
      await subscriber.onFrame(frame);
    } catch (error) {
      subscriber.error = error;
      subscriber.active = false;
      subscriber.reject?.(error);
    }
  });
  return subscriber.queue;
};

/**
 * Private fragment transport/cache module used by the browser router.
 * @private
 * @param {{ maxEntries?: number, maxBytes?: number }} [options]
 */
export const createFragmentLoader = ({ maxEntries = 100, maxBytes = 2_000_000 } = {}) => {
  const cache = new Map();
  const records = new Map();
  const inFlight = new Map();
  const encoder = new TextEncoder();
  let bytes = 0;
  let generation = 0;
  let expiryTimer;

  const evict = (record) => {
    if (!records.delete(record)) return;
    bytes -= record.size;
    for (const key of record.keys) if (cache.get(key)?.record === record) cache.delete(key);
  };
  const prune = () => {
    for (const record of records.keys()) if (record.expires <= Date.now()) evict(record);
  };
  const scheduleExpiry = () => {
    clearTimeout(expiryTimer);
    if (!records.size) return;
    const expires = Math.min(...[...records.keys()].map(record => record.expires));
    expiryTimer = setTimeout(() => { prune(); scheduleExpiry(); }, Math.min(2_147_483_647, Math.max(0, expires - Date.now())));
    expiryTimer.unref?.();
  };
  const writeCache = (entry, result) => {
    prune();
    const lifetime = Math.min(entry.ttl, result.lifetime);
    const size = encoder.encode(result.html).length;
    if (!(lifetime > 0) || !Number.isFinite(lifetime) || maxEntries <= 0 || size > maxBytes) return;
    const keys = new Set([...entry.urls].map(href => cacheKey(new URL(href), entry.slot)));
    for (const key of keys) if (cache.has(key)) evict(cache.get(key).record);
    const record = { size, keys, expires: Date.now() + lifetime };
    records.set(record, true);
    bytes += size;
    const cached = { ...result, timestamp: Date.now() };
    for (const key of keys) {
      const targetUrl = new URL(result.url);
      if (key === cacheKey(result.url, entry.slot) && key !== entry.key) targetUrl.hash = "";
      cache.set(key, { record, result: { ...cached, url: targetUrl } });
    }
    while (records.size > maxEntries || bytes > maxBytes) evict(records.keys().next().value);
    scheduleExpiry();
  };
  const validCacheEntry = (url, slot, ttl) => {
    prune();
    const entry = cache.get(cacheKey(url, slot));
    if (!entry) return null;
    if (Date.now() - entry.result.timestamp >= ttl) { evict(entry.record); return null; }
    records.delete(entry.record);
    records.set(entry.record, true);
    return entry.result;
  };

  const startRequest = ({ slot, ttl, url }) => {
    const key = cacheKey(url, slot);
    const entry = {
      controller: new AbortController(), frames: [], key, promise: null, slot, ttl,
      subscribers: new Set(), prefetches: 0, done: false, generation,
      urls: new Set([url.href]),
    };
    inFlight.set(key, entry);
    entry.promise = requestFragment({
      controller: entry.controller, slot, url,
      onUrl: (next) => entry.urls.add(next.href),
      onFrame: (frame) => {
        entry.frames.push(frame);
        for (const subscriber of entry.subscribers) queueFrame(subscriber, frame);
      },
    }).then((result) => {
      if (inFlight.get(key) === entry && !entry.controller.signal.aborted && entry.generation === generation) writeCache(entry, result);
      return result;
    }).finally(() => {
      entry.done = true;
      if (inFlight.get(key) === entry) inFlight.delete(key);
    });
    void entry.promise.catch(() => {});
    return entry;
  };
  const release = (entry) => {
    if (!entry.done && !entry.subscribers.size && !entry.prefetches) {
      entry.controller.abort();
      if (inFlight.get(entry.key) === entry) inFlight.delete(entry.key);
    }
  };
  const consumeEntry = async (entry, onFrame, signal) => {
    const subscriber = { active: true, error: null, onFrame, queue: Promise.resolve(), reject: null };
    const failed = new Promise((_, reject) => { subscriber.reject = reject; });
    const combined = signal ? AbortSignal.any([signal, entry.controller.signal]) : entry.controller.signal;
    const abort = () => { subscriber.active = false; };
    combined.addEventListener("abort", abort, { once: true });
    entry.subscribers.add(subscriber);
    for (const frame of entry.frames) queueFrame(subscriber, frame);
    try {
      if (combined.aborted) { abort(); throw abortError(combined); }
      const result = await waitFor(Promise.race([entry.promise, failed]), combined);
      await waitFor(subscriber.queue, combined);
      if (subscriber.error) throw subscriber.error;
      return result;
    } finally {
      subscriber.active = false;
      subscriber.reject = null;
      combined.removeEventListener("abort", abort);
      entry.subscribers.delete(subscriber);
      release(entry);
    }
  };
  const consume = async ({ onFrame, signal, slot, ttl, url }) => {
    if (signal?.aborted) throw abortError(signal);
    const cached = validCacheEntry(url, slot, ttl);
    if (cached) {
      const result = consumerResult(cached, url);
      await waitFor(Promise.resolve(onFrame({ html: result.html, index: 0, streaming: false, url: result.url })), signal);
      if (signal?.aborted) throw abortError(signal);
      return { ...result, streaming: false };
    }
    const key = cacheKey(url, slot);
    const entry = inFlight.get(key) ?? startRequest({ slot, ttl, url });
    return consumerResult(await consumeEntry(entry, (frame) => onFrame(consumerResult(frame, url)), signal), url);
  };
  const prefetch = async ({ signal, slot, ttl, url }) => {
    if (signal?.aborted) throw abortError(signal);
    if (validCacheEntry(url, slot, ttl)) return;
    const key = cacheKey(url, slot);
    const entry = inFlight.get(key) ?? startRequest({ slot, ttl, url });
    entry.prefetches++;
    try { await waitFor(entry.promise, signal); }
    finally { entry.prefetches--; release(entry); }
  };
  const invalidate = (url, { slot } = {}) => {
    generation++;
    const matches = (href, itemSlot) => !url ||
      (fragmentUrl(new URL(href)) === fragmentUrl(url) && (slot === undefined || requestedSlot(slot) === requestedSlot(itemSlot)));
    for (const record of records.keys()) {
      if (!url || [...record.keys].some(key => slot === undefined
        ? key === fragmentUrl(url) || key.startsWith(`${fragmentUrl(url)}::`)
        : key === cacheKey(url, slot))) evict(record);
    }
    for (const [key, entry] of inFlight) {
      if (![...entry.urls].some(href => matches(href, entry.slot))) continue;
      entry.controller.abort();
      inFlight.delete(key);
    }
    scheduleExpiry();
  };
  return Object.freeze({ consume, invalidate, prefetch });
};
