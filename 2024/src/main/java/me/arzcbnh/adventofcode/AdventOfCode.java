package me.arzcbnh.adventofcode;

import me.arzcbnh.adventofcode.days.Day;
import me.arzcbnh.adventofcode.utils.InputService;
import me.arzcbnh.adventofcode.utils.Normalizer;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.stream.Collectors;

public class AdventOfCode {
    private static InputService inputService = new InputService();

    public static void main(String[] args) {
        String day = Normalizer.day(args[0]);
        String input;

        try {
            var example = args[1];
            ClassLoader loader = AdventOfCode.class.getClassLoader();
            try (InputStream stream = loader.getResourceAsStream("example")) {
                var reader = new BufferedReader(new InputStreamReader(stream));
                input = reader.lines().collect(Collectors.joining("\n"));
            } catch (Exception e) {
                throw e;
            }
        } catch (Exception e) {
            input = inputService.getInput(day);
        }

//        String input = inputService.getInput(day);
        var dayInstance = Day.getSolution(day);
        var answer = dayInstance.solve(input);

        System.out.println("--- Advent of Code 2024, day " + day + " ---");
        System.out.println("Part 1: " + answer.part1());
        System.out.println("Part 2: " + answer.part2());
    }
}
