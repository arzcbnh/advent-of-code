package me.arzcbnh.adventofcode.days;

import java.util.List;
import java.util.stream.IntStream;
import java.util.stream.Stream;
import me.arzcbnh.adventofcode.utils.Listx;

public final class Day4 extends Day {
    public Answer solve() {
        var crosswords = Crosswords.fromInput(getInput());

        long part1 = crosswords.countXmas();
        long part2 = crosswords.countCrossMas();

        return new Answer(part1, part2);
    }

    private static class Crosswords {
        private static final List<Character> XMAS = List.of('X', 'M', 'A', 'S');
        private static final List<Character> SAMX = XMAS.reversed();
        private static final List<Character> MAS = List.of('M', 'A', 'S');
        private static final List<Character> SAM = MAS.reversed();

        private final List<List<Character>> grid;
        private long xmasCount;
        private long crossMasCount;

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
            if (xmasCount == 0) {
                xmasCount = countHorizontalXmas() + countVerticalXmas() + countDiagonalXmas();
            }

            return xmasCount;
        }

        private long countCrossMas() {
            if (crossMasCount == 0) {
                var windows = streamWindows(3);
                crossMasCount = windows.map(this::isCrossMas).filter(x -> x).count();
            }

            return crossMasCount;
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
            var windows = streamWindows(4);
            return windows.mapToLong(this::countDiagonalXmasInWindow).sum();
        }

        private Stream<List<List<Character>>> streamWindows(int windowSize) {
            Stream.Builder<List<List<Character>>> builder = Stream.builder();

            for (int y = 0; y + windowSize <= grid.size(); y++) {
                for (int x = 0; x + windowSize <= grid.get(y).size(); x++) {
                    builder.add(create2DWindow(x, y, windowSize));
                }
            }

            return builder.build();
        }

        private List<List<Character>> create2DWindow(int x, int y, int size) {
            return grid.subList(y, y + size).stream()
                    .map(line -> line.subList(x, x + size))
                    .toList();
        }

        private long countXmasInLine(List<Character> line) {
            return IntStream.range(0, line.size() - 3)
                    .mapToObj(i -> line.subList(i, i + 4))
                    .filter(window -> window.equals(XMAS) || window.equals(SAMX))
                    .count();
        }

        private long countDiagonalXmasInWindow(List<List<Character>> window) {
            boolean firstDiagonal = isDiagonalXmas(window, 0, 0, false);
            boolean secondDiagonal = isDiagonalXmas(window, 3, 0, true);

            return Stream.of(firstDiagonal, secondDiagonal).filter(x -> x).count();
        }

        private boolean isDiagonalXmas(List<List<Character>> window, int fromX, int fromY, boolean invertX) {
            int factor = invertX ? -1 : 1;

            List<Character> section = List.of(
                    window.get(fromY).get(fromX),
                    window.get(fromY + 1).get(fromX + 1 * factor),
                    window.get(fromY + 2).get(fromX + 2 * factor),
                    window.get(fromY + 3).get(fromX + 3 * factor));

            return section.equals(XMAS) || section.equals(SAMX);
        }

        private boolean isCrossMas(List<List<Character>> window) {
            List<Character> firstDiagonal = List.of(
                    window.get(0).get(0), window.get(1).get(1), window.get(2).get(2));

            List<Character> secondDiagonal = List.of(
                    window.get(0).get(2), window.get(1).get(1), window.get(2).get(0));

            return (firstDiagonal.equals(MAS) || firstDiagonal.equals(SAM))
                    && (secondDiagonal.equals(MAS) || secondDiagonal.equals(SAM));
        }
    }
}
