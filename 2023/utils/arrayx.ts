export const subarray = Symbol();
export const windowed = Symbol();

declare global {
    interface Array<T> {
        [subarray]: (start: number, end?: number) => T[];
        [windowed]: (size: number) => T[][];
    }
}

/**
 * Emulates String.prototype.substring
 */
Array.prototype[subarray] = function (start: number, end?: number) {
    const clamp = (x: number) => Math.max(0, Math.min(x, this.length));

    end = end ?? this.length;

    start = clamp(start);
    end = clamp(end);

    if (start > end) {
        const tmp = start;
        start = end;
        end = tmp;
    }

    return this.slice(start, end);
};

Array.prototype[windowed] = function <T>(size: number) {
    const res: T[][] = [];

    for (let i = 0; i < this.length - size + 1; i++) {
        res.push(this.slice(i, i + size));
    }

    return res;
};
