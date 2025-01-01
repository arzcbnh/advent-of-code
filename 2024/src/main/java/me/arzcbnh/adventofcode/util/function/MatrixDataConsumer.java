package me.arzcbnh.adventofcode.util.function;

@FunctionalInterface
public interface MatrixDataConsumer<T> {
    void accept(T item, int x, int y);
}
