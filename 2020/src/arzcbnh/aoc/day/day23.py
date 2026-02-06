from itertools import pairwise


def part1(data: str) -> str:
    cups, start = parse_mistranslation(data)
    do_moves(cups, 100, start)
    return compose_sequence(cups)


def part2(data: str) -> int:
    cups, start = parse_correctly(data)
    do_moves(cups, 10_000_000, start)

    fact_a = cups[1]
    fact_b = cups[fact_a]
    return fact_a * fact_b


def parse_mistranslation(data: str) -> tuple[list[int], int]:
    parsed = tuple(int(n) for n in data.strip())
    max_cup = max(parsed)

    cups = [0 for _ in range(max_cup + 1)]

    for a, b in pairwise(parsed):
        cups[a] = b

    cups[parsed[-1]] = parsed[0]

    return cups, parsed[0]


def parse_correctly(data: str) -> tuple[list[int], int]:
    parsed = tuple(int(n) for n in data.strip())
    max_cup = max(parsed)

    cups = [i + 1 for i in range(1_000_001)]

    for a, b in pairwise(parsed):
        cups[a] = b

    cups[parsed[-1]] = max_cup + 1
    cups[-1] = parsed[0]

    return cups, parsed[0]


def do_moves(cups: list[int], moves: int, start: int) -> None:
    mod = len(cups) - 1
    cur = start

    for _ in range(moves):
        chunk = remove(cups, cur, 3)
        target = get_target(cur, chunk, mod)
        insert(cups, target, chunk)
        cur = cups[cur]


def remove(cups: list[int], i: int, amount: int) -> tuple[int, ...]:
    chunk = []
    cur = i

    for _ in range(amount):
        cur = cups[cur]
        chunk.append(cur)

    cups[i] = cups[cur]

    return tuple(chunk)


def insert(cups: list[int], i: int, chunk: tuple[int, ...]) -> None:
    for n in chunk:
        cups[n] = cups[i]
        cups[i] = n
        i = n


def get_target(i: int, chunk: tuple[int, ...], mod: int) -> int:
    chunk = tuple(n - 1 for n in chunk)
    target = (i - 2) % mod

    while target in chunk:
        target = (target - 1) % mod

    return target % mod + 1


def compose_sequence(cups: list[int]) -> str:
    seq = []
    cur = 1

    while (cur := cups[cur]) != 1:
        seq.append(cur)

    return ''.join(str(n) for n in seq)
