enum Instruction {
    L = "left",
    R = "right",
}

type Node = {
    name: string;
    left: Node;
    right: Node;
};

type Network = Record<string, Node>;

export function solve(document: Input): Solution {
    const sections = document.split("\n\n");
    const network = buildNetwork(sections[1]);
    const instructions = sections[0]
        .split("")
        .filter(isInstruction)
        .map(char => Instruction[char]);

    const part1 = countSteps(instructions, [network.AAA]);
    const part2 = countSteps(
        instructions,
        Object.values(network).filter(node => node.name.match(/..A/))
    );

    return { part1, part2 };
}

function isInstruction(char: string): char is keyof typeof Instruction {
    return char === "L" || char === "R";
}

function buildNetwork(nodeBlock: string): Network {
    const network: Network = {};
    const nodes = nodeBlock
        .split("\n")
        .map(line => line.split(/\W+/g))
        .map(({ 0: name, 1: left, 2: right }) => ({ name, left, right }));

    for (const { name } of nodes) {
        network[name] = createNode(name);
    }

    for (const { name, left, right } of nodes) {
        network[name].left = network[left];
        network[name].right = network[right];
    }

    return network;
}

function createNode(name: string): Node {
    const node = {
        name,
        get left() {
            return this;
        },
        get right() {
            return this;
        },
    };

    return { ...node };
}

function countSteps(instructions: Instruction[], nodes: Node[]): number {
    const paths = nodes.map(node => ({ node, steps: 0 }));

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

function greatestCommonDivisor(a: number, b: number): number {
    let tmp: number;

    while (a % b > 0) {
        tmp = a % b;
        a = b;
        b = tmp;
    }

    return b;
}
