import argparse

from arzcbnh.aoc import get_answer


def main():
    parser = argparse.ArgumentParser('aoc-2020')
    parser.add_argument('day', type=int, help='day to answer, must be an integer between 1 and 25')
    parser.add_argument('-f', '--file', action='store', help='read input from specified file')
    args = parser.parse_args()

    if args.file:
        part1 = get_answer(args.day, part=1, data_source='file', arg=args.file)
        part2 = get_answer(args.day, part=2, data_source='file', arg=args.file)
    else:
        part1 = get_answer(args.day, part=1)
        part2 = get_answer(args.day, part=2)

    print('--- Advent of Code 2020, day', args.day, '---')
    print('Part 1:', part1)
    print('Part 2:', part2)


if __name__ == '__main__':
    main()
