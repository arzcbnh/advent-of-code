package me.arzcbnh.adventofcode.day.day7;

import java.util.Arrays;
import java.util.List;
import java.util.Stack;
import lombok.Getter;

record State(long value, int index, Operator operator) {}

final class Equation {
    @Getter
    private final long value;

    private final List<Integer> operands;

    public Equation(String encoded) {
        String[] parts = encoded.split(": ");
        this.value = Long.parseLong(parts[0]);
        this.operands =
                Arrays.stream(parts[1].split(" ")).map(Integer::parseInt).toList();
    }

    public boolean isValid(List<Operator> operators) {
        var stack = new Stack<State>();
        operators.forEach(op -> stack.add(new State(op.identity(), 0, op)));

        while (!stack.isEmpty()) {
            var state = stack.pop();

            boolean hasOperatedAll = state.index() == operands.size();
            boolean isExpectedValue = state.value() == value;
            boolean hasExceededValue = state.value() > value;

            if (hasOperatedAll && isExpectedValue) {
                return true;
            } else if (!hasOperatedAll && !hasExceededValue) {
                long a = state.value();
                long b = operands.get(state.index());
                long value = state.operator().calculate(a, b);
                int index = state.index() + 1;

                operators.forEach(op -> stack.add(new State(value, index, op)));
            }
        }

        return false;
    }
}
