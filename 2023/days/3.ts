import { subarray } from "#utils/arrayx";

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

export function solve(schematic: string) {
    const part1 = getSerials(schematic)
        .filter(serial => isSerial(schematic, serial))
        .reduce((acc, serial) => acc + serial.value, 0);

    const part2 = getStars(schematic)
        .map(star => setRatio(schematic, star))
        .reduce((acc, star) => acc + (star.ratio ?? 0), 0);

    return { part1, part2 };
}

function getSerials(schematic: string): Serial[] {
    const lines = schematic.split("\n");
    const parsed = lines.map(line => line.matchAll(/\d+/g).toArray());
    const serials = parsed.flatMap((line, index) => line.map(match => buildSerialFromMatch(match, index)));

    return serials;
}

function buildSerialFromMatch(match: Match, row: number): Serial {
    const value = Number(match[0]);
    const start = match.index;
    const end = match.index + match[0].length;

    return { value, start, end, row };
}

function isSerial(schematic: string, serial: Serial): boolean {
    const lines = schematic.split("\n")[subarray](serial.row - 1, serial.row + 2);
    const frames = lines.map(line => line.substring(serial.start - 1, serial.end + 1));
    const symbols = frames.flatMap(line => line.matchAll(/[^.\d]/g).toArray());

    return symbols.some(symbol => symbol != null);
}

function getStars(schematic: string): Star[] {
    const lines = schematic.split("\n");
    const parsed = lines.map(line => line.matchAll(/\*/g).toArray());
    const stars = parsed.flatMap((line, row) => line.map(({ index: column }) => ({ row, column }) as Star));

    return stars;
}

function setRatio(schematic: string, star: Star): Star {
    const lines = schematic.split("\n")[subarray](star.row - 1, star.row + 2);
    const serials = getSerials(lines.join("\n"));
    const around = serials.filter(serial => isSerialAroundStar(serial, star));
    const values = around.map(({ value }) => value);

    star.ratio = around.length === 2 ? values[0] * values[1] : null;
    return star;
}

function isSerialAroundStar(serial: Serial, star: Star) {
    return serial != null && serial.start <= star.column + 1 && serial.end >= star.column;
}
