package me.arzcbnh.adventofcode.days;

import java.util.*;
import java.util.stream.IntStream;

public final class Day5 implements Day {
    private record RuleMap(Map<Integer, List<Integer>> rules) {
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

        public List<Integer> get(Integer page) {
            return rules.getOrDefault(page, List.of());
        }
    }

    private record Updates(List<List<Integer>> correct, List<List<Integer>> sorted) {
        public static Updates fromAllUpdates(List<List<Integer>> updates, RuleMap rules) {
            List<List<Integer>> correct = new ArrayList<>();
            List<List<Integer>> sorted = new ArrayList<>();

            for (var update : updates) {
                if (isOrdered(update, rules)) {
                    correct.add(update);
                } else {
                    sorted.add(update.stream().sorted((a, b) -> comparePages(a, b, rules)).toList());
                }
            }

            return new Updates(Collections.unmodifiableList(correct), Collections.unmodifiableList(sorted));
        }

        private static boolean isOrdered(List<Integer> update, RuleMap rules) {
            var indexes = IntStream.range(0, update.size());

            return indexes.allMatch(i -> {
                var currPage = update.get(i);
                var preceding = update.subList(0, i);
                var mustSucceed = rules.get(currPage);

                return preceding.stream().noneMatch(mustSucceed::contains);
            });
        }

        private static int comparePages(int a, int b, RuleMap rules) {
            if (rules.get(a).contains(b)) {
                return -1;
            } else if (rules.get(b).contains(a)) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    private record Sections(List<String> serials, List<List<Integer>> updates) {
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

    public Answer solve(String input) {
        var sections = Sections.fromInput(input);
        var rules = RuleMap.fromSerials(sections.serials);
        var updates = Updates.fromAllUpdates(sections.updates, rules);

        int part1 = getMedian(updates.correct);
        int part2 = getMedian(updates.sorted);

        return new Answer(part1, part2);
    }

    private static int getMedian(List<List<Integer>> updates) {
        return updates.stream().mapToInt(up -> up.get(up.size() / 2)).sum();
    }
}
