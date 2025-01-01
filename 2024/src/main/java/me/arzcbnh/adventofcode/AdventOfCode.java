package me.arzcbnh.adventofcode;

import me.arzcbnh.adventofcode.day.SolverFactory;
import me.arzcbnh.adventofcode.input.InputProvider;
import me.arzcbnh.adventofcode.input.InputServiceFactory;

public class AdventOfCode {
    public static void main(String[] args) {
        InputProvider inputProvider = InputServiceFactory.createInputService();

        int day = Integer.parseInt(args[0]);
        boolean useExample = args.length > 1;

        String input = useExample ? inputProvider.getExample() : inputProvider.getInput(day);

        var solverInstance = SolverFactory.createDay(day);
        var answer = solverInstance.solve(input);

        System.out.println("--- Advent of Code 2024, day " + day + " ---");
        System.out.println("Part 1: " + answer.part1());
        System.out.println("Part 2: " + answer.part2());
    }
}
