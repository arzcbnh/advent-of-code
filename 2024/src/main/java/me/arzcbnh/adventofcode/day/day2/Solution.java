package me.arzcbnh.adventofcode.day.day2;

import java.util.Arrays;
import java.util.List;
import me.arzcbnh.adventofcode.day.Answer;
import me.arzcbnh.adventofcode.day.Solver;

public final class Solution implements Solver {
    public Answer solve(String input) {
        var reports = parseInput(input);

        var part1 = reports.stream().filter(LevelSequence::isSafeWithoutModule).count();
        var part2 = reports.stream().filter(LevelSequence::isSafeWithModule).count();

        return new Answer(part1, part2);
    }

    private List<LevelSequence> parseInput(String input) {
        List<LevelSequence> reports = input.lines()
                .map(line ->
                        Arrays.stream(line.split(" ")).map(Integer::parseInt).toList())
                .map(LevelSequence::new)
                .toList();

        return reports;
    }
}
