package me.arzcbnh.adventofcode.day.day8;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import me.arzcbnh.adventofcode.day.Answer;
import me.arzcbnh.adventofcode.day.Solver;

public final class Solution implements Solver {
    @Override
    public Answer solve(String input) {
        List<List<Character>> chars = input.lines()
                .map(line -> line.chars().mapToObj(c -> (char) c).toList())
                .toList();
        List<List<Integer>> antinodes = chars.stream()
                .map(row -> row.stream().map(__ -> 0).collect(Collectors.toList()))
                .collect(Collectors.toList());
        List<Antenna> antennas = new ArrayList<>();

        for (int y = 0; y < chars.size(); y++) {
            for (int x = 0; x < chars.get(y).size(); x++) {
                char c = chars.get(y).get(x);
                if (c != '.') {
                    antennas.add(new Antenna(x, y, c));
                }
            }
        }

        for (var antenna : antennas) {
            List<Antenna> alikes = antennas.stream()
                    .filter(a -> (antenna.x() != a.x() || antenna.y() != a.y()) && antenna.frequency() == a.frequency())
                    .toList();
            for (var alike : alikes) {
                int x = 2 * antenna.x() - alike.x();
                int y = 2 * antenna.y() - alike.y();

                if (x >= 0
                        && y >= 0
                        && y < antinodes.size()
                        && x < antinodes.get(y).size()) {
                    int v = antinodes.get(y).get(x);
                    antinodes.get(y).set(x, v + 1);
                }
            }
        }

        int antinodeCount = antinodes.stream()
                .mapToInt(row -> row.stream().mapToInt(v -> v > 0 ? 1 : 0).sum())
                .sum();

        for (var antenna : antennas) {
            List<Antenna> alikes = antennas.stream()
                    .filter(a -> (antenna.x() != a.x() || antenna.y() != a.y()) && antenna.frequency() == a.frequency())
                    .toList();
            for (var alike : alikes) {
                int x = antenna.x() - alike.x();
                int y = antenna.y() - alike.y();

                int i = antenna.x();
                int j = antenna.y();

                while (i >= 0
                        && j >= 0
                        && j < antinodes.size()
                        && i < antinodes.get(j).size()) {
                    int v = antinodes.get(j).get(i);
                    antinodes.get(j).set(i, v + 1);
                    i -= x;
                    j -= y;
                }
            }
        }

        int part2 = antinodes.stream()
                .mapToInt(row -> row.stream().mapToInt(v -> v > 0 ? 1 : 0).sum())
                .sum();

        return new Answer(antinodeCount, part2);
    }
}

record Antenna(int x, int y, char frequency) {}
