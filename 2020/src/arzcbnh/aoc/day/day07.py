from collections import deque


def part1(data: str) -> int:
    rules = parse_input(data)
    return count_containing_gold(rules)


def part2(data: str) -> int:
    rules = parse_input(data)
    return count_contained_by_gold(rules)


def parse_input(data: str) -> dict[str, dict[str, int] | None]:
    rules = {}

    for line in data.splitlines():
        container, contents = line.split(' bags contain ')

        if contents == 'no other bags.':
            rules[container] = None
        else:
            contained = (bag.split() for bag in contents.split(', '))
            rules[container] = {f'{modifier} {color}': int(amount) for amount, modifier, color, *_ in contained}

    return rules


def count_containing_gold(rules: dict[str, dict[str, int] | None]) -> int:
    queue = deque(['shiny gold'])
    containing = set()

    while len(queue) > 0:
        bag = queue.popleft()
        queue.extend(key for key, value in rules.items() if isinstance(value, dict) and bag in value)
        containing.add(bag)

    # Account for adding of 'shiny gold'
    return len(containing) - 1


def count_contained_by_gold(rules: dict[str, dict[str, int] | None]) -> int:
    queue = deque([('shiny gold', 1)])
    count = 0

    while len(queue) > 0:
        bag, amount = queue.popleft()
        rule = rules[bag]

        if rule is not None:
            queue.extend((key, value * amount) for key, value in rule.items())

        count += amount

    # Account for adding of 'shiny gold'
    return count - 1
