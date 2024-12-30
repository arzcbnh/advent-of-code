package me.arzcbnh.adventofcode.days;

import java.util.*;
import java.util.stream.IntStream;

public final class Day6 implements Day {
    private record Coordinate(int x, int y) {}

    //    private enum Direction {
    //        North,
    //        South,
    //        West,
    //        East;
    //
    //        public static Direction fromChar(int c) {
    //            return switch (c) {
    //                case '^' -> North;
    //                case 'v' -> South;
    //                case '<' -> West;
    //                case '>' -> East;
    //                default -> throw new IllegalArgumentException("No direction constant for char " + c + " found");
    //            };
    //        }
    //    }
    //
    //        private enum TileType {
    //            Empty,
    //            Obstacle,
    //            Guard;
    //
    //            public static TileType fromChar(int c) {
    //                return switch (c) {
    //                    case '.' -> Empty;
    //                    case '#' -> Obstacle;
    //                    case '^', 'v', '<', '>' -> Guard;
    //                    default -> throw new IllegalArgumentException("No legend constant for char " + c + " found");
    //                };
    //            }
    //        }
    //
    //    private static class Tile {
    //        public TileType type;
    //        public Direction dir;
    //        public int steps = 0;
    //
    //        private Tile(TileType type, Direction dir) {
    //            this.type = type;
    //            this.dir = dir;
    //        }
    //
    //        public static Tile fromChar(int c) {
    //            var type = TileType.fromChar(c);
    //            var dir = type == TileType.Guard ? Direction.fromChar(c) : null;
    //            return new Tile(type, dir);
    //        }
    //    }
    //
    //    private static class LaboratoryMap {
    //        private final List<List<Tile>> map;
    //        private int totalSteps = 0;
    //
    //        private final Coordinate guardStartPosition;
    //        private Coordinate guardPosition;
    //
    //        public LaboratoryMap(List<List<Tile>> map, Coordinate guardStart) {
    //            this.guardStartPosition = guardStart;
    //            this.map = map;
    //        }
    //
    //        public static LaboratoryMap fromInput(String input) {
    //            var tiles = input.lines().map(line -> line.chars().mapToObj(Tile::fromChar));
    //            var map = tiles.map(line -> (List<Tile>) line.collect(Collectors.toCollection(ArrayList::new)))
    //                    .toList();
    //
    //            var guardStart = findGuardStart(map);
    //
    //            return new LaboratoryMap(map, guardStart);
    //        }
    //
    //        private static Coordinate findGuardStart(List<List<Tile>> map) {
    //            for (int y = 0; y < map.size(); y++) {
    //                for (int x = 0; x < map.get(y).size(); x++) {
    //                    var tile = map.get(y).get(x);
    //
    //                    if (tile.type == TileType.Guard) {
    //                        return new Coordinate(x, y);
    //                    }
    //                }
    //            }
    //
    //            throw new DayExecutionException("Invalid input: guard character not found");
    //        }
    //
    //        public void step() {
    //            int x = guardPosition.x;
    //            int y = guardPosition.y;
    //            var tile = map.get(y).get(x);
    //
    //            tile.steps++;
    //
    //            switch (tile.dir) {
    //                case North:
    //                    if (y == 0) {
    //                        break;
    //                    } else if (map.get(y - 1).get(x).type == TileType.Empty) {
    //                        guardPosition = new Coordinate(x, y - 1);
    //                        var next = map.get(y - 1).get(x);
    //                        next.type = tile.type;
    //                        next.dir = tile.dir;
    //                    } else {
    //                        map.get(y).get(x).dir = Direction.East;
    //                    }
    //
    //                    break;
    //                case East:
    //                    if (x + 1 == map.get(y).size()) {
    //                        break;
    //                    } else if (map.get(y).get(x + 1).type == TileType.Empty) {
    //                        guardPosition = new Coordinate(x + 1, y);
    //                        var next = map.get(y).get(x + 1);
    //                        next.type = tile.type;
    //                        next.dir = tile.dir;
    //                    } else {
    //                        map.get(y).get(x).dir = Direction.South;
    //                    }
    //
    //                    break;
    //                case South:
    //                    if (y + 1 == map.size()) {
    //                        break;
    //                    } else if (map.get(y + 1).get(x).type == TileType.Empty) {
    //                        guardPosition = new Coordinate(x, y + 1);
    //                        var next = map.get(y + 1).get(x);
    //                        next.type = tile.type;
    //                        next.dir = tile.dir;
    //                    } else {
    //                        map.get(y).get(x).dir = Direction.West;
    //                    }
    //
    //                    break;
    //                case West:
    //                    if (x == 0) {
    //                        break;
    //                    } else if (map.get(y).get(x - 1).type == TileType.Empty) {
    //                        guardPosition = new Coordinate(x - 1, y);
    //                        var next = map.get(y).get(x - 1);
    //                        next.type = tile.type;
    //                        next.dir = tile.dir;
    //                    } else {
    //                        map.get(y).get(x).dir = Direction.South;
    //                    }
    //
    //                    break;
    //            }
    //        }
    //    }

    //
    //    private enum Legend {
    //        Guard('^'),
    //        Obstruction('#'),
    //        Empty('.');
    //
    //        private final int symbol;
    //
    //        Legend(int symbol) {
    //            this.symbol = symbol;
    //        }
    //
    //        public static Legend fromSymbol(int symbol) {
    //            for (var legend : Legend.values()) {
    //                if (legend.symbol == symbol) {
    //                    return legend;
    //                }
    //            }
    //
    //            throw new IllegalArgumentException("No legend constant with symbol " + symbol + " found");
    //        }
    //    }
    //
    //    private record Tile(int content, Map<Direction, Boolean> log) {
    //        public Tile(int content) {
    //            this(content, new EnumMap<>(Direction.class));
    //        }
    //
    //        public void addToLog(Direction dir) {
    //            log.put(dir, true);
    //        }
    //
    //        public boolean hasPassedFacing(Direction dir) {
    //            return log.getOrDefault(dir, false);
    //        }
    //    }
    //
    //    private static class LabMap {
    //        private final List<List<Tile>> map;
    //        private final Coordinate initialPosition;
    //
    //        public LabMap(List<List<Tile>> map, Coordinate initialPosition) {
    //            this.initialPosition = initialPosition;
    //            this.map = map;
    //        }
    //
    //        public static LabMap fromInput(String input) {
    //            List<List<Tile>> chars =
    //                    input.lines().map(line -> line.chars().mapToObj(Tile::new).toList()).toList();
    //
    //            return new LabMap(chars, findGuardCoordinate(chars));
    //        }
    //
    //        private static Coordinate findGuardCoordinate(List<List<Tile>> map) {
    //            for (int y = 0; y < map.size(); y++) {
    //                for (int x = 0; x < map.get(y).size(); x++) {
    //                    if (map.get(y).get(x).content == '^') {
    //                        return new Coordinate(x, y);
    //                    }
    //                }
    //            }
    //
    //            return new Coordinate(0, 0);
    //        }
    //
    //        public void reset() {
    //
    //        }
    //    }

    @Override
    public Answer solve(String input) {
        List<List<Integer>> map = input.lines()
                .map(line ->
                        (List<Integer>) new ArrayList<>(line.chars().boxed().toList()))
                .toList();

        Coordinate guard = findGuard(map);
        List<Coordinate> passed = new ArrayList<>();

        processMap(map, passed, guard);
        long part1 = map.stream()
                .mapToLong(line -> line.stream().filter(c -> c == 'X').count())
                .sum();

        long part2 = 0;

        passed = passed.stream().distinct().toList();

        for (var coord : passed.subList(1, passed.size())) {
            clearMap(map, guard);
            int x = coord.x;
            int y = coord.y;
            //            int x = 7;
            //            int y = 9;

            map.get(y).set(x, (int) '#');

            if (hasLoop(map, guard)) {
                System.out.println("" + x + " " + y);
                part2++;
            }

            //            System.out.println(part2);
            //            System.exit(0);
            map.get(y).set(x, (int) '.');
        }

        return new Answer(part1, part2);
    }

    private static Coordinate findGuard(List<List<Integer>> map) {
        for (int y = 0; y < map.size(); y++) {
            for (int x = 0; x < map.get(y).size(); x++) {
                if (map.get(y).get(x) == '^') {
                    return new Coordinate(x, y);
                }
            }
        }

        return new Coordinate(0, 0);
    }

    private void processMap(List<List<Integer>> map, List<Coordinate> passed, Coordinate guard) {
        while (true) {
            int x = guard.x;
            int y = guard.y;
            int c = map.get(y).get(x);
            map.get(y).set(x, (int) 'X');
            //            System.out.println("" + x + " " + y);

            if (c == '^') {
                if (y == 0) {
                    passed.add(new Coordinate(x, y));
                    break;
                } else if (map.get(y - 1).get(x) == '#') {
                    map.get(y).set(x, (int) '>');
                } else {
                    map.get(y - 1).set(x, (int) '^');
                    guard = new Coordinate(x, y - 1);
                    passed.add(new Coordinate(x, y));
                }
            } else if (c == '>') {
                if (x + 1 == map.get(y).size()) {
                    passed.add(new Coordinate(x, y));
                    break;
                } else if (map.get(y).get(x + 1) == '#') {
                    map.get(y).set(x, (int) 'v');
                } else {
                    map.get(y).set(x + 1, (int) '>');
                    guard = new Coordinate(x + 1, y);
                    passed.add(new Coordinate(x, y));
                }
            } else if (c == 'v') {
                if (y + 1 == map.size()) {
                    passed.add(new Coordinate(x, y));
                    break;
                } else if (map.get(y + 1).get(x) == '#') {
                    map.get(y).set(x, (int) '<');
                } else {
                    map.get(y + 1).set(x, (int) 'v');
                    guard = new Coordinate(x, y + 1);
                    passed.add(new Coordinate(x, y));
                }
            } else {
                if (x == 0) {
                    passed.add(new Coordinate(x, y));
                    break;
                } else if (map.get(y).get(x - 1) == '#') {
                    map.get(y).set(x, (int) '^');
                } else {
                    map.get(y).set(x - 1, (int) '<');
                    guard = new Coordinate(x - 1, y);
                    passed.add(new Coordinate(x, y));
                }
            }
        }
    }

    private boolean hasLoop(List<List<Integer>> map, Coordinate guard) {
        var count = new ArrayList<>(IntStream.range(0, map.size())
                .mapToObj(y -> new ArrayList<>(IntStream.range(0, map.get(y).size())
                        .map(x -> 0)
                        .boxed()
                        .toList()))
                .toList());

        while (true) {
            //            printmap(map);
            int x = guard.x;
            int y = guard.y;
            int c = map.get(y).get(x);
            map.get(y).set(x, (int) '.');
            count.get(y).set(x, count.get(y).get(x) + 1);

            if (count.get(y).get(x) > 4) {
                return true;
            }

            if (c == '^') {
                if (y == 0) {
                    break;
                } else if (map.get(y - 1).get(x) == '#') {
                    map.get(y).set(x, (int) '>');
                } else {
                    map.get(y - 1).set(x, (int) '^');
                    guard = new Coordinate(x, y - 1);
                }
            } else if (c == '>') {
                if (x + 1 == map.get(y).size()) {
                    break;
                } else if (map.get(y).get(x + 1) == '#') {
                    map.get(y).set(x, (int) 'v');
                } else {
                    map.get(y).set(x + 1, (int) '>');
                    guard = new Coordinate(x + 1, y);
                }
            } else if (c == 'v') {
                if (y + 1 == map.size()) {
                    break;
                } else if (map.get(y + 1).get(x) == '#') {
                    map.get(y).set(x, (int) '<');
                } else {
                    map.get(y + 1).set(x, (int) 'v');
                    guard = new Coordinate(x, y + 1);
                }
            } else {
                if (x == 0) {
                    break;
                } else if (map.get(y).get(x - 1) == '#') {
                    map.get(y).set(x, (int) '^');
                } else {
                    map.get(y).set(x - 1, (int) '<');
                    guard = new Coordinate(x - 1, y);
                }
            }
        }

        return false;
    }

    private void clearMap(List<List<Integer>> map, Coordinate guard) {
        map.get(guard.y).set(guard.x, (int) '^');

        for (List<Integer> integers : map) {
            for (int x = 0; x < integers.size(); x++) {
                int val = integers.get(x);
                if (val != '#' && val != '^') {
                    integers.set(x, (int) '.');
                }
            }
        }
    }

    //    private int count = 0;

    //    private void printmap(List<List<Integer>> map) {
    //        map.forEach(line -> {
    //            line.forEach(c -> {
    //                if (c < 10) {
    //                    System.out.print(c);
    //                } else {
    //                    System.out.print((char) c.intValue());
    //                    //                    System.out.print(c);
    //                }
    //            });
    //
    //            System.out.print('\n');
    //        });
    //        System.out.print('\n');
    //
    //        count++;
    //
    //        if (count == 10) {
    //            System.exit(0);
    //        }
    //    }
}
