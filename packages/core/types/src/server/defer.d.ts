export const defaultDeferredTimeout: 15000;
export function createRouteContext({ deferred, fallbackDeferredTimeout, match, request, }: {
    deferred: unknown[];
    fallbackDeferredTimeout: number | null;
    match: import("./router.js").Route;
    request: Request;
}): import("./router.js").RouteContext;
export function inlineDeferredFragments(rendered: any): Promise<any>;
export function renderDeferredFragment(task: any): Promise<import("./html.js").RawHtml>;
export function deferredFragmentBootstrap({ nonce }?: {}): import("./html.js").RawHtml;
