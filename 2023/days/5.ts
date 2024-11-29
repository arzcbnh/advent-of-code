import { group } from "#root/utils/arrayx.js";

type ResourceRange = {
    start: number;
    end: number;
};

type Cipher = {
    range: ResourceRange;
    shift: number;
};

type Converter = (resources: ResourceRange[]) => ResourceRange[];

const identityCipher = { range: { start: 0, end: Infinity }, shift: 0 } as const satisfies Cipher;

export function solve(almanac: Input): Solution {
    const sections = almanac.split("\n\n");
    const seeds = sections[0].slice(7).split(" ").map(Number);
    const converters = sections.slice(1).map(section => createConverter(section));

    const seedsAsIds = seeds.map(id => ({ start: id, end: id }));
    const seedsAsRanges = seeds[group](2).map(pair => ({ start: pair[0], end: pair[0] + pair[1] - 1 }));

    const part1 = findClosestLocation(converters, seedsAsIds);
    const part2 = findClosestLocation(converters, seedsAsRanges);

    return { part1, part2 };
}

function createConverter(data: string): Converter {
    const ciphers = parseCiphers(data);

    return resources => {
        const converted = [];

        for (const resource of resources) {
            const { range, shift } = ciphers.find(cipher => isInsideRange(cipher, resource)) ?? identityCipher;

            if (resource.start < range.start) {
                resources.push({ start: resource.start, end: range.start - 1 });
                resource.start = range.start;
            }

            if (resource.end > range.end) {
                resources.push({ start: range.end + 1, end: resource.end });
                resource.end = range.end;
            }

            converted.push({ start: resource.start + shift, end: resource.end + shift });
        }

        return converted;
    };
}

function parseCiphers(data: string): Cipher[] {
    const ranges = data
        .split("\n")
        .slice(1)
        .map(line => line.split(" ").map(Number))
        .map(({ 0: destination, 1: source, 2: length }) => {
            const range = { start: source, end: source + length - 1 };
            const shift = destination - source;

            return { range, shift };
        });

    return ranges;
}

function isInsideRange({ range }: Cipher, resource: ResourceRange) {
    return !(resource.start > range.end || resource.end < range.start);
}

function findClosestLocation(converters: Converter[], resources: ResourceRange[]) {
    return converters
        .reduce((resources, convert) => convert(resources), resources)
        .reduce((min, resource) => Math.min(min, resource.start), Infinity);
}
