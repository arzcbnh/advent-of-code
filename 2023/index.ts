import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const day = Number(process.argv[2]);
const example = Boolean(process.argv[3]);

if (Number.isNaN(day) || day < 1 || day > 25) {
    throw new Error("'day' argument must be a number between 1 and 25");
}

const scriptDir = import.meta.dirname.match(/(^.*\/)2023/)!.at(1);
const scriptPath = scriptDir + "fetch-input.sh";
let input = execSync(`env sh ${scriptPath} 2023 ${day}`, { encoding: "utf8" })
    .replace(/\r?\n/g, "\n") // Normalize newline
    .replace(/\n+$/, ""); // Remove trailing newline

if (example) {
    input = readFileSync(scriptDir + "2023/example", { encoding: "utf8" })
        .replace(/\r?\n/g, "\n") // Normalize newline
        .replace(/\n+$/, ""); // Remove trailing newline
}

const { solve } = await import(`#days/${day}`);
const { part1, part2 } = solve(input);

console.log(`--- Advent of Code 2023, day ${day} ---`);
console.log("Part 1: " + part1);
console.log("Part 2: " + part2);
