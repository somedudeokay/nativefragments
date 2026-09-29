export function createNavigationScope(): {
    abortAll: () => void;
    close(): void;
    begin(target: any, signal: any): {
        id: number;
        target: any;
        controller: AbortController;
        readonly signal: AbortSignal;
        check(): void;
        commit(update: any): any;
        wait(promise: any): Promise<any>;
        finish(): void;
    };
};
