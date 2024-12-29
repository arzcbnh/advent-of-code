package me.arzcbnh.adventofcode;

import me.arzcbnh.adventofcode.days.Answer;
import me.arzcbnh.adventofcode.days.Day;
import me.arzcbnh.adventofcode.utils.InputService;
import me.arzcbnh.adventofcode.utils.Normalizer;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
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

        var answer = solveDay(Integer.parseInt(day), input);

        System.out.println("--- Advent of Code 2024, day " + day + " ---");
        System.out.println("Part 1: " + answer.part1());
        System.out.println("Part 2: " + answer.part2());
    }

    public static Answer solveDay(int day, String input) {
        if (day < 1 || day > 25) {
            throw new IllegalArgumentException("Day must be a number between 1 and 25");
        }

        try {
            String className = "me.arzcbnh.adventofcode.days.Day" + day;
            Class<?> dayClass = Class.forName(className);
            Constructor<?> constructor = dayClass.getConstructor();
            Day instance = (Day) constructor.newInstance();
            return instance.solve(input);
        } catch (ClassNotFoundException e) {
            throw new IllegalArgumentException("Day " + day + " not implemented", e);
        } catch (NoSuchMethodException | InstantiationException | IllegalAccessException e) {
            throw new RuntimeException("Day " + day + " not properly implemented", e);
        } catch (InvocationTargetException e) {
            throw new RuntimeException(e);
        }
    }
}
