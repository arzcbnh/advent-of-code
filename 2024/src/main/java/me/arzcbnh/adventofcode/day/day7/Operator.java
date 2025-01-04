package me.arzcbnh.adventofcode.day.day7;

import java.util.function.BinaryOperator;
import lombok.AllArgsConstructor;

@AllArgsConstructor
enum Operator {
    Addition(0L, Long::sum),
    Multiplication(1L, (a, b) -> a * b),
    Concatenation(0L, (a, b) -> Long.parseLong(String.valueOf(a) + b));

    private final Long identity;
    private final BinaryOperator<Long> function;

    public long calculate(long a, long b) {
        return function.apply(a, b);
    }

    public long identity() {
        return identity;
    }
}
