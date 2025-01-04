package me.arzcbnh.adventofcode.day.day7;

import java.util.function.BinaryOperator;
import lombok.AllArgsConstructor;

@AllArgsConstructor
enum Operator {
    Addition(Long::sum),
    Multiplication((a, b) -> a * b),
    Concatenation((a, b) -> Long.parseLong(String.valueOf(a) + b));

    private final BinaryOperator<Long> function;

    public long calculate(long a, long b) {
        return function.apply(a, b);
    }
}
