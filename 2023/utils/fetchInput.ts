import https from "node:https";
import path from "node:path";
import fs from "node:fs";

const cacheDir = "cache";

export async function fetchInput(day: number): Promise<string> {
    // Ensure cache directory exists
    fs.mkdirSync(cacheDir, { recursive: true });

    // Return cached input if available
    if (isCached(day)) {
        return fs.readFileSync(path.join(cacheDir, `${day}`), { encoding: "utf8" });
    }

    // Ensure session cookie is provided
    const session = process.env.AOC_SESSION;

    if (session == null) {
        throw new Error("AOC_SESSION is not defined");
    }

    // Perform request
    const headers = { Cookie: "session=" + session };
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

    cacheInput(day, input);
    return input;
}

function isCached(day: number): boolean {
    try {
        fs.accessSync(path.join(cacheDir, `${day}`), fs.constants.R_OK);
        return true;
    } catch (err) {
        return false;
    }
}

function cacheInput(day: number, input: string): void {
    const file = fs.openSync(path.join(cacheDir, `${day}`), "w");
    fs.writeSync(file, input);
}
