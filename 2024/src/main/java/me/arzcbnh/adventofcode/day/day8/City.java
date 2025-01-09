package me.arzcbnh.adventofcode.day.day8;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.function.Predicate;
import me.arzcbnh.adventofcode.util.Listx;
import me.arzcbnh.adventofcode.util.Listx.Index2D;

final class City {
    private final List<Antenna> antennas;
    private final List<List<Antinode>> antinodes;
    private boolean hasCalculatedImpact = false;

    public City(String input) {
        List<List<Character>> chars = Listx.splitInput2D(input);

        this.antennas = new ArrayList<>();
        this.antinodes = chars.stream()
                .map(__ -> (List<Antinode>) new ArrayList<Antinode>())
                .toList();

        Listx.forEach2D(chars, (c, x, y) -> {
            antinodes.get(y).add(x, new Antinode());

            if (c != '.') {
                antennas.add(new Antenna(x, y, c));
            }
        });
    }

    public long countOppositeSideAntinodes() {
        return countAntinodeType(Antinode::isOppositeSide);
    }

    public long countResonantAntinodes() {
        return countAntinodeType(Antinode::isResonant);
    }

    private long countAntinodeType(Predicate<? super Antinode> predicate) {
        if (!hasCalculatedImpact) {
            calculateImpact();
        }

        return antinodes.stream().flatMap(Collection::stream).filter(predicate).count();
    }

    private void calculateImpact() {
        this.hasCalculatedImpact = true;

        for (var source : antennas) {
            List<Antenna> sameFrequency = antennas.stream()
                    .filter(target -> !source.equals(target) && source.hasSameFrequency(target))
                    .toList();

            for (var target : sameFrequency) {
                markAntinodes(source, target);
            }
        }
    }

    private void markAntinodes(Antenna source, Antenna target) {
        Index2D direction = calculateDirection(source, target);
        markOppositeAntinode(source, direction);
        markResonantAntinodes(source, direction);
    }

    private Index2D calculateDirection(Antenna source, Antenna target) {
        int x = source.x() - target.x();
        int y = source.y() - target.y();
        return new Index2D(x, y);
    }

    private void markOppositeAntinode(Antenna source, Index2D direction) {
        int x = source.x() + direction.x();
        int y = source.y() + direction.y();

        if (isInsideBounds(x, y)) {
            antinodes.get(y).get(x).setOppositeSide(true);
        }
    }

    private void markResonantAntinodes(Antenna source, Index2D direction) {
        int x = source.x();
        int y = source.y();

        while (isInsideBounds(x, y)) {
            antinodes.get(y).get(x).setResonant(true);
            x += direction.x();
            y += direction.y();
        }
    }

    private boolean isInsideBounds(int x, int y) {
        return y >= 0 && x >= 0 && y < antinodes.size() && x < antinodes.get(y).size();
    }
}
