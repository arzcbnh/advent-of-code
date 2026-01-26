from itertools import product


def part1(data: str) -> int:
    rules, messages = parse_input(data)
    return count_matches(rules, messages, False)


def part2(data: str) -> int:
    rules, messages = parse_input(data)
    return count_matches(rules, messages, True)


def parse_input(data: str) -> tuple[dict[int, set[str]], list[str]]:
    sections = data.split('\n\n')
    rules = parse_rules(sections[0])
    messages = sections[1].splitlines()
    reify_rules(rules)

    return rules, messages


def parse_rules(raw: str) -> dict[int, set[str] | list[list[int]]]:
    rules = {}

    for line in raw.splitlines():
        index, matches = line.split(': ')
        index = int(index)

        if matches[0] == '"':
            rules[index] = set(matches[1:-1])
            continue

        rules[index] = []
        for match in matches.split(' | '):
            rules[index].append([int(subrule) for subrule in match.split()])

    return rules


def reify_rules(rules: dict[int, set[str] | list[list[int]]]) -> None:
    stack = [0]

    while stack:
        index = stack[-1]

        if (next := get_unreified_subrule(rules, index)) is not None:
            stack.append(next)
            continue

        matches = {''.join(p) for match in rules[index] for p in product(*(rules[subrule] for subrule in match))}
        rules[index] = matches
        stack.pop()


def get_unreified_subrule(rules: dict[int, set[str] | list[list[int]]], index: int) -> int | None:
    for match in rules[index]:
        for subrule in match:
            if not isinstance(rules[subrule], set):
                return subrule

    return None


def count_matches(rules: dict[int, set[str]], messages: list[str], recursive: bool) -> int:
    if not recursive:
        return sum(1 for msg in messages if msg in rules[0])

    count = 0

    for msg in messages:
        i = count_42 = count_31 = 0
        len_42 = len(next(iter(rules[42])))
        len_31 = len(next(iter(rules[31])))

        if not msg[i : i + len_42]:
            continue
        while msg[i : i + len_42] in rules[42]:
            i += len_42
            count_42 += 1
        if not msg[i : i + len_31]:
            continue
        while msg[i : i + len_31] in rules[31]:
            i += len_31
            count_31 += 1

        count += count_42 > count_31 and i == len(msg)

    return count
