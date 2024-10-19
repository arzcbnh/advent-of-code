export function solve(input: string) {
    const part1 = processInput(input, /\d/g);
    const part2 = processInput(input, /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g);

    return { part1, part2 };
}

function processInput(input: string, pattern: RegExp) {
    const spelledDigits: { [key: string]: number } = {
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9,
    };

    return input
        .split("\n")
        .filter(Boolean)
        .map(line => {
            const digits = Array.from(line.matchAll(pattern))
                .flat()
                .filter(Boolean)
                .map(num => spelledDigits[num] ?? Number(num));

            const first = digits.at(0);
            const last  = digits.at(-1);
            const composite = Number(`${first}${last}`);

            return composite;
        })
        .reduce((acc, num) => acc + num, 0);
}
