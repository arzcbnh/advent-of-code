def part1(data: str) -> int:
    seq = [int(x) for x in data.splitlines()]
    return find_invalid(seq)


def part2(data: str) -> int:
    seq = [int(x) for x in data.splitlines()]
    contiguous = find_contiguous_range(seq, find_invalid(seq))
    return min(contiguous) + max(contiguous)


def find_invalid(seq: list[int]) -> int:
    prev = set(seq[:25])

    for i in range(25, len(seq)):
        cur = seq[i]

        for num in prev:
            if cur - num in prev:
                break
        else:
            return cur

        prev.remove(seq[i - 25])
        prev.add(seq[i])

    raise RuntimeError('Invalid number not found')


def find_contiguous_range(seq: list[int], target: int) -> list[int]:
    left = sum = 0

    for right in range(len(seq)):
        sum += seq[right]

        while sum > target:
            sum -= seq[left]
            left += 1

        if sum == target:
            return seq[left : right + 1]

    raise RuntimeError('Contiguous sequence not found')
