import { subarray } from "#root/utils/arrayx.js";

type Part = {
    value: number;
    start: number;
    end: number;
    row: number;
};

type Gear = {
    ratio: number;
    column: number;
    row: number;
};

export function solve(schematic: Input): Solution {
    const lines = schematic.split("\n");
    const parts = createParts(lines);
    const gears = createGears(lines, parts);

    const part1 = parts.reduce((acc, part) => acc + part.value, 0);
    const part2 = gears.reduce((acc, gear) => acc + gear.ratio, 0);

    return { part1, part2 };
}

function createParts(lines: string[]): Part[] {
    const parsed = lines.map(line => Array.from(line.matchAll(/\d+/g)));
    const serials = parsed.flatMap((line, row) =>
        line.map(({ 0: match, index: start }) => {
            const value = Number(match);
            const end = start + match.length;

            return { value, start, end, row };
        })
    );

    const parts = serials.filter(serial => isPart(lines, serial));

    return parts;
}

function isPart(lines: string[], serial: Part): boolean {
    const window = lines[subarray](serial.row - 1, serial.row + 2);
    const frames = window.map(line => line.substring(serial.start - 1, serial.end + 1));
    const symbols = frames.map(line => line.match(/[^.\d]/g));

    return symbols.some(symbol => symbol != null);
}

function createGears(lines: string[], parts: Part[]): Gear[] {
    const parsed = lines.map(line => Array.from(line.matchAll(/\*/g)));
    const stars = parsed.flatMap((line, row) =>
        line.map(({ index: column }) => {
            const partsAround = parts.filter(part => isSerialAroundStar(part, row, column));
            const values = partsAround.map(({ value }) => value);
            const ratio = values.length === 2 ? values[0] * values[1] : null;

            return { row, column, ratio };
        })
    );

    const gears = stars.filter(isGear);

    return gears;
}

function isGear(star: Omit<Gear, "ratio"> & { ratio: number | null }): star is Gear {
    return star.ratio != null;
}

function isSerialAroundStar(serial: Part, row: number, column: number): boolean {
    return serial.row >= row - 1 && serial.row <= row + 1 && serial.start <= column + 1 && serial.end >= column;
}
