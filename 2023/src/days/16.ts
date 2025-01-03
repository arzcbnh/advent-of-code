import { max } from "#root/utils/arrayx.js";

const Mirror = {
    BottomUp: "/",
    TopDown: "\\",
} as const;

const Splitter = {
    Horizontal: "-",
    Vertical: "|",
} as const;

const Part = { ...Mirror, ...Splitter, Empty: "." } as const;
type Part = (typeof Part)[keyof typeof Part];

const Direction = ["north", "south", "west", "east"] as const;
type Direction = (typeof Direction)[number];

type Index2D = {
    x: number;
    y: number;
};

type Contraption = Part[][];
type DirectionTracker = Record<Direction, boolean>;
type Beam = Index2D & { direction: Direction };

type Simulation = {
    readonly contraption: Contraption;
    readonly trackers: DirectionTracker[][];
    readonly beams: Set<Beam>;
};

const TOP_DOWN_REFLECTION_MAP = {
    north: "west",
    south: "east",
    west: "north",
    east: "south",
} as const;

const BOTTOM_UP_REFLECTION_MAP = {
    north: "east",
    south: "west",
    west: "south",
    east: "north",
} as const;

const BEAM_REFLECTORS = {
    [Mirror.TopDown]: TOP_DOWN_REFLECTION_MAP,
    [Mirror.BottomUp]: BOTTOM_UP_REFLECTION_MAP,
} as const;

const BEAM_SPLITTERS = {
    [Splitter.Horizontal]: ["west", "east"],
    [Splitter.Vertical]: ["north", "south"],
} as const;

export function solve(layout: Input): Solution {
    const contraption = parseLayout(layout);
    const energizedCount = generateSimulations(contraption)
        .map(sim => (runSimulation(sim), sim))
        .map(countEnergized)
        .toArray();

    const part1 = energizedCount[0];
    const part2 = energizedCount[max]();

    return { part1, part2 };
}

function parseLayout(layout: string): Contraption {
    const grid = layout.split("\n").map(line => line.split(""));
    assertContraption(grid);

    return grid;
}

function assertContraption(grid: string[][]): asserts grid is Contraption {
    const parts = Object.values<string>(Part);

    for (const [y, row] of grid.entries()) {
        for (const [x, char] of row.entries()) {
            if (!parts.includes(char)) {
                throw new Error(`Invalid character ${char} at row ${y}, column ${x}`);
            }
        }
    }
}

function createTracker(): DirectionTracker {
    return {
        north: false,
        south: false,
        west: false,
        east: false,
    };
}

function createSimulation(contraption: Contraption, start: Beam): Simulation {
    const trackers = contraption.map(row => row.map(createTracker));
    const beams = new Set<Beam>();
    beams.add(start);

    return { contraption, trackers, beams };
}

function* generateSimulations(contraption: Contraption): Generator<Simulation> {
    for (let y = 0; y < contraption.length; y++) {
        yield createSimulation(contraption, { x: -1, y, direction: "east" });
        yield createSimulation(contraption, { x: contraption[0].length, y, direction: "west" });
    }

    for (let x = 0; x < contraption[0].length; x++) {
        yield createSimulation(contraption, { x, y: -1, direction: "south" });
        yield createSimulation(contraption, { x, y: contraption.length, direction: "north" });
    }
}

function runSimulation(sim: Simulation): void {
    const { contraption, trackers, beams } = sim;

    while (beams.size > 0) {
        for (const [beam] of beams.entries()) {
            const next = calcNextTile(beam);
            beams.delete(beam);

            if (isOutOfBounds(contraption, next) || isLooping(trackers, next, beam)) {
                continue;
            }

            moveBeam(sim, beam, next);
        }
    }
}

function moveBeam(sim: Simulation, beam: Beam, index: Index2D) {
    const { contraption, trackers, beams } = sim;
    const { x, y } = index;
    const part = contraption[y][x];
    trackers[y][x][beam.direction] = true;

    switch (part) {
        case Splitter.Horizontal:
        case Splitter.Vertical:
            BEAM_SPLITTERS[part].forEach(direction => beams.add({ ...index, direction }));
            break;
        case Mirror.BottomUp:
        case Mirror.TopDown:
            beams.add({ ...index, direction: BEAM_REFLECTORS[part][beam.direction] });
            break;
        case Part.Empty:
            beams.add({ ...beam, ...index });
    }
}

function countEnergized({ trackers }: Simulation): number {
    return trackers.flat().filter(tracker => Direction.some(dir => tracker[dir])).length;
}

function calcNextTile(beam: Beam): Index2D {
    const { direction } = beam;
    const x = beam.x + Number(direction === "east") - Number(direction === "west");
    const y = beam.y + Number(direction === "south") - Number(direction === "north");

    return { x, y };
}

function isOutOfBounds(arr: unknown[][], { x, y }: Index2D): boolean {
    return !(y >= 0 && x >= 0 && y < arr.length && x < arr[y].length);
}

function isLooping(tracks: DirectionTracker[][], next: Index2D, beam: Beam): boolean {
    return tracks[next.y][next.x][beam.direction];
}
