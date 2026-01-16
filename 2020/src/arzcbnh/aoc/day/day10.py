from itertools import pairwise


def part1(data: str) -> int:
    adapters = parse_input(data)
    counter = {1: 0, 2: 0, 3: 0}

    for pair in pairwise(adapters):
        counter[pair[1] - pair[0]] += 1

    return counter[1] * counter[3]


def part2(data: str) -> int:
    adapters = parse_input(data)
    paths = {n: 0 for n in range(0, adapters[-1] + 4)}
    paths[0] = 1

    for n in adapters:
        for i in range(n + 1, n + 4):
            paths[i] += paths[n]

    return paths[adapters[-1]]


def parse_input(data: str) -> list[int]:
    adapters = sorted(int(x) for x in data.splitlines())
    adapters.append(adapters[-1] + 3)
    adapters.insert(0, 0)

    return adapters
