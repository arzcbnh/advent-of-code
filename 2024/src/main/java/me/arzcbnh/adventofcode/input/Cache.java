package me.arzcbnh.adventofcode.input;

import java.io.IOException;

public interface Cache {
    String readInput(int day) throws IOException;
    void storeInput(int day, String input) throws IOException;
}
