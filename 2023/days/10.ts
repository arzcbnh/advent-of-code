import { convertToEnum } from "utils/convertToEnum.js";

enum Location {
    Unknown,
    Inside,
    Loop,
}

enum Pipe {
    None = ".",
    Start = "S",
    Vertical = "|",
    Horizontal = "-",
    SouthWest = "L",
    NorthWest = "F",
    SouthEast = "J",
    NorthEast = "7",
}

type Tile = {
    pipe: Pipe;
    loc: Location;
    x: number;
    y: number;
};

type Grid = Tile[][] & { start: Tile };

type TrackingData = {
    isInside: boolean;
    prevAngledPipe: Pipe;
};

type Joint = {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
};

const JOINTS: Record<Pipe, Partial<Joint>> = {
    [Pipe.None]: {},
    [Pipe.Start]: { up: true, right: true, down: true, left: true },
    [Pipe.Vertical]: { up: true, down: true },
    [Pipe.Horizontal]: { left: true, right: true },
    [Pipe.SouthWest]: { up: true, right: true },
    [Pipe.NorthWest]: { right: true, down: true },
    [Pipe.SouthEast]: { left: true, up: true },
    [Pipe.NorthEast]: { down: true, left: true },
} as const;

export function solve(sketch: Input): Solution {
    const tiles = createTiles(sketch);
    const start = tiles.flat().find(tile => tile.pipe === Pipe.Start)!;
    const grid = Object.assign(tiles, { start });

    markPipes(grid);
    markInsideArea(grid);

    const flat = grid.flat();
    const part1 = flat.filter(tile => tile.loc === Location.Loop).length / 2;
    const part2 = flat.filter(tile => tile.loc === Location.Inside).length;

    return { part1, part2 };
}

function createTiles(sketch: string): Tile[][] {
    const tiles = sketch
        .split("\n")
        .map(line => line.split(""))
        .map((line, y) =>
            line.map((char, x) => {
                const loc = Location.Unknown;
                const pipe = convertToEnum(Pipe, char);

                return { x, y, loc, pipe };
            })
        );

    return tiles;
}

function markPipes(grid: Grid): void {
    let curr: Tile | undefined = grid.start;
    let next: Tile | undefined;

    while (curr != null) {
        next = findNextPipe(grid, curr);
        curr.loc = Location.Loop;
        curr = next;
    }
}

function findNextPipe(grid: Grid, pipe: Tile): Tile | undefined {
    const around = getSurroundings(grid, pipe);
    const next = around.find(tile => tile.loc !== Location.Loop && areConnected(pipe, tile));

    return next;
}

function getSurroundings(grid: Grid, pipe: Tile): Tile[] {
    const { x, y } = pipe;
    const around = [grid[y][x - 1], grid[y][x + 1], grid[y - 1]?.[x], grid[y + 1]?.[x]];

    return around.filter(Boolean);
}

function areConnected(a: Tile, b: Tile): boolean {
    const aJoints = JOINTS[a.pipe];
    const bJoints = JOINTS[b.pipe];

    return (
        (a.y > b.y && aJoints.up && bJoints.down) ||
        (a.y < b.y && aJoints.down && bJoints.up) ||
        (a.x < b.x && aJoints.right && bJoints.left) ||
        (a.x > b.x && aJoints.left && bJoints.right) ||
        false
    );
}

function markInsideArea(grid: Grid): void {
    for (const row of grid) {
        markInsideRow(row);
    }
}

function markInsideRow(row: Grid[number]): void {
    const data = {
        prevAngledPipe: Pipe.None,
        isInside: false,
    };

    for (const tile of row) {
        updateTileLocation(tile, data.isInside);

        if (!isRelevantPipe(tile)) {
            continue;
        }

        updateTrackingData(data, tile.pipe);
    }
}

function updateTileLocation(tile: Tile, isInside: boolean): void {
    const isUnknown = tile.loc === Location.Unknown;

    if (isInside && isUnknown) {
        tile.loc = Location.Inside;
    }
}

function isRelevantPipe(tile: Tile): boolean {
    const isInLoop = tile.loc === Location.Loop;
    const isHorizontal = tile.pipe === Pipe.Horizontal;

    return isInLoop && !isHorizontal;
}

function updateTrackingData(data: TrackingData, pipe: Pipe): void {
    const isInside = data.isInside !== isChangingArea(pipe, data.prevAngledPipe);
    const isVertical = pipe === Pipe.Vertical;
    const prevAngledPipe = isVertical ? data.prevAngledPipe : pipe;

    data.isInside = isInside;
    data.prevAngledPipe = prevAngledPipe;
}

function isChangingArea(curr: Pipe, prev: Pipe): boolean {
    return (
        curr === Pipe.Vertical ||
        (prev === Pipe.SouthWest && curr === Pipe.NorthEast) ||
        (prev === Pipe.NorthWest && curr === Pipe.SouthEast)
    );
}
