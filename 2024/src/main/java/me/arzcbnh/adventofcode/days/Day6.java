package me.arzcbnh.adventofcode.days;

import java.util.*;
import me.arzcbnh.adventofcode.util.Listx;
import me.arzcbnh.adventofcode.util.Listx.Index2D;

public final class Day6 implements Day {
    private enum Direction {
        North,
        South,
        West,
        East;

        public static Direction fromChar(char c) {
            return switch (c) {
                case '^' -> North;
                case 'v' -> South;
                case '<' -> West;
                case '>' -> East;
                default -> throw new IllegalArgumentException("Invalid direction char: " + c);
            };
        }

        public static boolean isValidChar(char c) {
            return c == '^' || c == 'v' || c == '<' || c == '>';
        }
    }

    private enum Action {
        Moved,
        Rotated,
        Exited,
        Looped;
    }

    private enum TileType {
        Obstacle,
        Empty
    }

    private static class Tile {
        public TileType type;
        public int visits = 0;

        public Tile(TileType type) {
            this.type = type;
        }

        public static Tile fromChar(char c) {
            return switch (c) {
                case '#' -> new Tile(TileType.Obstacle);
                case '.' -> new Tile(TileType.Empty);
                default -> {
                    if (Direction.isValidChar(c)) {
                        yield new Tile(TileType.Empty);
                    }

                    throw new DayExecutionException("Invalid tile char: " + c);
                }
            };
        }
    }

    private static class Guard {
        public int x;
        public int y;
        public Direction direction;
        private final Index2D initialPosition;
        private final Direction initialDirection;
        private final List<Index2D> trajectory;

        public Guard(int x, int y, Direction dir) {
            this.x = x;
            this.y = y;
            this.direction = dir;
            this.initialPosition = new Index2D(x, y);
            this.initialDirection = dir;
            this.trajectory = new ArrayList<>();
        }

        public static Guard fromSplitInput(List<List<Character>> input) {
            var index = Listx.findIndex2D(input, c -> c == '^' || c == 'v' || c == '<' || c == '>');

            if (index == null) {
                throw new IllegalStateException("Invalid input: guard character not found");
            } else {
                int x = index.x();
                int y = index.y();
                return new Guard(x, y, Direction.fromChar(input.get(y).get(x)));
            }
        }

        public void saveCurrentPosition() {
            trajectory.add(new Index2D(x, y));
        }

        public Action move(LaboratoryMap map) {
            var next = getNextPosition(map);

            if (map.isIndexOutOfBounds(next)) {
                return Action.Exited;
            } else if (map.isIndexObstructed(next)) {
                rotate();
                return Action.Rotated;
            } else {
                this.x = next.x();
                this.y = next.y();
                saveCurrentPosition();

                var tile = map.getTile(next);
                tile.visits++;

                if (tile.visits > 4) {
                    return Action.Looped;
                } else {
                    return Action.Moved;
                }
            }
        }

        private Index2D getNextPosition(LaboratoryMap map) {
            int x = this.x;
            int y = this.y;

            switch (direction) {
                case North -> y--;
                case South -> y++;
                case West -> x--;
                case East -> x++;
            }

            return new Index2D(x, y);
        }

        private void rotate() {
            this.direction = switch (direction) {
                case North -> Direction.East;
                case East -> Direction.South;
                case South -> Direction.West;
                case West -> Direction.North;
            };
        }

        public void reset() {
            x = initialPosition.x();
            y = initialPosition.y();
            direction = initialDirection;
        }
    }

    private static class LaboratoryMap {
        private final List<List<Tile>> tiles;

        public LaboratoryMap(List<List<Tile>> tiles) {
            this.tiles = tiles;
        }

        public static LaboratoryMap fromSplitInput(List<List<Character>> input, Guard guard) {
            List<List<Tile>> tiles = new ArrayList<>(Collections.nCopies(input.size(), null));
            tiles.replaceAll((__) -> new ArrayList<>());

            Listx.forEach2D(input, (x, y) -> {
                char c = input.get(y).get(x);
                tiles.get(y).add(Tile.fromChar(c));
            });

            tiles.get(guard.y).get(guard.x).visits++;
            return new LaboratoryMap(tiles);
        }

        public Tile getTile(Index2D index) {
            return tiles.get(index.y()).get(index.x());
        }

        public int countVisitedTiles() {
            return tiles.stream()
                    .flatMap(List::stream)
                    .filter(tile -> tile.type == TileType.Empty)
                    .mapToInt(empty -> empty.visits > 0 ? 1 : 0)
                    .sum();
        }

        public boolean isIndexOutOfBounds(Index2D index) {
            int x = index.x();
            int y = index.y();
            return x < 0 || y < 0 || x >= tiles.getFirst().size() || y >= tiles.size();
        }

        public boolean isIndexObstructed(Index2D index) {
            int x = index.x();
            int y = index.y();
            return tiles.get(y).get(x).type == TileType.Obstacle;
        }

        public void clear() {
            tiles.forEach(row -> row.forEach(tile -> tile.visits = 0));
        }

        public void setTile(Index2D index, TileType type) {
            tiles.get(index.y()).get(index.x()).type = type;
        }
    }

    @Override
    public Answer solve(String input) {
        List<List<Character>> split = splitInput(input);
        var guard = Guard.fromSplitInput(split);
        var laboratory = LaboratoryMap.fromSplitInput(split, guard);

        for (var status = Action.Moved; status != Action.Exited; status = guard.move(laboratory))
            ;

        long part1 = laboratory.countVisitedTiles();
        long part2 = 0;

        for (var index : guard.trajectory.stream().distinct().toList()) {
            guard.reset();
            laboratory.clear();
            laboratory.setTile(index, TileType.Obstacle);
            var status = Action.Moved;

            while (status == Action.Moved || status == Action.Rotated) {
                status = guard.move(laboratory);
                part2 += status == Action.Looped ? 1 : 0;
            }

            laboratory.setTile(index, TileType.Empty);
        }

        return new Answer(part1, part2);
    }

    private static List<List<Character>> splitInput(String input) {
        return input.lines()
                .map(line -> line.chars().mapToObj(c -> (char) c).toList())
                .toList();
    }
}
