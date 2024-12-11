package me.arzcbnh.adventofcode;

import me.arzcbnh.adventofcode.days.DayFactory;
import me.arzcbnh.adventofcode.utils.InputService;

public class AdventOfCode {
    private static InputService inputService = new InputService();

    public static void main(String[] args) {
        // Normalize day number
        var day = args[0];
        var num = Integer.parseInt(day);
        day = Integer.toString(num);

        if (num < 1 || num > 25) {
            throw new IllegalArgumentException("Day must be between 1 and 25");
        }

        var input = inputService.getInput(day);
        var dayInstance = DayFactory.createDay(day, input);
        var answer = dayInstance.solve();

        System.out.println("--- Advent of Code 2024 ---");
        System.out.println("Part 1: " + answer.part1());
        System.out.println("Part 2: " + answer.part2());
    }
}
