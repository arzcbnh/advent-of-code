import {BinaryHeap} from "#root/utils/biheap.js";
import {sum} from "#root/utils/arrayx.js";

const Direction = ["up", "down", "left", "right"] as const;
type Direction = (typeof Direction)[number];

type Graph = {
    nodes: string[];
    edges: Map<string, Map<string, number>>;
};

// type Node = {
//     heatloss: number;
//     neighbors: Node[];
// }

export function solve(map: Input): Solution {
    const grid = map.split("\n").map(line => line.split("").map(Number));

    // const stableCauldronGraph = buildStableCauldronGraph(map);
    // const totalHeatloss = calcTotalHeatloss(stableCauldronGraph.start);
    // const min = Math.min(...stableCauldronGraph.targets.map(target => totalHeatloss.get(target)).filter(n => n != undefined))

    const part1 = pathfindBasicCrucibles(grid);
    const part2 = pathfindUltraCrucibles(grid);

    return { part1, part2 };
}

function pathfindBasicCrucibles(grid: number[][]): number {
    const width = grid[0].length;
    const height = grid.length;
    const targets = [
        `${width - 1},${height - 1},1,up`,
        `${width - 1},${height - 1},2,up`,
        `${width - 1},${height - 1},3,up`,
        `${width - 1},${height - 1},1,down`,
        `${width - 1},${height - 1},2,down`,
        `${width - 1},${height - 1},3,down`,
        `${width - 1},${height - 1},1,left`,
        `${width - 1},${height - 1},2,left`,
        `${width - 1},${height - 1},3,left`,
        `${width - 1},${height - 1},1,right`,
        `${width - 1},${height - 1},2,right`,
        `${width - 1},${height - 1},3,right`,
    ];

    const graph = buildBasicCauldronGraph(grid);
    const { distance } = dijkstra(graph, "0,0,1,up");
    const targetsHeatloss = targets.map(t => distance.get(t) ?? Infinity);

    return Math.min(...targetsHeatloss);
}

function pathfindUltraCrucibles(grid: number[][]): number {
    const width = grid[0].length;
    const height = grid.length;
    const targets = [
        `${width - 1},${height - 1},4,up`,
        `${width - 1},${height - 1},5,up`,
        `${width - 1},${height - 1},6,up`,
        `${width - 1},${height - 1},7,up`,
        `${width - 1},${height - 1},8,up`,
        `${width - 1},${height - 1},9,up`,
        `${width - 1},${height - 1},10,up`,
        `${width - 1},${height - 1},4,down`,
        `${width - 1},${height - 1},5,down`,
        `${width - 1},${height - 1},6,down`,
        `${width - 1},${height - 1},7,down`,
        `${width - 1},${height - 1},8,down`,
        `${width - 1},${height - 1},9,down`,
        `${width - 1},${height - 1},10,down`,
        `${width - 1},${height - 1},4,left`,
        `${width - 1},${height - 1},5,left`,
        `${width - 1},${height - 1},6,left`,
        `${width - 1},${height - 1},7,left`,
        `${width - 1},${height - 1},8,left`,
        `${width - 1},${height - 1},9,left`,
        `${width - 1},${height - 1},10,left`,
        `${width - 1},${height - 1},4,right`,
        `${width - 1},${height - 1},5,right`,
        `${width - 1},${height - 1},6,right`,
        `${width - 1},${height - 1},7,right`,
        `${width - 1},${height - 1},8,right`,
        `${width - 1},${height - 1},9,right`,
        `${width - 1},${height - 1},10,right`,
    ];

    // const start = { heatloss: grid[0][0], neighbors: [layers.down[4][4][0], layers.right[4][0][4]] };
    const graph = buildUltraCauldronGraph(grid);
    const { distance } = dijkstra(graph, "0,0,4,up");
    const targetsHeatloss = targets.map(t => distance.get(t) ?? Infinity);



    return Math.min(...targetsHeatloss);

}

function buildBasicCauldronGraph(grid: number[][]): Graph {
    const width = grid[0].length;
    const height = grid.length;

    const edges = new Map<string, Map<string, number>>();
    const nodes = [];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const coords = [
                `${x},${y},1,up`,
                `${x},${y},2,up`,
                `${x},${y},3,up`,
                `${x},${y},1,down`,
                `${x},${y},2,down`,
                `${x},${y},3,down`,
                `${x},${y},1,left`,
                `${x},${y},2,left`,
                `${x},${y},3,left`,
                `${x},${y},1,right`,
                `${x},${y},2,right`,
                `${x},${y},3,right`,
            ];

            nodes.push(...coords);
            coords.forEach(coord => edges.set(coord, new Map()));
        }
    }

    /* eslint-disable @typescript-eslint/no-non-null-assertion --
     * Since every node has its edges map setup in a previous loop, every 'get'
     * is assured to be non-null.
    **/
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (y > 0) {
                edges.get(`${x},${y},1,up`)!.set(`${x},${y - 1},2,up`, grid[y - 1][x]);
                edges.get(`${x},${y},2,up`)!.set(`${x},${y - 1},3,up`, grid[y - 1][x]);
                edges.get(`${x},${y},1,left`)!.set(`${x},${y - 1},1,up`, grid[y - 1][x]);
                edges.get(`${x},${y},2,left`)!.set(`${x},${y - 1},1,up`, grid[y - 1][x]);
                edges.get(`${x},${y},3,left`)!.set(`${x},${y - 1},1,up`, grid[y - 1][x]);
                edges.get(`${x},${y},1,right`)!.set(`${x},${y - 1},1,up`, grid[y - 1][x]);
                edges.get(`${x},${y},2,right`)!.set(`${x},${y - 1},1,up`, grid[y - 1][x]);
                edges.get(`${x},${y},3,right`)!.set(`${x},${y - 1},1,up`, grid[y - 1][x]);
            }

            if (x > 0) {
                const weight = grid[y][x - 1];
                edges.get(`${x},${y},1,left`)!.set(`${x - 1},${y},2,left`, weight);
                edges.get(`${x},${y},2,left`)!.set(`${x - 1},${y},3,left`, weight);
                edges.get(`${x},${y},1,up`)!.set(`${x - 1},${y},1,left`, weight);
                edges.get(`${x},${y},2,up`)!.set(`${x - 1},${y},1,left`, weight);
                edges.get(`${x},${y},3,up`)!.set(`${x - 1},${y},1,left`, weight);
                edges.get(`${x},${y},1,down`)!.set(`${x - 1},${y},1,left`, weight);
                edges.get(`${x},${y},2,down`)!.set(`${x - 1},${y},1,left`, weight);
                edges.get(`${x},${y},3,down`)!.set(`${x - 1},${y},1,left`, weight);
            }

            if (y + 1 < height) {
                const weight = grid[y + 1][x];
                edges.get(`${x},${y},1,down`)!.set(`${x},${y + 1},2,down`, weight);
                edges.get(`${x},${y},2,down`)!.set(`${x},${y + 1},3,down`, weight);
                edges.get(`${x},${y},1,left`)!.set(`${x},${y + 1},1,down`, weight);
                edges.get(`${x},${y},2,left`)!.set(`${x},${y + 1},1,down`, weight);
                edges.get(`${x},${y},3,left`)!.set(`${x},${y + 1},1,down`, weight);
                edges.get(`${x},${y},1,right`)!.set(`${x},${y + 1},1,down`, weight);
                edges.get(`${x},${y},2,right`)!.set(`${x},${y + 1},1,down`, weight);
                edges.get(`${x},${y},3,right`)!.set(`${x},${y + 1},1,down`, weight);
            }

            if (x + 1 < width) {
                const weight = grid[y][x + 1];
                edges.get(`${x},${y},1,right`)!.set(`${x + 1},${y},2,right`, weight);
                edges.get(`${x},${y},2,right`)!.set(`${x + 1},${y},3,right`, weight);
                edges.get(`${x},${y},1,up`)!.set(`${x + 1},${y},1,right`, weight);
                edges.get(`${x},${y},2,up`)!.set(`${x + 1},${y},1,right`, weight);
                edges.get(`${x},${y},3,up`)!.set(`${x + 1},${y},1,right`, weight);
                edges.get(`${x},${y},1,down`)!.set(`${x + 1},${y},1,right`, weight);
                edges.get(`${x},${y},2,down`)!.set(`${x + 1},${y},1,right`, weight);
                edges.get(`${x},${y},3,down`)!.set(`${x + 1},${y},1,right`, weight);
            }
        }
    }
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    return { nodes, edges };
}

function buildUltraCauldronGraph(grid: number[][]): Graph {
    const width = grid[0].length;
    const height = grid.length;
    const edges = new Map<string, Map<string, number>>();
    const nodes = [];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const coords = [
                `${x},${y},4,up`,
                `${x},${y},5,up`,
                `${x},${y},6,up`,
                `${x},${y},7,up`,
                `${x},${y},8,up`,
                `${x},${y},9,up`,
                `${x},${y},10,up`,
                `${x},${y},4,down`,
                `${x},${y},5,down`,
                `${x},${y},6,down`,
                `${x},${y},7,down`,
                `${x},${y},8,down`,
                `${x},${y},9,down`,
                `${x},${y},10,down`,
                `${x},${y},4,left`,
                `${x},${y},5,left`,
                `${x},${y},6,left`,
                `${x},${y},7,left`,
                `${x},${y},8,left`,
                `${x},${y},9,left`,
                `${x},${y},10,left`,
                `${x},${y},4,right`,
                `${x},${y},5,right`,
                `${x},${y},6,right`,
                `${x},${y},7,right`,
                `${x},${y},8,right`,
                `${x},${y},9,right`,
                `${x},${y},10,right`,
            ];

            nodes.push(...coords);
            coords.forEach(coord => edges.set(coord, new Map()));
        }
    }

    /* eslint-disable @typescript-eslint/no-non-null-assertion --
     * Since every node has its edges map setup in a previous loop, every 'get'
     * is assured to be non-null.
     **/
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (y > 0) {
                const weight = grid[y - 1][x];
                edges.get(`${x},${y},4,up`)!.set(`${x},${y - 1},5,up`, weight);
                edges.get(`${x},${y},5,up`)!.set(`${x},${y - 1},6,up`, weight);
                edges.get(`${x},${y},6,up`)!.set(`${x},${y - 1},7,up`, weight);
                edges.get(`${x},${y},7,up`)!.set(`${x},${y - 1},8,up`, weight);
                edges.get(`${x},${y},8,up`)!.set(`${x},${y - 1},9,up`, weight);
                edges.get(`${x},${y},9,up`)!.set(`${x},${y - 1},10,up`, weight);
            }

            if (y > 3) {
                const weight = grid.slice(y - 4, y).flatMap(row => row[x])[sum]();
                edges.get(`${x},${y},4,left`)!.set(`${x},${y - 4},4,up`, weight);
                edges.get(`${x},${y},5,left`)!.set(`${x},${y - 4},4,up`, weight);
                edges.get(`${x},${y},6,left`)!.set(`${x},${y - 4},4,up`, weight);
                edges.get(`${x},${y},7,left`)!.set(`${x},${y - 4},4,up`, weight);
                edges.get(`${x},${y},8,left`)!.set(`${x},${y - 4},4,up`, weight);
                edges.get(`${x},${y},9,left`)!.set(`${x},${y - 4},4,up`, weight);
                edges.get(`${x},${y},10,left`)!.set(`${x},${y - 4},4,up`, weight);

                edges.get(`${x},${y},4,right`)!.set(`${x},${y - 4},4,up`, weight);
                edges.get(`${x},${y},5,right`)!.set(`${x},${y - 4},4,up`, weight);
                edges.get(`${x},${y},6,right`)!.set(`${x},${y - 4},4,up`, weight);
                edges.get(`${x},${y},7,right`)!.set(`${x},${y - 4},4,up`, weight);
                edges.get(`${x},${y},8,right`)!.set(`${x},${y - 4},4,up`, weight);
                edges.get(`${x},${y},9,right`)!.set(`${x},${y - 4},4,up`, weight);
                edges.get(`${x},${y},10,right`)!.set(`${x},${y - 4},4,up`, weight);
            }

            if (x > 0) {
                const weight = grid[y][x - 1];
                edges.get(`${x},${y},4,left`)!.set(`${x - 1},${y},5,left`, weight);
                edges.get(`${x},${y},5,left`)!.set(`${x - 1},${y},6,left`, weight);
                edges.get(`${x},${y},6,left`)!.set(`${x - 1},${y},7,left`, weight);
                edges.get(`${x},${y},7,left`)!.set(`${x - 1},${y},8,left`, weight);
                edges.get(`${x},${y},8,left`)!.set(`${x - 1},${y},9,left`, weight);
                edges.get(`${x},${y},9,left`)!.set(`${x - 1},${y},10,left`, weight);
            }

            if (x > 3) {
                const weight = grid[y].slice(x - 4, x)[sum]();
                edges.get(`${x},${y},4,up`)!.set(`${x - 4},${y},4,left`, weight);
                edges.get(`${x},${y},5,up`)!.set(`${x - 4},${y},4,left`, weight);
                edges.get(`${x},${y},6,up`)!.set(`${x - 4},${y},4,left`, weight);
                edges.get(`${x},${y},7,up`)!.set(`${x - 4},${y},4,left`, weight);
                edges.get(`${x},${y},8,up`)!.set(`${x - 4},${y},4,left`, weight);
                edges.get(`${x},${y},9,up`)!.set(`${x - 4},${y},4,left`, weight);
                edges.get(`${x},${y},10,up`)!.set(`${x - 4},${y},4,left`, weight);

                edges.get(`${x},${y},4,down`)!.set(`${x - 4},${y},4,left`, weight);
                edges.get(`${x},${y},5,down`)!.set(`${x - 4},${y},4,left`, weight);
                edges.get(`${x},${y},6,down`)!.set(`${x - 4},${y},4,left`, weight);
                edges.get(`${x},${y},7,down`)!.set(`${x - 4},${y},4,left`, weight);
                edges.get(`${x},${y},8,down`)!.set(`${x - 4},${y},4,left`, weight);
                edges.get(`${x},${y},9,down`)!.set(`${x - 4},${y},4,left`, weight);
                edges.get(`${x},${y},10,down`)!.set(`${x - 4},${y},4,left`, weight);
            }

            if (y + 1 < height) {
                const weight = grid[y + 1][x];
                edges.get(`${x},${y},4,down`)!.set(`${x},${y + 1},5,down`, weight);
                edges.get(`${x},${y},5,down`)!.set(`${x},${y + 1},6,down`, weight);
                edges.get(`${x},${y},6,down`)!.set(`${x},${y + 1},7,down`, weight);
                edges.get(`${x},${y},7,down`)!.set(`${x},${y + 1},8,down`, weight);
                edges.get(`${x},${y},8,down`)!.set(`${x},${y + 1},9,down`, weight);
                edges.get(`${x},${y},9,down`)!.set(`${x},${y + 1},10,down`, weight);
            }

            if (y + 4 < height) {
                const weight = grid.slice(y + 1, y + 5).flatMap(row => row[x])[sum]();
                edges.get(`${x},${y},4,left`)!.set(`${x},${y + 4},4,down`, weight);
                edges.get(`${x},${y},5,left`)!.set(`${x},${y + 4},4,down`, weight);
                edges.get(`${x},${y},6,left`)!.set(`${x},${y + 4},4,down`, weight);
                edges.get(`${x},${y},7,left`)!.set(`${x},${y + 4},4,down`, weight);
                edges.get(`${x},${y},8,left`)!.set(`${x},${y + 4},4,down`, weight);
                edges.get(`${x},${y},9,left`)!.set(`${x},${y + 4},4,down`, weight);
                edges.get(`${x},${y},10,left`)!.set(`${x},${y + 4},4,down`, weight);

                edges.get(`${x},${y},4,right`)!.set(`${x},${y + 4},4,down`, weight);
                edges.get(`${x},${y},5,right`)!.set(`${x},${y + 4},4,down`, weight);
                edges.get(`${x},${y},6,right`)!.set(`${x},${y + 4},4,down`, weight);
                edges.get(`${x},${y},7,right`)!.set(`${x},${y + 4},4,down`, weight);
                edges.get(`${x},${y},8,right`)!.set(`${x},${y + 4},4,down`, weight);
                edges.get(`${x},${y},9,right`)!.set(`${x},${y + 4},4,down`, weight);
                edges.get(`${x},${y},10,right`)!.set(`${x},${y + 4},4,down`, weight);
            }

            if (x + 1 < width) {
                const weight = grid[y][x + 1];
                edges.get(`${x},${y},4,right`)!.set(`${x + 1},${y},5,right`, weight);
                edges.get(`${x},${y},5,right`)!.set(`${x + 1},${y},6,right`, weight);
                edges.get(`${x},${y},6,right`)!.set(`${x + 1},${y},7,right`, weight);
                edges.get(`${x},${y},7,right`)!.set(`${x + 1},${y},8,right`, weight);
                edges.get(`${x},${y},8,right`)!.set(`${x + 1},${y},9,right`, weight);
                edges.get(`${x},${y},9,right`)!.set(`${x + 1},${y},10,right`, weight);
            }

            if (x + 4 < width) {
                const weight = grid[y].slice(x + 1, x + 5)[sum]();
                edges.get(`${x},${y},4,up`)!.set(`${x + 4},${y},4,right`, weight);
                edges.get(`${x},${y},5,up`)!.set(`${x + 4},${y},4,right`, weight);
                edges.get(`${x},${y},6,up`)!.set(`${x + 4},${y},4,right`, weight);
                edges.get(`${x},${y},7,up`)!.set(`${x + 4},${y},4,right`, weight);
                edges.get(`${x},${y},8,up`)!.set(`${x + 4},${y},4,right`, weight);
                edges.get(`${x},${y},9,up`)!.set(`${x + 4},${y},4,right`, weight);
                edges.get(`${x},${y},10,up`)!.set(`${x + 4},${y},4,right`, weight);

                edges.get(`${x},${y},4,down`)!.set(`${x + 4},${y},4,right`, weight);
                edges.get(`${x},${y},5,down`)!.set(`${x + 4},${y},4,right`, weight);
                edges.get(`${x},${y},6,down`)!.set(`${x + 4},${y},4,right`, weight);
                edges.get(`${x},${y},7,down`)!.set(`${x + 4},${y},4,right`, weight);
                edges.get(`${x},${y},8,down`)!.set(`${x + 4},${y},4,right`, weight);
                edges.get(`${x},${y},9,down`)!.set(`${x + 4},${y},4,right`, weight);
                edges.get(`${x},${y},10,down`)!.set(`${x + 4},${y},4,right`, weight);
            }
        }
    }
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    return { nodes, edges };
}

function dijkstra(graph: Graph, start: string): { distance: Map<string, number>, previous: Map<string, string> } {
    const visited = new Set<string>();
    const previous = new Map<string, string>();
    const distance = new Map<string, number>(graph.nodes.map(node => [node, Infinity]));
    distance.set(start, 0);

    const queue = new BinaryHeap(graph.nodes, (a, b) => distance.get(a)! < distance.get(b)!);
    let curr;

    while ((curr = queue.remove()) != null) {
        // console.log(curr);
        visited.add(curr);

        for (const [neighbor, weight] of getNodeNeighbors(graph, visited, curr)) {
            const dist = distance.get(curr)! + weight;

            if (dist < distance.get(neighbor)!) {
                distance.set(neighbor, dist);
                previous.set(neighbor, curr);
                queue.upHeapify(neighbor);
            }
        }
    }

    return { distance, previous };
}

function getNodeNeighbors(graph: Graph, visited: Set<string>, node: string) {
    return graph.edges.get(node)!.entries().filter(neighbor => !visited.has(neighbor[0]));
}

// type State = {
//     x: number;
//     y: number;
//     direction: Direction;
//     straightMoves: number;
// }

// type Block = {
//     heatloss: number;
//     visited: boolean;
// };
//
// type State = {
//     x: number;
//     y: number;
//     direction: Direction;
//     straightMoves: number;
//     totalHeatLoss: number;
//     visited: boolean;
// };

// export function solve(map: Input): Solution {
//     const heatloss = map.split("\n").map(line => line.split("").map(Number));
//
//     const part1 = findMinimalHeatloss(heatloss);
//     const part2 = 0;
//
//     return { part1, part2 };
// }
//
// function findMinimalHeatloss(heatloss: number[][]): number {
//     const queue: State[] = [];
//     const visited: Record<string, boolean> = {};
//     const totalHeatloss: Record<string, number> = {};
//     let minimal = null;
//     const y = heatloss.length - 1;
//     const x = heatloss[y].length - 1;
//
//     queue.push({x: 0, y: 0, direction: "left", straightMoves: 0});
//     totalHeatloss[serialize({x: 0, y: 0, direction: "left", straightMoves: 0})] = 0;
//
//     while (
//         !visited[serialize({x, y, direction: "up", straightMoves: 1})] ||
//         !visited[serialize({x, y, direction: "up", straightMoves: 2})] ||
//         !visited[serialize({x, y, direction: "up", straightMoves: 3})] ||
//         !visited[serialize({x, y, direction: "left", straightMoves: 1})] ||
//         !visited[serialize({x, y, direction: "left", straightMoves: 2})] ||
//         !visited[serialize({x, y, direction: "left", straightMoves: 3})] ||
//         !visited[serialize({x, y, direction: "right", straightMoves: 1})] ||
//         !visited[serialize({x, y, direction: "right", straightMoves: 2})] ||
//         !visited[serialize({x, y, direction: "right", straightMoves: 3})] ||
//         !visited[serialize({x, y, direction: "down", straightMoves: 1})] ||
//         !visited[serialize({x, y, direction: "down", straightMoves: 2})] ||
//         !visited[serialize({x, y, direction: "down", straightMoves: 3})]
//         ) {
//     // while (minimal == null) {
//         const curr = queue.pop();
//
//         if (curr == null) {
//             break;
//         }
//
//         visited[serialize(curr)] = true;
//
//         for (const next of getNextStates(heatloss, curr)) {
//             const newTotal = totalHeatloss[serialize(curr)] + heatloss[next.y][next.x];
//             const serial = serialize(next);
//
//             if (visited[serial]) {
//                 continue;
//             }
//
//             if (!queue.find(st => st.x === next.x && st.y === next.y && st.direction === next.direction && st.straightMoves === next.straightMoves)) {
//                 queue.push(next);
//             }
//
//             if (isNaN(newTotal)) {
//                 throw new Error("newTotal is NaN");
//             }
//
//             if (totalHeatloss[serial] == null || totalHeatloss[serial] > newTotal) {
//                 totalHeatloss[serial] = newTotal;
//             }
//         }
//
//         queue.sort((a, b) => totalHeatloss[serialize(b)] - totalHeatloss[serialize(a)]);
//
//         // print(heatloss, visited)
//
//         minimal = Math.min(
//             totalHeatloss[serialize({x, y, direction: "up", straightMoves: 1})] ||    Infinity,
//             totalHeatloss[serialize({x, y, direction: "up", straightMoves: 2})] ||    Infinity,
//             totalHeatloss[serialize({x, y, direction: "up", straightMoves: 3})] ||    Infinity,
//             totalHeatloss[serialize({x, y, direction: "left", straightMoves: 1})] ||  Infinity,
//             totalHeatloss[serialize({x, y, direction: "left", straightMoves: 2})] ||  Infinity,
//             totalHeatloss[serialize({x, y, direction: "left", straightMoves: 3})] ||  Infinity,
//             totalHeatloss[serialize({x, y, direction: "right", straightMoves: 1})] || Infinity,
//             totalHeatloss[serialize({x, y, direction: "right", straightMoves: 2})] || Infinity,
//             totalHeatloss[serialize({x, y, direction: "right", straightMoves: 3})] || Infinity,
//             totalHeatloss[serialize({x, y, direction: "down", straightMoves: 1})] ||  Infinity,
//             totalHeatloss[serialize({x, y, direction: "down", straightMoves: 2})] ||  Infinity,
//             totalHeatloss[serialize({x, y, direction: "down", straightMoves: 3})] ||  Infinity
//         );
//     }
//
//     return minimal;
// }
//
// function print(arr, visited) {
//     for (let [y, row] of arr.entries()) {
//         for (let [x, heat] of row.entries()) {
//             if (visited[y][x]) {
//                 process.stdout.write("\x1b[1;31m" + heat)
//             } else {
//                 process.stdout.write("\x1b[1;32m" + heat);
//             }
//         }
//         console.log("");
//     }
//     console.log("");
// }
//
// function serialize({ x, y, direction, straightMoves }: State): string {
//     return `${x}-${y}-${direction}-${straightMoves}`;
// }
//
// function getNextStates(heatloss: unknown[][], curr: State): State[] {
//     const {x, y, direction, straightMoves} = curr;
//     const next: State[] = [];
//
//     if (y > 0) {
//         if (direction === "up" && straightMoves < 3) {
//             next.push({x, y: y - 1, direction, straightMoves: straightMoves + 1});
//         } else if (direction !== "up" && direction !== "down") {
//             next.push({x, y: y - 1, direction: "up", straightMoves: 1});
//         }
//     }
//
//     if (x > 0) {
//         if (direction === "left" && straightMoves < 3) {
//             next.push({ x: x - 1, y, direction, straightMoves: straightMoves + 1 });
//         } else if (direction !== "left" && direction !== "right") {
//             next.push({ x: x - 1, y, direction: "left", straightMoves: 1 });
//         }
//     }
//
//     if (y < heatloss.length - 1) {
//         if (direction === "down" && straightMoves < 3) {
//             next.push({ x, y: y + 1, direction, straightMoves: straightMoves + 1 });
//         } else if (direction !== "down" && direction !== "up") {
//             next.push({ x, y: y + 1, direction: "down", straightMoves: 1});
//         }
//     }
//
//     if (x < heatloss[y].length - 1) {
//         if (direction === "right" && straightMoves < 3) {
//             next.push({ x: x + 1, y, direction, straightMoves: straightMoves + 1});
//         } else if (direction !== "right" && direction !== "left") {
//             next.push({ x: x + 1, y, direction: "right", straightMoves: 1})
//         }
//     }
//
//     return next;
// }

// type Node = {
//     heatloss: number;
//     neighbors: Node[];
// }
//
// export function solve(map: Input): Solution {
//     const graph = buildGraph(map);
//
//     const part1 = findLeastHeatLoss(graph);
//     const part2 = 0;
//
//     return { part1, part2 };
// }
//
// function buildGraph(map: string) {
//     const heatloss = map.split("\n").map(line => line.split("").map(Number));
//     const layers = {
//         "up": {},
//         "left": {},
//         "down": {},
//         "right": {}
//     };
//
//     for (const dir of Direction) {
//         for (let straightSteps = 1; straightSteps <= 3; straightSteps++) {
//             const nodes = heatloss.map(row => row.map<Node>(val => ({ heatloss: val, neighbors: [] })));
//             layers[dir][straightSteps] = nodes;
//         }
//     }
//
//     for (const direction of Object.keys(layers)) {
//         for (const straightMoves of Object.keys)
//         const direction = layer[0];
//         const straightMoves = layer[1];
//
//         for (const [y, row] of nodes.entries()) {
//             for (const [x, node] of row.entries()) {
//                 const neighbors = [];
//
//                 if (y > 0 && (direction !== "up" || straightMoves < 3)) {
//                     neighbors.push()
//                 }
//             }
//         }
//     }
//
//     const relation = layers.reduce<Record<string, { heatloss: number, neighbors: [] }>>((rel, lay) => rel[lay] = heatloss.map(row => row.map(heatloss => ({ heatloss, neighbors: [] }))), {})
//
//     for (let x = 0, y = 0; x < heatloss[0].length && y < heatloss.length; x++, y++) {
//         relation.oneStraightStepsToTop.push()
//     }
// }

// function findLeastHeatLoss(city: Block[][]): number {
//     const queue: State[] = [{ x: 0, y: 0, direction: "left", straightMoves: 0, totalHeatLoss: 0, visited: false }];
//     const ends = []
//
//     while (queue.length > 0) {
//         queue.sort((a, b) => a.totalHeatLoss - b.totalHeatLoss);
//         const curr = queue.shift()!;
//
//         if (curr.x === city[0].length - 1 && curr.y === city.length - 1) {
//             return curr.totalHeatLoss;
//             // ends.push(curr);
//         }
//
//         // city[curr.y][curr.x].visited = true;
//
//         for (const state of getPossibleMoves(city, curr)) {
//             const queued = queue.find(
//                 queued =>
//                     state.x === queued.x &&
//                     state.y === queued.y &&
//                     state.direction === queued.direction &&
//                     state.straightMoves === queued.straightMoves
//             );
//
//             if (queued && queued.visited) {
//                 continue;
//             }
//
//             if (queued == null) {
//                 queue.push(state);
//                 continue;
//             }
//
//             queued.visited = true;
//
//             if (state.totalHeatLoss < queued.totalHeatLoss) {
//                 queued.totalHeatLoss = state.totalHeatLoss;
//             }
//         }
//     }
//
//     // printInsanity(graph, curr)
//     console.log(ends);
//
//     process.exit();
//     throw new Error();
//
//     // for (x = y = 0; graph[x][y] !== target; [x, y] = queue.shift()) {
//     //     const neighbors = getNeighborsCoords(graph, x, y)
//     //         .filter(([x, y]) => graph[x][y].distance === Infinity || queue.some(coords => coords[0] === x && coords[1] === y))
//     //         .filter(([x, y]) => )
//     //
//     // }
// }
//
// function getPossibleMoves(city: Block[][], state: State): State[] {
//     const { x, y, direction, straightMoves, totalHeatLoss } = state;
//     const possible: State[] = [];
//
//     if (x > 0 && !city[y][x - 1].visited && (direction !== "left" || straightMoves < 3)) {
//         possible.push({
//             x: x - 1,
//             y,
//             direction: "left",
//             straightMoves: direction === "left" ? straightMoves + 1 : 1,
//             totalHeatLoss: totalHeatLoss + city[y][x - 1].heatloss,
//             visited: false,
//         });
//     }
//
//     if (y > 0 && !city[y - 1][x].visited && (direction !== "up" || straightMoves < 3)) {
//         possible.push({
//             x,
//             y: y - 1,
//             direction: "up",
//             straightMoves: direction === "up" ? straightMoves + 1 : 1,
//             totalHeatLoss: totalHeatLoss + city[y - 1][x].heatloss,
//             visited: false,
//         });
//     }
//
//     if (x + 1 < city[y].length && !city[y][x + 1].visited && (direction !== "right" || straightMoves < 3)) {
//         possible.push({
//             x: x + 1,
//             y,
//             direction: "right",
//             straightMoves: direction === "right" ? straightMoves + 1 : 1,
//             totalHeatLoss: totalHeatLoss + city[y][x + 1].heatloss,
//             visited: false,
//         });
//     }
//
//     if (y + 1 < city.length && !city[y + 1][x].visited && (direction !== "down" || straightMoves < 3)) {
//         possible.push({
//             x,
//             y: y + 1,
//             direction: "down",
//             straightMoves: direction === "down" ? straightMoves + 1 : 1,
//             totalHeatLoss: totalHeatLoss + city[y + 1][x].heatloss,
//             visited: false,
//         });
//     }
//
//     return possible;
// }

// function printInsanity(graph, curr) {
//     while (curr != null) {
//         console.log(
//             String(curr.block.heatLoss),
//             curr.block.x + "," + curr.block.y,
//             curr.previousDirection,
//             curr.straightSteps,
//             curr.totalHeatLoss
//         );
//         curr = curr.previousNode;
//     }
// }

// // function getNeighborsCoords(graph: Graph, x: number, y: number): Coords[] {
// //     const neighbors: (Coords | null)[] = [
// //         y > 0 ? [x, y - 1] : null,
// //         x > 0 ? [x - 1, y] : null,
// //         y < graph.length - 1 ? [x, y + 1] : null,
// //         x < graph[y].length - 1 ? [x + 1, y] : null,
// //     ];
// //
// //     return neighbors.filter(coords => coords != null);
// // }
