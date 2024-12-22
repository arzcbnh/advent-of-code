import { equals, sum, transpose } from "#root/utils/arrayx.js";

enum Material {
    Rock = "#",
    Ash = ".",
}

enum Orientation {
    Horizontal,
    Vertical,
}

type Reflection = {
    orientation: Orientation;
    index: number;
};

type ReflectionChecker = () => {
    compare: (a: Material[], b: Material[]) => void;
    result: () => boolean;
};

type ReflectionPair = { perfect: Reflection; smudgy: Reflection };
type Landscape = Material[][];

export function solve(notes: Input): Solution {
    const landscapes = parseLandscapes(notes);
    const reflections = landscapes.map(findAllReflections);

    const part1 = reflections.map(summarizeType("perfect"))[sum]();
    const part2 = reflections.map(summarizeType("smudgy"))[sum]();

    return { part1, part2 };
}

function parseLandscapes(notes: string): Landscape[] {
    const blocks = notes.split("\n\n");
    const landscapes = blocks.map(block => block.split("\n").map(line => line.split("")));

    if (!isLandscapeArray(landscapes)) {
        throw new Error("Invalid input");
    }

    return landscapes;
}

function isLandscapeArray(landscapes: string[][][]): landscapes is Landscape[] {
    return landscapes.every(ls => ls.every(line => line.every(char => char === "#" || char === ".")));
}

function findAllReflections(landscape: Landscape): ReflectionPair {
    const perfect = findReflectionInAnyOrientation(landscape, isPerfectReflection);
    const smudgy = findReflectionInAnyOrientation(landscape, isSmudgyReflection);

    return { perfect, smudgy };
}

function findReflectionInAnyOrientation(landscape: Landscape, checker: ReflectionChecker): Reflection {
    const reflection =
        findReflection(landscape, checker, Orientation.Horizontal) ??
        findReflection(landscape, checker, Orientation.Vertical);

    if (reflection == null) {
        throw new Error(
            "Could not find reflections in landscape, there must be at least one perfect and one smudgy reflection"
        );
    }

    return reflection;
}

function findReflection(landscape: Landscape, checker: ReflectionChecker, orientation: Orientation): Reflection | null {
    if (orientation === Orientation.Vertical) {
        landscape = landscape[transpose]();
    }

    for (let i = 0; i < landscape.length - 1; i++) {
        if (isReflectionType(landscape, i, checker)) {
            return { orientation, index: i };
        }
    }

    return null;
}

function isReflectionType(landscape: Landscape, idx: number, checker: ReflectionChecker): boolean {
    const preceding = landscape.slice(0, idx + 1).reverse();
    const succeeding = landscape.slice(idx + 1);
    const { compare, result } = checker();

    for (let i = 0; i < preceding.length && i < succeeding.length; i++) {
        compare(preceding[i], succeeding[i]);
    }

    return result();
}

function isPerfectReflection(): ReturnType<ReflectionChecker> {
    let status = true;

    const result = () => status;
    const compare = (line1: Material[], line2: Material[]) => {
        status = status && line1[equals](line2);
    };

    return { result, compare };
}

function isSmudgyReflection(): ReturnType<ReflectionChecker> {
    let smudges = 0;

    const result = () => smudges === 1;
    const compare = (line1: Material[], line2: Material[]) => {
        smudges += line1.reduce((diff, val, i) => diff + Number(val != line2[i]), 0);
    };

    return { result, compare };
}

function summarizeType(type: keyof ReflectionPair): (pair: ReflectionPair) => number {
    return pair => (pair[type].orientation === Orientation.Horizontal ? 100 : 1) * (pair[type].index + 1);
}
