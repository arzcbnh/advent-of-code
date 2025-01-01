package me.arzcbnh.adventofcode;

import me.arzcbnh.adventofcode.day.SolverFactory;
import me.arzcbnh.adventofcode.days.DayFactory;
import me.arzcbnh.adventofcode.input.InputProvider;
import me.arzcbnh.adventofcode.input.InputServiceFactory;

public class AdventOfCode {
    public static void main(String[] args) {
        InputProvider inputProvider = InputServiceFactory.createInputService();

        int day = Integer.parseInt(args[0]);
        boolean useExample = args.length > 1;

        String input = useExample ? inputProvider.getExample() : inputProvider.getInput(day);
        String part1, part2;

        try {
            var dayInstance = DayFactory.createDay(day);
            var answer = dayInstance.solve(input);
            part1 = answer.part1();
            part2 = answer.part2();
        } catch (Exception e) {
            var solverInstance = SolverFactory.createDay(day);
            var answer = solverInstance.solve(input);
            part1 = answer.part1();
            part2 = answer.part2();
        }

        System.out.println("--- Advent of Code 2024, day " + day + " ---");
        System.out.println("Part 1: " + part1);
        System.out.println("Part 2: " + part2);
    }
}
