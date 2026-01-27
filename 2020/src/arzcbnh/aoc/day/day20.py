from collections import deque
from itertools import combinations
from math import prod

# class BiDict:
#     def __init__(self, *args, **kwargs):
#         self.forward = {}
#         self.backward = {}
#
#         if len(args) == 0:
#             for key, value in kwargs.items():
#                 self.forward[key] = value
#                 self.backward[value] = key
#         elif len(args) == 1 and isinstance(args[0], dict):
#             for key, value in args[0].items():
#                 self.forward[key] = value
#                 self.backward[value] = key
#         # elif len(args) == 1 and isinstance(args[0], )
#
#         # super().__init__(*args, **kwargs)
#         for key, value in list(self.items()):
#             self[value] = key
#
#     def __setitem__(self, key, value):
#         super().__setitem__(key, value)
#         super().__setitem__(value, key)
#
#     def __delitem__(self, key):
#         super().__delitem__(self[self[key]])
#         super().__delitem__(self[key])
#         # del self[self[key]]
#         # del self[key]
#
#
# MutableMapping.register(BiDict)


# 0 is up, 1 is right, 2 is down, 3 is left
class Tile:
    # connections: list[Tile | None]

    def __init__(self, id: int, body: list[str], edges: list[str]):
        self.id = id
        self.body = body
        self.edges = edges
        self.connections = {}
        # self.orientation = dict(zip(edges, [0, 1, 2, 3]))
        self.dir_ids = list('ABCD')
        self.id_edges = dict(zip('ABCD', edges))

    def rotate(self, times: int):
        times %= 4

        if times == 0:
            return
        elif times == 1:
            # self.edges.insert(0, self.edges.pop())
            self.dir_ids.insert(0, self.dir_ids.pop())
            self.body = [''.join(line) for line in zip(*self.body[::-1])]
        elif times == 2:
            # self.edges = self.edges[2:4] + self.edges[:2]
            self.dir_ids = self.dir_ids[2:4] + self.dir_ids[:2]
            self.body = [line[::-1] for line in self.body[::-1]]
        else:
            # self.edges.append(self.edges.pop(0))
            self.dir_ids.append(self.dir_ids.pop(0))
            self.body = [''.join(line) for line in zip(*self.body)][::-1]
            # pass

        # self.orientation = {edge: (dir + times) % 4 for edge, dir in self.orientation.items()}

    # 0 is y, 1 is x
    def flip(self, axis: str):
        for id in self.id_edges:
            self.id_edges[id] = self.id_edges[id][::-1]

        if axis == 0:
            # self.dir_ids[0] = self.dir_ids[0][::-1]
            # self.dir_ids[2] = self.dir_ids[2][::-1]
            self.dir_ids[1], self.dir_ids[3] = self.dir_ids[3], self.dir_ids[1]
            # self.dir_ids[3] = self.dir_ids[1]
            self.body = [line[::-1] for line in self.body]
        else:
            self.dir_ids[0], self.dir_ids[2] = self.dir_ids[2], self.dir_ids[0]
            # self.dir_ids[2] = self.dir_ids[0]
            # self.id_edges[0]
            # self.dir_ids[1] = self.dir_ids[1][::-1]
            # self.dir_ids[3] = self.dir_ids[3][::-1]
            self.body = self.body[::-1]

    def thruple(self):
        return ((dir, self.dir_ids[dir], self.id_edges[self.dir_ids[dir]]) for dir in range(4))

    # def connections(self) -> int:

    def __repr__(self):
        return f'Tile {self.id}:\n\tedges {self.edges}\n\tdir_ids: {self.dir_ids}\n\tid_edges: {self.id_edges}\n\tconnections: {list((this, tile.id, other) for this, (tile, other) in self.connections.items())}\n'  # \n\tconnections: up {self.up.id}, down {self.down.id}, left {self.left.id}, right {self.right.id}\n'


def part1(data: str) -> int:
    tiles = parse_input(data)
    # print(len(tiles))

    for tile, other in combinations(tiles, 2):
        for id, edge in tile.id_edges.items():
            if edge in other.edges:
                other_id = next(key for key, val in other.id_edges.items() if val == edge)
                tile.connections[id] = (other, other_id)
                other.connections[other_id] = (tile, id)
            elif edge[::-1] in other.edges:
                other_id = next(key for key, val in other.id_edges.items() if val == edge[::-1])
                tile.connections[id] = (other, other_id)
                other.connections[other_id] = (tile, id)

    return prod(tile.id for tile in tiles if len(tile.connections) == 2)


# def part1(data: str) -> int:
#     tiles = parse_input(data)
#     # print(len(tiles))
#
#     for tile, other in combinations(tiles, 2):
#         for edge in tile.edges:
#             if edge in other.edges:
#                 # j = other.edges.index(tile.edges[i])
#                 tile.connections[edge] = (other, edge)
#                 other.connections[edge] = (tile, edge)
#             elif edge[::-1] in other.edges:
#                 # j = other.edges.index(tile.edges[i][::-1])
#                 tile.connections[edge] = (other, edge[::-1])
#                 other.connections[edge[::-1]] = (tile, edge)
#
#     # for tile in tiles:
#     #     if any(len(tile.candidates[i]) > 1 for i in range(4)):
#     #         print(tile)
#     #     if all(len(tile.candidates[i]) == 0 for i in range(4)):
#     #         print('error:', tile)
#
#     return prod(tile.id for tile in tiles if len(tile.connections) == 2)
#     # return prod(tile.id for tile in tiles if sum(1 for conn in tile.connections.values() if conn is not None) == 2)
#     return 0
#
#
def part2(data: str) -> int:
    goalmap = {0: 2, 2: 0, 1: 3, 3: 1}
    tiles = parse_input(data)
    # print(len(tiles))

    # print(tiles[0])
    # exit()

    for tile, other in combinations(tiles, 2):
        for id, edge in tile.id_edges.items():
            if edge in other.edges:
                other_id = next(key for key, val in other.id_edges.items() if val == edge)
                tile.connections[id] = (other, other_id)
                other.connections[other_id] = (tile, id)
            elif edge[::-1] in other.edges:
                other_id = next(key for key, val in other.id_edges.items() if val == edge[::-1])
                tile.connections[id] = (other, other_id)
                other.connections[other_id] = (tile, id)

    queue = deque()
    aligned = set()

    queue.append(tiles[0])
    aligned.add(tiles[0])

    while queue:
        tile = queue.popleft()

        for id, (other, other_id) in tile.connections.items():
            if other in aligned:
                continue

            # try:
            #     dir, other_dir = tile.dir_ids.index(id), other.dir_ids.index(other_id)
            # except:
            #     print(id)
            #     exit()
            dir, other_dir = tile.dir_ids.index(id), other.dir_ids.index(other_id)
            edge, other_edge = tile.id_edges[id], other.id_edges[other_id]
            # rots = goalmap[dir] - other_dir
            other.rotate(goalmap[dir] - other_dir)

            # if edge == other_edge and edge == other_edge[::-1]:
            #     raise ValueError(f'{tile.id} and {other.id} have symmetrical edges')

            if edge == other_edge:
                other.flip(dir % 2)

            aligned.add(other)
            queue.append(other)

    # exit()
    # for tile in tiles:
    #     if tile.id == 2729:
    #         break
    # print(tile)
    # print('\n'.join(tile.body))
    # for other, _ in tile.connections.values():
    #     print(other)
    #     print('\n'.join(other.body))
    # for tile in tiles:
    #     print(tile)
    #     print('\n'.join(tile.body))
    # exit()

    for tile in tiles:
        if len(tile.connections) == 2:
            dirs = {tile.dir_ids.index(id) for id in tile.connections.keys()}
            if dirs == {1, 2}:
                break

    # print(tile)
    # exit()

    image = []
    # row = []

    while tile is not None:
        row = []

        while tile is not None:
            row.append(tile)
            id = tile.dir_ids[1]
            # :
            #     break
            # print(edge in tile.connections)
            tile = tile.connections[id][0] if id in tile.connections else None

        image.append(row)
        tile = row[0]
        id = tile.dir_ids[2]
        # edge = next((edge for edge, dir in tile.orientation.items() if dir == 2), None)
        # if edge not in tile.connections:
        #     break
        tile = tile.connections[id][0] if id in tile.connections else None

    # print(image)

    # image = image[::-1]
    # image = image[::-1]
    # for row in image:
    #     print(' '.join(str(tile.id) for tile in row))
    # exit()
    built = []

    for row in image:
        for i in range(8):
            formed = ''
            for tile in row:
                formed += tile.body[i]
                # formed += ' '
            built.append(formed)
        # built.append('')
    # print('\n'.join(built))
    # print('\n'.join(built[::-1]))

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

    # return prod(tile.id for tile in tiles if sum(1 for i in range(4) if tile.connections[i] is not None) == 2)
    return count_monsters(built)


def parse_input(data: str) -> list[Tile]:
    tiles = []

    for section in data.split('\n\n'):
        # print(section)
        # exit()
        title, *lines = section.splitlines()
        id = int(title[5:-1])
        # print(id)
        body = [line[1:-1] for line in lines[1:-1]]
        zipped = list(zip(*lines))
        edges = [lines[0], ''.join(zipped[-1]), lines[-1][::-1], ''.join(zipped[0][::-1])]  # up, right, down, left
        # edges = tuple(''.join(raw).replace('.', '0').replace('#', '1') for raw in raw_edges)
        # edges = tuple(''.join(raw) for raw in raw_edges)
        tiles.append(Tile(id, body, edges))
        # print(tiles[0])
        # exit()

    return tiles


def count_monsters(image: list[str]) -> int:
    monster_pattern = [
        [18],
        [0, 5, 6, 11, 12, 17, 18, 19],
        [1, 4, 7, 10, 13, 16],
    ]

    idxs = []

    for _ in range(2):
        for r in range(4):
            image = rotate(image, r)
            for i in range(len(image) - 2):
                for j in range(len(image[i]) - 19):
                    if all(all(image[i + k][j + d] == '#' for d in monster_pattern[k]) for k in range(3)):
                        idxs.append((i, j))

            if idxs:
                break
        else:
            break

        image = flip(image, 0)

    for i, j in idxs:
        for k in range(3):
            for d in monster_pattern[k]:
                image[i + k] = image[i + k][: j + d] + 'O' + image[i + k][1 + j + d :]
    # print('\n'.join(image))

    return sum(sum(1 for c in line if c == '#') for line in image)
    # raise RuntimeError('No monsters found')


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
