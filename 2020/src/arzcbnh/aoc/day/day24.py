"""
The hexagon grid is interpreted as a 2-axis coordinate system, where x is the
west-east axis, and y is the southwest-northeast axis.
"""

from itertools import product


def part1(data: str) -> int:
    blackened = parse_input(data)
    return len(blackened)


def part2(data: str) -> int:
    blackened = parse_input(data)

    for _ in range(100):
        blackened = flip_floor(blackened)

    return len(blackened)


def parse_input(data: str) -> set[tuple[int, int]]:
    blackened = set()

    for steps in data.splitlines():
        x = y = i = 0

        while i < len(steps):
            if steps[i] == 'e':
                x += 1
            elif steps[i] == 'w':
                x -= 1
            elif steps[i] == 's':
                y -= 1
                i += 1
                if steps[i] == 'e':
                    x += 1
            elif steps[i] == 'n':
                y += 1
                i += 1
                if steps[i] == 'w':
                    x -= 1
            i += 1

        if (x, y) in blackened:
            blackened.remove((x, y))
        else:
            blackened.add((x, y))

    return blackened


def flip_floor(tiles: set[tuple[int, int]]) -> set[tuple[int, int]]:
    min_x = min(x for x, _ in tiles)
    max_x = max(x for x, _ in tiles)
    min_y = min(y for _, y in tiles)
    max_y = max(y for _, y in tiles)
    range_x = range(min_x - 1, max_x + 2)
    range_y = range(min_y - 1, max_y + 2)
    flipped = set()

    for x, y in product(range_x, range_y):
        len_blackened_neighbors = len(tiles & get_neighbors(x, y))

        if (
            (x, y) in tiles
            and len_blackened_neighbors in (1, 2)
            or (x, y) not in tiles
            and len_blackened_neighbors == 2
        ):
            flipped.add((x, y))

    return flipped


def get_neighbors(x: int, y: int) -> set[tuple[int, int]]:
    return {
        (x + 1, y),
        (x - 1, y),
        (x, y - 1),
        (x, y + 1),
        (x + 1, y - 1),
        (x - 1, y + 1),
    }
