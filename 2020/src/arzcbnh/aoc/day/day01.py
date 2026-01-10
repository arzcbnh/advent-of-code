from itertools import combinations
from math import prod


def part1(data: str) -> int:
    entries = [int(x) for x in data.splitlines()]
    return find_entry_combination_product(entries, 2)


def part2(data: str) -> int:
    entries = [int(x) for x in data.splitlines()]
    return find_entry_combination_product(entries, 3)


def find_entry_combination_product(entries: list[int], length: int) -> int:
    for tup in combinations(entries, length):
        if sum(tup) == 2020:
            return prod(tup)

    raise RuntimeError('No entry combination found')
