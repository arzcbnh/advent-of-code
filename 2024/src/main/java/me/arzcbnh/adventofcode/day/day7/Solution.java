package me.arzcbnh.adventofcode.day.day7;

import java.util.List;
import me.arzcbnh.adventofcode.day.Answer;
import me.arzcbnh.adventofcode.day.Solver;

public final class Solution implements Solver {
    @Override
    public Answer solve(String input) {
        List<Equation> equations = input.lines().map(Equation::new).toList();
        List<Equation> valid = equations.stream().filter(Equation::isValid).toList();
        List<Equation> vp2 = equations.stream().filter(Equation::part2).toList();

        long part1 = valid.stream().mapToLong(eq -> eq.value).sum();
        long part2 = vp2.stream().mapToLong(eq -> eq.value).sum();

        return new Answer(part1, part2);
    }
}
