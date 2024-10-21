import { execSync } from "node:child_process";
import { accessSync, constants } from "node:fs";

const day = Number(process.argv[2]);

if (Number.isNaN(day) || day < 1 || day > 25) {
    throw new Error("'day' argument must be number between 1 and 25");
}

const rootDirRegex = /(^.*\/)2023/;
const scriptDir = import.meta.dirname.match(rootDirRegex)?.at(1);
const scriptPath = scriptDir + "fetch-input.sh";

accessSync(scriptPath, constants.X_OK);
const input = execSync(`${scriptPath} 2023 ${day}`)
    .toString()
    .replace(/[\r\n]+/g, "\n") // Normalize newline
    .replace(/\n+$/, ""); // Remove trailing newline

const { solve } = await import(`#days/${day}`);
const answers = solve(input);

console.log(`--- Advent of Code 2023, day ${day} ---`);
console.log("Part 1: " + answers.part1);
console.log("Part 2: " + answers.part2);
