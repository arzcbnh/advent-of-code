from math import prod


def part1(data: str) -> int:
    map = data.splitlines()
    return count_trees(map, 3, 1)


def part2(data: str) -> int:
    map = data.splitlines()
    slopes = [(1, 1), (3, 1), (5, 1), (7, 1), (1, 2)]
    return prod(count_trees(map, x_step, y_step) for x_step, y_step in slopes)


def count_trees(map: list[str], x_step: int, y_step: int) -> int:
    count = x = y = 0

    while y < len(map):
        count += map[y][x] == '#'
        x = (x + x_step) % len(map[0])
        y += y_step

    return count
