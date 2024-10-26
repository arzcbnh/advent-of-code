import { parse } from "#utils/stringx";
import { zip } from "#utils/arrayx";

export function solve(sheet: string) {
    const kernedRace = [sheet.replace(/ /g, "")[parse](/\d+/g).map(Number)];
    const races = sheet
        .split("\n")
        .map(line => line[parse](/\d+/g).map(Number))
        [zip]();

    const part1 = calcWaysToWin(races);
    const part2 = calcWaysToWin(kernedRace);

    return { part1, part2 };
}

function calcWaysToWin(races: number[][]) {
    return races
        .map(({ 0: time, 1: distance }) => bhaskara(1, -time, distance))
        .map(({ 0: min, 1: max }) => Math.ceil(max) - Math.floor(min) - 1)
        .reduce((acc, ways) => acc * ways);
}

function bhaskara(a: number, b: number, c: number) {
    const sqrt = Math.sqrt(b ** 2 - 4 * a * c);
    return [((-b + sqrt) / 2) * a, ((-b - sqrt) / 2) * a].sort((a, b) => a - b);
}
