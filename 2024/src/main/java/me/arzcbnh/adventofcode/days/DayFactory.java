package me.arzcbnh.adventofcode.days;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import lombok.experimental.StandardException;

public final class DayFactory {
    public static Day createDay(String day, String input) {
        try {
            String className = "me.arzcbnh.adventofcode.days.Day" + day;
            Class<?> dayClass = Class.forName(className);
            Constructor<?> constructor = dayClass.getConstructor(String.class);
            return (Day) constructor.newInstance(input);
        } catch (ClassNotFoundException e) {
            throw new IllegalArgumentException("Day " + day + " not yet implemented", e);
        } catch (NoSuchMethodException | InstantiationException | IllegalAccessException e) {
            throw new DayFactoryException("Day " + day + " not properly implemented", e);
        } catch (InvocationTargetException e) {
            throw new DayFactoryException(e);
        }
    }

    private DayFactory() {}
}

@StandardException
class DayFactoryException extends RuntimeException {}
