export const equals = Symbol();
export const group = Symbol();
export const max = Symbol();
export const subarray = Symbol();
export const sum = Symbol();
export const transpose = Symbol();
export const windowed = Symbol();
export const zip = Symbol();

declare global {
    interface Array<T> {
        [equals]: (arr: T[]) => boolean;
        [group]: (size: number) => T[][];
        [max]: (this: number[]) => number;
        [subarray]: (start: number, end?: number) => T[];
        [sum]: (this: number[]) => number;
        [transpose]: () => T[];
        [windowed]: (size: number) => T[][];
        [zip]: () => T[];
    }
}

Array.prototype[equals] = function <T>(this: T[], other: T[]): boolean {
    if (this.length !== other.length) {
        return false;
    }

    for (let i = 0; i < this.length; i++) {
        if (this[i] !== other[i]) {
            return false;
        }
    }

    return true;
};

/**
 * Splits the array into groups. Throws an error if the array can't be evenly
 * divided.
 * @param size - The size of each group.
 */
Array.prototype[group] = function <T>(size: number) {
    if (this.length % size) {
        throw new Error("Array items can't be grouped without leftovers");
    }

    const groups: T[][] = [];

    for (let i = 0; i < this.length; i += size) {
        groups.push(this.slice(i, i + size));
    }

    return groups;
};

Array.prototype[max] = function (this: number[]): number {
    return this.reduce((max, num) => Math.max(max, num), -Infinity);
};

/**
 * Emulates String.prototype.substring
 * @param start - The index of the first item to include
 * @param [end] - The index of the first item to exclude
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

Array.prototype[sum] = function (this: number[]): number {
    return this.reduce((acc, num) => acc + num, 0);
};

Array.prototype[transpose] = function <T>(this: T[][]): T[][] {
    if (this.length === 0) {
        return [];
    }

    const isEveryRowSameLength = this.every(row => row.length === this[0].length);

    if (!isEveryRowSameLength) {
        throw new Error();
    }

    const collen = this.length;
    const rowlen = this[0].length;
    const transposed = Array.from({ length: rowlen }, () => Array(collen));

    for (let j = 0; j < rowlen; j++) {
        for (let i = 0; i < collen; i++) {
            transposed[j][i] = this[i][j];
        }
    }

    return transposed;
};

/**
 * Returns a list of subarrays of the given size sliding along the given array.
 * @param size - The size of the subarrays
 */
Array.prototype[windowed] = function <T>(size: number) {
    const res: T[][] = [];

    for (let i = 0; i < this.length - size + 1; i++) {
        res.push(this.slice(i, i + size));
    }

    return res;
};

Array.prototype[zip] = function () {
    const arr = [];

    for (let i = 0; i < this[0].length; i++) {
        const a = this.reduce((a, b) => [...a, b[i]], []);
        arr.push(a);
    }

    return arr;
};
