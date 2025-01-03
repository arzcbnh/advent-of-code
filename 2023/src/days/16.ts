// Constants
const Mirror = {
    BottomUp: "/",
    TopDown: "\\",
} as const;

const Splitter = {
    Horizontal: "-",
    Vertical: "|",
} as const;

const Part = { ...Mirror, ...Splitter, Empty: "." } as const;
const Direction = ["north", "south", "west", "east"] as const;

// Types
type Part = (typeof Part)[keyof typeof Part];
type Direction = (typeof Direction)[number];
type Beam = {
    x: number;
    y: number;
    direction: Direction;
};

type Tile = {
    part: Part;
    beams: Beam[];
};

type Contraption = Tile[][];
type Index2D = {
    x: number;
    y: number;
};

type Track = Record<Direction, boolean>;

// Implementation
export function solve(layout: Input): Solution {
    const contraption = parseLayout(layout);
    const allEntrances = (() => {
        const top = contraption[0].map((_, x) => ({ x, y: -1, direction: "south" }));
        const bot = contraption[contraption.length - 1].map((_, x) => ({
            x,
            y: contraption.length,
            direction: "north",
        }));
        const lef = contraption.map((_, y) => ({ x: -1, y, direction: "east" }));
        const rig = contraption.map((_, y) => ({ x: contraption[0].length, y, direction: "west" }));

        return top.concat(bot).concat(lef).concat(rig);
    })();

    const part1 = countEnergizedTiles(contraption, { x: -1, y: 0, direction: "east" });
    const part2 = allEntrances.reduce((max, ent) => {
        const energized = countEnergizedTiles(contraption, ent);
        return Math.max(max, energized);
    }, -Infinity);

    return { part1, part2 };
    // const beam = { direction: "east" } satisfies Beam;
}

function parseLayout(layout: string): Contraption {
    const grid = layout.split("\n").map(line => line.split(""));
    const contraption = grid.map(row =>
        row.map(char => {
            const part = char;
            const beams = [] satisfies unknown[];

            return { part, beams };
        })
    );

    assertContraption(contraption);
    return contraption;
}

function assertContraption(grid: { part: string; beams: unknown[] }[][]): asserts grid is Contraption {
    const parts = Object.values<string>(Part);

    for (const [y, row] of grid.entries()) {
        for (const [x, tile] of row.entries()) {
            if (!parts.includes(tile.part)) {
                throw new Error(`Invalid character ${tile.part} at row ${y}, column ${x}`);
            }
        }
    }
}

function createTrack(): Track {
    return {
        north: false,
        south: false,
        west: false,
        east: false,
    };
}

function countEnergizedTiles(contraption: Contraption, init: Beam): number {
    const tracks = contraption.map(row => row.map(createTrack));
    const beams = new Set([init]);

    while (beams.size > 0) {
        step(contraption, beams, tracks);
    }

    // printcont(tracks);
    return tracks.flat().filter(track => Direction.some(dir => track[dir])).length;
}

function step(contraption: Contraption, beams: Set<Beam>, tracks: Track[][]): void {
    for (const [beam] of beams.entries()) {
        const next = calcNextTile(beam);
        // console.log("doing sum'");
        // console.log(next);

        if (!isWithinBounds(contraption, next)) {
            // console.log("out");
            beams.delete(beam);
            continue;
        }

        if (tracks[next.y][next.x][beam.direction]) {
            // console.log("tracked");
            beams.delete(beam);
            continue;
        }

        const { part } = contraption[next.y][next.x];
        const track = tracks[next.y][next.x];
        track[beam.direction] = true;
        // printcont(tracks);

        switch (part) {
            case "-":
                if (beam.direction === "west" || beam.direction === "east") {
                    beams.add({ ...beam, ...next });
                    break;
                }

                beams.add({ ...next, direction: "west" });
                beams.add({ ...next, direction: "east" });
                break;
            case "|":
                if (beam.direction === "north" || beam.direction === "south") {
                    beams.add({ ...beam, ...next });
                    break;
                }

                beams.add({ ...next, direction: "north" });
                beams.add({ ...next, direction: "south" });
                break;
            case "/":
                if (beam.direction === "north") {
                    beams.add({ ...next, direction: "east" });
                } else if (beam.direction === "south") {
                    beams.add({ ...next, direction: "west" });
                } else if (beam.direction === "west") {
                    beams.add({ ...next, direction: "south" });
                } else {
                    beams.add({ ...next, direction: "north" });
                }
                break;
            case "\\":
                if (beam.direction === "north") {
                    beams.add({ ...next, direction: "west" });
                } else if (beam.direction === "south") {
                    beams.add({ ...next, direction: "east" });
                } else if (beam.direction === "west") {
                    beams.add({ ...next, direction: "north" });
                } else {
                    beams.add({ ...next, direction: "south" });
                }
                break;
            case ".":
                beams.add({ ...beam, ...next });
                break;
        }

        beams.delete(beam);
    }
}

function calcNextTile(beam: Beam): Index2D {
    const { direction } = beam;
    const x = beam.x + Number(direction === "east") - Number(direction === "west");
    const y = beam.y + Number(direction === "south") - Number(direction === "north");

    return { x, y };
}

function isWithinBounds(arr: unknown[][], { x, y }: Index2D): boolean {
    // console.log(`${y} >= 0, ${y >= 0}`);
    // console.log(`${x} >= 0, ${x >= 0}`);
    // console.log(`${y} < ${arr.length}, ${y < arr.length}`);
    // console.log(`${x} < ${arr[y].length}, ${y < arr[y].length}`);
    // console.log(arr.length, arr[y].length);
    return y >= 0 && x >= 0 && y < arr.length && x < arr[y].length;
}

function printcont(tracks: Track[][]) {
    console.log(
        tracks.map(row => row.map(track => (Direction.some(dir => track[dir]) ? "#" : ".")).join("")).join("\n")
    );
}
