package me.arzcbnh.adventofcode.day.day6;

enum Direction {
    North,
    South,
    West,
    East;

    public static Direction fromChar(char c) {
        return switch (c) {
            case '^' -> North;
            case 'v' -> South;
            case '<' -> West;
            case '>' -> East;
            default -> throw new IllegalArgumentException("Invalid direction char: " + c);
        };
    }

    public static boolean isValidChar(char c) {
        return c == '^' || c == 'v' || c == '<' || c == '>';
    }
}
