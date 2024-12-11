package me.arzcbnh.adventofcode.days;

abstract sealed interface Part permits NumberPart, StringPart {
    Object value();
}

record NumberPart(Number value) implements Part {
    @Override
    public final String toString() {
        return value.toString();
    }
}

record StringPart(String value) implements Part {
    @Override
    public final String toString() {
        return value;
    }
}

public record Answer(Part part1, Part part2) {
    public Answer(Number p1, Number p2) {
        this(new NumberPart(p1), new NumberPart(p2));
    }

    public Answer(Number p1, String p2) {
        this(new NumberPart(p1), new StringPart(p2));
    }

    public Answer(String p1, Number p2) {
        this(new StringPart(p1), new NumberPart(p2));
    }

    public Answer(String p1, String p2) {
        this(new StringPart(p1), new StringPart(p2));
    }
}
