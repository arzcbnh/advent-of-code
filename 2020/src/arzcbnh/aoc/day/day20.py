from collections import deque
from dataclasses import dataclass
from enum import IntEnum
from itertools import combinations, product
from math import prod

# Relies on:
# - Edges always being asymmetric
# - Edges being unique
# - Monsters never intersecting


pattern = (
    '                  # ',
    '#    ##    ##    ###',
    ' #  #  #  #  #  #   ',
)

coords = tuple((i, j) for i, line in enumerate(pattern) for j, char in enumerate(line) if char == '#')


class Axis(IntEnum):
    Y = 0
    X = 1


class Direction(IntEnum):
    UP = 0
    RIGHT = 1
    DOWN = 2
    LEFT = 3


class Image:
    def __init__(self, data: list[list[int]]):
        self.data = data

    def __getitem__(self, i: int) -> list[int]:
        return self.data[i]

    def __repr__(self):
        map = {-1: 'O', 0: '.', 1: '#'}
        return '\n'.join(''.join(map[cell] for cell in row) for row in self.data)

    def rotate_cw(self, times: int):
        times %= 4

        if times == 1:
            self.data = [list(col) for col in zip(*self.data[::-1])]
        elif times == 2:
            self.data = [row[::-1] for row in self.data[::-1]]
        elif times == 3:
            self.data = [list(col) for col in zip(*self.data)][::-1]

    def mirror(self, axis: Axis):
        match axis:
            case Axis.X:
                self.data = self.data[::-1]
            case Axis.Y:
                self.data = [row[::-1] for row in self.data]


class EdgeSet:
    def __init__(self, edges: list[str]):
        self.links: dict[int, tuple['Tile', int]] = {}
        self.orientations = deque(Direction)
        self.edges = edges

    def __getitem__(self, i: int) -> tuple[Direction, str, tuple['Tile', int] | None]:
        return self.orientations[i], self.edges[i], self.links[i] if i in self.links else None

    def __iter__(self):
        for i in range(4):
            yield self[i]

    def rotate_cw(self, times: int):
        for _ in range(times % 4):
            self.orientations.append(self.orientations.popleft())

    def mirror(self, axis: Axis):
        a, b = self.orientations.index(1 - axis), self.orientations.index(3 - axis)
        self.orientations[a], self.orientations[b] = self.orientations[b], self.orientations[a]

        for i, edge in enumerate(self.edges):
            self.edges[i] = edge[::-1]


class Tile:
    def __init__(self, id: int, image: list[list[int]], edges: list[str]):
        self.id = id
        self.image = Image(image)
        self.edgeset = EdgeSet(edges)

    def __getitem__(self, i: int) -> tuple[Direction, str, tuple['Tile', int] | None]:
        return self.edgeset[i]

    def __iter__(self):
        return iter(self.edgeset)

    def __repr__(self):
        edges = ', '.join(str((dir, edge, link and (link[0].id, link[1]))) for dir, edge, link in self.edgeset)
        return f'Tile {self.id}: {edges}'

    def rotate(self, times: int):
        self.image.rotate_cw(times)
        self.edgeset.rotate_cw(times)

    def mirror(self, axis: Axis):
        self.image.mirror(axis)
        self.edgeset.mirror(axis)


@dataclass
class Tilee:
    id: int
    data: list[list[int]]
    edges: list[str]

    def __hash__(self):
        return self.id


# class Tilee:
#     def __init__(self, id: int, data: list[list[int]], edges: list[str]):
#         self.id = id
#         self.data = data
#         self.edges = edges
#         self.rotations = 0
#         self.flipped = False
#
#     def get_edge(self, dir: Direction) -> str:
#         return self.edges[(1 - 2 * self.flipped) * (dir - self.rotations) % 4]
#
#
def part1(data: str) -> int:
    tiles = parsee_inputt(data)

    # link_tiles(tiles)

    return prod(tile.id for tile in tiles if len(tile.edgeset.links) == 2)


# def part1(data: str) -> int:
#     tiles = parse_input(data)
#     link_tiles(tiles)
#
#     return prod(tile.id for tile in tiles if len(tile.edgeset.links) == 2)
#
#
def part2(data: str) -> int:
    # tiles: list[Tilee] = parse_input(data)
    tiles: set[Tilee] = parsee_inputt(data)
    tile = tiles.pop()

    # unvisited = {tiles[0]}
    unvisited = {tile}
    # alignments: dict[int, tuple[int, int]] = { tiles[0].id: (0, 0) }
    alignments: dict[Tilee, tuple[int, int]] = {tile: (1, 0)}
    # grid: dict[int, tuple[int, int]] = { tiles[0].id: (0, 0) }
    grid: dict[Tilee, tuple[int, int]] = {tile: (0, 0)}

    while unvisited:
        tile = unvisited.pop()

        i, j = grid[tile]
        flip, rotation = alignments[tile]
        tile_dirs = [flip * (dir - rotation) % 4 for dir in Direction]

        # print(list(t.id for t in tiles))
        for other in list(tiles):
            for a, b in product(range(4), repeat=2):
                # for dir, other_dir in product(tile_dirs, Direction):
                # for dir, other_dir in product(Direction, repeat=2):
                #     dir = flip * (dir - rotation) % 4
                edge = tile.edges[a]
                other_edge = other.edges[b]

                if edge == other_edge:
                    other_flip = -flip
                elif edge == other_edge[::-1]:
                    other_flip = flip

                # if tile.id == 2311 and other.id == 1427:
                #     print(edge, other_edge)

                if edge == other_edge:
                    actual_dir = (flip * a + rotation) % 4
                    alignments[other] = (other_flip, (actual_dir + other_flip * (2 - b)) % 4)
                    grid[other] = i + 1 - abs(actual_dir - 2), j + 1 - abs(actual_dir - 1)
                    unvisited.add(other)
                    tiles.remove(other)
                    # print(dir, other_dir)
                    print(
                        # f'{tile.id} at ({i}, {j}) aligned by {alignments[tile.id]} connected with {other.id} at {grid[other.id]} and aligned to {alignments[other.id]}'
                        f'{tile.id} edge {a, edge} connected with {other.id} on edge {b, other_edge}'
                    )
                    break
                elif edge == other_edge[::-1]:
                    actual_dir = (flip * a + rotation) % 4
                    alignments[other] = (other_flip, (actual_dir + other_flip * (2 - b)) % 4)
                    grid[other] = i + 1 - abs(actual_dir - 2), j + 1 - abs(actual_dir - 1)
                    unvisited.add(other)
                    tiles.remove(other)
                    # if tile.id == 2473 and other.id == 1171:
                    #     print(j, actual_dir, j + 1 - abs(actual_dir - 1))
                    print(
                        # f'{tile.id} at ({i}, {j}) aligned by {alignments[tile.id]} connected with {other.id} at {grid[other.id]} and aligned to {alignments[other.id]}'
                        f'{tile.id} edge {a, edge} connected with {other.id} on edge {b, other_edge}'
                    )
                    break
            # exit()
        # print(list(t.id for t in unvisited))

    min_i = min(grid.values(), key=lambda x: x[0])[0]
    max_i = max(grid.values(), key=lambda x: x[0])[0]
    min_j = min(grid.values(), key=lambda x: x[1])[1]
    max_j = max(grid.values(), key=lambda x: x[1])[1]

    placed = [tile for tile]

    print('alignments:', alignments)
    print('grid:', grid)
    exit()

    link_tiles(tiles)
    align_tiles(tiles)

    img = construct_image(tiles)
    orient_image(img)
    tag_monsters(img)

    return calc_water_roughness(img)


# def part2(data: str) -> int:
#     tiles = parse_input(data)
#     link_tiles(tiles)
#     align_tiles(tiles)
#
#     img = construct_image(tiles)
#     orient_image(img)
#     tag_monsters(img)
#
#     return calc_water_roughness(img)
#
#
def parse_input(data: str) -> list[Tile]:
    tiles = []

    for section in data.split('\n\n'):
        title, *lines = section.splitlines()

        id = int(title[5:-1])
        zipped = list(zip(*lines))
        edges = [lines[0], ''.join(zipped[-1]), lines[-1][::-1], ''.join(zipped[0][::-1])]  # up, right, down, left
        image = [[int(c == '#') for c in line[1:-1]] for line in lines[1:-1]]

        tiles.append(Tile(id, image, edges))

    return tiles


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


def link_tiles(tiles: list[Tile]) -> None:
    for tile, other in combinations(tiles, 2):
        for (i, (_, edge, _)), (j, (_, other_edge, _)) in product(enumerate(tile), enumerate(other)):
            if edge == other_edge or edge == other_edge[::-1]:
                tile.edgeset.links[i] = other, j
                other.edgeset.links[j] = tile, i


def align_tiles(tiles: list[Tile]) -> None:
    queue = deque()
    aligned = set()

    queue.append(tiles[0])
    aligned.add(tiles[0])

    while queue:
        tile = queue.popleft()

        for dir, edge, link in tile:
            if link is None or link[0] in aligned:
                continue

            other, j = link
            other_dir, other_edge, _ = other[j]
            other.rotate((dir + 2) % 4 - other_dir)

            if edge == other_edge:
                other.mirror(dir % 2)

            aligned.add(other)
            queue.append(other)


def construct_image(tiles: list[Tile]) -> Image:
    image = []
    tile = get_upper_left_tile(tiles)

    while tile is not None:
        row = []

        while tile is not None:
            row.append(tile)
            i = tile.edgeset.orientations.index(Direction.RIGHT)
            link = tile[i][2]
            tile = link and link[0]

        image.append(row)
        tile = row[0]
        i = tile.edgeset.orientations.index(Direction.DOWN)
        link = tile[i][2]
        tile = link and link[0]

    built = []

    for row in image:
        for i in range(8):
            formed = []
            for tile in row:
                formed += tile.image.data[i]
            built.append(formed)

    return Image(built)


def get_upper_left_tile(tiles) -> Tile:
    for tile in tiles:
        if len(tile.edgeset.links) == 2:
            dirs = {tile[i][0] for i in tile.edgeset.links}
            if dirs == {Direction.RIGHT, Direction.DOWN}:
                return tile

    raise RuntimeError('No upper left tile found')


def orient_image(img: Image) -> None:
    transformations = (
        lambda: img.rotate_cw(1),
        lambda: img.rotate_cw(2),
        lambda: img.rotate_cw(3),
        lambda: img.mirror(Axis.X),
        lambda: img.rotate_cw(1),
        lambda: img.rotate_cw(2),
        lambda: img.rotate_cw(3),
    )

    rows = len(img.data) - 2
    cols = len(img.data[0]) - 19

    for xf in transformations:
        for i, j in product(range(rows), range(cols)):
            if has_monster(img, i, j):
                return

        xf()


def tag_monsters(img: Image) -> None:
    rows = len(img.data) - 2
    cols = len(img.data[0]) - 19

    for i, j in product(range(rows), range(cols)):
        if has_monster(img, i, j):
            for k, l in coords:
                img[i + k][j + l] = -1


def has_monster(img: Image, i: int, j: int) -> bool:
    for k, l in coords:
        if img[i + k][j + l] == 0:
            return False

    return True


def calc_water_roughness(img: Image) -> int:
    roughness = 0
    rows = len(img.data)
    cols = len(img.data[0])

    for i, j in product(range(rows), range(cols)):
        roughness += img[i][j] == 1

    return roughness
