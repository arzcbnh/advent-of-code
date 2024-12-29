package me.arzcbnh.adventofcode.days;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.IntStream;

public final class Day2 extends Day {
    private static class LevelSequence {
        private final List<Integer> levels;
        private final ValidationResult validationResult;

        private record ValidationResult(boolean isSafeByDefault, boolean isSafeWithModule) {}

        public LevelSequence(List<Integer> l) {
            levels = List.copyOf(l);
            validationResult = validateSequence();
        }

        private ValidationResult validateSequence() {
            boolean isSafeByDefault = isSequenceSafe(levels);
            boolean isSafeWithModule = IntStream.range(0, levels.size())
                    .mapToObj(this::createSequenceWithoutIndex)
                    .anyMatch(LevelSequence::isSequenceSafe);

            return new ValidationResult(isSafeByDefault, isSafeWithModule);
        }

        private static boolean isSequenceSafe(List<Integer> levels) {
            var isAscending = levels.get(0) < levels.get(1);

            for (int i = 1; i < levels.size(); i++) {
                var curr = levels.get(i);
                var prev = levels.get(i - 1);
                var diff = Math.abs(curr - prev);

                if ((prev < curr) != isAscending) {
                    return false;
                }

                if (diff < 1 || diff > 3) {
                    return false;
                }
            }

            return true;
        }

        private List<Integer> createSequenceWithoutIndex(int i) {
            List<Integer> sequence = new ArrayList<>(levels);
            sequence.remove(i);
            return sequence;
        }

        public boolean isSafeWithoutModule() {
            return validationResult.isSafeByDefault();
        }

        public boolean isSafeWithModule() {
            return validationResult.isSafeWithModule();
        }
    }

    public Answer solve(String input) {
        var reports = parseInput(input);

        var part1 = reports.stream().filter(LevelSequence::isSafeWithoutModule).count();
        var part2 = reports.stream().filter(LevelSequence::isSafeWithModule).count();

        return new Answer(part1, part2);
    }

    private List<LevelSequence> parseInput(String input) {
        List<LevelSequence> reports = input
                .lines()
                .map(line ->
                        Arrays.stream(line.split(" ")).map(Integer::parseInt).toList())
                .map(LevelSequence::new)
                .toList();

        return reports;
    }
}
