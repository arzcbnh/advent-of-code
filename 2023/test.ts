import fs from "node:fs";
import assert from "node:assert/strict";
import { solveDay } from "#root/index.js";

type Answer = [number | string, number | string];

const red = "\x1b[1;31m";
const green = "\x1b[1;32m";
const reset = "\x1b[0m";
const checkmark = "\u2714";
const xmark = "\u2718";
const STATUS_MESSAGE = {
    OK: `${green} OK ${checkmark}${reset}`,
    FAIL: `${red} FAIL ${xmark}${reset}`,
} as const;

const answers: Answer[] = JSON.parse(fs.readFileSync("answers.json", { encoding: "utf8" }));
const expected: Solution[] = answers.map(({ 0: part1, 1: part2 }) => ({ part1, part2 }));

const fails = [];

for (let day = 1; day <= expected.length; day++) {
    const obtained = await solveDay(day);
    console.log(`Testing day ${day}...`);

    try {
        process.stdout.write("Part 1:");
        assert.equal(obtained.part1, expected[day - 1].part1);
        console.log(STATUS_MESSAGE.OK);
    } catch {
        fails.push(`day ${day} part 1`);
        console.log(STATUS_MESSAGE.FAIL);
    }

    try {
        process.stdout.write("Part 2:");
        assert.equal(obtained.part2, expected[day - 1].part2);
        console.log(STATUS_MESSAGE.OK);
    } catch {
        fails.push(`day ${day} part 2`);
        console.log(STATUS_MESSAGE.FAIL);
    }

    console.log("");
}

if (fails.length > 0) {
    console.log("Fails: " + fails.join(", "));
}

/*
async function test(name: string, fn: () => void | Promise<unknown>) {
    let success = true;

    try {
        const result = fn();

        if (result instanceof Promise) {
            await result;
        }
    } catch (err) {
        success = false;
        console.error(err);
    }

    console.log(`Testing ${name}... ${success ? "SUCCESS" : "FAIL"}`);
}

test("fetchInput", async () => {
    const response = await fetchInput(1);
    assert.notEqual(response, "");
});
*/
