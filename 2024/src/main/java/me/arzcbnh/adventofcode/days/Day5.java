package me.arzcbnh.adventofcode.days;

import java.util.*;
import java.util.stream.IntStream;

public class Day5 extends Day {

    public Answer solve() {
        Map<Integer, List<Integer>> rules = parseRules();
        List<List<Integer>> updates = parseUpdates();
        List<List<Integer>> ordered = updates.stream().filter(update -> {
            return IntStream.range(0, update.size()).allMatch(i -> {
                var preceding = update.subList(0, i);
                List<Integer> pages = rules.getOrDefault(update.get(i), new ArrayList<>());

                return preceding.stream().allMatch(prec -> {
                    return !pages.contains(prec);
                });
            });
        }).toList();
//        System.out.println(ordered);
//        System.out.println(rules.get(75));
//        System.out.println(rules.get(29));
//        System.out.println(rules.get(13));

        List<List<Integer>> disordered = updates.stream().filter(update -> {
            return !IntStream.range(0, update.size()).allMatch(i -> {
                var preceding = update.subList(0, i);
                List<Integer> pages = rules.getOrDefault(update.get(i), new ArrayList<>());

                return preceding.stream().allMatch(prec -> {
                    return !pages.contains(prec);
                });
            });
        }).toList();

        List<List<Integer>> fised = disordered.stream().map(update -> update.stream().sorted((a, b) -> {
            var rulesa = rules.get(a);
            var rulesb = rules.get(b);

            if (rulesa != null && rulesa.contains(b)) {
                return -1;
            } else if (rulesb != null && rulesb.contains(a)) {
                return 1;
            } else {
                return 0;
            }
        }).toList()).toList();

        int part1 = ordered.stream().mapToInt(up -> up.get(up.size() / 2)).sum();
        int part2 = fised.stream().mapToInt(up -> up.get(up.size() / 2)).sum();

        return new Answer(part1, part2);
    }

    private Map<Integer, List<Integer>> parseRules() {
        Map<Integer, List<Integer>> rules = new HashMap<>();

        getInput().split("\n\n")[0].lines().forEach(str -> {
            var pair = str.split("\\|");
            var preceding = Integer.parseInt(pair[0]);
            var succeeding = Integer.parseInt(pair[1]);

            rules.putIfAbsent(preceding, new ArrayList<Integer>());
            rules.get(preceding).add(succeeding);
        });

        return rules;
    }

    private List<List<Integer>> parseUpdates() {
        return getInput().split("\n\n")[1].lines().map(line -> Arrays.stream(line.split(",")).mapToInt(str -> Integer.parseInt(str)).boxed().toList()).toList();
    }

//    private static class Rul {
//        private int preceding;
//        private List<Integer> succeeding;
//    }
}
