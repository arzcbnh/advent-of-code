def part1(data: str) -> int:
    card_key, door_key = (int(n) for n in data.splitlines())
    return transform(door_key, calc_loops(card_key))


def calc_loops(key: int) -> int:
    loops = cur = 1

    while (cur := cur * 7 % 20201227) != key:
        loops += 1

    return loops


def transform(subject: int, loops: int) -> int:
    priv = 1

    for _ in range(loops):
        priv = priv * subject % 20201227

    return priv
