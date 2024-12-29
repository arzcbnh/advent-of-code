#!/usr/bin/env node

import { solveDay } from "#root/index.js";
import { parseArgs } from "node:util";

const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    allowPositionals: true,
    options: {
        example: {
            type: "boolean",
            short: "e",
        },
    },
});

const day = Number(positionals[0]);
const useExample = values.example;

const { part1, part2 } = await solveDay(day, useExample);

console.log(`--- Advent of Code 2023, day ${day} ---`);
console.log("Part 1: " + part1);
console.log("Part 2: " + part2);
