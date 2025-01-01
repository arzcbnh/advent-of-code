package me.arzcbnh.adventofcode.day.day5;

import java.util.*;

record RuleMap(Map<Integer, List<Integer>> rules) {
    public static RuleMap fromSerials(List<String> serials) {
        Map<Integer, List<Integer>> rules = new HashMap<>();

        serials.forEach(str -> {
            var pair = str.split("\\|");
            var preceding = Integer.parseInt(pair[0]);
            var succeeding = Integer.parseInt(pair[1]);

            rules.putIfAbsent(preceding, new ArrayList<>());
            rules.get(preceding).add(succeeding);
        });

        rules.replaceAll((key, value) -> Collections.unmodifiableList(value));
        return new RuleMap(Collections.unmodifiableMap(rules));
    }

    public int comparePages(int a, int b) {
        if (rules.get(a).contains(b)) {
            return -1;
        } else if (rules.get(b).contains(a)) {
            return 1;
        } else {
            return 0;
        }
    }
}
