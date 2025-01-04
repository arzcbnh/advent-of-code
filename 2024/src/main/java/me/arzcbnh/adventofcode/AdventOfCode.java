package me.arzcbnh.adventofcode;

import me.arzcbnh.adventofcode.day.SolverFactory;
import me.arzcbnh.adventofcode.input.InputProvider;
import me.arzcbnh.adventofcode.input.InputServiceFactory;
import org.apache.commons.cli.*;

public class AdventOfCode {
    private static final class CLI {
        int day;
        boolean useExample;
    }

    private static final InputProvider inputProvider = InputServiceFactory.createInputService();

    public static void main(String[] args) {
        var cli = parseArgs(args);

        String input = cli.useExample ? inputProvider.getExample() : inputProvider.getInput(cli.day);

        var solverInstance = SolverFactory.createDay(cli.day);
        var answer = solverInstance.solve(input);

        System.out.println("--- Advent of Code 2024, day " + cli.day + " ---");
        System.out.println("Part 1: " + answer.part1());
        System.out.println("Part 2: " + answer.part2());
    }

    private static CLI parseArgs(String[] args) {
        var options = new Options()
                .addOption("e", "example", false, "use file 'example' in the current working directory as input");

        try {
            CommandLine cmd = new DefaultParser().parse(options, args);

            var cli = new CLI();
            cli.day = Integer.parseInt(cmd.getArgs()[0]);
            cli.useExample = cmd.hasOption("e");

            return cli;
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }
}
