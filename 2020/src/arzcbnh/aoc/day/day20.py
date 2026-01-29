from dataclasses import dataclass
from itertools import product
from math import prod

# Relies on:
# - Edges always being asymmetric
# - Edges being unique
# - Monsters never intersecting


@dataclass
class Tilee:
    id: int
    data: list[list[int]]
    edges: list[str]

    def __hash__(self):
        return self.id


class Pattern:
    def __init__(self):
        pattern = (
            '                  # ',
            '#    ##    ##    ###',
            ' #  #  #  #  #  #   ',
        )

        self.coords = tuple((i, j) for i, line in enumerate(pattern) for j, char in enumerate(line) if char == '#')

    def matches_at(self, image: list[list[int]], i: int, j: int) -> bool:
        height, width = len(image), len(image[0])

        for di, dj in ((i + coord[0], j + coord[1]) for coord in self.coords):
            if di >= height or dj >= width or image[di][dj] == 0:
                return False

        return True


def part1(data: str) -> int:
    tiles = parsee_inputt(data)
    return prod(tile.id for tile in find_corners(tiles))


def part2(data: str) -> int:
    tiles = parsee_inputt(data)
    alignments, grid = build_grid(tiles)
    placed = assemble_image(alignments, grid)

    return calc_water_roughness(placed)


def parsee_inputt(data: str) -> set[Tilee]:
    tiles = set()

    for section in data.split('\n\n'):
        title, *lines = section.splitlines()

        id = int(title[5:-1])
        zipped = list(zip(*lines))
        edges = [lines[0], ''.join(zipped[-1]), lines[-1][::-1], ''.join(zipped[0][::-1])]  # up, right, down, left
        image = [[int(c == '#') for c in line[1:-1]] for line in lines[1:-1]]

        tiles.add(Tilee(id, image, edges))

    return tiles


def find_corners(tiles: set[Tilee]) -> list[Tilee]:
    corners = []

    for tile in tiles:
        matches = 0

        for other, a, b in product(tiles - {tile}, range(4), range(4)):
            edge = tile.edges[a]
            other_edge = other.edges[b]

            if edge == other_edge or edge == other_edge[::-1]:
                matches += 1
            if matches == 3:
                break

        if matches == 2:
            corners.append(tile)

    return corners


def build_grid(tiles: set[Tilee]):
    tiles = tiles.copy()
    tile = tiles.pop()

    unvisited = {(0, 0)}
    alignments: dict[Tilee, tuple[int, int]] = {tile: (1, 0)}
    grid: dict[tuple[int, int], Tilee] = {(0, 0): tile}

    while unvisited:
        i, j = unvisited.pop()

        tile = grid[i, j]
        flip, rotation = alignments[tile]

        for other in list(tiles):
            for a, b in product(range(4), repeat=2):
                edge = tile.edges[a]
                other_edge = other.edges[b]
                other_flip = calc_flip_coeff(edge, other_edge) * flip

                if not other_flip:
                    continue

                dir = (flip * a + rotation) % 4
                alignments[other] = (other_flip, (dir + other_flip * (2 - b)) % 4)
                oi, oj = i + 1 - abs(dir - 2), j + 1 - abs(dir - 1)
                grid[oi, oj] = other
                unvisited.add((oi, oj))
                tiles.remove(other)
                break

    return alignments, grid


def calc_flip_coeff(a: str, b: str) -> int:
    if a == b:
        return -1
    elif a == b[::-1]:
        return 1
    else:
        return 0


def assemble_image(alignments, grid):
    min_i = min(grid, key=lambda x: x[0])[0]
    max_i = max(grid, key=lambda x: x[0])[0]
    min_j = min(grid, key=lambda x: x[1])[1]
    max_j = max(grid, key=lambda x: x[1])[1]
    img = []

    for i in range(min_i, max_i + 1):
        tiles: list[list[list[int]]] = []

        for j in range(min_j, max_j + 1):
            tile = grid[i, j]
            flip, rotations = alignments[tile]
            data = rotate_cw(tile.data if flip == 1 else flip_horizontal(tile.data), rotations)

            tiles.append(data)

        for k in range(8):
            img.append(sum((tile[k] for tile in tiles), start=[]))

    return img


def calc_water_roughness(img: list[list[int]]) -> int:
    transformations = (rotate_cw, rotate_cw, rotate_cw, flip_horizontal, rotate_cw, rotate_cw, rotate_cw)
    roughness = black_pixels = sum(pixel for row in img for pixel in row)
    height, width = len(img), len(img[0])
    pattern = Pattern()

    for xf in transformations:
        for i, j in product(range(height), range(width)):
            if pattern.matches_at(img, i, j):
                roughness -= 15

        if roughness != black_pixels:
            break

        img = xf(img)

    return roughness


def rotate_cw(matrix: list[list[int]], times: int = 1) -> list[list[int]]:
    if times == 1:
        matrix = [list(col) for col in zip(*matrix[::-1])]
    elif times == 2:
        matrix = [row[::-1] for row in matrix[::-1]]
    elif times == 3:
        matrix = [list(col) for col in zip(*matrix)][::-1]

    return matrix


def flip_horizontal(matrix: list[list[int]]) -> list[list[int]]:
    return [row[::-1] for row in matrix]
