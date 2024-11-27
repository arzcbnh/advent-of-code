import { parse } from "utils/stringx.js";

type Sequence = number[];
type SumEdgesFunction = (sum: number, seq: Sequence) => number;

export function solve(report: Input): Solution {
    const derivations = report
        .split("\n")
        .map(line => line[parse](/-?\d+/g).map(Number) as Sequence)
        .map(history => [history].concat(createDifferences(history)).reverse());

    const part1 = predictAndSum(derivations, "next");
    const part2 = predictAndSum(derivations, "previous");

    return { part1, part2 };
}

function createDifferences(sequence: Sequence): Sequence[] {
    if (sequence.every(x => x === 0)) {
        return [];
    }

    const differences = [] as Sequence;

    for (let i = 0; i < sequence.length - 1; i++) {
        const curr = sequence[i];
        const next = sequence[i + 1];
        differences.push(next - curr);
    }

    return [differences].concat(createDifferences(differences));
}

function predictAndSum(derivations: Sequence[][], edgeFlag: "previous" | "next") {
    const sumEdges = (
        edgeFlag === "previous" ?
            (sum, seq) => seq[0] - sum
        :   (sum, seq) => sum + seq.at(-1)!) as SumEdgesFunction;

    return derivations.map(differences => differences.reduce(sumEdges, 0)).reduce((sum, num) => sum + num, 0);
}
