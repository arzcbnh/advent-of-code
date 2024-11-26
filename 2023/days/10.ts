import { convertToEnum } from "#utils/convertToEnum";

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

interface Tile {
    pipe: Pipe;
    loc: Location;
    x: number;
    y: number;
}

type Grid = Tile[][] & { start: Tile };

interface Joint {
    up?: boolean;
    down?: boolean;
    left?: boolean;
    right?: boolean;
}

const JOINTS: Record<Pipe, Joint> = {
    [Pipe.None]: {},
    [Pipe.Start]: { up: true, right: true, down: true, left: true },
    [Pipe.Vertical]: { up: true, down: true },
    [Pipe.Horizontal]: { left: true, right: true },
    [Pipe.SouthWest]: { up: true, right: true },
    [Pipe.NorthWest]: { right: true, down: true },
    [Pipe.SouthEast]: { left: true, up: true },
    [Pipe.NorthEast]: { down: true, left: true },
} as const;

export function solve(sketch: string) {
    const tiles = sketch
        .split("\n")
        .map(line => line.split(""))
        .map((line, y) => line.map((char, x) => createTile(x, y, char)));

    const start = tiles.flat().find(tile => tile.pipe === Pipe.Start)!;
    const grid = Object.assign(tiles, { start });

    markPipes(grid);
    markInsideArea(grid);

    const flat = grid.flat();
    const part1 = flat.filter(tile => tile.loc === Location.Loop).length / 2;
    const part2 = flat.filter(tile => tile.loc === Location.Inside).length;

    return { part1, part2 };
}

function createTile(x: number, y: number, char: string): Tile {
    const pipe = convertToEnum(Pipe, char);
    const loc = Location.Unknown;

    return { x, y, pipe, loc };
}

function markPipes(grid: Grid): void {
    let curr: Tile | undefined = grid.start;
    let next: Tile | undefined;

    do {
        next = findNextPipe(grid, curr);
        curr.loc = Location.Loop;
        curr = next;
    } while (curr != null);
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
        let previousAngledPipe = Pipe.None;
        let isInside = false;

        for (const tile of row) {
            const { pipe, loc } = tile;

            if (isInside && loc === Location.Unknown) {
                tile.loc = Location.Inside;
                continue;
            }

            if (loc !== Location.Loop || pipe === Pipe.Horizontal) {
                continue;
            }

            isInside = isInside !== isChangingArea(pipe, previousAngledPipe);
            previousAngledPipe = pipe !== Pipe.Vertical ? pipe : previousAngledPipe;
        }
    }
}

function isChangingArea(curr: Pipe, prev: Pipe): boolean  {
    return (
        curr === Pipe.Vertical ||
        (prev === Pipe.SouthWest && curr === Pipe.NorthEast) ||
        (prev === Pipe.NorthWest && curr === Pipe.SouthEast)
    );
}
