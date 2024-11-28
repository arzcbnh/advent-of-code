type Card = {
    wins: number;
    points: number;
    instances: number;
};

export function solve(table: Input): Solution {
    const cards = table.split("\n").map(line => createCard(line));
    const part1 = cards.reduce((sum, card) => sum + card.points, 0);
    const part2 = cards.map(increaseSuccessors).reduce((sum, card) => sum + card.instances, 0);

    return { part1, part2 };
}

function createCard(line: string): Card {
    const [winning, drawn] = line
        .split(":")[1]
        .split("|")
        .map(list => list.trim().split(/\D+/).map(Number));

    const wins = winning.filter(n => drawn.includes(n)).length;
    const points = 2 ** (wins - 1) * Number(wins > 0);
    const instances = 1;

    return { wins, points, instances };
}

function increaseSuccessors(card: Card, index: number, cards: Card[]): Card {
    const succeeding = cards.slice(index + 1, index + card.wins + 1);
    const copies = card.instances;

    for (const card of succeeding) {
        card.instances += copies;
    }

    return card;
}
