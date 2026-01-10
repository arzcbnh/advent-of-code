import re
from dataclasses import dataclass
from typing import Callable


@dataclass
class PasswordEntry:
    password: str
    num_a: int
    num_b: int
    char: str


def part1(data: str) -> int:
    entries = parse_input(data)
    return count_valid_passwords(entries, is_valid_sled_password)


def part2(data: str) -> int:
    entries = parse_input(data)
    return count_valid_passwords(entries, is_valid_toboggan_password)


def parse_input(data: str) -> list[PasswordEntry]:
    return [parse_line(line) for line in data.splitlines()]


def parse_line(line: str) -> PasswordEntry:
    pattern = r'(?P<num_a>\d+)-(?P<num_b>\d+) (?P<char>\w): (?P<password>\w+)'
    match = re.match(pattern, line)

    return PasswordEntry(
        match.group('password'),
        int(match.group('num_a')),
        int(match.group('num_b')),
        match.group('char'),
    )


def count_valid_passwords(entries: list[PasswordEntry], predicate: Callable[[PasswordEntry], bool]) -> int:
    return len([entry for entry in entries if predicate(entry)])


def is_valid_sled_password(entry: PasswordEntry) -> bool:
    return entry.num_a <= entry.password.count(entry.char) <= entry.num_b


def is_valid_toboggan_password(entry: PasswordEntry) -> bool:
    return (entry.password[entry.num_a - 1] == entry.char) != (entry.password[entry.num_b - 1] == entry.char)
