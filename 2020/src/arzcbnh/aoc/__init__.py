import argparse
import sys

from arzcbnh.aoc.day import (
    day01,
    day02,
    day03,
    day04,
    day05,
    day06,
    day07,
    day08,
    day09,
    day10,
    day11,
)


def main():
    parser = argparse.ArgumentParser('aoc-2020')
    parser.add_argument('day', type=int, choices=range(1, 26))
    parser.add_argument('part', type=int, choices=(1, 2))
    args = parser.parse_args()
    data = sys.stdin.read()

    print(get_answer(args.day, args.part, data))


def get_answer(day: int, part: int, data: str) -> int | str:
    """
    Calculate the answer to a given challenge defined by the day and part of the Advent of Code 2020 event.

    Parameters:
        day (int): The day of the challenge (must be an integer between 1 and 25).
        part (int: The part of the challenge to solve (must be either 1 or 2).
        data (str): The puzzle input data required to compute the solution.

    Returns:
        int | str: The computed answer for the specified day and part of the event.

    Raises:
        ValueError: If the day is not between 1 and 25.
        ValueError: If the part is not 1 or 2.
    """

    if day <= 0 or day > 25:
        raise ValueError(f'Day must be an integer between 1 and 25, got: {day}')

    if part != 1 and part != 2:
        raise ValueError(f'Part must be either 1 or 2, got: {part}')

    module = {
        1: day01,
        2: day02,
        3: day03,
        4: day04,
        5: day05,
        6: day06,
        7: day07,
        8: day08,
        9: day09,
        10: day10,
        11: day11,
    }.get(day)

    solution = {
        1: module.part1,
        2: module.part2,
    }.get(part)

    return solution(data)


if __name__ == '__main__':
    main()
