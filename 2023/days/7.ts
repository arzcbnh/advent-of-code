enum FaceCards {
    T = 10,
    J,
    Q,
    K,
    A,
}

type Hand = {
    cards: number[];
    strength: number;
    bid: number;
};

const WITH_JOKERS = true;

export function solve(list: Input): Solution {
    const hands = list.split("\n").map(line => createHand(line));
    const part1 = calcWinnings(hands);

    for (const hand of hands) {
        hand.strength = calcStrength(hand.cards, WITH_JOKERS);
        hand.cards = hand.cards.map(card => (card === FaceCards.J ? 1 : card));
    }

    const part2 = calcWinnings(hands);

    return { part1, part2 };
}

function createHand(line: string): Hand {
    const [values, bidStr] = line.split(" ");

    const cards = values.split("").map(value => (isFaceCard(value) ? FaceCards[value] : Number(value)));
    const strength = calcStrength(cards);
    const bid = Number(bidStr);

    return { cards, strength, bid };
}

function isFaceCard(value: string): value is keyof typeof FaceCards {
    return Object.keys(FaceCards).includes(value);
}

function calcStrength(cards: number[], withJokers = false): number {
    const isJoker = (card: number) => withJokers && card === FaceCards.J;
    const jokers = cards.filter(isJoker).length;

    // Won't map properly unless you spread or fill the array for some reason
    const count = [...Array(15)]
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

function calcWinnings(hands: Hand[]): number {
    const winnings = hands.sort(compareHandRanks).reduce((acc, { bid }, rank) => acc + bid * (rank + 1), 0);
    return winnings;
}

function compareHandRanks(a: Hand, b: Hand): number {
    if (a.strength !== b.strength) {
        return a.strength - b.strength;
    }

    for (let i = 0; i < a.cards.length; i++) {
        if (a.cards[i] !== b.cards[i]) {
            return a.cards[i] - b.cards[i];
        }
    }

    return 0;
}
