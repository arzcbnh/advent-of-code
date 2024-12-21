package me.arzcbnh.adventofcode.days;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import lombok.experimental.StandardException;
import me.arzcbnh.adventofcode.utils.Normalizer;

public abstract class Day {
    private String input;

    public static Day getSolution(String day, String input) {
        return getSolution(Normalizer.day(day).toString(), input);
    }

    public static Day getSolution(Number day, String input) {
        try {
            String className = "me.arzcbnh.adventofcode.days.Day" + day;
            Class<?> dayClass = Class.forName(className);
            Constructor<?> constructor = dayClass.getConstructor();
            Day instance = (Day) constructor.newInstance();
            instance.setInput(input);
            return instance;
        } catch (ClassNotFoundException e) {
            throw new IllegalArgumentException("Day " + day + " not implemented", e);
        } catch (NoSuchMethodException | InstantiationException | IllegalAccessException e) {
            throw new DayFactoryException("Day " + day + " not properly implemented", e);
        } catch (InvocationTargetException e) {
            throw new DayFactoryException(e);
        }
    }

    public abstract Answer solve();

    protected String getInput() {
        return this.input;
    }

    private void setInput(String input) {
        this.input = input;
    }

    @StandardException
    public static class DayFactoryException extends RuntimeException {}
}
