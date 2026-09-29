export const defaultDeferredTimeout: 15000;
export function createRouteContext({ deferred, fallbackDeferredTimeout, match, request, scope, }: {
    deferred: unknown[];
    fallbackDeferredTimeout: number | null;
    match: import("./router.js").Route;
    request: Request;
    scope?: import("./context.js").RequestContext;
}): import("./router.js").RouteContext;
export function warnForMissingDeferredSlots(rendered: any): void;
export function inlineDeferredFragments(rendered: any): Promise<any>;
export function renderDeferredFragment(task: any, { document }?: {
    document?: boolean;
}): Promise<import("./html.js").RawHtml>;
export function deferredFragmentBootstrap({ nonce }?: {}): import("./html.js").RawHtml;
