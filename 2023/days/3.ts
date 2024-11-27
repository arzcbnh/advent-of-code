import { subarray } from "utils/arrayx.js";
import { parse } from "utils/stringx.js";

type Match = RegExpExecArray;

interface Serial {
    value: number;
    start: number;
    end: number;
    row: number;
}

interface Star {
    ratio: number | null;
    column: number;
    row: number;
}

export function solve(schematic: Input): Solution {
    const lines = schematic.split("\n");

    const part1 = getSerials(lines)
        .filter(serial => isPart(lines, serial))
        .reduce((acc, serial) => acc + serial.value, 0);

    const part2 = getStars(lines)
        .map(star => setRatio(lines, star))
        .reduce((acc, star) => acc + (star.ratio ?? 0), 0);

    return { part1, part2 };
}

function getSerials(lines: string[]): Serial[] {
    const parsed = lines.map(line => line[parse](/\d+/g));
    const serials = parsed.flatMap((line, index) => line.map(match => buildSerialFromMatch(match, index)));

    return serials;
}

function buildSerialFromMatch(match: Match, row: number): Serial {
    const value = Number(match[0]);
    const start = match.index;
    const end = match.index + match[0].length;

    return { value, start, end, row };
}

function isPart(lines: string[], serial: Serial): boolean {
    const window = lines[subarray](serial.row - 1, serial.row + 2);
    const frames = window.map(line => line.substring(serial.start - 1, serial.end + 1));
    const symbols = frames.flatMap(line => line[parse](/[^.\d]/g));

    return symbols.some(symbol => symbol != null);
}

function getStars(lines: string[]): Star[] {
    const parsed = lines.map(line => line[parse](/\*/g));
    const stars = parsed.flatMap((line, row) => line.map(({ index: column }) => ({ row, column }) as Star));

    return stars;
}

function setRatio(lines: string[], star: Star): Star {
    const window = lines[subarray](star.row - 1, star.row + 2);
    const serials = getSerials(window);
    const around = serials.filter(serial => isSerialAroundStar(serial, star));
    const values = around.map(({ value }) => value);

    star.ratio = around.length === 2 ? values[0] * values[1] : null;
    return star;
}

function isSerialAroundStar(serial: Serial, star: Star) {
    return serial != null && serial.start <= star.column + 1 && serial.end >= star.column;
}
