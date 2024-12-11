package me.arzcbnh.adventofcode.utils;

import java.io.IOException;
import java.nio.file.*;
import java.net.URI;
import java.net.http.*;
import java.net.http.HttpResponse.BodyHandlers;

import lombok.experimental.StandardException;

public class InputService {
    private final Cache cache;
    private final String session;

    public InputService() {
        cache = new Cache();
        session = System.getenv("AOC_SESSION");
    }

    public String getInput(String day) {
        try {
            return cache.getInput(day);
        } catch (Exception e) {
            // Do nothing
        }

        try {
            var input = fetchInput(day);
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
            var sessionCookie = "session=" + session;
            var url = new StringBuilder("https://adventofcode.com/2024/day/").append(day).append("/input").toString();
            var request = HttpRequest.newBuilder().uri(URI.create(url)).header("Cookie", sessionCookie).build();
            var client = HttpClient.newHttpClient();

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

        var input = response.body();

        return input;
    }

    private static class Cache {
        private final Path directory;

        Cache() {
            directory = setupDirectory();
        }

        private static Path setupDirectory() {
            var xdg = System.getenv("XDG_CACHE_DIR");
            var home = System.getProperty("user.home");
            Path userCache;

            if (xdg != null) {
                userCache = Paths.get(xdg);
            } else {
                userCache = Paths.get(home, ".cache");
            }

            var aocCache = userCache.resolve("arzcbnh-aoc/2024");

            try {
                Files.createDirectories(aocCache);
            } catch (IOException e) {
                throw new InputServiceException("Unable to setup Advent of Code 2024 cache directory", e);
            }

            return aocCache;
        }

        public String getInput(String day) throws IOException {
            var inputPath = directory.resolve(day);
            var input = Files.readString(inputPath);
            return input;
        }

        public void store(String day, String content) throws IOException {
            var inputPath = directory.resolve(day);
            Files.writeString(inputPath, content);
        }
    }
}

@StandardException
class InputServiceException extends RuntimeException {}
