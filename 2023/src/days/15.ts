import { sum } from "#root/utils/arrayx.js";

type Lens = {
    label: string;
    length: number;
};

type Step = Lens & {
    operation: "=" | "-";
    box: number;
};

type Box = Lens[];

export function solve(sequence: Input): Solution {
    const split = sequence.split(",");
    const steps = split.map(parseStep);
    const boxes = Array.from({ length: 256 }, (): Lens[] => []);

    for (const step of steps) {
        performStep(step, boxes);
    }

    const part1 = split.map(hash)[sum]();
    const part2 = calcPower(boxes);

    return { part1, part2 };
}

function hash(str: string): number {
    const chars = str.split("").map(char => char.charCodeAt(0));
    let value = 0;

    for (const char of chars) {
        value += char;
        value *= 17;
        value %= 256;
    }

    return value;
}

function parseStep(step: string): Step {
    const operation = step.includes("=") ? "=" : "-";
    const [label, lengthStr] = step.split(operation);
    const length = Number(lengthStr);
    const box = hash(label);

    return { box, label, length, operation };
}

function performStep(step: Step, boxes: Box[]): void {
    const { label, length } = step;
    const box = boxes[step.box];

    switch (step.operation) {
        case "=":
            addLens(label, length, box);
            break;
        case "-":
            removeLens(label, box);
            break;
    }
}

function addLens(label: string, length: number, box: Box): void {
    const index = getLensIndex(label, box);

    if (index === -1) {
        box.push({ label, length });
    } else {
        box[index].length = length;
    }
}

function removeLens(label: string, box: Box): void {
    const index = getLensIndex(label, box);

    if (index !== -1) {
        box.splice(index, 1);
    }
}

function getLensIndex(label: string, box: Box) {
    return box.findIndex(inside => inside.label === label);
}

function calcPower(boxes: Box[]): number {
    let power = 0;

    for (const [i, box] of boxes.entries()) {
        const boxNumber = i + 1;

        for (const [j, { length }] of box.entries()) {
            const lensNumber = j + 1;
            power += boxNumber * lensNumber * length;
        }
    }

    return power;
}
