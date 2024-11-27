import { zip } from "utils/arrayx.js";

export function solve(sheet: Input): Solution {
    const kernedRace = [sheet.replace(/ /g, "").match(/\d+/g)!.map(Number)];
    const races = sheet.split("\n").map(line => line.match(/\d+/g)!.map(Number));

    // When zipping the races at the variable definition, Prettier breaks it
    // into a new line, which causes ESLint to complain.
    const part1 = calcWaysToWin(races[zip]());
    const part2 = calcWaysToWin(kernedRace);

    return { part1, part2 };
}

function calcWaysToWin(races: number[][]): number {
    return races
        .map(({ 0: time, 1: distance }) => bhaskara(1, -time, distance))
        .map(({ 0: min, 1: max }) => Math.ceil(max) - Math.floor(min) - 1)
        .reduce((acc, ways) => acc * ways);
}

function bhaskara(a: number, b: number, c: number): [number, number] {
    const sqrt = Math.sqrt(b ** 2 - 4 * a * c);
    const xs = [((-b + sqrt) / 2) * a, ((-b - sqrt) / 2) * a] satisfies [number, number];
    return xs.sort((a, b) => a - b);
}
