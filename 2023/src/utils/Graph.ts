import { BinaryHeap } from "#root/utils/BinaryHeap.js";

type PathfindingResults<T> = {
    readonly distance: Map<T, number>;
    readonly previous: Map<T, T>;
}

export class Graph<T> {
    private readonly nodes: Set<T>;
    private readonly edges: Map<T, Map<T, number>>;

    constructor(nodes: T[]) {
        this.nodes = new Set(nodes);
        this.edges = new Map(nodes.map(node => [node, new Map()]));
    }

    link(from: T, to: T, weight: number): void {
        const edgeMap = this.edges.get(from);

        if (edgeMap == null) {
            throw new Error(`Source node ${from} is not in graph`);
        }

        if (!this.nodes.has(to)) {
            throw new Error(`Target node ${to} is not in graph`);
        }

        edgeMap.set(to, weight);
    }

    dijkstra(start: T, isTarget = (_node: T) => false): PathfindingResults<T> {
        if (!this.nodes.has(start)) {
            throw new Error(`Node ${start} is not in graph`);
        }

        const visited = new Set<T>();
        const previous = new Map<T, T>();
        const distance = new Map<T, number>(this.nodes.keys().map(node => [node, Infinity]));
        distance.set(start, 0);

        const queue = new BinaryHeap([{ node: start, distance: 0 }], (a, b) => a.distance < b.distance);
        let curr;

        while ((curr = queue.extract()?.node) != null && !isTarget(curr)) {
            if (visited.has(curr)) {
                continue;
            }

            visited.add(curr);

            for (const [neighbor, weight] of this.edges.get(curr)?.entries() ?? []) {
                /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion --
                 * The distance to all nodes has already been set, so they're confirmed to be non-null. */
                const dist = distance.get(curr)! + weight;

                /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion --
                 * The distance to all nodes has already been set, so they're confirmed to be non-null. */
                if (dist < distance.get(neighbor)!) {
                    distance.set(neighbor, dist);
                    previous.set(neighbor, curr);
                    queue.insert({ node: neighbor, distance: dist });
                }
            }
        }

        return { distance, previous };
    }
}
