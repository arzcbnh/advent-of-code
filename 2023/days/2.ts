import { parse } from "#utils/stringx";

class Game {
    id: number;
    red: number;
    blue: number;
    green: number;

    constructor(set: string) {
        this.id = Number(set.match(/Game (\d+):/)![1]);
        this.red = findGreatestDieCount(set, "red");
        this.blue = findGreatestDieCount(set, "blue");
        this.green = findGreatestDieCount(set, "green");
    }

    get power() {
        return this.red * this.blue * this.green;
    }

    get hasEnoughDie() {
	return this.red <= maxDie.red && this.blue <= maxDie.blue && this.green <= maxDie.green;
    }
}

const maxDie = {
    red: 12,
    green: 13,
    blue: 14,
} as const;

const maxAmount = (max: number, num: number) => (max > num ? max : num);

function findGreatestDieCount(set: string, color: string) {
    const regex = new RegExp(`(\\d+) ${color}`, "g");
    return set[parse](regex)
        .map(match => Number(match[1]))
        .reduce(maxAmount);
}

export function solve(record: string) {
    const games = record.split("\n").map(set => new Game(set));
    const part1 = games.reduce((sum, game) => sum + game.id * Number(game.hasEnoughDie), 0);
    const part2 = games.reduce((sum, game) => sum + game.power, 0);

    return { part1, part2 };
}
