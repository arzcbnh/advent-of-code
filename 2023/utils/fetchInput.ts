import https from "node:https";
import path from "node:path";
import fs from "node:fs";

const cachePath = setupCachePath();

export async function fetchInput(day: number): Promise<string> {
    let input;

    // Return cached input if available
    input = readCached(day);

    if (input != null) {
        return input;
    }

    // Perform request over network
    input = requestInput(day);

    return input;
}

function setupCachePath(): string {
    const xdg = process.env.XDG_CACHE_HOME;
    const home = process.env.HOME;
    let userCachePath;

    if (xdg) {
        userCachePath = xdg;
    } else if (home) {
        userCachePath = path.join(home, ".cache");
    } else {
        throw new Error("Unable to define user cache path");
    }

    const aocCachePath = path.join(userCachePath, "arzcbnh-aoc/2023");
    fs.mkdirSync(aocCachePath, { recursive: true });
    return aocCachePath;
}

function readCached(day: number): string | null {
    try {
        const inputPath = path.join(cachePath, String(day));
        const input = fs.readFileSync(inputPath, { encoding: "utf8" });
        return input;
    } catch {
        return null;
    }
}

async function requestInput(day: number): Promise<string> {
    const inputPath = path.join(cachePath, String(day));
    const headers = { Cookie: "session=" + getSessionCookie() };
    const url = `https://adventofcode.com/2023/day/${day}/input`;

    const input = await new Promise<string>((resolve, reject) => {
        const request = https.get(url, { headers });

        request.on("error", err => reject(err));
        request.on("response", res => {
            if (res.statusCode !== 200) {
                reject(new Error("Unable to fetch input, status code: " + res.statusCode));
            }

            let data = "";

            res.setEncoding("utf8");
            res.on("data", chunk => (data += chunk));
            res.on("end", () => resolve(data));
        });
    });

    fs.writeFileSync(inputPath, input);
    return input;
}

function getSessionCookie(): string {
    const session = process.env.AOC_SESSION;

    if (session == null) {
        throw new Error("AOC_SESSION is not defined");
    }

    return session;
}
