class Game {
    id: number;
    red: number;
    blue: number;
    green: number;
    power: number;

    constructor(str: string) {
        this.id = Number(str.match(/Game (\d+):/)![1]);
        this.red = findGreatestDieCount(str, "red");
        this.blue = findGreatestDieCount(str, "blue");
        this.green = findGreatestDieCount(str, "green");
        this.power = this.red * this.blue * this.green;
    }
}

function findGreatestDieCount(str: string, color: string) {
    return Array.from(str.matchAll(new RegExp(`(\\d+) ${color}`, "g")), match => Number(match[1])).reduce((max, cur) =>
        max > cur ? max : cur
    );
}

export function solve(input: string) {
    const maxDie = {
        red: 12,
        green: 13,
        blue: 14,
    } as const;

    const games = input.split("\n").map(line => new Game(line));

    const part1 = games.reduce((sum, game) => {
        const hasEnoughDie = game.red <= maxDie.red && game.blue <= maxDie.blue && game.green <= maxDie.green;
        return sum + game.id * Number(hasEnoughDie);
    }, 0);

    const part2 = games.reduce((sum, game) => sum + game.power, 0);

    return { part1, part2 };
}
