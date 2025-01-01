package me.arzcbnh.adventofcode.day.day4;

import me.arzcbnh.adventofcode.day.Answer;
import me.arzcbnh.adventofcode.day.Solver;
import me.arzcbnh.adventofcode.util.Listx;

public final class Solution implements Solver {
    public Answer solve(String input) {
        var crosswords = new Crosswords(Listx.splitInput2D(input));

        long part1 = crosswords.countXmas();
        long part2 = crosswords.countCrossMas();

        return new Answer(part1, part2);
    }
}
