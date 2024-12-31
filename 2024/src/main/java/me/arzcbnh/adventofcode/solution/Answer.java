package me.arzcbnh.adventofcode.solution;

public final class Answer {
    private final Object part1;
    private final Object part2;

    private Answer(Object p1, Object p2) {
        this.part1 = p1;
        this.part2 = p2;
    }

    public Answer(Number p1, Number p2) {
        this((Object) p1, p2);
    }

    public Answer(Number p1, String p2) {
        this((Object) p1, p2);
    }

    public Answer(String p1, Number p2) {
        this((Object) p1, p2);
    }

    public Answer(String p1, String p2) {
        this((Object) p1, p2);
    }

    public String part1() {
        return part1.toString();
    }

    public String part2() {
        return part2.toString();
    }
}
