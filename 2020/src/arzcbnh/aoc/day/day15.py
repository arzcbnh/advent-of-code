def part1(data: str) -> int:
    return calc_nth(data, 2020)


def part2(data: str) -> int:
    return calc_nth(data, 30000000)


def calc_nth(nums: str, n: int) -> int:
    nums = [int(n) for n in nums.split(',')]
    cache = {n: i + 1 for i, n in enumerate(nums)}
    cur = nums[-1]

    for turn in range(len(nums), n):
        cache[cur], cur = turn, turn - cache.get(cur, turn)

    return cur
