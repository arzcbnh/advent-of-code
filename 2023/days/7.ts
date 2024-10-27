const WITH_JOKERS = true;
const FACE_VALUES: Record<string, number> = {
    T: 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14,
} as const;

class Hand {
    cards: number[];
    strength: number;
    bid: number;

    constructor(data: string) {
        const [cards, bid] = data.split(" ");

        this.cards = cards.split("").map(card => FACE_VALUES[card] ?? Number(card));
        this.strength = calcStrength(this.cards);
        this.bid = Number(bid);
    }
}

export function solve(list: string) {
    const hands = list.split("\n").map(line => new Hand(line));
    const part1 = calcWinnings(hands);

    hands.forEach(hand => (hand.strength = calcStrength(hand.cards, WITH_JOKERS)));
    hands.forEach(hand => (hand.cards = hand.cards.map(card => (card === FACE_VALUES.J ? 1 : card))));

    const part2 = calcWinnings(hands);

    return { part1, part2 };
}

function calcStrength(cards: number[], withJokers = false) {
    const isJoker = (card: number) => withJokers && card === FACE_VALUES.J;

    const jokers = cards.filter(isJoker).length;
    const count = [...Array(15)] // Won't map unless you spread or fill the array for some reason
        .map((_, idx) => cards.filter(card => card === idx && !isJoker(card)).length)
        .sort((a, b) => b - a);

    if (count[0] === 5 - jokers) {
        return 6;
    } else if (count[0] === 4 - jokers) {
        return 5;
    } else if (count[0] === 3 - jokers && count[1] === 2) {
        return 4;
    } else if (count[0] === 3 - jokers) {
        return 3;
    } else if (count[0] === 2 && count[1] === 2) {
        return 2;
    } else if (count[0] === 2 - jokers) {
        return 1;
    } else {
        return 0;
    }
}

function calcWinnings(hands: Hand[]) {
    return hands.sort(compareHandRanks).reduce((winnings, { bid }, i) => winnings + bid * (i + 1), 0);
}

function compareHandRanks(a: Hand, b: Hand) {
    if (a.strength !== b.strength) {
        return a.strength - b.strength;
    }

    for (let i = 0; i < 5; i++) {
        if (a.cards[i] !== b.cards[i]) {
            return a.cards[i] - b.cards[i];
        }
    }

    return 0;
}
