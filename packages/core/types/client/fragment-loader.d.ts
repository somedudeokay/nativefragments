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
    prefetch: ({ signal, slot, ttl, url }: {
        signal: any;
        slot: any;
        ttl: any;
        url: any;
    }) => Promise<void>;
}>;
