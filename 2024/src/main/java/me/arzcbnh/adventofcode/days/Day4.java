package me.arzcbnh.adventofcode.days;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
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
        private enum Pattern {
            XMAS,
            CROSS_MAS
        }

        private final List<List<Character>> grid;
        private final Map<Pattern, Long> patternCounts = new EnumMap<>(Pattern.class);

        private Crosswords(List<List<Character>> grid) {
            this.grid = grid;
        }

        public static Crosswords fromInput(String input) {
            List<List<Character>> grid = input.lines()
                    .map(line -> line.chars().mapToObj(c -> (char) c).toList())
                    .toList();

            return new Crosswords(grid);
        }

        public long countXmas() {
            return patternCounts.computeIfAbsent(
                    Pattern.XMAS, __ -> countHorizontalXmas() + countVerticalXmas() + countDiagonalXmas());
        }

        private long countCrossMas() {
            return patternCounts.computeIfAbsent(Pattern.CROSS_MAS, __ -> {
                final int windowSize = 3;
                long count = 0;

                for (int y = 0; y + windowSize <= grid.size(); y++) {
                    for (int x = 0; x + windowSize <= grid.get(y).size(); x++) {
                        var window = create2DWindow(x, y, windowSize);
                        count += isCrossMasInWindow(window) ? 1 : 0;
                    }
                }

                return count;
            });
        }

        private long countHorizontalXmas() {
            return grid.stream().mapToLong(this::countXmasInLine).sum();
        }

        private long countVerticalXmas() {
            return Listx.transpose(grid).stream()
                    .mapToLong(this::countXmasInLine)
                    .sum();
        }

        private long countDiagonalXmas() {
            final int windowSize = 4;
            long count = 0;

            for (int y = 0; y + windowSize <= grid.size(); y++) {
                for (int x = 0; x + windowSize <= grid.get(y).size(); x++) {
                    var window = create2DWindow(x, y, windowSize);
                    count += countDiagonalXmasInWindow(window);
                }
            }

            return count;
        }

        private List<List<Character>> create2DWindow(int x, int y, int size) {
            return grid.subList(y, y + size).stream()
                    .map(line -> line.subList(x, x + size))
                    .toList();
        }

        private long countXmasInLine(List<Character> line) {
            List<Character> XMAS = List.of('X', 'M', 'A', 'S');
            List<Character> SAMX = List.of('S', 'A', 'M', 'X');

            return IntStream.range(0, line.size() - 3)
                    .mapToObj(i -> line.subList(i, i + 4))
                    .filter(window -> window.equals(XMAS) || window.equals(SAMX))
                    .count();
        }

        private long countDiagonalXmasInWindow(List<List<Character>> window) {
            boolean topLeft = isDiagonalXmas(window, 0, 0, 1, 1);
            boolean topRight = isDiagonalXmas(window, 3, 0, -1, 1);
            boolean bottomLeft = isDiagonalXmas(window, 0, 3, 1, -1);
            boolean bottomRight = isDiagonalXmas(window, 3, 3, -1, -1);

            return Stream.of(topLeft, topRight, bottomLeft, bottomRight)
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

        private boolean isCrossMasInWindow(List<List<Character>> window) {
            if (window.get(1).get(1) != 'A') {
                return false;
            }

            boolean topLeft = window.get(0).get(0) == 'M' && window.get(2).get(2) == 'S';
            boolean topRight = window.get(2).get(0) == 'S' && window.get(0).get(2) == 'M';
            boolean bottomLeft = window.get(2).get(0) == 'M' && window.get(0).get(2) == 'S';
            boolean bottomRight = window.get(0).get(0) == 'S' && window.get(2).get(2) == 'M';

            return (topLeft || bottomRight) && (topRight || bottomLeft);
        }
    }
}
