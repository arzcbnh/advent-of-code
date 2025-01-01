package me.arzcbnh.adventofcode.day.day6;

import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import me.arzcbnh.adventofcode.util.Listx;

record SimulationResults(Action result, Set<Listx.Index2D> trajectory) {}

@AllArgsConstructor
final class Simulation {
    private final LaboratoryMap map;
    private final Guard guard;

    public int countUniqueVisitedTiles() {
        var results = run();
        return results.trajectory().size() + 1;
    }

    public int countPossibleLoops() {
        int count = 0;

        for (var index : run().trajectory()) {
            map.setObstacle(index);
            count += run().result() == Action.Looped ? 1 : 0;
        }

        return count;
    }

    private SimulationResults run() {
        Set<Listx.Index2D> trajectory = new HashSet<>();
        Action action;

        do {
            trajectory.add(guard.getPosition());
            action = guard.queryMoveAttempt();
        } while (action == Action.Moved);

        trajectory.remove(guard.getInitialPosition());
        guard.reset();
        map.reset();

        return new SimulationResults(action, trajectory);
    }
}
