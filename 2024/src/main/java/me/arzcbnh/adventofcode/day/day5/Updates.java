package me.arzcbnh.adventofcode.day.day5;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

record Updates(List<List<Integer>> correct, List<List<Integer>> sorted) {
    public static Updates fromAllUpdates(List<List<Integer>> updates, RuleMap rules) {
        List<List<Integer>> correct = new ArrayList<>();
        List<List<Integer>> sorted = new ArrayList<>();

        for (var update : updates) {
            var expected = update.stream().sorted(rules::comparePages).toList();

            if (update.equals(expected)) {
                correct.add(update);
            } else {
                sorted.add(expected);
            }
        }

        return new Updates(Collections.unmodifiableList(correct), Collections.unmodifiableList(sorted));
    }
}
