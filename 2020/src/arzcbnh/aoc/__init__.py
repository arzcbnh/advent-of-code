import http.client
import os
from getpass import getuser
from pathlib import Path
from typing import Literal

from arzcbnh.aoc.day import day01, day02, day03, day04, day05, day06, day07, day08, day09, day10
from arzcbnh.aoc.util import cache


def get_answer(
    day: int,
    part: Literal[1] | Literal[2],
    data_source: str = 'fetch',
    arg: str | None = None,
) -> int | str:
    """
    Fetches and computes the answer for the specified day and part of an Advent of Code
    challenge. The function retrieves the input data and calculates the answer for the
    provided day and part by invoking the appropriate module and function.

    Arguments:
        day (int): The day of the Advent of Code challenge. Must be an integer
            between 1 and 25, inclusive.
        part (Literal[1] | Literal[2]): Determines which part of the day's challenge
            to solve. Valid values are:
                - 1: Solve part 1 of the challenge.
                - 2: Solve part 2 of the challenge.
        data_source (str): Specifies the method of input data retrieval.
            Possible options are:
                - 'arg': Uses the value of the `arg` parameter as the input data.
                - 'stdin': Reads input data from standard input.
                - 'fetch': Retrieves input data programmatically for the specified day.
                - 'file': Reads input data from a file specified by the `arg` parameter.
            Defaults to 'fetch'.
        arg (str | None, optional): The input data or file path, depending on the
            selected `data_source`. Required when `data_source` is 'arg' or 'file'.

    Raises:
        ValueError: If the `day` is not between 1 and 25.
        ValueError: If the provided `data_source` is not one of the supported options.
        ValueError: If the `part` is not either 1 or 2.

    Returns:
        int | str: The computed answer for the specified day and part.
    """
    data = {
        'arg': lambda: arg,
        'stdin': lambda: input(),
        'fetch': lambda: fetch_input_data(day),
        'file': lambda: Path(arg).read_text(encoding='utf-8'),
    }.get(data_source, lambda: None)()

    if data is None:
        raise ValueError(f'Invalid data source: {data_source}')

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
    }.get(day)

    if module is None:
        raise ValueError(f'Day must be an integer between 1 and 25, got: {day}')

    answer = {
        1: lambda: module.part1(data),
        2: lambda: module.part2(data),
    }.get(part, lambda: None)()

    if answer is None:
        raise ValueError(f'Part must be either 1 or 2, got: {part}')

    return answer


def fetch_input_data(day: int) -> str:
    data = cache.retrieve(day)

    if data is None:
        headers = {'Cookie': f'session={get_token()}', 'User-Agent': get_user_agent()}
        connection = http.client.HTTPSConnection('adventofcode.com')
        connection.request('GET', f'/2020/day/{day}/input', headers=headers)
        response = connection.getresponse()
        data = response.read().decode('utf-8')
        connection.close()

        if response.status != 200:
            raise ConnectionError(f'Failed to fetch input for day {day}: {data}')

        cache.store(day, data)

    return data


def get_token() -> str:
    return os.environ['AOC_TOKEN']


def get_user_agent() -> str:
    sources = (lambda: os.environ['AOC_USER'], lambda: getuser())
    username = 'unknown'

    for source in sources:
        try:
            username = source()
            break
        except KeyError, OSError:
            pass

    return f'https://github.com/arzcbnh/advent-of-code by {username}'
