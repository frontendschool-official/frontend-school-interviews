export declare class AppError extends Error {
    readonly code: string;
    readonly details?: unknown;
    constructor(code: string, message: string, details?: unknown);
}
export declare const nowUnixMs: () => number;
export declare const createId: () => string;
export type Result<T, E = AppError> = {
    ok: true;
    value: T;
} | {
    ok: false;
    error: E;
};
export declare const ok: <T>(value: T) => Result<T>;
export declare const err: <E extends AppError>(error: E) => Result<never, E>;
