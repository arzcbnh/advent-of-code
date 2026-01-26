from itertools import product


def part1(data: str) -> int:
    rules, messages = parse_input(data, False)
    # rules = {re.compile(rule) for rule in rules}

    return sum(1 for msg in messages if msg in rules)


def part2(data: str) -> int:
    raw_rules, messages = parse_input_v2(data, True)
    count = 0
    matches = []

    for msg in messages:
        i = _42_c = _31_c = 0
        _42_l = len(next(iter(raw_rules[42])))
        _31_l = len(next(iter(raw_rules[31])))
        if not msg[i : i + _42_l]:
            continue
        while msg[i : i + _42_l] in raw_rules[42]:
            i += _42_l
            _42_c += 1
        if not msg[i : i + _31_l]:
            continue
        while msg[i : i + _31_l] in raw_rules[31]:
            i += _31_l
            _31_c += 1
        if _42_c > _31_c and i == len(msg):
            count += 1
            # matches.append(msg)
        # if msg == 'abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa':
        #     print(_42_c, _31_c)
    # rules = {re.compile(rule) for rule in rules if '+' in rule}
    # rules -= exprs
    # print(len(messages), len(set(messages)))
    # exit()
    # print(rules)
    # print('')
    # goal = {
    #     'bbabbbbaabaabba',
    #     'babbbbaabbbbbabbbbbbaabaaabaaa',
    #     'aaabbbbbbaaaabaababaabababbabaaabbababababaaa',
    #     'bbbbbbbaaaabbbbaaabbabaaa',
    #     'bbbababbbbaaaaaaaabbababaaababaabab',
    #     'ababaaaaaabaaab',
    #     'ababaaaaabbbaba',
    #     'baabbaaaabbaaaababbaababb',
    #     'abbbbabbbbaaaababbbbbbaaaababb',
    #     'aaaaabbaabaaaaababaa',
    #     'aaaabbaabbaaaaaaabbbabbbaaabbaabaaa',
    #     'aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba',
    # }
    # print(raw_rules[42])
    # print(raw_rules[31])
    # print(set(matches) - goal)
    # matching = rules & set(messages) | {msg for msg in messages if any(rule.fullmatch(msg) for rule in rules)}

    return count


# def parse_inputt(data: str) -> tuple[dict[int, set[str]], list[str]]:
#     sections = data.split('\n\n')
#     rules = parse_rules(sections[0])
#     messages = sections[1].splitlines()
#
#     return parse_rule(0, rules, part2), sections[1].splitlines()


# def parse_rules(raw: str) -> dict[int, set[str] | list[list[int]]]:
#     rules = {}
#
#     for line in raw.splitlines():
#         index, matches = line.split(': ')
#         index = int(index)
#         # matches = matches.split(' | ')
#
#         if matches[0] == '"':
#             rules[index] = set(matches[1:-1])
#             continue
#
#         rules[index] = []
#         for match in matches.split(' | '):
#             rules[index].append([int(subrule) for subrule in match.split()])
#         # rr = [tuple(int(subrule) for subrule in match.split()) for match in matches.split(' | ')]
#         # rules[index] = [tuple(int(subrule) for subrule in match.split()) for match in matches.split(' | ')]
#         # rules[index] = asdasd
#
#     return rules


# def reify_rules(rules: dict[int, set[str] | list[list[int]]]) -> None:
#     stack = [(0, 0, 0)]
#
#     while stack:
#         matches_i, match_i, subrule_i = stack[0]
#         matches = rules[matches_i]
#         # match =
#
#         if isinstance(subrule, set):
#             match[]
#
#
#         # rule_i = stack.pop()
#         matches = rules[matches_i]
#
#         for match_i in range(len(matches)):
#             match = matches[match_i]
#             for subrule_i in range(len(match)):
#                 if isinstance(rules[subrule_i], set):
#                     match[subrule_i] = rules[subrule_i]
#             matches[match_i] = set(match)
#
#         if isinstance(matches, set):
#             continue
#
#         stack.extend(rules[matches_i])
#
#     if isinstance(rules[matches_i], set):
#         return rules[matches_i]
#
#     all = set()
# if part2 and rule_i == 8:
#     _42 = parse_rule(42, rules, part2)
#     formed = [f'(?:{res})+' for res in _42]
#     all.update(formed)
#     # print(all)
# elif part2 and rule_i == 11:
#     _42 = parse_rule(42, rules, part2)
#     _31 = parse_rule(31, rules, part2)
#     # print(_42)
#     # print(_31)
#     formed = [f'(?:{a})+(?:{b})+' for a, b in product(_42, _31)]
#     all.update(formed)
#     # print(all)
# else:
# for match in rules[matches_i]:
#     formed = ['']
#     for subrule in match:
#         res = parse_rule(subrule, rules, part2)
#         formed = [f + r for f, r in product(formed, res)]
#     all.update(formed)
#
# rules[matches_i] = all
# return all


def parse_input(data: str, part2: bool) -> tuple[set[str], list[str]]:
    sections = data.split('\n\n')
    raw_rules = {}

    for line in sections[0].splitlines():
        index, raw_rule = line.split(': ')

        if raw_rule[0] == '"':
            raw_rules[int(index)] = set(raw_rule[1:-1])
        else:
            rr = [tuple(int(ref) for ref in rule.split()) for rule in raw_rule.split(' | ')]
            raw_rules[int(index)] = rr

    # print(raw_rules)
    # exit()

    return parse_rule(0, raw_rules, part2), sections[1].splitlines()


def parse_input_v2(data: str, part2: bool) -> tuple[set[str], list[str]]:
    sections = data.split('\n\n')
    raw_rules = {}

    for line in sections[0].splitlines():
        index, raw_rule = line.split(': ')

        if raw_rule[0] == '"':
            raw_rules[int(index)] = set(raw_rule[1:-1])
        else:
            rr = [tuple(int(ref) for ref in rule.split()) for rule in raw_rule.split(' | ')]
            raw_rules[int(index)] = rr

    # print(raw_rules)
    # exit()
    parse_rule(0, raw_rules, part2)

    return raw_rules, sections[1].splitlines()


def parse_rule(index: int, rules: dict[int, set[list[int] | str]], part2: bool) -> set[str]:
    if isinstance(rules[index], set):
        return rules[index]

    all = set()
    # if part2 and index == 8:
    #     _42 = parse_rule(42, rules, part2)
    #     formed = [f'(?:{res})+' for res in _42]
    #     all.update(formed)
    #     # print(all)
    # elif part2 and index == 11:
    #     _42 = parse_rule(42, rules, part2)
    #     _31 = parse_rule(31, rules, part2)
    #     # print(_42)
    #     # print(_31)
    #     formed = [f'(?:{a})+(?:{b})+' for a, b in product(_42, _31)]
    #     all.update(formed)
    #     # print(all)
    # else:
    for match in rules[index]:
        formed = ['']
        for subrule in match:
            res = parse_rule(subrule, rules, part2)
            formed = [f + r for f, r in product(formed, res)]
        all.update(formed)

    rules[index] = all
    return all
