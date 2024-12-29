package me.arzcbnh.adventofcode;

import me.arzcbnh.adventofcode.days.Answer;
import me.arzcbnh.adventofcode.days.Day;
import me.arzcbnh.adventofcode.input.Cache;
import me.arzcbnh.adventofcode.input.CacheService;
import me.arzcbnh.adventofcode.input.InputProvider;
import me.arzcbnh.adventofcode.input.InputService;
import me.arzcbnh.adventofcode.utils.Normalizer;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Collectors;

public class AdventOfCode {
    private static final InputProvider inputProvider;

    static {
        Path cacheDirectory = setupCacheDirectory();
        Cache cacheService = new CacheService(cacheDirectory);
        inputProvider = new InputService(cacheService);
    }

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
            input = inputProvider.getInput(Integer.parseInt(day));
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

    private static Path setupCacheDirectory() {
        String xdg = System.getenv("XDG_CACHE_DIR");
        String home = System.getProperty("user.home");
        Path userCache;

        if (xdg != null) {
            userCache = Paths.get(xdg);
        } else {
            userCache = Paths.get(home, ".cache");
        }

        Path aocCache = userCache.resolve("arzcbnh-aoc/2024");

        try {
            Files.createDirectories(aocCache);
        } catch (IOException e) {
            throw new RuntimeException("Unable to setup Advent of Code 2024 cache directory", e);
        }

        return aocCache;
    }
}
