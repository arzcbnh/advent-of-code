import { transpose } from "#root/utils/arrayx.js";

enum Material {
    Rock = "#",
    Ash = ".",
}

enum ReflectionType {
    Horizontal,
    Vertical,
}

type Reflection = {
    type: ReflectionType;
    index: number;
};

type Landscape = Material[][];

let debug = false
export function solve(notes: Input): Solution {
    const landscapes = parseLandscapes(notes);
    const reflections = landscapes.map(findReflection);
    const withSmudges = landscapes.map((ls, i) => { if (i == 2) debug = true; return findSmudged(ls) });
    // console.log(reflections);

    const part1 = reflections.map(reflection => {
        if (reflection.type === ReflectionType.Horizontal) {
            return 100 * (reflection.index + 1);
        } else {
            return (reflection.index + 1);
        }
    }).reduce((acc, num) => acc + num, 0);
    const part2 = withSmudges.map(reflection => {
        if (reflection.type === ReflectionType.Horizontal) {
            return 100 * (reflection.index + 1);
        } else {
            return (reflection.index + 1);
        }
    }).reduce((acc, num) => acc + num, 0);

    return { part1, part2 };
}

function parseLandscapes(notes: string): Landscape[] {
    const blocks = notes.split("\n\n");
    const landscapes = blocks.map(block => block.split("\n").map(line => line.split("")));
    // landscapes.forEach(landscape => { console.log(landscape); console.log("\n")});

    if (!isLandscapeArray(landscapes)) {
        throw new Error();
    }

    return landscapes;
}

function isLandscapeArray(landscapes: string[][][]): landscapes is Landscape[] {
    return landscapes.every(landscape => landscape.every(line => line.every(char => char === "#" || char === ".")));
}

function findReflection(landscape: Landscape): Reflection {
    let type: ReflectionType;
    let x: number;
    let y: number;

    for (y = 0; y < landscape.length - 1; y++) {
            if (isHorizontalReflection(landscape, y)) {
                return { type: ReflectionType.Horizontal, index: y };
            }
    }

        for (x = 0; x < landscape[y].length - 1; x++) {
            if (isVerticalReflection(landscape, x)) {
                return { type: ReflectionType.Vertical, index: x };
            }
        }
}

function findSmudged(landscape: Landscape): Reflection {
    let type: ReflectionType;
    let x: number;
    let y: number;

    for (y = 0; y < landscape.length - 1; y++) {
            if (isSmudgyHorizontalReflection(landscape, y)) {
                return { type: ReflectionType.Horizontal, index: y };
            }
    }

        for (x = 0; x < landscape[y].length - 1; x++) {
            if (isSmudgyVerticalReflection(landscape, x)) {
                return { type: ReflectionType.Vertical, index: x };
            }
        }

    console.log(landscape.map(line => line.join("")).join("\n"));
    process.exit();
}

// let count = 0
function isHorizontalReflection(landscape: Landscape, y: number): boolean {
    const precedingLines = landscape.slice(0, y + 1).reverse();
    const succeedingLines = landscape.slice(y + 1);

    // if (y === 3 && count++ === 1) {
    //     console.log(precedingLines);
    //     console.log(succeedingLines)
    // }

    for (let i = 0; i < precedingLines.length && i < succeedingLines.length; i++) {
        const preceding = precedingLines[i];
        const succeeding = succeedingLines[i];

        if (preceding == null || succeeding == null) {
            break;
        }

        if (preceding.some((_, j) => preceding[j] !== succeeding[j])) {
            return false;
        }
    }

    return true;
}

function isVerticalReflection(landscape: Landscape, x: number): boolean {
    landscape = landscape[transpose]();
    const precedingLines = landscape.slice(0, x + 1).reverse();
    const succeedingLines = landscape.slice(x + 1);

    for (let i = 0; i < precedingLines.length && i < succeedingLines.length; i++) {
        const preceding = precedingLines[i];
        const succeeding = succeedingLines[i];

        if (preceding == null || succeeding == null) {
            break;
        }

        if (preceding.some((_, j) => preceding[j] !== succeeding[j])) {
            return false;
        }
    }

    return true;
}


function isSmudgyHorizontalReflection(landscape: Landscape, y: number): boolean {
    const precedingLines = landscape.slice(0, y + 1).reverse();
    const succeedingLines = landscape.slice(y + 1);
    let smudges = 0;

    if (y == 2) {
        // console.log(precedingLines)
        // console.log(succeedingLines)
    }

    for (let i = 0; i < precedingLines.length && i < succeedingLines.length; i++) {
        const preceding = precedingLines[i];
        const succeeding = succeedingLines[i];

        if (preceding == null || succeeding == null) {
            break;
        }

        smudges += preceding.reduce((acc, _, j) => {
            // if (y == 2 && i == 2) {
            //     console.log(preceding);
            //     console.log(succeeding)
            // }
            return Number(preceding[j] != succeeding[j]) + acc
        }, 0);
    }

    if (y == 2) {
        // console.log(smudges);
        // console.log(precedingLines[2]);
        // console.log(succeedingLines[2]);
        // console.log(precedingLines[2][0] != succeedingLines[2][0])
        // process.exit()
    }

    return smudges == 1;
}

function isSmudgyVerticalReflection(landscape: Landscape, y: number): boolean {
    landscape = landscape[transpose]();
    const precedingLines = landscape.slice(0, y + 1).reverse();
    const succeedingLines = landscape.slice(y + 1);
    let smudges = 0;

    for (let i = 0; i < precedingLines.length && i < succeedingLines.length; i++) {
        const preceding = precedingLines[i];
        const succeeding = succeedingLines[i];

        if (preceding == null || succeeding == null) {
            break;
        }

        smudges += preceding.reduce((acc, _, j) => {
            // if (y == 2 && i == 2) {
            //     console.log(preceding);
            //     console.log(succeeding)
            // }
            return Number(preceding[j] != succeeding[j]) + acc
        }, 0);
    }

    // if (debug == true && y == 7) {
    //     // console.log(precedingLines);
    //     // console.log(succeedingLines)
    //     console.log(smudges);
    //     process.exit()
    // }

    return smudges == 1;
}
