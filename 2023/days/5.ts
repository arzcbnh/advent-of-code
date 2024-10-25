import { parse } from "#utils/stringx";
import { group } from "#utils/arrayx";

type Converter = (resources: ResourceRange[]) => ResourceRange[];

interface ResourceRange {
    start: number;
    end: number;
}

interface Cipher {
    range: ResourceRange;
    shift: number;
}

const identityCipher = { range: { start: 0, end: Infinity }, shift: 0 };

export function solve(almanac: string) {
    const blocks = almanac.split("\n\n");
    const seeds = blocks.shift()![parse](/\d+/g).map(Number);
    const converters = blocks.map(block => createConverter(block));

    const seedsAsIds = seeds.map(id => ({ start: id, end: id }));
    const part1 = findClosestLocation(converters, seedsAsIds);

    const seedsAsRanges = seeds[group](2).map(pair => ({ start: pair[0], end: pair[0] + pair[1] - 1 }));
    const part2 = findClosestLocation(converters, seedsAsRanges);

    return { part1, part2 };
}

function createConverter(data: string): Converter {
    const ciphers = parseCiphers(data);

    return resources =>
        resources.reduce((converted, resource) => {
            const { range, shift } = ciphers.find(cipher => isInsideRange(cipher, resource)) ?? identityCipher;
            const overflows: ResourceRange[] = [];

            if (resource.start < range.start) {
                overflows.push({ start: resource.start, end: range.start - 1 });
                resource.start = range.start;
            }

            if (resource.end > range.end) {
                overflows.push({ start: range.end + 1, end: resource.end });
                resource.end = range.end;
            }

            return converted.concat([...overflows, { start: resource.start + shift, end: resource.end + shift }]);
        }, [] as ResourceRange[]);
}

function parseCiphers(data: string): Cipher[] {
    const ranges = data
        .split("\n")
        .slice(1)
        .map(line => line[parse](/\d+/g).map(Number))
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
