from collections import deque


def part1(data: str) -> int:
    decks = parse_input(data)
    _, winner = play_combat(decks)
    return calc_score(winner)


def part2(data: str) -> int:
    decks = parse_input(data)
    _, winner = play_recursive(decks)
    return calc_score(winner)


def parse_input(data: str) -> tuple[tuple[int, ...], tuple[int, ...]]:
    sections = data.split('\n\n')

    return (
        tuple(int(x) for x in sections[0].splitlines()[1:]),
        tuple(int(x) for x in sections[1].splitlines()[1:]),
    )


def play_combat(decks: tuple[tuple[int, ...], tuple[int, ...]]) -> tuple[int, tuple[int, ...]]:
    decks = deque(decks[0]), deque(decks[1])

    while decks[0] and decks[1]:
        cards = decks[0].popleft(), decks[1].popleft()
        winner = int(cards[0] < cards[1])
        decks[winner].extend(cards if winner == 0 else reversed(cards))

    return winner, tuple(decks[winner])


def play_recursive(decks: tuple[tuple[int, ...], tuple[int, ...]]) -> tuple[int, tuple[int, ...]]:
    decks = deque(decks[0]), deque(decks[1])
    previous = set(), set()

    while decks[0] and decks[1]:
        hands = tuple(decks[0]), tuple(decks[1])

        if hands[0] in previous[0] or hands[1] in previous[1]:
            return 0, tuple(decks[0])

        previous[0].add(hands[0])
        previous[1].add(hands[1])

        cards = decks[0].popleft(), decks[1].popleft()

        if len(hands[0]) > cards[0] and len(hands[1]) > cards[1]:
            subdecks = (
                hands[0][1 : cards[0] + 1],
                hands[1][1 : cards[1] + 1],
            )

            winner, _ = play_recursive(subdecks)
        else:
            winner = int(cards[0] < cards[1])

        decks[winner].extend(cards if winner == 0 else reversed(cards))

    return winner, tuple(decks[winner])


def calc_score(deck: tuple[int, ...]) -> int:
    return sum((i + 1) * n for i, n in enumerate(reversed(deck)))
