import math


def part1(data: str) -> int:
    ids = [calc_id(ticket) for ticket in data.splitlines()]
    return max(ids)


def part2(data: str) -> int:
    ids = [calc_id(ticket) for ticket in data.splitlines()]

    for id in range(min(ids), max(ids) + 1):
        if id not in ids:
            return id

    raise ValueError('Missing seat ID not found from input')


def calc_id(ticket: str) -> int:
    row = bin_search_seat_axis(ticket[:7], 'F')
    column = bin_search_seat_axis(ticket[7:10], 'L')
    return 8 * row + column


def bin_search_seat_axis(data: str, left_marker: str) -> int:
    left = 0
    right = 2 ** len(data)

    for char in data:
        if char == left_marker:
            right -= math.ceil((right - left) / 2)
        else:
            left += math.ceil((right - left) / 2)

    return left
