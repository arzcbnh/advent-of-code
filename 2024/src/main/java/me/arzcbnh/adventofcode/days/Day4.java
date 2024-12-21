package me.arzcbnh.adventofcode.days;

import java.util.List;
import java.util.stream.IntStream;
import java.util.stream.Stream;
import me.arzcbnh.adventofcode.utils.Listx;

public class Day4 extends Day {
    public Answer solve() {
        var crosswords = Crosswords.fromInput(getInput());

        long part1 = crosswords.countXmas();
        long part2 = crosswords.countCrossMas();

        return new Answer(part1, part2);
    }

    private static class Crosswords {
        private final List<List<Character>> grid;
        private long xmasCount;
        private long crossMasCount;

        private Crosswords(List<List<Character>> grid) {
            this.grid = grid;
            this.xmasCount = 0;
            this.crossMasCount = 0;
        }

        public static Crosswords fromInput(String input) {
            List<List<Character>> grid = input.lines()
                    .map(line -> line.chars().mapToObj(c -> (char) c).toList())
                    .toList();

            return new Crosswords(grid);
        }

        public long countXmas() {
            if (xmasCount == 0) {
                xmasCount = countHorizontalXmas() + countVerticalXmas() + countTotalDiagonalXmas();
            }

            return xmasCount;
        }

        private long countHorizontalXmas() {
            return grid.stream().mapToLong(this::countXmasInLine).sum();
        }

        private long countVerticalXmas() {
            return Listx.transpose(grid).stream()
                    .mapToLong(this::countXmasInLine)
                    .sum();
        }

        private long countXmasInLine(List<Character> line) {
            return IntStream.range(0, line.size() - 3)
                    .filter(i -> indexIsHorizontalXmas(line, i))
                    .count();
        }

        private boolean indexIsHorizontalXmas(List<Character> line, int i) {
            List<Character> window = line.subList(i, i + 4);
            List<Character> forwardPattern = List.of('X', 'M', 'A', 'S');
            List<Character> backwardPattern = List.of('S', 'A', 'M', 'X');

            return window.equals(forwardPattern) || window.equals(backwardPattern);
        }

        private long countTotalDiagonalXmas() {
            return IntStream.range(0, grid.size() - 3)
                    .mapToLong(y -> IntStream.range(0, grid.get(y).size() - 3)
                            .mapToLong(x -> countDiagonalXmasInWindow(createWindow(x, y, 4)))
                            .sum())
                    .sum();
        }

        private long countDiagonalXmasInWindow(List<List<Character>> window) {
            var fromTopLeft = isDiagonalXmas(window, 0, 0, 1, 1);
            var fromTopRight = isDiagonalXmas(window, 3, 0, -1, 1);
            var fromBottomLeft = isDiagonalXmas(window, 0, 3, 1, -1);
            var fromBottomRight = isDiagonalXmas(window, 3, 3, -1, -1);

            return Stream.of(fromTopLeft, fromTopRight, fromBottomLeft, fromBottomRight)
                    .filter(x -> x)
                    .count();
        }

        private boolean isDiagonalXmas(List<List<Character>> window, int fromX, int fromY, int dirX, int dirY) {
            char[] pattern = {'X', 'M', 'A', 'S'};

            for (int i = 0; i < pattern.length; i++) {
                var line = window.get(fromY + i * dirY);
                var ch = line.get(fromX + i * dirX);

                if (ch != pattern[i]) {
                    return false;
                }
            }

            return true;
        }

        private long countCrossMas() {
            if (crossMasCount == 0) {
                crossMasCount = IntStream.range(0, grid.size() - 2)
                        .mapToLong(y -> IntStream.range(0, grid.get(y).size() - 2)
                                .mapToObj(x -> isCrossMasInWindow(createWindow(x, y, 3)))
                                .filter(x -> x)
                                .count())
                        .sum();
            }

            return crossMasCount;
        }

        private List<List<Character>> createWindow(int x, int y, int size) {
            return grid.subList(y, y + size).stream()
                    .map(line -> line.subList(x, x + size))
                    .toList();
        }

        private boolean isCrossMasInWindow(List<List<Character>> window) {
            var middleIsA = window.get(1).get(1) == 'A';
            var fromTopLeft = window.get(0).get(0) == 'M' && window.get(2).get(2) == 'S';
            var fromBottomRight = window.get(0).get(0) == 'S' && window.get(2).get(2) == 'M';
            var fromBottomLeft = window.get(2).get(0) == 'M' && window.get(0).get(2) == 'S';
            var fromTopRight = window.get(2).get(0) == 'S' && window.get(0).get(2) == 'M';

            return middleIsA && (fromTopLeft || fromBottomRight) && (fromTopRight || fromBottomLeft);
        }
    }
}
