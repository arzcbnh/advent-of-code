from collections.abc import Callable
from itertools import product


class Seat:
    def __init__(self):
        self.occupied = False
        self.neighbors = []


directions = [(-1, -1), ( 0, -1), ( 1, -1),
              (-1,  0),           ( 1,  0),
              (-1,  1), ( 0,  1), ( 1,  1)]  # fmt: skip


def part1(data: str) -> int:
    seats = build_graph(data, link_immediate)
    return simulate_and_count(seats, threshold=4)


def part2(data: str) -> int:
    seats = build_graph(data, link_raytrace)
    return simulate_and_count(seats, threshold=5)


def build_graph(data: str, link_func: Callable[[dict[tuple[int, int], Seat], int, int]]) -> list[Seat]:
    lines = data.splitlines()
    rows, cols = len(lines), len(lines[0])
    seats = {(i, j): Seat() for i, j in product(range(rows), range(cols)) if lines[i][j] == 'L'}
    link_func(seats, rows, cols)
    return list(seats.values())


def link_immediate(seats: dict[tuple[int, int], Seat], rows: int, cols: int) -> None:
    for (i, j), seat in seats.items():
        for i_step, j_step in directions:
            if (neighbor := seats.get((i + i_step, j + j_step))) is not None:
                seat.neighbors.append(neighbor)


def link_raytrace(seats: dict[tuple[int, int], Seat], rows: int, cols: int) -> None:
    for (i, j), seat in seats.items():
        for i_step, j_step in directions:
            neighbor_i, neighbor_j = i + i_step, j + j_step

            while 0 <= neighbor_i < rows and 0 <= neighbor_j < cols:
                if (neighbor := seats.get((neighbor_i, neighbor_j))) is not None:
                    seat.neighbors.append(neighbor)
                    break

                neighbor_i += i_step
                neighbor_j += j_step


def simulate_and_count(seats: list[Seat], threshold: int) -> int:
    while to_update := get_to_update(seats, threshold):
        for seat in to_update:
            seat.occupied = not seat.occupied

    return sum(1 for seat in seats if seat.occupied)


def get_to_update(seats: list[Seat], threshold: int) -> list[Seat]:
    to_update = []

    for seat in seats:
        occupied = 0

        for neighbor in seat.neighbors:
            occupied += neighbor.occupied

        if seat.occupied and occupied >= threshold or not seat.occupied and occupied == 0:
            to_update.append(seat)

    return to_update
