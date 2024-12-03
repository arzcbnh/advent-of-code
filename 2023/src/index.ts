import { fetchInput } from "#root/utils/fetchInput.js";
import fs from "node:fs";

declare global {
    type Input = string;
    type Solution = {
        part1: string | number;
        part2: string | number;
    };
}

async function solveDay(day: number, useExample = false): Promise<Solution> {
    const raw = useExample ? fs.readFileSync("example", { encoding: "utf8" }) : await fetchInput(day);
    const input = raw
        .replace(/\r?\n/g, "\n") // Normalize newline
        .replace(/\n+$/, ""); // Remove trailing newline

    const { solve } = await import(`#root/days/${day}.js`);
    return solve(input);
}

export { solveDay };
