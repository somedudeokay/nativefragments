export function createFragmentLoader({ maxEntries, maxBytes }?: {
    maxEntries?: number;
    maxBytes?: number;
}): Readonly<{
    consume: ({ onFrame, signal, slot, ttl, url }: {
        onFrame: any;
        signal: any;
        slot: any;
        ttl: any;
        url: any;
    }) => Promise<any>;
    invalidate: (url: any, { slot }?: {}) => void;
    prefetch: ({ priority, signal, slot, ttl, url }: {
        priority: any;
        signal: any;
        slot: any;
        ttl: any;
        url: any;
    }) => Promise<void>;
}>;
