from collections.abc import Callable, Generator
from itertools import product


def parse_2d[T](data: str, callback: Callable[[str], T]) -> list[list[T]]:
    return [[callback(char) for char in line] for line in data.splitlines()]


def count_if[T](arr: list[T], predicate: Callable[[T], bool]) -> int:
    count = 0

    for val in arr:
        count += predicate(val)

    return count


def enumerate_2d[T](arr: list[list[T]]) -> Generator[tuple[tuple[int, int], T], None, None]:
    rows, cols = len(arr), len(arr[0])
    for i, j in product(range(rows), range(cols)):
        yield (i, j), arr[i][j]
