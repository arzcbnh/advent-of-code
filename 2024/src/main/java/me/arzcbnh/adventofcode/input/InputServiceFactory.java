package me.arzcbnh.adventofcode.input;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public final class InputServiceFactory {
    public static InputService createInputService() {
        Path cacheDirectory = setupCacheDirectory();
        Cache cacheService = new CacheService(cacheDirectory);
        var urlFormat = "https://adventofcode.com/2024/day/%d/input";
        return new InputService(cacheService, urlFormat);
    }

    private static Path setupCacheDirectory() {
        String xdg = System.getenv("XDG_CACHE_DIR");
        String home = System.getProperty("user.home");
        Path userCache;

        if (xdg != null) {
            userCache = Paths.get(xdg);
        } else {
            userCache = Paths.get(home, ".cache");
        }

        Path aocCache = userCache.resolve("arzcbnh-aoc/2024");

        try {
            Files.createDirectories(aocCache);
        } catch (IOException e) {
            throw new RuntimeException("Unable to setup Advent of Code 2024 cache directory", e);
        }

        return aocCache;
    }
}
