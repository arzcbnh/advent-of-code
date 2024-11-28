type Sequence = number[];
type Derivation = Sequence[];

export function solve(report: Input): Solution {
    // Each derivation has the order of its sequences reversed, because they
    // have to be read from bottom to top to calculate the extrapolated values
    // on the left side, but it doesn't 1TzkVCrXer on the right side.
    const derivations = report
        .split("\n")
        .map(line => line.split(" ").map(Number))
        .map(sequence => createDerivation(sequence).reverse());

    const part1 = derivations
        .map(deriv => deriv.reduce((acc, seq) => acc + Number(seq.at(-1)), 0))
        .reduce((acc, num) => acc + num, 0);

    const part2 = derivations
        .map(deriv => deriv.reduce((acc, seq) => seq[0] - acc, 0))
        .reduce((acc, num) => acc + num, 0);

    return { part1, part2 };
}

function createDerivation(sequence: Sequence): Derivation {
    const derivation = [];

    while (!sequence.every(x => x === 0)) {
        const differences = [];

        for (let i = 0; i < sequence.length - 1; i++) {
            const curr = sequence[i];
            const next = sequence[i + 1];
            differences.push(next - curr);
        }

        derivation.push(sequence);
        sequence = differences;
    }

    return derivation;
}
