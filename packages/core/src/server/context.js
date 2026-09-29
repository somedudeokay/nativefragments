/**
 * @typedef {object} RequestContext
 * @property {Request} request Original request.
 * @property {Record<string, unknown>} env Runtime bindings for this request.
 * @property {unknown} context Runtime execution context (for example waitUntil).
 * @property {Record<string, unknown>} locals Application state prepared once per request.
 * @property {AbortSignal} signal Request cancellation signal.
 * @property {URL} url Parsed request URL.
 * @property {URLSearchParams} query Parsed query parameters.
 */

/** @private
 * @param {{ request: Request, env?: Record<string, unknown>, context?: unknown, locals?: Record<string, unknown> }} options
 * @returns {RequestContext}
 */
export const createRequestContext = ({ request, env = {}, context, locals = {} }) => {
  const url = new URL(request.url);
  return { request, env, context, locals, signal: request.signal, url, query: url.searchParams };
};

/** Error observers cannot replace the original response, even if they reject. @private */
export const reportError = (onError, event) => {
  try {
    Promise.resolve(onError(event)).catch(() => {});
  } catch {}
};
