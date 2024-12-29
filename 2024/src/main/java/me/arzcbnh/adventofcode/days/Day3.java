package me.arzcbnh.adventofcode.days;

import java.util.regex.*;

public final class Day3 extends Day {
    private static final String DO_COMMAND = "do()";
    private static final String DONT_COMMAND = "don't()";

    public Answer solve() {
        var pattern = Pattern.compile("do\\(\\)|don't\\(\\)|mul\\((\\d+),(\\d+)\\)");
        var matcher = pattern.matcher(getInput());

        var part1 = evalOnlyMults(matcher);
        var part2 = evalWithControlOps(matcher);

        return new Answer(part1, part2);
    }

    private long evalOnlyMults(Matcher matcher) {
        long part1 = 0;
        matcher.reset();

        while (matcher.find()) {
            var command = matcher.group();

            if (command.equals(DO_COMMAND) || command.equals(DONT_COMMAND)) {
                continue;
            }

            part1 += evalMultiplication(matcher);
        }

        return part1;
    }

    private long evalWithControlOps(Matcher matcher) {
        var isEnabled = true;
        long part2 = 0;
        matcher.reset();

        while (matcher.find()) {
            var command = matcher.group();

            if (command.equals(DO_COMMAND)) {
                isEnabled = true;
            } else if (command.equals(DONT_COMMAND)) {
                isEnabled = false;
            } else if (isEnabled) {
                part2 += evalMultiplication(matcher);
            }
        }

        return part2;
    }

    private long evalMultiplication(Matcher matcher) {
        var left = matcher.group(1);
        var right = matcher.group(2);
        return Long.parseLong(left) * Long.parseLong(right);
    }
}
