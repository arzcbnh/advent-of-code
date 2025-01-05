export const equals = Symbol();
export const group = Symbol();
export const max = Symbol();
export const subarray = Symbol();
export const sum = Symbol();
export const transpose = Symbol();
export const windowed = Symbol();

declare global {
    interface Array<T> {
        [equals]: (arr: T[]) => boolean;
        [group]: (size: number) => T[][];
        [max]: (this: number[]) => number;
        [subarray]: (start: number, end?: number) => T[];
        [sum]: (this: number[]) => number;
        [transpose]: <T>(this: T[][]) => T[][];
        [windowed]: (size: number) => T[][];
    }
}

/**
 * Checks if every element between two arrays is equal.
 * @param other - The array to be compared to.
 */
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
Array.prototype[group] = function <T>(this: T[], size: number): T[][] {
    if (this.length % size) {
        throw new Error(`Array can't be grouped without ${this.length % size} leftover elements`);
    }

    const groups = [];

    for (let i = 0; i < this.length; i += size) {
        groups.push(this.slice(i, i + size));
    }

    return groups;
};

/**
 * Reduces an array of numbers to its maximum value.
 */
Array.prototype[max] = function (this: number[]): number {
    return this.reduce((max, num) => Math.max(max, num), -Infinity);
};

/**
 * Emulates String.prototype.substring.
 * @param start - The index of the first item to include.
 * @param [end] - The index of the first item to exclude.
 */
Array.prototype[subarray] = function <T>(this: T[], start: number, end?: number): T[] {
    const clamp = (x: number) => Math.max(0, Math.min(x, this.length));

    start = clamp(start);
    end = clamp(end ?? this.length);

    if (start > end) {
        const tmp = start;
        start = end;
        end = tmp;
    }

    return this.slice(start, end);
};

/**
 * Reduces an array of numbers to the sum of its values.
 */
Array.prototype[sum] = function (this: number[]): number {
    return this.reduce((acc, num) => acc + num, 0);
};

/**
 * Returns a new two-dimensional array with its elements transposed - that is,
 * rows are turned into columns, and columns are turned into rows.
 */
Array.prototype[transpose] = function <T>(this: T[][]): T[][] {
    if (this.length === 0) {
        return [];
    }

    // If a row has a different length from the others
    for (const [i, row] of this.entries()) {
        if (row.length !== this[0].length) {
            throw new Error(`Row with index ${i} has a different length from the first row`);
        }
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
 * @param size - The size of the subarrays.
 */
Array.prototype[windowed] = function <T>(size: number) {
    const res: T[][] = [];

    for (let i = 0; i < this.length - size + 1; i++) {
        res.push(this.slice(i, i + size));
    }

    return res;
};
