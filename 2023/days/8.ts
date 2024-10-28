type Instruction = "left" | "right";
type Network = Record<string, Node>;

interface Node {
    name: string;
    left: Node;
    right: Node;
}

const INSTRUCTIONS = {
    L: "left",
    R: "right",
} as const;

export function solve(document: string) {
    const blocks = document.split("\n\n");
    const instructions = (blocks[0].match(/L|R/g) as ("L" | "R")[]).map(char => INSTRUCTIONS[char]);
    const network = buildNetwork(blocks[1]);

    const part1 = countSteps(instructions, [network.AAA]);
    const part2 = countSteps(
        instructions,
        Object.values(network).filter(node => node.name.match(/..A/))
    );

    return { part1, part2 };
}

function buildNetwork(nodeBlock: string) {
    const network: Network = {};
    const nodes = nodeBlock
        .split("\n")
        .map(line => line.match(/(\w+) = \((\w+), (\w+)\)/)!)
        .map(({ 1: name, 2: left, 3: right }) => ({ name, left, right }));

    for (const { name } of nodes) {
        network[name] = { name } as Node;
    }

    for (const { name, left, right } of nodes) {
        network[name].left = network[left];
        network[name].right = network[right];
    }

    return network;
}

function countSteps(instructions: Instruction[], nodes: Node[]) {
    let paths = nodes.map(node => ({ node, steps: 0 }));

    for (const path of paths) {
        while (!path.node.name.match(/..Z/)) {
            const index = path.steps % instructions.length;
            const instruction = instructions[index];
            path.node = path.node[instruction];
            path.steps++;
        }
    }

    const steps = paths.map(path => path.steps);
    const gcd = steps.reduce((gcd, steps) => greatestCommonDivisor(gcd, steps));
    const lcm = steps.reduce((lcm, steps) => (lcm / gcd) * steps);

    return lcm;
}

function greatestCommonDivisor(a: number, b: number) {
    let tmp: number;

    while (a % b > 0) {
        tmp = a % b;
        a = b;
        b = tmp;
    }

    return b;
}
