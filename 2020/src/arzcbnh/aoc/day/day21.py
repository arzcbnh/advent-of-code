def part1(data: str) -> int:
    menu = parse_input(data)
    association = associate_allergens(menu)
    return count_safe(menu, frozenset(association.values()))


def part2(data: str) -> str:
    menu = parse_input(data)
    association = associate_allergens(menu)
    return compose_canon(association)


def parse_input(data: str) -> dict[frozenset[str], frozenset[str]]:
    menu = {}

    for line in data.splitlines():
        division = line.index('(')
        ingredients = frozenset(line[: division - 1].split())
        allergens = frozenset(line[division + 10 : -1].split(', '))
        menu[ingredients] = allergens

    return menu


def associate_allergens(menu: dict[frozenset[str], frozenset[str]]) -> dict[str, str]:
    candidates = {}
    resolved = {}

    for ingredients, allergens in menu.items():
        for allergen in allergens:
            candidates[allergen] = candidates.get(allergen, set(ingredients)) & ingredients

    while candidates:
        identified = {algen: next(iter(ingr)) for algen, ingr in candidates.items() if len(ingr) == 1}
        resolved |= identified

        for allergen in identified:
            del candidates[allergen]

        for ingredient in identified.values():
            for allergen in candidates:
                candidates[allergen].discard(ingredient)

    return resolved


def count_safe(menu: dict[frozenset[str], frozenset[str]], unsafe: frozenset[str]) -> int:
    count = 0

    for ingredients in menu:
        count += len(ingredients - unsafe)

    return count


def compose_canon(association: dict[str, str]) -> str:
    allergens = sorted(association)
    ingredients = (association[allergen] for allergen in allergens)

    return ','.join(ingredients)
