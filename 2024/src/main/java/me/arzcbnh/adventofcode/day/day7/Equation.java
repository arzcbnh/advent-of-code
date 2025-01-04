package me.arzcbnh.adventofcode.day.day7;

import java.util.Arrays;
import java.util.List;

final class Equation {
    public final long value;
    private final List<Integer> operands;
    private Boolean isValid;

    public Equation(String encoded) {
        String[] parts = encoded.split(": ");
        this.value = Long.parseLong(parts[0]);
        this.operands =
                Arrays.stream(parts[1].split(" ")).map(Integer::parseInt).toList();
    }

    public boolean isValid() {
        return op(0, Operator.Addition, 0) || op(0, Operator.Multiplication, 1);
    }

    public boolean part2() {
        return sop(0, Operator.Addition, 0) || sop(0, Operator.Multiplication, 1) || sop(0, Operator.Concatenation, 0);
    }

    private boolean op(int i, Operator ope, long curr) {
        if (i >= operands.size()) {
            return false;
        }

        if (ope == Operator.Addition) {
            curr += operands.get(i);
        } else if (ope == Operator.Multiplication) {
            curr *= operands.get(i);
        }

        if (i == operands.size() - 1 && curr == value) {
            return true;
        }

        return op(i + 1, Operator.Addition, curr) || op(i + 1, Operator.Multiplication, curr);
    }

    private boolean sop(int i, Operator ope, long curr) {
        if (i >= operands.size()) {
            return false;
        }

        if (ope == Operator.Addition) {
            curr += operands.get(i);
        } else if (ope == Operator.Multiplication) {
            curr *= operands.get(i);
        } else {
            curr = Long.parseLong(String.valueOf(curr) + String.valueOf(operands.get(i)));
        }

        if (i == operands.size() - 1 && curr == value) {
            return true;
        }

        return sop(i + 1, Operator.Addition, curr)
                || sop(i + 1, Operator.Multiplication, curr)
                || sop(i + 1, Operator.Concatenation, curr);
    }
}
