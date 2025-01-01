package me.arzcbnh.adventofcode.day;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

public final class SolverFactory {
    public static Solver createDay(int day) {
        if (day < 1 || day > 25) {
            throw new IllegalArgumentException("Day must be a number between 1 and 25");
        }

        try {
            String className = "me.arzcbnh.adventofcode.day.day" + day + ".Solution";
            Class<?> dayClass = Class.forName(className);
            Constructor<?> constructor = dayClass.getConstructor();
            return (Solver) constructor.newInstance();
        } catch (ClassNotFoundException e) {
            throw new IllegalArgumentException("Day " + day + " not implemented", e);
        } catch (NoSuchMethodException | InstantiationException | IllegalAccessException e) {
            throw new UnsupportedOperationException("Day " + day + " not properly implemented", e);
        } catch (InvocationTargetException e) {
            throw new SolverInvocationException(e.getCause());
        }
    }
}
