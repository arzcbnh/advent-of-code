package me.arzcbnh.adventofcode.day.day7;

import java.util.Arrays;
import java.util.List;
import me.arzcbnh.adventofcode.day.Answer;
import me.arzcbnh.adventofcode.day.Solver;

public final class Solution implements Solver {
    @Override
    public Answer solve(String input) {
        List<Operator> operators = Arrays.asList(Operator.values());
        List<Equation> equations = input.lines().map(Equation::new).toList();

        List<Equation> validWithoutConcat = equations.stream()
                .filter(eq -> eq.isValid(operators.subList(0, 2)))
                .toList();

        List<Equation> validWithConcat =
                equations.stream().filter(eq -> eq.isValid(operators)).toList();

        long part1 = validWithoutConcat.stream().mapToLong(Equation::getValue).sum();
        long part2 = validWithConcat.stream().mapToLong(Equation::getValue).sum();

        return new Answer(part1, part2);
    }
}
