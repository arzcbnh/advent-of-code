import { transpose } from "#root/utils/arrayx.js";

type Voids = {
    horizontal: number[];
    vertical: number[];
};

type Galaxy = {
    x: number;
    y: number;
};

export function solve(image: Input): Solution {
    const voids = parseVoids(image);
    const galaxies = parseGalaxies(image);
    const doubleDistances = calcDistances(galaxies, voids, 2);
    const millionDistances = calcDistances(galaxies, voids, 1000000);

    const part1 = doubleDistances.reduce((acc, dist) => acc + dist, 0);
    const part2 = millionDistances.reduce((acc, dist) => acc + dist, 0);

    return { part1, part2 };
}

function parseGalaxies(image: string): Galaxy[] {
    const hashes = image.split("\n").map(row => Array.from(row.matchAll(/#/g)));
    const galaxies = hashes.flatMap((row, y) => row.map(({ index: x }) => ({ x, y })));

    return galaxies;
}

function parseVoids(image: string): Voids {
    const rows = image.split("\n").map(row => row.split(""));
    const vertical = findVoidIndexes(rows[transpose]());
    const horizontal = findVoidIndexes(rows);

    return { horizontal, vertical };
}

function findVoidIndexes(chars: string[][]): number[] {
    const indexes = chars.map((row, i) => (row.every(char => char === ".") ? i : null));
    const found = indexes.filter(row => row != null);

    return found;
}

function calcDistances(galaxies: Galaxy[], voids: Voids, factor: number): number[] {
    const distances = [];

    for (let i = 0; i < galaxies.length; i++) {
        for (let j = i + 1; j < galaxies.length; j++) {
            const distance = calcDistanceBetween(galaxies[i], galaxies[j], voids, factor);
            distances.push(distance);
        }
    }

    return distances;
}

function calcDistanceBetween(a: Galaxy, b: Galaxy, voids: Voids, factor: number): number {
    const originalDistance = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    const voidsBetweenX = voids.vertical.filter(idx => isVoidBetweenGalaxies(idx, a.x, b.x)).length;
    const voidsBetweenY = voids.horizontal.filter(idx => isVoidBetweenGalaxies(idx, a.y, b.y)).length;

    const expandedSpace = (voidsBetweenX + voidsBetweenY) * (factor - 1);
    const distance = originalDistance + expandedSpace;

    return distance;
}

function isVoidBetweenGalaxies(voidIndex: number, a: number, b: number): boolean {
    const is = Math.min(a, b) < voidIndex && voidIndex < Math.max(a, b);
    return is;
}
