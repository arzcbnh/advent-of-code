const Direction = ["up", "down", "left", "right"] as const;
type Direction = (typeof Direction)[number];

type Node = {
    heatloss: number;
    neighbors: Node[];
}

export function solve(map: Input): Solution {
    const graph = buildGraph(map);
    const totalHeatloss = calcTotalHeatloss(graph.start);
    const min = Math.min(...graph.targets.map(target => totalHeatloss.get(target)).filter(n => n != undefined))

    const part1 = min;
    const part2 = 0;

    return { part1, part2 };
}

function buildGraph(map: string): { start: Node, targets: Node[] } {
    const grid = map.split("\n").map(line => line.split("").map(Number));
    const width = grid[0].length;
    const height = grid.length;

    const layers: Record<Direction, Record<number, Node[][]>> = {
        up: {
            1: grid.map(row => row.map(heatloss => ({ heatloss, neighbors: [] }))),
            2: grid.map(row => row.map(heatloss => ({ heatloss, neighbors: [] }))),
            3: grid.map(row => row.map(heatloss => ({ heatloss, neighbors: [] }))),
        },
        down: {
            1: grid.map(row => row.map(heatloss => ({ heatloss, neighbors: [] }))),
            2: grid.map(row => row.map(heatloss => ({ heatloss, neighbors: [] }))),
            3: grid.map(row => row.map(heatloss => ({ heatloss, neighbors: [] }))),
        },
        left: {
            1: grid.map(row => row.map(heatloss => ({ heatloss, neighbors: [] }))),
            2: grid.map(row => row.map(heatloss => ({ heatloss, neighbors: [] }))),
            3: grid.map(row => row.map(heatloss => ({ heatloss, neighbors: [] }))),
        },
        right: {
            1: grid.map(row => row.map(heatloss => ({ heatloss, neighbors: [] }))),
            2: grid.map(row => row.map(heatloss => ({ heatloss, neighbors: [] }))),
            3: grid.map(row => row.map(heatloss => ({ heatloss, neighbors: [] }))),
        },
    };

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (y > 0) {
                layers.up[1][y][x].neighbors.push(layers.up[2][y - 1][x]);
                layers.up[2][y][x].neighbors.push(layers.up[3][y - 1][x]);
                layers.left[1][y][x].neighbors.push(layers.up[1][y - 1][x]);
                layers.left[2][y][x].neighbors.push(layers.up[1][y - 1][x]);
                layers.left[3][y][x].neighbors.push(layers.up[1][y - 1][x]);
                layers.right[1][y][x].neighbors.push(layers.up[1][y - 1][x]);
                layers.right[2][y][x].neighbors.push(layers.up[1][y - 1][x]);
                layers.right[3][y][x].neighbors.push(layers.up[1][y - 1][x]);
            }

            if (x > 0) {
                layers.left[1][y][x].neighbors.push(layers.left[2][y][x - 1]);
                layers.left[2][y][x].neighbors.push(layers.left[3][y][x - 1]);
                layers.up[1][y][x].neighbors.push(layers.left[1][y][x - 1]);
                layers.up[2][y][x].neighbors.push(layers.left[1][y][x - 1]);
                layers.up[3][y][x].neighbors.push(layers.left[1][y][x - 1]);
                layers.down[1][y][x].neighbors.push(layers.left[1][y][x - 1]);
                layers.down[2][y][x].neighbors.push(layers.left[1][y][x - 1]);
                layers.down[3][y][x].neighbors.push(layers.left[1][y][x - 1]);
            }

            if (y + 1 < height) {
                layers.down[1][y][x].neighbors.push(layers.down[2][y + 1][x]);
                layers.down[2][y][x].neighbors.push(layers.down[3][y + 1][x]);
                layers.left[1][y][x].neighbors.push(layers.down[1][y + 1][x]);
                layers.left[2][y][x].neighbors.push(layers.down[1][y + 1][x]);
                layers.left[3][y][x].neighbors.push(layers.down[1][y + 1][x]);
                layers.right[1][y][x].neighbors.push(layers.down[1][y + 1][x]);
                layers.right[2][y][x].neighbors.push(layers.down[1][y + 1][x]);
                layers.right[3][y][x].neighbors.push(layers.down[1][y + 1][x]);
            }

            if (x + 1 < width) {
                layers.right[1][y][x].neighbors.push(layers.right[2][y][x + 1]);
                layers.right[2][y][x].neighbors.push(layers.right[3][y][x + 1]);
                layers.up[1][y][x].neighbors.push(layers.right[1][y][x + 1]);
                layers.up[2][y][x].neighbors.push(layers.right[1][y][x + 1]);
                layers.up[3][y][x].neighbors.push(layers.right[1][y][x + 1]);
                layers.down[1][y][x].neighbors.push(layers.right[1][y][x + 1]);
                layers.down[2][y][x].neighbors.push(layers.right[1][y][x + 1]);
                layers.down[3][y][x].neighbors.push(layers.right[1][y][x + 1]);
            }
        }
    }

    const start = { heatloss: grid[0][0], neighbors: [layers.down[1][1][0], layers.right[1][0][1]] };
    const targets = [
        layers.up[1][height - 1][width - 1],
        layers.up[2][height - 1][width - 1],
        layers.up[3][height - 1][width - 1],
        layers.down[1][height - 1][width - 1],
        layers.down[2][height - 1][width - 1],
        layers.down[3][height - 1][width - 1],
        layers.left[1][height - 1][width - 1],
        layers.left[2][height - 1][width - 1],
        layers.left[3][height - 1][width - 1],
        layers.right[1][height - 1][width - 1],
        layers.right[2][height - 1][width - 1],
        layers.right[3][height - 1][width - 1],
    ];

    return { start, targets };
}

function calcTotalHeatloss(start: Node): WeakMap<Node, number> {
    const totalHeatloss = new WeakMap<Node, number>([[start, 0]]);
    const visited = new WeakMap<Node, boolean>();
    const queue = [start];

    while (queue.length > 0) {
        const curr = queue.pop()!;
        visited.set(curr, true);

        for (const neighbor of curr.neighbors) {
            const heatloss = totalHeatloss.get(curr) + neighbor.heatloss;

            if (heatloss < (totalHeatloss.get(neighbor) ?? Infinity)) {
                totalHeatloss.set(neighbor, heatloss);
            }

            if (!visited.get(neighbor) && !queue.includes(neighbor)) {
                queue.push(neighbor);
            }
        }

        queue.sort((a, b) => (totalHeatloss.get(b) ?? Infinity) - (totalHeatloss.get(a) ?? Infinity));
    }

    return totalHeatloss;
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
