import { sum } from "#root/utils/arrayx.js";

enum Rock {
    Round = "O",
    Cube = "#",
    None = ".",
}

type Platform = Rock[][];

function print(plat: Platform) {
    // plat.forEach(line => console.log(line.join("")));
    // console.log();
}

export function solve(note: Input): Solution {
    const platform = parsePlatform(note);
    const rolled = rollStonesNorth(platform);

    const part1 = rolled.map((row, y) => (rolled.length - y) * row.filter(rock => rock === Rock.Round).length)[sum]();

    let other = platform;
    
    for (let i = 0; i < 1000; i++) {
        other = rollStonesCycle(other);
    // console.log(other.map((row, y) => (rolled.length - y) * row.filter(rock => rock === Rock.Round).length)[sum]());
}

    const part2 = other.map((row, y) => (rolled.length - y) * row.filter(rock => rock === Rock.Round).length)[sum]();

    return { part1, part2 };
}

function parsePlatform(note: string): Platform {
    const platform = note.split("\n").map(line => line.split(""));
    assertPlatform(platform);

    return platform;
}

function assertPlatform(parsed: string[][]): asserts parsed is Platform {
    const expected = Object.values<string>(Rock);

    for (let y = 0; y < parsed.length; y++) {
        for (let x = 0; x < parsed[y].length; x++) {
            const char = parsed[y][x];

            if (!expected.includes(char)) {
                throw new Error(`Invalid character '${char}' at row ${y}, column ${x}`);
            }
        }
    }
}

function rollStonesNorth(platform: Platform): Platform {
    const rolled = [];

    for (const row of platform) {
        rolled.push(Array.from(row));

        for (let y = 0; y < rolled.length; y++) {
            for (let x = 0; x < rolled.length; x++) {
                if (rolled[y][x] != Rock.Round) {
                    continue;
                }

                rolled[y][x] = Rock.None;
                let n;

                for (n = y; n > 0 && rolled[n - 1][x] === Rock.None; n--);

                rolled[n][x] = Rock.Round;
            }
        }
    }

    return rolled;
}

function rollStonesCycle(platform: Platform): Platform {
    const rolled = platform.map(row => row.map(rock => rock));

    for (let y = 0; y < rolled.length; y++) {
        for (let x = 0; x < rolled[y].length; x++) {
            if (rolled[y][x] != Rock.Round) {
                continue;
            }

            rolled[y][x] = Rock.None;
            let n;

            for (n = y; n > 0 && rolled[n - 1] && rolled[n-1][x] === Rock.None; n--);
            rolled[n][x] = Rock.Round;
        }
    }
    print(rolled);

    for (let y = 0; y < rolled.length; y++) {
        for (let x = 0; x < rolled[y].length; x++) {
            if (rolled[y][x] != Rock.Round) {
                continue;
            }

            rolled[y][x] = Rock.None;
            let n;

            for (n = x; n > 0 && rolled[y][n - 1] === Rock.None; n--);
            rolled[y][n] = Rock.Round;
        }
    }
    print(rolled);
    
    for (let y = rolled.length - 1; y >= 0; y--) {
        for (let x = 0; x < rolled[y].length; x++) {
            if (rolled[y][x] != Rock.Round) {
                continue;
            }

            rolled[y][x] = Rock.None;
            let n;

            for (n = y; n < rolled.length && rolled[n + 1] && rolled[n + 1][x] === Rock.None; n++);
            rolled[n][x] = Rock.Round;
        }
    }
    print(rolled);

    for (let y = 0; y < rolled.length; y++) {
        for (let x = rolled[y].length - 1; x >= 0; x--) {
            if (rolled[y][x] != Rock.Round) {
                continue;
            }

            rolled[y][x] = Rock.None;
            let n;

            for (n = x; n < rolled[y].length && rolled[y][n + 1] === Rock.None; n++);
            rolled[y][n] = Rock.Round;
        }
    }
    print(rolled);

    return rolled;
}
