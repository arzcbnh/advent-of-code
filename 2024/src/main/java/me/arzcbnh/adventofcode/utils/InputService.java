package me.arzcbnh.adventofcode.utils;

import java.io.IOException;
import java.net.URI;
import java.net.http.*;
import java.net.http.HttpResponse.BodyHandlers;
import java.nio.file.*;
import lombok.experimental.StandardException;

public class InputService {
    private final Cache cache;
    private final String session;

    public InputService() {
        cache = new Cache();
        session = System.getenv("AOC_SESSION");
    }

    public String getInput(String day) {
        return getInput(Normalizer.day(day).toString());
    }

    public String getInput(Number dayNumber) {
        var day = dayNumber.toString();

        try {
            return cache.getInput(day);
        } catch (IOException e) {
            // Do nothing, I don't want to nest try-catch statements
        }

        try {
            String input = fetchInput(day);
            cache.store(day, input);
            return input;
        } catch (IOException e) {
            throw new InputServiceException(e);
        }
    }

    private String fetchInput(String day) {
        if (session == null) {
            throw new InputServiceException("AOC_SESSION environment variable is null");
        }

        HttpResponse<String> response;

        try {
            var client = HttpClient.newHttpClient();
            var sessionCookie = "session=" + session;
            var url = "https://adventofcode.com/2024/day/" + day + "/input";
            var request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Cookie", sessionCookie)
                    .header("User-Agent", "github.com/arzcbnh/advent-of-code by 1TzkVCrXPOqfUk0d@gmail.com")
                    .build();

            response = client.send(request, BodyHandlers.ofString());
        } catch (IOException e) {
            throw new InputServiceException(e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new InputServiceException(e);
        }

        if (response.statusCode() != 200) {
            throw new InputServiceException("Unable to fetch input, status code: " + response.statusCode());
        }

        return response.body();
    }

    private static class Cache {
        private final Path directory;

        public Cache() {
            directory = setupDirectory();
        }

        private static Path setupDirectory() {
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
                throw new InputServiceException("Unable to setup Advent of Code 2024 cache directory", e);
            }

            return aocCache;
        }

        public String getInput(String day) throws IOException {
            var inputPath = directory.resolve(day);
            return Files.readString(inputPath);
        }

        public void store(String day, String content) throws IOException {
            var inputPath = directory.resolve(day);
            Files.writeString(inputPath, content);
        }
    }

    @StandardException
    public static class InputServiceException extends RuntimeException {}
}
