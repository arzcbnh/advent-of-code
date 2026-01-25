from collections.abc import Callable, Iterator
from itertools import product


def part1(data: str) -> int:
    active, height, width = parse_input(data)
    simulate(active, gen_iter_all(width, height, False), gen_iter_neighbors(False))
    return len(active)


def part2(data: str) -> int:
    active, height, width = parse_input(data)
    simulate(active, gen_iter_all(width, height, True), gen_iter_neighbors(True))
    return len(active)


def parse_input(data: str) -> tuple[set[tuple[int, int, int, int]], int, int]:
    lines = data.splitlines()
    active = set((x, y, 0, 0) for y, line in enumerate(lines) for x, char in enumerate(line) if char == '#')
    return active, len(lines), len(lines[0])


def simulate(
    active: set[tuple[int, int, int, int]],
    iter_all: Callable[[], Iterator[tuple[int, int, int, int]]],
    iter_neighbors: Callable[[tuple[int, int, int, int]], Iterator[tuple[int, int, int, int]]],
) -> None:
    to_toggle = set()

    for _ in range(6):
        for coord in iter_all():
            is_active = coord in active
            nearby_active = 0

            for neighbor in iter_neighbors(coord):
                if neighbor in active:
                    nearby_active += 1

            if is_active and nearby_active not in (2, 3) or not is_active and nearby_active == 3:
                to_toggle.add(coord)

        active ^= to_toggle
        to_toggle.clear()


def gen_iter_all(width: int, height: int, _4d: bool) -> Callable[[], Iterator[tuple[int, int, int, int]]]:
    w_range = range(-6, 7)
    z_range = range(-6, 7)
    y_range = range(-6, height + 6)
    x_range = range(-6, width + 6)

    if not _4d:
        coords = list(product(x_range, y_range, z_range, (0,)))
    else:
        coords = list(product(x_range, y_range, z_range, w_range))

    def iter_all():
        for coord in coords:
            yield coord

    return iter_all


def gen_iter_neighbors(_4d: bool) -> Callable[[tuple[int, int, int, int]], Iterator[tuple[int, int, int, int]]]:
    if not _4d:
        diffs = list(coord + (0,) for coord in product(range(-1, 2), repeat=3))
    else:
        diffs = list(product(range(-1, 2), repeat=4))

    diffs.remove((0, 0, 0, 0))

    def iter_neighbors(coord):
        for diff in diffs:
            yield coord[0] + diff[0], coord[1] + diff[1], coord[2] + diff[2], coord[3] + diff[3]

    return iter_neighbors
