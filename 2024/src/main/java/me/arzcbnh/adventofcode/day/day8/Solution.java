package me.arzcbnh.adventofcode.day.day8;

import me.arzcbnh.adventofcode.day.Answer;
import me.arzcbnh.adventofcode.day.Solver;

public final class Solution implements Solver {
    @Override
    public Answer solve(String input) {
        var city = new City(input);

        long part1 = city.countOppositeSideAntinodes();
        long part2 = city.countResonantAntinodes();

        return new Answer(part1, part2);
    }
}
