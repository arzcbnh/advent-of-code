package me.arzcbnh.adventofcode.day.day1;

import java.util.ArrayList;
import java.util.List;
import me.arzcbnh.adventofcode.day.Answer;
import me.arzcbnh.adventofcode.day.Solver;

public final class Solution implements Solver {
    public Answer solve(String input) {
        var lists = parseInput(input);
        List<Integer> locations1 = lists.get(0);
        List<Integer> locations2 = lists.get(1);

        var part1 = calcTotalDistance(locations1, locations2);
        var part2 = calcSimilarityScore(locations1, locations2);

        return new Answer(part1, part2);
    }

    private static List<List<Integer>> parseInput(String input) {
        List<Integer> locations1 = new ArrayList<>(1000);
        List<Integer> locations2 = new ArrayList<>(1000);

        input.lines().forEach(line -> {
            var ids = line.split(" {3}");
            locations1.add(Integer.parseInt(ids[0]));
            locations2.add(Integer.parseInt(ids[1]));
        });

        return List.of(locations1, locations2);
    }

    private static long calcTotalDistance(List<Integer> locations1, List<Integer> locations2) {
        List<Integer> distances = new ArrayList<>(1000);

        locations1.sort(Integer::compare);
        locations2.sort(Integer::compare);

        for (var i = 0; i < locations1.size(); i++) {
            int dist = Math.abs(locations1.get(i) - locations2.get(i));
            distances.add(dist);
        }

        return distances.stream().mapToLong(Integer::longValue).sum();
    }

    private static long calcSimilarityScore(List<Integer> locations1, List<Integer> locations2) {
        long score = 0;

        for (var id : locations1) {
            long occurrences = locations2.stream().filter(id::equals).count();
            score += id * occurrences;
        }

        return score;
    }
}
