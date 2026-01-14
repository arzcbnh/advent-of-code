def part1(data: str) -> int:
    return sum(count_any_affirmations(group) for group in data.split('\n\n'))


def part2(data: str) -> int:
    return sum(count_universal_affirmations(group) for group in data.split('\n\n'))


def count_any_affirmations(group: str) -> int:
    affirmed_questions = set()

    for person in group.split('\n'):
        for answer in person:
            affirmed_questions.add(answer)

    return len(affirmed_questions)


def count_universal_affirmations(group: str) -> int:
    people = group.splitlines()
    count = 0

    for affirmation in people[0]:
        for person in people:
            if affirmation not in person:
                break
        else:
            count += 1

    return count
