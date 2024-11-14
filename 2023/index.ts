import { fetchInput } from "#utils/fetchInput";
import fs from "node:fs";

const day = Number(process.argv[2]);
const useExample = Boolean(process.argv[3]);

if (isNaN(day) || day < 1 || day > 25) {
    throw new Error("'day' argument must be a number between 1 and 25");
}

const raw = useExample ? fs.readFileSync("example", { encoding: "utf8" }) : await fetchInput(day);
const input = raw
    .replace(/\r?\n/g, "\n") // Normalize newline
    .replace(/\n+$/, ""); // Remove trailing newline

const { solve } = await import(`#days/${day}`);
const { part1, part2 } = solve(input);

console.log(`--- Advent of Code 2023, day ${day} ---`);
console.log("Part 1: " + part1);
console.log("Part 2: " + part2);
