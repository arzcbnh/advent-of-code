class Card {
    wins: number;
    points: number;
    instances: number;

    constructor(data: string) {
        const [winning, drawn] = data
            .split(":")[1]
            .split("|")
            .map(list => list.match(/\d+/g)!.map(Number));

        this.wins = winning.filter(n => drawn.includes(n)).length;
        this.points = 2 ** (this.wins - 1) * Number(this.wins > 0);
        this.instances = 1;
    }
}

export function solve(table: Input): Solution {
    const cards = table.split("\n").map(line => new Card(line));
    const part1 = cards.reduce((sum, card) => sum + card.points, 0);
    const part2 = cards.map(increaseSuccessors).reduce((sum, card) => sum + card.instances, 0);

    return { part1, part2 };
}

function increaseSuccessors(card: Card, index: number, cards: Card[]) {
    const succeeding = cards.slice(index + 1, index + card.wins + 1);
    const copies = card.instances;

    succeeding.forEach(card => (card.instances += copies));
    return card;
}
