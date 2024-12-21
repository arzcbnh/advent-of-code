package me.arzcbnh.adventofcode;

import me.arzcbnh.adventofcode.days.Day;
import me.arzcbnh.adventofcode.utils.InputService;

public class AdventOfCode {
    private static InputService inputService = new InputService();

    public static void main(String[] args) {
        var day = normalizeDay(args[0]);
        var input = inputService.getInput(day);
        var dayInstance = Day.getSolution(day, input);
        var answer = dayInstance.solve();

        System.out.println("--- Advent of Code 2024 ---");
        System.out.println("Part 1: " + answer.part1());
        System.out.println("Part 2: " + answer.part2());
    }

    private static String normalizeDay(String day) {
        try {
            var num = Integer.parseInt(day);

            if (num < 1 || num > 25) {
                throw new IllegalArgumentException("Day must be a number between 1 and 25");
            }

            return Integer.toString(num);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Day must be a number between 1 and 25", e);
        }
    }
}
