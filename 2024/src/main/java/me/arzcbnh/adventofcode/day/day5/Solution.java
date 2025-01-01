package me.arzcbnh.adventofcode.day.day5;

import java.util.*;
import me.arzcbnh.adventofcode.day.Answer;
import me.arzcbnh.adventofcode.day.Solver;

public final class Solution implements Solver {
    public Answer solve(String input) {
        var sections = Sections.fromInput(input);
        var rules = RuleMap.fromSerials(sections.serials());
        var updates = Updates.fromAllUpdates(sections.updates(), rules);

        int part1 = getMedian(updates.correct());
        int part2 = getMedian(updates.sorted());

        return new Answer(part1, part2);
    }

    private static int getMedian(List<List<Integer>> updates) {
        return updates.stream().mapToInt(up -> up.get(up.size() / 2)).sum();
    }
}
