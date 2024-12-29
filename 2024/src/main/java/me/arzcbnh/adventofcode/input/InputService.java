package me.arzcbnh.adventofcode.input;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.nio.file.Files;
import java.nio.file.Paths;

public final class InputService implements InputProvider {
    private final String session = System.getenv("AOC_SESSION");
    private final Cache cache;

    public InputService(Cache cache) {
        this.cache = cache;
    }

    public String getExample() {
        try {
            var path = Paths.get(System.getProperty("user.dir"), "example");
            return Files.readString(path);
        } catch (IOException e) {
            throw new InputServiceException("Unable to get example input", e);
        }
    }

    public String getInput(int day) {
        try {
            return cache.readInput(day);
        } catch (IOException e) {
            // Do nothing
        }

        try {
            String input = fetchInput(day);
            cache.storeInput(day, input);
            return input;
        } catch (IOException e) {
            throw new InputServiceException(e);
        }
    }

    private String fetchInput(int day) {
        if (session == null) {
            throw new InputServiceException("AOC_SESSION environment variable is null");
        }

        HttpResponse<String> response;

        try (var client = HttpClient.newHttpClient()) {
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
}
