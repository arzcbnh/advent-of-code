#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#include "aoc.h"
#include "getopt.h"
#include "sds.h"

int
main(int argc, char **argv)
{
	int day = atoi(argv[argc - 1]);
	char opt;
	sds custom_input = NULL;

	while ((opt = getopt(argc, argv, "c:")) != -1) {
		switch (opt) {
		case 'c':
			custom_input = sdsnew(optarg);
			break;
		case '?':
			fprintf(stderr, "aoc: error: unknown option %c\n", optopt);
			break;
		}
	}

	if (day < 1 || day > 25) {
		fprintf(stderr, "aoc: error: day '%i' not available\n", day);
		return 1;
	}
	
	if (custom_input) {
		stdin = fopen(custom_input, "r");
		sdsfree(custom_input);
	} else {
		sds path = sdsnew(INPUT_PATH "input/%02i.txt");
		sprintf(path, path, day);
		stdin = fopen(path, "r");
		sdsfree(path);
	}
	
	if (stdin == NULL) {
		fprintf(stderr, "aoc: error: no input file found\n");
		return 1;
	}

	printf("--- Advent of Code 2021 Day %02i ---\n", day);

	switch (day) {
	case 1: day01(); break;
	case 2: day02(); break;
	case 3: day03(); break;
	case 4: day04(); break;
	/*
	case 5: day05(); break;
	case 6: day06(); break;
	case 7: day07(); break;
	case 8: day08(); break;
	case 9: day09(); break;
	case 10: day10(); break;
	case 11: day11(); break;
	case 12: day12(); break;
	case 13: day13(); break;
	case 14: day14(); break;
	case 15: day15(); break;
	case 16: day16(); break;
	case 17: day17(); break;
	case 18: day18(); break;
	case 19: day19(); break;
	case 20: day20(); break;
	case 21: day21(); break;
	case 22: day22(); break;
	case 23: day23(); break;
	case 24: day24(); break;
	case 25: day25(); break;
	*/
	}

	fclose(stdin);
	
	return 0;
}
