import { sum } from "#root/utils/arrayx.js";

enum Direction {
    North,
    South,
    East,
    West,
}

enum Rock {
    Round = "O",
    Cube = "#",
    None = ".",
}

type Platform = Rock[][];

function print(plat: Platform) {
    plat.forEach(line => console.log(line.join("")));
    console.log();
}

export function solve(note: Input): Solution {
    const platform = parsePlatform(note);

    const rolledNorth = rollStones(platform.map(row => row.map(rock => rock)), Direction.North);
    const part1 = calcTotalLoad(rolledNorth);

    let tortoise = platform.map(row => row.map(rock => rock));
    let hare = platform.map(row => row.map(rock => rock));
    
    do {
        rollCycle(tortoise);
        rollCycle(hare);
        rollCycle(hare);
    } while (tortoise.map(row => row.join()).join() != hare.map(row => row.join()).join())

    tortoise = platform.map(row => row.map(rock => rock));
    let cycleStart = 0;

    while (tortoise.map(row => row.join()).join() != hare.map(row => row.join()).join()) {
        rollCycle(tortoise);
        rollCycle(hare);
        cycleStart++;
    }

    let cycleLength = 0;
    hare = tortoise.map(row => row.map(rock => rock));

    do {
        rollCycle(hare);
        cycleLength++;
    } while (tortoise.map(row => row.join()).join() != hare.map(row => row.join()).join())

    for (let i = 0; i < cycleStart + (1e9 - cycleStart) % cycleLength; i++) {
        rollCycle(platform);
    }

    const part2 = calcTotalLoad(platform);

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
            for (let x = 0; x < rolled[y].length; x++) {
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

    // north
    for (let y = 0; y < rolled.length; y++) {
        for (let x = 0; x < rolled[y].length; x++) {
            if (rolled[y][x] != Rock.Round) {
                continue;
            }

            rolled[y][x] = Rock.None;
            let n;

            for (n = y; n > 0 && rolled[n - 1] && rolled[n - 1][x] === Rock.None; n--);
            rolled[n][x] = Rock.Round;
        }
    }
    print(rolled);

    // west
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
    
    // south
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

    // east
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

function iter(rolled: Platform, fn: (x: number, y: number) => void) {
    for (let y = 0; y < rolled.length; y++) {
        for (let x = rolled[y].length - 1; x >= 0; x--) {
            if (rolled[y][x] != Rock.Round) {
                continue;
            }

            rolled[y][x] = Rock.None;
            fn(x, y);
        }
    }
    // print(rolled);
}

function rollStones(platform: Platform, dir: Direction): Platform {
    let x: number, y: number, i: number;

    const rowStart = dir == Direction.South ? platform.length - 1 : 0;
    const rowCheck = dir != Direction.South ? () => y < platform.length : () => y >= 0;
    const rowIncrement = dir == Direction.South ? () => y-- : () => y++;

    const columnStart = dir == Direction.East ? platform[0].length - 1 : 0;
    const columnCheck = dir != Direction.East ? () => x < platform[0].length : () => x >= 0;
    const columnIncrement = dir == Direction.East ? () => x-- : () => x++;

    const iterStart = dir == Direction.North || dir == Direction.South ? () => y : () => x;
    const iterCheck = dir == Direction.North ? () => i > 0 && platform[i - 1] && platform[i - 1][x] == Rock.None :
        dir == Direction.South ? () => i < platform.length && platform[i + 1] && platform[i + 1][x] == Rock.None :
        dir == Direction.West ? () => i > 0 && platform[y][i - 1] == Rock.None :
                        () => i < platform[0].length && platform[y][i + 1] == Rock.None;
    const iterIncrement = dir == Direction.North || dir == Direction.West ? () => i-- : () => i++;
    const setter = dir == Direction.North || dir == Direction.South ?
        () => platform[i][x] = Rock.Round : () => platform[y][i] = Rock.Round;
    // const rolled = [];

    // for (const row of platform) {
    // rolled.push(Array.from(row));

        for (y = rowStart; rowCheck(); rowIncrement()) {
            for (x = columnStart; columnCheck(); columnIncrement()) {
                if (platform[y][x] != Rock.Round) {
                    continue;
                }

                platform[y][x] = Rock.None;
                for (i = iterStart(); iterCheck(); iterIncrement());
                setter();
                // console.log(x, y, i);
                // print(platform);
            }
        }
        // print(platform)
    // }


    return platform;
}

function rollCycle(platform: Platform): Platform {
    rollStones(platform, Direction.North);
    rollStones(platform, Direction.West);
    rollStones(platform, Direction.South);
    rollStones(platform, Direction.East);

    return platform;
}

function calcTotalLoad(platform: Platform): number {
    return platform.map((row, y) => (platform.length - y) * row.filter(rock => rock === Rock.Round).length)[sum]();
}
