import { sum } from "#root/utils/arrayx.js";

enum Rock {
    Round = "O",
    Cube = "#",
    None = ".",
}

type Platform = Rock[][];
type Direction = "north" | "south" | "east" | "west";

type TraversalOrder = {
    start: (len: number) => number;
    end: (len: number) => number;
    increment: 1 | -1;
};

type RockMovement = {
    getStartPosition: (x: number, y: number) => number;
    canMoveNext: (platform: Platform, x: number, y: number, curr: number) => boolean;
    placeRock: (platform: Platform, x: number, y: number, final: number) => void;
};

type OperationSet = {
    rowStart: (plat: Platform) => number;
    rowCheck: (plat: Platform, y: number) => boolean;
    rowIncrement: (y: number) => number;

    columnStart: (plat: Platform) => number;
    columnCheck: (plat: Platform, x: number) => boolean;
    columnIncrement: (x: number) => number;

    iterStart: (x: number, y: number) => number;
    iterCheck: (plat: Platform, x: number, y: number, curr: number) => boolean;
    iterIncrement: (curr: number) => number;

    placeRock: (plat: Platform, x: number, y: number, final: number) => void;
};

const OPERATION_SETS = {
    north: generateOperationSet("north"),
    south: generateOperationSet("south"),
    west: generateOperationSet("west"),
    east: generateOperationSet("east"),
} as const;

export function solve(note: Input): Solution {
    const platform = parsePlatform(note);

    const rolledNorth = clonePlatform(platform);
    const cycledBillion = clonePlatform(platform);
    const billionthCycle = detectBillionthCycleEquivalent(platform);

    rollStones(rolledNorth, OPERATION_SETS.north);
    for (let i = 0; i < billionthCycle; i++) {
        rollCycle(cycledBillion);
    }

    const part1 = calcTotalLoad(rolledNorth);
    const part2 = calcTotalLoad(cycledBillion);

    return { part1, part2 };
}

function parsePlatform(note: string): Platform {
    const platform = note.split("\n").map(line => line.split(""));
    assertPlatform(platform);

    return platform;
}

function assertPlatform(parsed: string[][]): asserts parsed is Platform {
    const expected = Object.values<string>(Rock);

    parsed.forEach((row, y) =>
        row.forEach((char, x) => {
            if (!expected.includes(char)) {
                throw new Error(`Invalid character '${char}' at row ${y}, column ${x}`);
            }
        })
    );
}

function rollStones(platform: Platform, op: OperationSet): void {
    for (let y = op.rowStart(platform); op.rowCheck(platform, y); y = op.rowIncrement(y)) {
        for (let x = op.columnStart(platform); op.columnCheck(platform, x); x = op.columnIncrement(x)) {
            if (platform[y][x] !== Rock.Round) {
                continue;
            }

            let i;
            platform[y][x] = Rock.None;

            for (i = op.iterStart(x, y); op.iterCheck(platform, x, y, i); i = op.iterIncrement(i));
            op.placeRock(platform, x, y, i);
        }
    }
}

function createTraversalOrder(dir: Direction): { row: TraversalOrder; column: TraversalOrder } {
    const defaultOrder = {
        start: () => 0,
        end: length => length,
        increment: 1,
    } satisfies TraversalOrder;

    const reverseOrder = {
        start: length => length - 1,
        end: () => -1,
        increment: -1,
    } satisfies TraversalOrder;

    switch (dir) {
        case "north":
        case "south":
            return {
                row: dir === "north" ? defaultOrder : reverseOrder,
                column: defaultOrder,
            };
        case "west":
        case "east":
            return {
                row: defaultOrder,
                column: dir === "west" ? defaultOrder : reverseOrder,
            };
    }
}

function createRockMovement(dir: Direction): RockMovement {
    switch (dir) {
        case "north":
            return {
                getStartPosition: (_x, y) => y,
                canMoveNext: (plat, x, _y, i) => i > 0 && plat[i - 1][x] === Rock.None,
                placeRock: (plat, x, _y, i) => (plat[i][x] = Rock.Round),
            };
        case "south":
            return {
                getStartPosition: (_x, y) => y,
                canMoveNext: (plat, x, _y, i) => i < plat.length - 1 && plat[i + 1][x] === Rock.None,
                placeRock: (plat, x, _y, i) => (plat[i][x] = Rock.Round),
            };
        case "west":
            return {
                getStartPosition: (x, _y) => x,
                canMoveNext: (plat, _x, y, i) => i > 0 && plat[y][i - 1] === Rock.None,
                placeRock: (plat, _x, y, i) => (plat[y][i] = Rock.Round),
            };
        case "east":
            return {
                getStartPosition: (x, _y) => x,
                canMoveNext: (plat, _x, y, i) => i < plat[y].length - 1 && plat[y][i + 1] === Rock.None,
                placeRock: (plat, _x, y, i) => (plat[y][i] = Rock.Round),
            };
    }
}

function generateOperationSet(dir: Direction): OperationSet {
    const traversal = createTraversalOrder(dir);
    const movement = createRockMovement(dir);

    return {
        rowStart: plat => traversal.row.start(plat.length),
        rowCheck: (plat, y) => y !== traversal.row.end(plat.length),
        rowIncrement: y => y + traversal.row.increment,

        columnStart: plat => traversal.column.start(plat.length),
        columnCheck: (plat, x) => x !== traversal.column.end(plat.length),
        columnIncrement: x => x + traversal.column.increment,

        iterStart: movement.getStartPosition,
        iterCheck: movement.canMoveNext,
        iterIncrement: dir === "north" || dir === "west" ? i => i - 1 : i => i + 1,
        placeRock: movement.placeRock,
    };
}

function rollCycle(platform: Platform): void {
    rollStones(platform, OPERATION_SETS.north);
    rollStones(platform, OPERATION_SETS.west);
    rollStones(platform, OPERATION_SETS.south);
    rollStones(platform, OPERATION_SETS.east);
}

function detectBillionthCycleEquivalent(platform: Platform): number {
    let tortoise = clonePlatform(platform);
    let hare = clonePlatform(platform);
    let length = 1;
    let start = 0;

    do {
        rollCycle(tortoise);
        rollCycle(hare);
        rollCycle(hare);
    } while (!equalsPlatform(tortoise, hare));

    for (tortoise = clonePlatform(platform); !equalsPlatform(tortoise, hare); start++) {
        rollCycle(tortoise);
        rollCycle(hare);
    }

    hare = clonePlatform(tortoise);
    for (rollCycle(hare); !equalsPlatform(tortoise, hare); length++) {
        rollCycle(hare);
    }

    const target = 1e9;
    const remaining = (target - start) % length;
    return start + remaining;
}

function calcTotalLoad(platform: Platform): number {
    return platform.map((row, y) => (platform.length - y) * row.filter(rock => rock === Rock.Round).length)[sum]();
}

function clonePlatform(plat: Platform): Platform {
    return plat.map(row => row.map(rock => rock));
}

function equalsPlatform(a: Platform, b: Platform): boolean {
    return joinPlatform(a) === joinPlatform(b);
}

function joinPlatform(plat: Platform): string {
    return plat.map(row => row.join("")).join("");
}
