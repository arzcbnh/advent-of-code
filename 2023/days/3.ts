import { splitLines } from "#utils";

export function solve(input: string) {
    const lines = splitLines(input);

    const sumAll = (acc: number, num: number) => acc + num;
    const matchToNumber = (match: RegExpExecArray) => Number(match[0]);
    const linesAround = (row: number) => [lines[row - 1], lines[row + 1], lines[row]];

    const part1 = lines.flatMap((line, row) => 
        line.matchAll(/\d+/g).toArray()
            .filter(({ index, 0: { length }}) => linesAround(row)
                .map(line => line?.substring(index - 1, index + length + 1).match(/[^.\d]/))
                .some(match => match != null)
            )
        )
        .map(matchToNumber)
        .reduce(sumAll);

    const part2 = lines.flatMap((line, row) =>
        line.matchAll(/\*/g).toArray()
            .map(({ index: asterisk }) => linesAround(row)
                .flatMap(line => line?.matchAll(/\d+/g).toArray())
                .filter(({ index, 0: { length }}) => index != null && index <= asterisk + 1 && index + length >= asterisk)
                .map(matchToNumber)
            )
            .filter(numbers => numbers.length === 2)
            .map(numbers => numbers[0] * numbers[1])
       )
       .reduce(sumAll);

    return { part1, part2 };
}
