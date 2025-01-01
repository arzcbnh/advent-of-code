package me.arzcbnh.adventofcode.day.day6;

import java.util.List;
import lombok.Getter;
import me.arzcbnh.adventofcode.util.Listx;
import me.arzcbnh.adventofcode.util.Listx.Index2D;

final class Guard {
    @Getter
    private Index2D position;

    @Getter
    private final Index2D initialPosition;

    private Direction direction;
    private final Direction initialDirection;
    private final LaboratoryMap map;

    public Guard(LaboratoryMap map, List<List<Character>> scheme) {
        this.map = map;

        var index = Listx.findIndex2D(scheme, Direction::isValidChar);

        if (index == null) {
            throw new IllegalStateException("Invalid input: guard character not found");
        } else {
            char c = scheme.get(index.y()).get(index.x());
            this.position = this.initialPosition = index;
            this.direction = this.initialDirection = Direction.fromChar(c);
        }
    }

    public Action queryMoveAttempt() {
        var next = getNextPosition();

        if (map.isIndexOutOfBounds(next)) {
            return Action.Exited;
        } else if (map.isIndexObstructed(next)) {
            rotate();
            return Action.Moved;
        } else {
            return move(next);
        }
    }

    private Index2D getNextPosition() {
        int x = position.x();
        int y = position.y();

        switch (direction) {
            case North -> y--;
            case South -> y++;
            case West -> x--;
            case East -> x++;
        }

        return new Index2D(x, y);
    }

    private Action move(Index2D next) {
        this.position = next;
        int visits = map.visitTile(next);

        if (visits > 4) {
            return Action.Looped;
        } else {
            return Action.Moved;
        }
    }

    private void rotate() {
        this.direction = switch (direction) {
            case North -> Direction.East;
            case East -> Direction.South;
            case South -> Direction.West;
            case West -> Direction.North;
        };
    }

    public void reset() {
        this.position = initialPosition;
        this.direction = initialDirection;
    }
}
