import { parse } from "utils/stringx.js";

const SPELLED_DIGITS: { [key: string]: number } = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
} as const;

const spelledToDigit = (num: string) => SPELLED_DIGITS[num] ?? num;
const sumValues = (sum: number, val: number) => sum + val;

export function solve(document: Input): Solution {
    const part1 = sumValuesIn(document, /\d/g);
    const part2 = sumValuesIn(document, /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g);

    return { part1, part2 };
}

function sumValuesIn(document: string, pattern: RegExp) {
    return document
        .split("\n")
        .map(line => {
            const digits = line[parse](pattern).flat().filter(Boolean).map(spelledToDigit);

            const first = digits.at(0);
            const last = digits.at(-1);
            const value = Number(`${first}${last}`);

            return value;
        })
        .reduce(sumValues, 0);
}
