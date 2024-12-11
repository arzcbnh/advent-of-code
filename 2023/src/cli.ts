#!/usr/bin/env node

import { solveDay } from "#root/index.js";

const day = Number(process.argv[2]);
const useExample = Boolean(process.argv[3]);

const { part1, part2 } = await solveDay(day, useExample);

console.log(`--- Advent of Code 2023, day ${day} ---`);
console.log("Part 1: " + part1);
console.log("Part 2: " + part2);
