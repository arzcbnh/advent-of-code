package me.arzcbnh.adventofcode.day.day5;

import java.util.Arrays;
import java.util.List;

record Sections(List<String> serials, List<List<Integer>> updates) {
    public static Sections fromInput(String input) {
        var split = input.split("\n\n");
        var serials = split[0].lines().toList();
        var updates = split[1].lines().map(Sections::parseIntList).toList();

        return new Sections(serials, updates);
    }

    private static List<Integer> parseIntList(String list) {
        return Arrays.stream(list.split(",")).map(Integer::parseInt).toList();
    }
}
