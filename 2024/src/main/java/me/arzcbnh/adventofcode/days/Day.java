package me.arzcbnh.adventofcode.days;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import lombok.experimental.StandardException;
import me.arzcbnh.adventofcode.utils.Normalizer;

public abstract class Day {
    public static Day getSolution(String day) {
        return getSolution(Integer.parseInt(Normalizer.day(day)));
    }

    public static Day getSolution(Number day) {
        try {
            String className = "me.arzcbnh.adventofcode.days.Day" + day;
            Class<?> dayClass = Class.forName(className);
            Constructor<?> constructor = dayClass.getConstructor();
            Day instance = (Day) constructor.newInstance();
            return instance;
        } catch (ClassNotFoundException e) {
            throw new IllegalArgumentException("Day " + day + " not implemented", e);
        } catch (NoSuchMethodException | InstantiationException | IllegalAccessException e) {
            throw new DayFactoryException("Day " + day + " not properly implemented", e);
        } catch (InvocationTargetException e) {
            throw new DayFactoryException(e);
        }
    }

    public abstract Answer solve(String input);

    @StandardException
    public static class DayFactoryException extends RuntimeException {}
}
