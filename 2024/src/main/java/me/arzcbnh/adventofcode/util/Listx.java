package me.arzcbnh.adventofcode.util;

import java.util.List;
import java.util.function.Consumer;
import java.util.function.Predicate;
import java.util.stream.IntStream;
import me.arzcbnh.adventofcode.util.function.IntBinaryConsumer;
import me.arzcbnh.adventofcode.util.function.MatrixDataConsumer;

public class Listx {
    public record Index2D(int x, int y) {}

    //    public static List<List<Character>> streamInput2D(String input) {
    //        return input.lines()
    //                .map(line -> line.chars().mapToObj(c -> (char) c).toList())
    //                .toList();
    //    }

    public static <T> T find2D(List<List<T>> list, Predicate<T> predicate) {
        var index = findIndex2D(list, predicate);

        if (index == null) {
            return null;
        } else {
            return list.get(index.y()).get(index.x());
        }
    }

    public static <T> Index2D findIndex2D(List<List<T>> list, Predicate<T> predicate) {
        for (int y = 0; y < list.size(); y++) {
            for (int x = 0; x < list.get(y).size(); x++) {
                if (predicate.test(list.get(y).get(x))) {
                    return new Index2D(x, y);
                }
            }
        }

        return null;
    }

    public static <T> void forEach2D(List<List<T>> list, Consumer<T> consumer) {
        list.forEach(row -> row.forEach(consumer));
    }

    public static <T> void forEach2D(List<List<T>> list, IntBinaryConsumer consumer) {
        for (int y = 0; y < list.size(); y++) {
            for (int x = 0; x < list.get(y).size(); x++) {
                consumer.accept(x, y);
            }
        }
    }

    public static <T> void forEach2D(List<List<T>> list, MatrixDataConsumer<T> consumer) {
        for (int y = 0; y < list.size(); y++) {
            for (int x = 0; x < list.get(y).size(); x++) {
                var item = list.get(y).get(x);
                consumer.accept(item, x, y);
            }
        }
    }

    public static List<List<Character>> splitInput2D(String input) {
        return input.lines()
                .map(line -> line.chars().mapToObj(c -> (char) c).toList())
                .toList();
    }

    public static <T> List<List<T>> transpose(List<List<T>> list) {
        return IntStream.range(0, list.get(0).size())
                .mapToObj(i -> list.stream().map(line -> line.get(i)).toList())
                .toList();
    }
}
