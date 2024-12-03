type ParsedLine = (number | string)[];

const NUMERALS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"] as const;

export function solve(document: Input): Solution {
    const parsedLines = parseNumbers(document);
    const parsedDigits = parsedLines.map(line => line.filter(x => typeof x === "string"));

    const part1 = sumBoundaries(parsedDigits);
    const part2 = sumBoundaries(parsedLines);

    return { part1, part2 };
}

function parseNumbers(document: string): ParsedLine[] {
    const numbers = document.split("\n").map(line => {
        const matches = [];
        const regex = new RegExp(["\\d", ...NUMERALS].join("|"), "g");
        let match = regex.exec(line)?.[0];

        while (match != null) {
            // Set regex index just one after the last match so it can match
            // overlapping values.
            regex.lastIndex -= match.length - 1;
            matches.push(match);
            match = regex.exec(line)?.[0];
        }

        const convertedMatches = matches.map(convertNumeral);
        return convertedMatches;
    });

    return numbers;
}

function convertNumeral(num: string): number | string {
    const numeralsAsStrings: readonly string[] = NUMERALS;
    const idx = numeralsAsStrings.indexOf(num);

    // Since digits are not numerals, they are not converted to a number, thus
    // remaining as a string. This way, they can be differentiated for part 1 of
    // the challenge - see 'parsedDigits' in 'solve'.
    return idx > 0 ? idx : num;
}

function sumBoundaries(lines: ParsedLine[]): number {
    const values = lines.map(line => {
        const first = line.at(0);
        const last = line.at(-1);
        const value = Number(`${first}${last}`);

        return value;
    });

    const sum = values.reduce((acc, num) => acc + num, 0);
    return sum;
}
