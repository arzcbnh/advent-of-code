import { splitLines } from "#utils";

class Part {
    number: number;
    row: number;
    column: number;
    length: number;

    constructor(number: string, row: number, column: number) {
        this.number = Number(number);
        this.row = row;
        this.column = column;
	this.length = number.length;
    }

    get isAdjacent() {
	return this.isAdjacent;
    }

    set isAdjacent(val: boolean) {
	this.isAdjacent = val;
    }
}

export function solve(input: string) {
    const lines = splitLines(input);

    const parts = lines.flatMap((line, row) => {
	const numbers = Array.from(line.matchAll(/\d+/g));
	const parts = [];

	for (const number of numbers) {
	    const lineAbove = lines[row - 1];
	    const lineBelow = lines[row + 1];

	    if (lineAbove && lineAbove.slice(number.index > 0 ? number.index - 1 : 0, (number.index + number[0].length + 1) <= line.length ? number.index + number[0].length + 1 : line.length).match(/[^.\d]/)) {
		parts.push(Number(number[0]));
		continue;
	    }

	    if (lineBelow && lineBelow.slice(number.index > 0 ? number.index - 1 : 0, (number.index + number[0].length + 1) <= line.length ? number.index + number[0].length + 1 : line.length).match(/[^.\d]/)) {
		parts.push(Number(number[0]));
		continue;
	    }

	    if (line.slice(number.index > 0 ? number.index - 1 : 0, (number.index + number[0].length + 1) <= line.length ? number.index + number[0].length + 1 : line.length).match(/[^.\d]/)) {
		parts.push(Number(number[0]));
		continue;
	    }
	}

	return parts;
    })

    const gears = lines.flatMap((line, row) => {
	const asterisks = Array.from(line.matchAll(/\*/g));
	const gears = [];

	for (const asterisk of asterisks) {
	    const lineAbove = lines[row - 1];
	    const lineBelow = lines[row + 1];
	    const column = asterisk.index;
	    const numbers = [];

	    if (lineAbove) {
		lineAbove.matchAll(/\d+/g).forEach(match => {
		    const fitsAround = match.index <= column + 1 && match.index + match[0].length - 1 >= column - 1;
		    if (fitsAround) {
			numbers.push(match[0])
		    }
		})
	    }

	    if (lineBelow) {
		lineBelow.matchAll(/\d+/g).forEach(match => {
		    const fitsAround = match.index <= column + 1 && match.index + match[0].length - 1 >= column - 1;
		    if (fitsAround) {
			numbers.push(match[0])
		    }
		})
	    }

	    line.matchAll(/\d+/g).forEach(match => {
		const fitsAround = match.index <= column + 1 && match.index + match[0].length - 1 >= column - 1;
		if (fitsAround) {
		    numbers.push(match[0])
		}
	    })

	    if (numbers.length === 2) {
		gears.push(Number(numbers[0]) * Number(numbers[1]))
	    }
	}

	return gears;
    })

    const part1 = parts.reduce((sum, num) => sum + num)
    const part2 = gears.reduce((sum, num) => num + sum)

/*    const parts = lines.flatMap((line, row) =>
        Array.from(line.matchAll(/\d+/g)).map(match => new Part(match[0], row, match.index))
    );

    for (const part of parts) {
	for (let i = part.column - 1; i < part.column + part.length + 1; i++) {
	    if (lines[part.row - 1] && lines[part.row - 1][i] !== ".")
		part.isAdjacent = true;
	}

	for (let i = part.column - 1; i < part.column + part.length + 1; i++) {
	    if (lines[part.row + 1] && lines[part.row + 1][i] !== ".")
		part.isAdjacent = true;
	}

	if (part.row > 0 && lines[part.row][part.column - 1] !== "." || lines[part.row][part.column + part.length] !== ".")
	    part.isAdjacent = true;
    }

    const part1 = parts.filter(part => part.isAdjacent).reduce((sum, part) => sum + part.number, 0)
*/
    return { part1, part2 };
}
