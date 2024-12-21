package me.arzcbnh.adventofcode.utils;

import java.util.List;
import java.util.stream.IntStream;

public class Listx {
    public static <T> List<List<T>> transpose(List<List<T>> list) {
        return IntStream.range(0, list.get(0).size())
                .mapToObj(i -> list.stream().map(line -> line.get(i)).toList())
                .toList();
    }
}
