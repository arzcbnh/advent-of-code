package me.arzcbnh.adventofcode.day.day6;

final class Tile {
    private int visits;
    public boolean isObstacle;
    private final boolean isInitiallyObstacle;

    public Tile(char c) {
        this.visits = 0;
        this.isObstacle = this.isInitiallyObstacle = switch (c) {
            case '#' -> true;
            case '.' -> false;
            default -> {
                if (Direction.isValidChar(c)) {
                    yield false;
                }

                throw new IllegalArgumentException("Invalid tile char: " + c);
            }
        };
    }

    public int visit() {
        this.visits++;
        return visits;
    }

    public void reset() {
        this.visits = 0;
        this.isObstacle = isInitiallyObstacle;
    }
}
