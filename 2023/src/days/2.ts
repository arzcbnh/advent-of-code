type Game = {
    id: number;
    red: number;
    blue: number;
    green: number;
    power: number;
    hasEnoughDie: boolean;
};

const MAX_DIE = {
    red: 12,
    green: 13,
    blue: 14,
} as const;

export function solve(record: Input): Solution {
    const games = record.split("\n").map(set => createGame(set));
    const part1 = games.reduce((sum, game) => sum + game.id * Number(game.hasEnoughDie), 0);
    const part2 = games.reduce((sum, game) => sum + game.power, 0);

    return { part1, part2 };
}

function createGame(set: string): Game {
    const id = Number(set.slice(set.indexOf(" ") + 1, set.indexOf(":")));
    const red = findGreatestDieCount(set, "red");
    const blue = findGreatestDieCount(set, "blue");
    const green = findGreatestDieCount(set, "green");
    const power = red * blue * green;
    const hasEnoughDie = red <= MAX_DIE.red && blue <= MAX_DIE.blue && green <= MAX_DIE.green;

    return { id, red, blue, green, power, hasEnoughDie };
}

function findGreatestDieCount(set: string, color: string): number {
    const regex = new RegExp(`(\\d+) ${color}`, "g");
    const greatest = Array.from(set.matchAll(regex))
        .map(match => Number(match[1]))
        .reduce((max, num) => (max > num ? max : num), 0);

    return greatest;
}
