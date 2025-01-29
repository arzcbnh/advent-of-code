// const Direction = ["up", "down", "left", "right"] as const;
// type Direction = (typeof Direction)[number];

type State = {
    heatloss: number;
    x: number;
    y: number;
    straightMoves: number;
    dx: number;
    dy: number;
}

export function solve(map: Input): Solution {
    const grid = map.split("\n").map(line => line.split("").map(Number));

    const part1 = findMinimalHeatloss(grid);
    const part2 = 0;

    return { part1, part2 };
}

function findMinimalHeatloss(grid: number[][]): number {
    const start = { heatloss: 0, x: 0, y: 0, straightMoves: 0, dx: 0, dy: 0 };
    const queue: State[] = [start];
    const hashStateMap = new Map<string, State>([[[start.x, start.y, start.straightMoves, start.dx, start.dy].join(), start]])
    // const q = [[0, 0, 0, 0, 0, 0]];
    const newVisited = new Map<State, boolean>();
    // const oldVisited = {};
    const m = grid.length, n = grid[0].length;
    // const directions = [[-1, 0], [0, -1], [0, 1], [1, 0]];

    while (queue.length > 0) {
        const curr = queue.pop()!;
        const { heatloss: loss, x, y /* , straightMoves: k, dx, dy */ } = curr;
        // const [loss, x, y, k, dx, dy] = q.pop()!;

        if (x === n - 1 && y === m - 1) {
            return loss;
        }

        if (newVisited.get(curr)) {
        // if (newVisited.get([x, y, k, dx, dy].join())) {
        // if (oldVisited[[x, y, k, dx, dy]]) {
            continue;
        }

        // oldVisited[[x, y, k, dx, dy]] = true;
        // newVisited.set([x, y, k, dx, dy].join(), true);
        newVisited.set(curr, true);

        // for (const [newdX, newdY] of directions) {
        for (const next of getNextStates(curr, grid)) {
            // const { dx: newdX, dy: newdY } = nuxt;
            // const straight = newdX === dx && newdY === dy;
            // const newX = x + newdX, newY = y + newdY;

            // if ((newdX === -dx && newdY === -dy) || (k === 3 && straight) || newX < 0 || newY < 0 || newX === n || newY === m) {
            //     continue;
            // }

            // const newK = straight ? k + 1 : 1;
            // const newHeatloss = loss + grid[newY][newX];

            // const next = { heatloss: newHeatloss, x: newX, y: newY, straightMoves: newK, dx: newdX, dy: newdY }

            // const existing = queue.find(state => state.x === next.x && state.y === next.y && state.straightMoves === next.straightMoves && state.dx === next.dx && state.dy === next.dy);
            const hash = [next.x, next.y, next.straightMoves, next.dx, next.dy].join();
            const existing = hashStateMap.get(hash);

            // if (existing) {
            if (existing && !newVisited.get(existing) && next.heatloss < existing.heatloss) {
                existing.heatloss = next.heatloss;
            } else if (!existing) {
                hashStateMap.set(hash, next);
                queue.push(next);
            }

            // q.push([loss + grid[newY][newX], newX, newY, newK, newdX, newdY]);
        }

        queue.sort((a, b) => b.heatloss - a.heatloss);
        // q.sort((a, b) => b[0] - a[0]);
    }
}

function getNextStates(curr: State, grid: number[][]): State[] {
    const {heatloss: loss, x, y, straightMoves: k, dx, dy} = curr;
    const directions = [[-1, 0], [0, -1], [0, 1], [1, 0]];
    const m = grid.length, n = grid[0].length;
    const next = [];

    for (const [newdX, newdY] of directions) {
        const straight = newdX === dx && newdY === dy;
        const newX = x + newdX, newY = y + newdY;

        if ((newdX === -dx && newdY === -dy) || (k === 3 && straight) || newX < 0 || newY < 0 || newX === n || newY === m) {
            continue;
        }

        const newHeatloss = loss + grid[newY][newX];
        const newK = straight ? k + 1 : 1;

        next.push({ heatloss: newHeatloss, x: newX, y: newY, straightMoves: newK, dx: newdX, dy: newdY });
    }

    return next;
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
