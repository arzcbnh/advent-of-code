package me.arzcbnh.adventofcode;

import java.io.*;
import me.arzcbnh.adventofcode.day.SolverFactory;
import me.arzcbnh.adventofcode.input.InputProvider;
import me.arzcbnh.adventofcode.input.InputServiceFactory;
import org.apache.commons.cli.*;

public class AdventOfCode {
    private static final class CLI {
        int day;
        boolean example;
        boolean prompt;
    }

    private static final InputProvider inputProvider = InputServiceFactory.createInputService();
    private static final BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
    private static final PrintWriter writer = new PrintWriter(System.out, true);

    public static void main(String[] args) throws IOException {
        var cli = parseArgs(args);

        if (cli.prompt) {
            writer.print("Day: ");
            writer.flush();
            cli.day = Integer.parseInt(reader.readLine());
        }

        String input = cli.example ? inputProvider.getExample() : inputProvider.getInput(cli.day);

        var solverInstance = SolverFactory.createDay(cli.day);
        var answer = solverInstance.solve(input);

        writer.println("--- Advent of Code 2024, day " + cli.day + " ---");
        writer.println("Part 1: " + answer.part1());
        writer.println("Part 2: " + answer.part2());
    }

    private static CLI parseArgs(String[] args) {
        var options = new Options()
                .addOption("e", "example", false, "use file 'example' in the current working directory as input")
                .addOption("p", "prompt", false, "prompt for a day");

        try {
            CommandLine cmd = new DefaultParser().parse(options, args);

            var cli = new CLI();
            cli.example = cmd.hasOption("e");

            if (cmd.hasOption("p")) {
                cli.prompt = cmd.hasOption("p");
            } else {
                cli.day = Integer.parseInt(cmd.getArgs()[0]);
            }

            return cli;
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }
}
