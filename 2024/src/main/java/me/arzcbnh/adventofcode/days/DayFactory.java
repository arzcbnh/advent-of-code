package me.arzcbnh.adventofcode.days;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

public final class DayFactory {
    public static Day createDay(int day) {
        if (day < 1 || day > 25) {
            throw new IllegalArgumentException("Day must be a number between 1 and 25");
        }

        try {
            String className = "me.arzcbnh.adventofcode.days.Day" + day;
            Class<?> dayClass = Class.forName(className);
            Constructor<?> constructor = dayClass.getConstructor();
            return (Day) constructor.newInstance();
        } catch (ClassNotFoundException e) {
            try {
                String className = "me.arzcbnh.adventofcode.solution.day" + day + ".Solution";
                Class<?> dayClass = Class.forName(className);
                Constructor<?> constructor = dayClass.getConstructor();
                return (Day) constructor.newInstance();
            } catch (Exception er) {
                throw new IllegalArgumentException("Day " + day + " not implemented", er);
            }
        } catch (NoSuchMethodException | InstantiationException | IllegalAccessException e) {
            throw new DayExecutionException("Day " + day + " not properly implemented", e);
        } catch (InvocationTargetException e) {
            throw new DayExecutionException(e);
        }
    }
}
