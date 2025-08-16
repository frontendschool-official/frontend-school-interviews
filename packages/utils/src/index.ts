export class AppError extends Error {
  public readonly code: string;
  public readonly details?: unknown;
  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

export const nowUnixMs = (): number => Date.now();

export const createId = (): string => {
  // RFC4122-like light UUID v4 (for server-side, consider crypto.randomUUID())
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
    return (crypto as any).randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export type Result<T, E = AppError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export const ok = <T>(value: T): Result<T> => ({ ok: true, value });
export const err = <E extends AppError>(error: E): Result<never, E> => ({
  ok: false,
  error,
});
