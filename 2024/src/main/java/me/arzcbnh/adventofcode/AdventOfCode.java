package me.arzcbnh.adventofcode;

import me.arzcbnh.adventofcode.days.Day;
import me.arzcbnh.adventofcode.utils.InputService;
import me.arzcbnh.adventofcode.utils.Normalizer;

public class AdventOfCode {
    private static InputService inputService = new InputService();

    public static void main(String[] args) {
        var day = Normalizer.day(args[0]);
        var input = inputService.getInput(day);
        var dayInstance = Day.getSolution(day, input);
        var answer = dayInstance.solve();

        System.out.println("--- Advent of Code 2024 ---");
        System.out.println("Part 1: " + answer.part1());
        System.out.println("Part 2: " + answer.part2());
    }
}
