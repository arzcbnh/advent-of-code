enum SpringStatus {
    Operational = ".",
    Damaged = "#",
    Unknown = "?",
}

type Row = {
    springs: string;
    groups: number[];
};

export function solve(records: Input): Solution {
    const rows = parseRows(records);
    const unfolded = unfoldRows(rows);

    const part1 = rows.map(countValidPermutations).reduce((sum, num) => sum + num, 0);
    const part2 = unfolded.map(countValidPermutations).reduce((sum, num) => sum + num, 0);

    return { part1, part2 };
}

function parseRows(records: string): Row[] {
    const rows = records
        .split("\n")
        .map(line => line.split(" "))
        .map(([springs, sequence]) => {
            const groups = sequence.split(",").map(Number);
            return { groups, springs } satisfies Row;
        });

    return rows;
}

function unfoldRows(rows: Row[]): Row[] {
    const unfolded = rows.map(row => {
        const springs = Array(5).fill(row.springs).join(SpringStatus.Unknown);
        const groups = Array(5).fill(row.groups).flat();
        return { springs, groups } satisfies Row;
    });

    return unfolded;
}

function countValidPermutations({ springs, groups }: Row): number {
    // Store as '[groupIndex-damagedCount]: permutationCount'
    let permutations: Record<string, number> = { "0,0": 1 };

    for (const spring of springs) {
        const data = parsePermutationData(permutations);
        const next = generateNextPermutations(spring, groups, data);
        permutations = storePermutations(next);
    }

    const validPermutations = parsePermutationData(permutations).filter(data => isValidPermutation(data, groups));
    const permutationCounts = validPermutations.map(({ 2: permutationCount }) => permutationCount);
    return permutationCounts.reduce((sum, count) => sum + count, 0);
}

function parsePermutationData(permutations: Record<string, number>): number[][] {
    // Return array of tuples of three numbers:
    // [current damaged group index, current count of damaged springs, possible permutations from current state]
    return Object.entries(permutations).map(([key, value]) => key.split(",").map(Number).concat([value]));
}

function generateNextPermutations(spring: string, groups: number[], data: number[][]): number[][] {
    const next = [];

    for (const [groupIndex, damagedCount, permCount] of data) {
        if (spring !== SpringStatus.Damaged) {
            // Push permutation representing operational spring
            if (damagedCount === 0) {
                // Continue current permutation streak
                next.push([groupIndex, damagedCount, permCount]);
            } else if (damagedCount === groups[groupIndex]) {
                // End counting of damaged springs, pushing only if matches expected amount
                next.push([groupIndex + 1, 0, permCount]);
            }
        }

        if (spring !== SpringStatus.Operational && damagedCount < groups[groupIndex]) {
            // Push permutation representing damaged spring only if more damaged springs are expected
            next.push([groupIndex, damagedCount + 1, permCount]);
        }
    }

    return next;
}

function storePermutations(next: number[][]): Record<string, number> {
    const permutations: Record<string, number> = {};

    for (const [groupIndex, damagedCount, permCount] of next) {
        const key = `${groupIndex},${damagedCount}`;
        permutations[key] = (permutations[key] ?? 0) + permCount;
    }

    return permutations;
}

function isValidPermutation([groupIndex, damagedCount]: number[], groups: number[]) {
    // Check if all groups have had their amount of damaged springs matched,
    // either all groups were matched previously or the last one has yet to be matched
    return groupIndex === groups.length || (groupIndex === groups.length - 1 && damagedCount === groups[groupIndex]);
}
