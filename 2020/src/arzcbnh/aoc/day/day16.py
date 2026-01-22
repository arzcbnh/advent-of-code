import time
from dataclasses import dataclass
from itertools import chain
from math import prod


@dataclass
class Ticket(dict[str, int]):
    values: list[int]

    def __init__(self, raw: str):
        super().__init__()
        self.values = [int(n) for n in raw.split(',')]


@dataclass
class Ruleset(dict[str, list[range]]):
    def __init__(self, raw: str):
        super().__init__()

        for line in raw.splitlines():
            colon_i = line.index(':')
            name, raw_ranges = line[:colon_i], line[colon_i + 2 :].split(' or ')
            ranges = [range(int(start), int(end) + 1) for start, end in (value.split('-') for value in raw_ranges)]
            self[name] = ranges

    def is_valid(self, ticket: Ticket) -> tuple[bool, int | None]:
        for val in ticket.values:
            if val not in chain.from_iterable(chain.from_iterable(self.values())):
                return False, val

        return True, None


# @dataclass
# class Ruleset(dict[str, list[range]]):
#     def __init__(self, raw: str):
#         super().__init__()
#
#         for line in raw.splitlines():
#             colon_i = line.index(':')
#             name, raw_ranges = line[:colon_i], line[colon_i + 2 :].split(' or ')
#             ranges = [range(int(start), int(end) + 1) for start, end in (value.split('-') for value in raw_ranges)]
#             self.rules[name] = ranges
#
#     def is_valid(self, ticket: Ticket) -> tuple[bool, int | None]:
#         for val in ticket.values:
#             if val not in chain.from_iterable(chain.from_iterable(self.rules.values())):
#                 return False, val
#
#         return True, None


def part1(data: str) -> int:
    start = time.perf_counter()
    rules, _, nearby_tickets = parse_input_v2(data)
    error_rate = 0

    for ticket in nearby_tickets:
        is_valid, error_value = rules.is_valid(ticket)
        if not is_valid:
            # print(f'Invalid value {value} found in ticket {ticket}')
            error_rate += error_value

    print((time.perf_counter() - start) * 1000, 'ms')
    return error_rate


# def part1(data: str) -> int:
#     rules, _, nearby_tickets = parse_input(data)
#     error_rate = 0
#
#     for ticket in nearby_tickets:
#         for value in ticket:
#             if not is_valid_field(rules, value):
#                 # print(f'Invalid value {value} found in ticket {ticket}')
#                 error_rate += value
#                 break
#
#     return error_rate


# def part2(data: str) -> int:
#     sections = data.split('\n\n')
#     rules = Ruleset(sections[0])
#     your_ticket = [int(n) for n in sections[1].splitlines()[1].split(',')]
#     seqs = [[n] for n in your_ticket]
#
#     for line in sections[2].splitlines()[1:]:
#         for i, n in enumerate(line.split(',')):
#             seqs[i].append(int(n))
#
#     candidates = []
#
#     OPTIMIZATION IDEA: only check rules for which you already know all other values are valid.
#     for seq in seqs:
#         left = rules.copy()
#         for n in seq:
#             in_these = {}
#             for name, ranges in list(left.items()):
#                 if n in chain.from_iterable(ranges):
#                     in_these[name] = ranges
#
#
#     return 0


def part2(data: str) -> int:
    start = time.perf_counter()
    rules, your_ticket, nearby_tickets = parse_input_v2(data)
    valid_tickets = [ticket for ticket in nearby_tickets if rules.is_valid(ticket)[0]]
    field_candidates = {}
    print((time.perf_counter() - start) * 1000, 'ms')

    start = time.perf_counter()
    # for seq in zip(your_ticket.values, *(ticket.values for ticket in nearby_tickets if rules.is_valid(ticket)[0])):
    for seq in zip(your_ticket.values, *(ticket.values for ticket in valid_tickets)):
        field_candidates[seq] = set()
        for rulename, ranges in rules.items():
            if all(value in chain.from_iterable(ranges) for value in seq):
                field_candidates[seq].add(rulename)
    print((time.perf_counter() - start) * 1000, 'ms')

    start = time.perf_counter()
    while len(field_candidates) > 0:
        for seq, names in list(field_candidates.items()):
            if len(names) != 1:
                continue

            name = names.pop()
            your_ticket[name] = seq[0]
            del field_candidates[seq]

            for names in field_candidates.values():
                if name in names:
                    names.discard(name)
        # for seq, name in {seq: names.pop() for seq, names in field_candidates.items() if len(names) == 1}.items():
        #     your_ticket[name] = seq[0]
        #     del field_candidates[seq]
        #
        #     for names in field_candidates.values():
        #         if name in names:
        #             names.discard(name)
    print((time.perf_counter() - start) * 1000, 'ms')

    return prod(val for name, val in your_ticket.items() if name.startswith('departure'))


# def part2(data: str) -> int:
#     rules, your_ticket, nearby_tickets = parse_input_v2(data)
#     valid_tickets = [ticket for ticket in nearby_tickets if rules.is_valid(ticket)[0]]
#     field_candidates = {name: [] for name in rules.keys()}
#     # assocs = {}
#
#     for seq in zip(your_ticket.values, *(ticket.values for ticket in valid_tickets)):
#         # print('candidates:', field_candidates)
#         # print('now considering:', seq)
#         # exit()
#         for rulename, ranges in rules.items():
#             # print(
#             #     'rule',
#             #     rulename,
#             #     'with ranges',
#             #     ranges,
#             #     f'does {"" if all(value in chain.from_iterable(ranges) for value in seq) else "not"} contain seq',
#             # )
#             if all(value in chain.from_iterable(ranges) for value in seq):
#                 field_candidates[rulename].append(seq)
#                 # print('adding seq to candidates, now:', field_candidates)
#         # exit()
#         print('')
#
#     # exit()
#     count = 0
#     # while len(field_candidates) > 0:
#     # print(your_ticket)
#     while len(field_candidates) > 0 and (count := count + 1) < 1000:
#         # print(field_candidates)
#         # exit()
#         for rulename, seq in {k: v[0] for k, v in field_candidates.items() if len(v) == 1}.items():
#             # print(field_candidates)
#             # print(assocs)
#             # print({k: v[0] for k, v in field_candidates.items() if len(v) == 1})
#             # for name, seqs in {name: seqs for name, seqs in field_candidates.items() if len(seqs) == 1}.items():
#             #     removal = seqs[0]
#             #     assocs[name] = removal[0]
#             # print('to be removed:', removal)
#             # print(candidates.values())
#             # print(rulename, seq[0])
#             your_ticket[rulename] = seq[0]
#             for oh, cands in list(field_candidates.items()):
#                 # try:
#                 # print('removing', removal, 'from', seq)
#                 if seq in cands:
#                     cands.remove(seq)
#                 if len(cands) == 0:
#                     del field_candidates[oh]
#                 # except ValueError:
#                 #     pass
#                 # except IndexError:
#                 # print(name, candidates)
#                 # pass
#         # print('')
#         # sleep(1)
#
#     # print(dict(your_ticket))
#     # print(assocs)
#     # return departure_mul
#     return prod(val for name, val in your_ticket.items() if name.startswith('departure'))


def parse_input_v2(data: str) -> tuple[Ruleset, Ticket, list[Ticket]]:
    sections = data.split('\n\n')
    rules = Ruleset(sections[0])
    your_ticket = Ticket(sections[1].splitlines()[1])
    nearby_tickets = [Ticket(line) for line in sections[2].splitlines()[1:]]

    return rules, your_ticket, nearby_tickets


# def parse_rules_v2(section: str) -> dict[str, list[range]]:
#     rules = {}
#
#     for line in section.splitlines():
#         colon_i = line.index(':')
#         name, values = line[:colon_i], line[colon_i + 2 :].split(' or ')
#         ranges = [range(int(start), int(end) + 1) for start, end in (value.split('-') for value in values)]
#         rules[name] = ranges
#
#     return rules


def parse_input(data: str) -> tuple[dict[str, list[range]], list[int], list[list[int]]]:
    sections = data.split('\n\n')
    rules = parse_rules(sections[0])
    your_ticket = [int(n) for n in sections[1].splitlines()[1].split(',')]
    nearby_tickets = [[int(n) for n in line.split(',')] for line in sections[2].splitlines()[1:]]

    return rules, your_ticket, nearby_tickets


def parse_rules(section: str) -> dict[str, list[range]]:
    rules = {}

    for line in section.splitlines():
        colon_i = line.index(':')
        name, values = line[:colon_i], line[colon_i + 2 :].split(' or ')
        ranges = [range(int(start), int(end) + 1) for start, end in (value.split('-') for value in values)]
        rules[name] = ranges

    return rules


def is_valid_field(rules: dict[str, list[range]], value: int) -> bool:
    for range in chain.from_iterable(rules.values()):
        # print(range, value)
        if value in range:
            return True

    # exit()
    return False
