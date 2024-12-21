package me.arzcbnh.adventofcode.utils;

public class Normalizer {
    public static String day(String day) {
        try {
            var num = Integer.parseInt(day);

            if (num < 1 || num > 25) {
                throw new IllegalArgumentException("Day must be a number between 1 and 25");
            }

            return Integer.toString(num);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Day must be a number between 1 and 25", e);
        }
    }
}
