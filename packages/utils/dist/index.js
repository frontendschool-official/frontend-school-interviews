export class AppError extends Error {
    constructor(code, message, details) {
        super(message);
        this.code = code;
        this.details = details;
    }
}
export const nowUnixMs = () => Date.now();
export const createId = () => {
    // RFC4122-like light UUID v4 (for server-side, consider crypto.randomUUID())
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
        return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
export const ok = (value) => ({ ok: true, value });
export const err = (error) => ({
    ok: false,
    error,
});
