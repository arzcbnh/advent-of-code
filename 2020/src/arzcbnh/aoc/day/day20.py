from dataclasses import dataclass
from enum import IntEnum
from itertools import product

# Relies on:
# - Edges always being asymmetric
# - Edges being unique
# - Monsters never intersecting

MONSTER_PATTERN =         \
'                  # \n'  \
'#    ##    ##    ###\n'  \
' #  #  #  #  #  #   \n'  # fmt:skip


class Direction(IntEnum):
    UP = 0
    RIGHT = 1
    DOWN = 2
    LEFT = 3


@dataclass
class Transform:
    rotation: int
    flip: bool

    def compose(self: 'Transform', source: Direction, target: Direction, flip: bool) -> 'Transform':
        pass

    def __mul__(self, other: Direction) -> Direction:
        pass


@dataclass(frozen=True)
class Tile:
    id: int
    data: list[list[int]]
    edges: tuple[str, str, str, str]

    @staticmethod
    def parse(raw: str) -> 'Tile':
        title, *lines = raw.splitlines()

        id = int(title[5:-1])
        edges = Tile.parse_edges(lines)
        image = [[int(char == '#') for char in line[1:-1]] for line in lines[1:-1]]

        return Tile(id, image, edges)

    @staticmethod
    def parse_edges(data: list[str]) -> tuple[str, str, str, str]:
        zipped = list(zip(*data))

        up = data[0]
        down = data[-1][::-1]
        left = ''.join(zipped[0][::-1])
        right = ''.join(zipped[-1])

        return up, right, down, left

    def match(self, other: 'Tile') -> tuple[Direction, Direction, bool] | None:
        pass

    # def get_edge(self, direction: Direction, transform: Transform = Transform(0, False)) -> str:
    #     dir = ((1 - 2 * flip * a) + rotation) % 4
    #     pass

    # def iter_edges(self, transform: Transform = Transform(0, False)):
    #     edges = self.edges.copy()


class Pattern:
    def __init__(self, pattern: str):
        self.coords = tuple(
            (i, j) for i, line in enumerate(pattern.splitlines()) for j, char in enumerate(line) if char == '#'
        )

    def match(self, image: list[list[int]], i: int, j: int) -> bool:
        height, width = len(image), len(image[0])

        for coord in self.coords:
            di, dj = i + coord[0], j + coord[1]
            if di >= height or dj >= width or image[di][dj] == 0:
                return False

        return True


def part1(data: str) -> int:
    tiles = {Tile.parse(section) for section in data.split('\n\n')}
    return multiply_corner_ids(tiles)


def part2(data: str) -> int:
    tiles = parse_input(data)
    transforms, grid = build_grid(tiles)
    placed = assemble_image(alignments, grid)

    return calc_water_roughness(placed)


def parse_input(data: str) -> dict[int, Tile]:
    tiles = {}

    for section in data.split('\n\n'):
        # title, *lines = section.splitlines()
        #
        # id = int(title[5:-1])
        # edges = parse_edges(lines)
        # image = [[int(char == '#') for char in line[1:-1]] for line in lines[1:-1]]

        tile = Tile.parse(section)
        tiles[tile.id] = tile
        # tiles[id] = Tile(id, image, edges)

    return tiles


# def parse_edges(data: list[str]) -> list[str]:
#     zipped = list(zip(*data))
#
#     up = data[0]
#     down = data[-1][::-1]
#     left = ''.join(zipped[0][::-1])
#     right = ''.join(zipped[-1])
#
#     return [up, right, down, left]


# def align_tiles(tiles: dict[int, Tile]) -> dict[int, Transform]:
#     available = tiles.copy()
#     id, tile = tiles.popitem()
#
#     transforms = {id: Transform(0, False)}
#     frontier = {id: tile}
#
#     for fixed_id, fixed in frontier.popitem():
#         for free_id, free in available.items():
#             pass


def multiply_corner_ids(tiles: set[Tile]) -> int:
    # tiles = list(tiles)
    result = 1
    # corners = []

    for tile_a in tiles:
        adjacent = 0

        for tile_b in tiles - {tile_a}:
            adjacent += tile_a.match(tile_b) is not None
            if adjacent >= 3:
                break

        if adjacent == 2:
            result *= tile_a.id

    return result


def build_grid(tiles: set[Tile]):
    available = tiles.copy()
    placed = available.pop()

    transforms = {placed: Transform(0, False)}
    grid = {(0, 0): placed}
    frontier = {(0, 0)}
    matches = set()

    while frontier:
        index = frontier.pop()
        placed = grid[index]
        placed_xfm = transforms[placed]

        for loose in available:
            if len(matches) >= 4:
                break
            if (match_result := placed.match(loose)) is None:
                continue

            placed_dir, loose_dir, mirrored = match_result
            loose_xfm = placed_xfm.compose(placed_dir, loose_dir, mirrored)
            loose_index = move_index(index, loose_dir)

            transforms[loose] = loose_xfm
            grid[loose_index] = loose
            matches.add(loose)

        available -= matches
        matches.clear()

        # for placed_dir, loose_dir in product(Direction, repeat=2):
        #     placed_edge = placed.get_edge(placed_dir, placed_xfm)
        #     loose_edge = loose.get_edge(loose_dir)
        #     mirrored = are_mirrored_edges(placed_edge, loose_edge)
        #
        #     # if edges match
        #     #   compose new orientation (requires placed_dir, loose_dir, placed_edge, loose_edge, transform)
        #     #   add to frontier, remove from available
        #     # other_flip = bool(flip - calc_flip_coeff(placed_edge, loose_edge))
        #
        #     if flip is None:
        #         continue
        #
        #     dir = ((1 - 2 * flip * a) + rotation) % 4
        #     transforms[loose] = Transform((dir + other_flip * (2 - b)) % 4, mirrored)
        #     oi, oj = i + 1 - abs(dir - 2), j + 1 - abs(dir - 1)
        #     grid[oi, oj] = loose
        #     frontier.add((oi, oj))
        #     available.remove(loose)
        #     break

    return transforms, grid


def move_index(index: tuple[int, int], direction: Direction) -> tuple[int, int]:
    return index[0] - direction * 2 + 1, index[1] + direction - 1


# def are_mirrored_edges(a: str, b: str) -> bool | None:
#     if a == b:
#         return False
#     elif a == b[::-1]:
#         return True
#     else:
#         return None
#
#
# def calc_flip_coeff(a: str, b: str) -> int | None:
#     if a == b:
#         return 1
#     elif a == b[::-1]:
#         return 0
#     else:
#         return None


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
            if pattern.match(img, i, j):
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
