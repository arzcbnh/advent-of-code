package me.arzcbnh.adventofcode.days;

public abstract class Day {
    protected final String input;

    protected Day(String i) {
        input = i;
    }

    public abstract Answer solve();
}
