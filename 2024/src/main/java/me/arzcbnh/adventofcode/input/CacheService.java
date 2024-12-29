package me.arzcbnh.adventofcode.input;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class CacheService implements Cache {
    private final Path directory;

    public CacheService(Path directory) {
        this.directory = directory;
    }

    public String readInput(int day) throws IOException {
        var path = directory.resolve(Integer.toString(day));
        return Files.readString(path);
    }

    public void storeInput(int day, String input) throws IOException {
        var path = directory.resolve(Integer.toString(day));
        Files.writeString(path, input);
    }
}
