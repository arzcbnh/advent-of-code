import { sum } from "#root/utils/arrayx.js";
import { Graph } from "#root/utils/Graph.js";

type Range = {
    start: number;
    end: number;
}

type Coordinate = {
    x: number;
    y: number;
}

const Orientation = ["horizontal", "vertical"] as const;
type Orientation = (typeof Orientation)[number];

type Node = string;
type NodeStruct = Coordinate & { orientation?: Orientation }

const START_NODE_STRUCT: NodeStruct = { x: 0, y: 0 };
const START_NODE_KEY: Node = nodeStructToKey(START_NODE_STRUCT);

const COORDINATES_GETTER: Readonly<Record<Orientation, (struct: NodeStruct, diffs: number[]) => Coordinate[]>> = {
    "horizontal": ({ x, y }, diffs) => diffs.flatMap(diff => [{ x: x + diff, y }, { x: x - diff, y }]),
    "vertical": ({ x, y }, diffs) => diffs.flatMap(diff => [{ x, y: y + diff }, { x, y: y - diff }]),
}

const WEIGHT_GETTER: Readonly<Record<Orientation, (grid: number[][], source: Coordinate, target: Coordinate) => number>> = {
    "horizontal": (grid, source, target) => {
        const start = target.x < source.x ? target.x : source.x + 1;
        const end = target.x < source.x ? source.x : target.x + 1;
        return grid[source.y].slice(start, end)[sum]();
    },
    "vertical": (grid, source, target) => {
        const start = target.y < source.y ? target.y : source.y + 1;
        const end = target.y < source.y ? source.y : target.y + 1;
        return grid.slice(start, end).map(row => row[target.x])[sum]();
    },
}

export function solve(map: Input): Solution {
    const grid = map.split("\n").map(line => line.split("").map(Number));
    const minimalHeatloss = calcMinimalHeatloss(grid);

    const part1 = minimalHeatloss.basic;
    const part2 = minimalHeatloss.ultra;

    return { part1, part2 };
}

function calcMinimalHeatloss(grid: number[][]): { basic: number, ultra: number } {
    const y = grid.length - 1;
    const x = grid[y].length - 1;
    const targets = createNodes(x, y);
    const nodes = grid.flatMap((row, y) => row.flatMap((_, x) => createNodes(x, y)));
    nodes.push(START_NODE_KEY);

    const basicCauldronGraph = buildGraph(grid, nodes, { start: 1, end: 3 });
    const ultraCauldronGraph = buildGraph(grid, nodes, { start: 4, end: 10 });

    return {
        basic: pathfindCrucibles(basicCauldronGraph, targets),
        ultra: pathfindCrucibles(ultraCauldronGraph, targets),
    }
}

function buildGraph(grid: number[][], nodes: Node[], neighborRange: Range): Graph<Node> {
    const graph = new Graph<Node>(nodes);
    const width = grid[0].length;
    const height = grid.length;

    const differences = createDifferences(neighborRange);

    // Link start node
    linkToNeighbors(graph, grid, START_NODE_STRUCT, differences);

    // Link other nodes
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (const orientation of Orientation) {
                const struct = {x, y, orientation};
                linkToNeighbors(graph, grid, struct, differences);
            }
        }
    }

    return graph;
}

function pathfindCrucibles(graph: Graph<Node>, targets: Node[]): number {
    const { distance } = graph.dijkstra(START_NODE_KEY, targets.includes.bind(targets));
    const targetsHeatloss = targets.map(t => distance.get(t) ?? Infinity);

    return Math.min(...targetsHeatloss);
}

function linkToNeighbors(graph: Graph<string>, grid: number[][], source: NodeStruct, differences: number[]): void {
    const sourceKey = nodeStructToKey(source);

    function linkBasedOnOrientation(sourceOrientation: Orientation, targetOrientation: Orientation) {
        const coordinates = COORDINATES_GETTER[sourceOrientation](source, differences);
        const neighbors = coordinates.filter(coord => isInGrid(grid, coord));
        const targets = neighbors.map(target => {
            const key = nodeStructToKey({ ...target, orientation: targetOrientation });
            const weight = WEIGHT_GETTER[sourceOrientation](grid, source, target);
            return { key, weight };
        });

        for (const target of targets) {
            graph.link(sourceKey, target.key, target.weight);
        }
    }

    if (source.orientation !== "vertical") {
        linkBasedOnOrientation("horizontal", "vertical");
    }

    if (source.orientation !== "horizontal") {
        linkBasedOnOrientation("vertical", "horizontal");
    }
}

function createDifferences({ start, end }: Range): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function createNodes(x: number, y: number): Node[] {
    return Orientation.map(orientation => `${x},${y},${orientation}`);
}

function nodeStructToKey(struct: NodeStruct): Node {
    return `${struct.x},${struct.y},${struct.orientation}`;
}

function isInGrid(grid: number[][], { x, y }: Coordinate): boolean {
    return y >= 0 && x >= 0 && y < grid.length && x < grid[y].length;
}
