type Action<T extends string, P = null> = P extends null ? { type: T, payload?: never } : { type: T; payload: P };
