import re
from collections.abc import Callable

field_validators = {
    'byr': lambda x: 1920 <= int(x) <= 2002,
    'iyr': lambda x: 2010 <= int(x) <= 2020,
    'eyr': lambda x: 2020 <= int(x) <= 2030,
    'hgt': lambda x: (x[2:4] == 'in' and 59 <= int(x[:2]) <= 76) or (x[3:5] == 'cm' and 150 <= int(x[:3]) <= 193),
    'hcl': lambda x: re.match(r'#[\da-f]{6}$', x),
    'ecl': lambda x: re.match(r'amb|blu|brn|gry|grn|hzl|oth', x),
    'pid': lambda x: re.match(r'\d{9}$', x),
}


def part1(data: str) -> int:
    passports = parse_input(data)
    return count_valid_passports(passports, lambda field, value: True)


def part2(data: str) -> int:
    passports = parse_input(data)
    return count_valid_passports(passports, lambda field, value: field_validators[field](value))


def parse_input(data: str) -> list[dict]:
    return [parse_passport(entry) for entry in data.split('\n\n')]


def parse_passport(entry: str) -> dict:
    return dict(pair.split(':') for pair in re.split(r'\s+', entry.strip()))


def count_valid_passports(passports: list[dict], validator: Callable[[str, str], bool]) -> int:
    valid = 0

    for passport in passports:
        for field in field_validators.keys():
            try:
                if field not in passport or not validator(field, passport[field]):
                    break
            except ValueError | IndexError:
                pass
        else:
            valid += 1

    return valid
