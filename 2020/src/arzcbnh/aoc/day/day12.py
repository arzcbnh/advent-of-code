def part1(data: str) -> int:
    return calc_manhattan_distance(data, 'pos', 'direction')


def part2(data: str) -> int:
    return calc_manhattan_distance(data, 'waypoint', 'waypoint')


def calc_manhattan_distance(data: str, cardinal_key: str, rotate_key: str) -> int:
    instructions = [(line[0], int(line[1:])) for line in data.splitlines()]
    ship = {'pos': (0, 0), 'direction': (1, 0), 'waypoint': (10, 1)}

    for action, value in instructions:
        match action:
            case 'N':
                ship[cardinal_key] = go_forward(ship[cardinal_key], (0, 1), value)
            case 'S':
                ship[cardinal_key] = go_forward(ship[cardinal_key], (0, -1), value)
            case 'E':
                ship[cardinal_key] = go_forward(ship[cardinal_key], (1, 0), value)
            case 'W':
                ship[cardinal_key] = go_forward(ship[cardinal_key], (-1, 0), value)
            case 'L':
                ship[rotate_key] = rotate(ship[rotate_key], value)
            case 'R':
                ship[rotate_key] = rotate(ship[rotate_key], -value)
            case 'F':
                ship['pos'] = go_forward(ship['pos'], ship[rotate_key], value)

    return abs(ship['pos'][0]) + abs(ship['pos'][1])


def go_forward(coord: tuple[int, int], dir: tuple[int, int], amount: int) -> tuple[int, int]:
    return coord[0] + dir[0] * amount, coord[1] + dir[1] * amount


def rotate(coord: tuple[int, int], degrees: int) -> tuple[int, int]:
    a, b = coord
    turns = degrees // 90 % 4
    return [a, -b, -a, b][turns], [b, a, -b, -a][turns]
