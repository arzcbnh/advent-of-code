package me.arzcbnh.adventofcode;

import me.arzcbnh.adventofcode.days.Day;
import me.arzcbnh.adventofcode.utils.InputService;
import me.arzcbnh.adventofcode.utils.Normalizer;

public class AdventOfCode {
    private static InputService inputService = new InputService();

    public static void main(String[] args) {
        String day = Normalizer.day(args[0]);
        String input = inputService.getInput(day);
        var dayInstance = Day.getSolution(day, input);
        var answer = dayInstance.solve();

        System.out.println("--- Advent of Code 2024, day " + day + " ---");
        System.out.println("Part 1: " + answer.part1());
        System.out.println("Part 2: " + answer.part2());
    }
}
