import https from "node:https";
import path from "node:path";
import fs from "node:fs";

const cacheDir = "cache";

export async function fetchInput(day: number): Promise<string> {
    // Return cached input if available
    const inputPath = path.join(cacheDir, `${day}`);

    if (fs.existsSync(inputPath)) {
        return fs.readFileSync(inputPath, { encoding: "utf8" });
    }

    // Ensure cache directory exists
    fs.mkdirSync(cacheDir, { recursive: true });

    // Obtain session cookie
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

    fs.writeFileSync(inputPath, input);
    return input;
}
