def part1(data: str) -> int:
    earliest_time, ids = parse_input(data)
    wait_time, id = min(((id - earliest_time % id, id) for id in ids if id is not None), key=lambda t: t[0])
    return wait_time * id


def part2(data: str) -> int:
    _, ids = parse_input(data)
    relations = [((id - i) % id, id) for i, id in enumerate(ids) if id is not None]
    relations.sort(key=lambda x: x[1], reverse=True)
    time, coeff = relations[0]

    for rem, mod in relations[1:]:
        while time % mod != rem:
            time += coeff
        coeff *= mod

    return time


def parse_input(data: str) -> tuple[int, list[int | None]]:
    lines = data.splitlines()
    earliest_time = int(lines[0])
    ids = [int(id) if id != 'x' else None for id in lines[1].split(',')]
    return earliest_time, ids
