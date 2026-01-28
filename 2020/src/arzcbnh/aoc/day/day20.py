from collections import deque
from enum import IntEnum
from itertools import combinations, product
from math import prod


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

    # def __iter__(self):

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


def part1(data: str) -> int:
    tiles = parse_input(data)
    link_tiles(tiles)

    return prod(tile.id for tile in tiles if len(tile.edgeset.links) == 2)


def part2(data: str) -> int:
    tiles = parse_input(data)
    # for tile in tiles:
    #     print(tile)
    link_tiles(tiles)
    # print(len(tiles))

    # for tile in tiles:
    #     print(tile)
    # print('')
    # print(tiles[0])
    # exit()

    # for t in tiles:
    #     print(t)
    #     print(t.image)
    #     print('')
    # print('-------------')

    goalmap = {0: 2, 2: 0, 1: 3, 3: 1}
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

            # try:
            #     dir, other_dir = tile.dir_ids.index(id), other.dir_ids.index(other_id)
            # except:
            #     print(id)
            #     exit()
            # dir, other_dir = tile.dir_ids.index(id), other.dir_ids.index(other_id)
            # edge, other_edge = tile.id_edges[id], other.id_edges[other_id]
            # rots = goalmap[dir] - other_dir
            other.rotate((dir + 2) % 4 - other_dir)

            # if edge == other_edge and edge == other_edge[::-1]:
            #     raise ValueError(f'{tile.id} and {other.id} have symmetrical edges')

            if edge == other_edge:
                other.mirror(dir % 2)

            aligned.add(other)
            queue.append(other)

            # print(tile.id, 'aligned', other.id)
            # print(list(tile.id for tile in queue))
            # for tiled in tiles:
            #     print(tiled)
            # print('')
        # exit()

    # exit()
    # for tile in tiles:
    #     print(tile)
    # exit()
    # print('\n'.join(tile.body))
    # for other, _ in tile.connections.values():
    #     print(other)
    #     print('\n'.join(other.body))
    # for tile in tiles:
    #     print(tile)
    #     print('\n'.join(tile.body))
    # for t in tiles:
    #     print(t)
    #     print(t.image)
    #     print('')
    # print('-------------------')

    for tile in tiles:
        if len(tile.edgeset.links) == 2:
            dirs = {tile[i][0] for i in tile.edgeset.links}
            if dirs == {Direction.RIGHT, Direction.DOWN}:
                break

    # print(tile.id)
    # for tile in tiles:
    #     print(tile)
    # exit()

    image = []
    # row = []

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
        # edge = next((edge for edge, dir in tile.orientation.items() if dir == 2), None)
        # if edge not in tile.connections:
        #     break
        link = tile[i][2]
        tile = link and link[0]

    # print(image)

    # image = image[::-1]
    # image = image[::-1]
    for row in image:
        print(' '.join(str(tile.id) for tile in row))
    # for row in image:
    #     for tile in
    # exit()
    built = []

    for row in image:
        for i in range(8):
            formed = []
            for tile in row:
                formed += tile.image.data[i]
                # formed += [' ']
            built.append(formed)
        # built.append('')
    # print('\n'.join(built))

    omg = Image(built)
    # omg.mirror(Axis.X)

    # for row in image:
    #     for t in row:
    #         print(t)
    # print()

    # print('\n'.join(''.join(str(p) for p in row) for row in omg.data))
    # print(omg)

    #     goal = """\
    # .#.#..#.##...#.##..#####
    # ###....#.#....#..#......
    # ##.##.###.#.#..######...
    # ###.#####...#.#####.#..#
    # ##.#....#.##.####...#.##
    # ...########.#....#####.#
    # ....#..#...##..#.#.###..
    # .####...#..#.....#......
    # #..#.##..#..###.#.##....
    # #.####..#.####.#.#.###..
    # ###.#.#...#.######.#..##
    # #.####....##..########.#
    # ##..##.#...#...#.#.#.#..
    # ...#..#..#.#.##..###.###
    # .#.#....#.##.#...###.##.
    # ###.#...#..#.##.######..
    # .#.#.###.##.##.#..#.##..
    # .####.###.#...###.#..#.#
    # ..#.#..#..#.#.#.####.###
    # #..####...#.#.#.###.###.
    # #####..#####...###....##
    # #.##..#..#...#..####...#
    # .#.###..##..##..####.##.
    # ...###...##...#...#..###\
    # """

    # print('\n'.join(built[::-1]) == goal)

    # for tile in tiles:
    #     if any(len(tile.candidates[i]) > 1 for i in range(4)):
    #         print(tile)
    #     if all(len(tile.candidates[i]) == 0 for i in range(4)):
    #         print('error:', tile)

    tag_monster(omg)

    # return prod(tile.id for tile in tiles if sum(1 for i in range(4) if tile.connections[i] is not None) == 2)
    # return count_monsters(built)
    return sum(sum(cell for cell in line if cell == 1) for line in omg.data)


def parse_input(data: str) -> list[Tile]:
    tiles = []

    for section in data.split('\n\n'):
        # print(section)
        # exit()
        title, *lines = section.splitlines()
        # print(id)

        # body = [line[1:-1] for line in lines[1:-1]]
        id = int(title[5:-1])
        zipped = list(zip(*lines))
        edges = [lines[0], ''.join(zipped[-1]), lines[-1][::-1], ''.join(zipped[0][::-1])]  # up, right, down, left
        image = [[int(c == '#') for c in line[1:-1]] for line in lines[1:-1]]
        # edges = tuple(''.join(raw).replace('.', '0').replace('#', '1') for raw in raw_edges)
        # edges = tuple(''.join(raw) for raw in raw_edges)

        tiles.append(Tile(id, image, edges))
        # print(tiles[0])
        # exit()

    return tiles


def link_tiles(tiles: list[Tile]) -> None:
    for tile, other in combinations(tiles, 2):
        for (i, (_, edge, _)), (j, (_, other_edge, _)) in product(enumerate(tile), enumerate(other)):
            if edge == other_edge or edge == other_edge[::-1]:
                tile.edgeset.links[i] = other, j
                other.edgeset.links[j] = tile, i


pattern = """
                  # 
#    ##    ##    ###
 #  #  #  #  #  #   
""".strip('\n')

coords = tuple((i, j) for i, line in enumerate(pattern.splitlines()) for j, char in enumerate(line) if char == '#')

# print(coords)
# exit()


def tag_monster(image: Image):
    # monster_pattern = [
    #     [18],
    #     [0, 5, 6, 11, 12, 17, 18, 19],
    #     [1, 4, 7, 10, 13, 16],
    # ]
    #
    idxs = []

    # try:
    for _ in range(2):
        for r in range(4):
            image.rotate_cw(r)
            for i in range(len(image.data) - 2):
                for j in range(len(image.data[i]) - 19):
                    if has_monster(image, i, j):
                        idxs.append((i, j))

            if idxs:
                break
        else:
            break

        image.mirror(Axis.X)

    for i, j in idxs:
        for k, d in coords:
            image[i + k][j + d] = -1
    # except:
    #     print(i, j)
    #     exit()
    # print(image)
    # return 0
    # for line in image.data:
    #     print(line)
    return sum(sum(line) for line in image.data)
    # raise RuntimeError('No monsters found')


def has_monster(img: Image, i: int, j: int) -> bool:
    try:
        for k, l in coords:
            if img[i + k][j + l] == 0:
                return False

        return True

    except:
        print(img)
        print(i, j, k, l)
        print(img[7])
        exit()


# def count_monsters(image: list[str]) -> int:
#     monster_pattern = [
#         [18],
#         [0, 5, 6, 11, 12, 17, 18, 19],
#         [1, 4, 7, 10, 13, 16],
#     ]
#
#     idxs = []
#
#     for _ in range(2):
#         for r in range(4):
#             image = rotate(image, r)
#             for i in range(len(image) - 2):
#                 for j in range(len(image[i]) - 19):
#                     if all(all(image[i + k][j + d] == '#' for d in monster_pattern[k]) for k in range(3)):
#                         idxs.append((i, j))
#
#             if idxs:
#                 break
#         else:
#             break
#
#         image = flip(image, 0)
#
#     for i, j in idxs:
#         for k in range(3):
#             for d in monster_pattern[k]:
#                 image[i + k] = image[i + k][: j + d] + 'O' + image[i + k][1 + j + d :]
#     # print('\n'.join(image))
#
#     return sum(sum(1 for c in line if c == '#') for line in image)
#     # raise RuntimeError('No monsters found')
#
#
def rotate(image: list[str], times: int):
    times %= 4

    if times == 0:
        return image
    elif times == 1:
        return [''.join(line) for line in zip(*image[::-1])]
    elif times == 2:
        return [line[::-1] for line in image[::-1]]
    else:
        return [''.join(line) for line in zip(*image)][::-1]


def flip(image: list[str], axis: int):
    if axis == 0:
        return [line[::-1] for line in image]
    else:
        return image[::-1]
