// Advent of Code 2021 - Day 08

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "vec.h"

#define DIGIT_AMOUNT 10
#define OUTPUT_AMOUNT 4
#define SEGMENT_AMOUNT 7

#define EXCHANGE(a, b) void *tmp = a; a = b; b = tmp;

enum Segment { A, B, C, D, E, F, G };
struct Display {
	char *digit[DIGIT_AMOUNT];
	char *screen[OUTPUT_AMOUNT];
	char segment[SEGMENT_AMOUNT];
	int output[OUTPUT_AMOUNT];
};
const char *DIGIT[] = {
	"abcefg",  //0
	"cf",      //1
	"acdeg",   //2
	"acdfg",   //3
	"bcdf",    //4
	"abdfg",   //5
	"abdefg",  //6
	"acf",     //7
	"abcdefg", //8
	"abcdfg"   //9
};

static int
calc_part2(struct Display **display_vec)
{
	int result = 0;

	for (int i = 0; i < vector_size(display_vec); i++) {
		int factor = 1000;

		for (int j = 0; j < OUTPUT_AMOUNT; j++) {
			result += display_vec[i]->output[j] * factor;
			factor /= 10;
		}
	}

	return result;
}

static int
calc_part1(struct Display **display_vec)
{
	int result = 0;

	for (int i = 0; i < vector_size(display_vec); i++)
		for (int j = 0; j < OUTPUT_AMOUNT; j++) {
			int n = display_vec[i]->output[j];
			result += n == 1 || n == 4 || n == 7 || n == 8;
		}

	return result;
}

static char
find_segment(char *base, char *mask)
{
	int i;

	for (i = 0; base[i] != 0 && strchr(mask, base[i]); i++)
		;
	
	return base[i];
}

static void
decode_screen(struct Display *d)
{
	for (int i = 0; i < OUTPUT_AMOUNT; i++)
		for (int j = 0; j < DIGIT_AMOUNT; j++) {
			char *unknown = d->screen[i];
			char *comparate = d->digit[j];
			size_t len_unknown = strlen(unknown);

			// If find_segment() doesn't find a different segment, then it's the same output
			if (strlen(comparate) == len_unknown && !(find_segment(unknown, comparate))) {
				d->output[i] = j;
				break;
			}
		}
}

static int
count_matches(const char* a, const char* b)
{
	size_t len_x = strlen(a);
	size_t len_y = strlen(b);
	int matches = 0;

	for (int i = 0; i < len_x; i++)
		for (int j = 0; j < len_y; ++j)
			matches += a[i] == b[j];

	return matches;
}

static void
find_digit(int n, int k, struct Display *d)
{
	// The segments of a output "n" can be found when it
	// matches "expected" times with digit "k"
	int i = 0;
	int expected = count_matches(DIGIT[n], DIGIT[k]);
	size_t len_n = strlen(DIGIT[n]);

	while (strlen(d->digit[i]) != len_n || expected != count_matches(d->digit[k], d->digit[i]))
		i++;

	EXCHANGE(d->digit[n], d->digit[i]);
}

static void
find_known_digits(struct Display *d)
{
	// These digits have a unique amount of segments, so they can be found easily
	int digit_of_length[SEGMENT_AMOUNT + 1] = { 0, 0, 1, 7, 4, 0, 0, 8 };

	for (int i = 0; i < DIGIT_AMOUNT; i++) {
		int target = digit_of_length[strlen(d->digit[i])];

		if (target == 0 || target == i)
			continue;

		EXCHANGE(d->digit[target], d->digit[i]);
		i--;
	}
}

static struct Display**
input_data(void)
{
	struct Display **display_vec = vector_create();
	char *line = NULL;
	size_t length;

	while (getline(&line, &length, stdin) != EOF) {
		struct Display *d = malloc(sizeof(struct Display));

		d->digit[0] = strdup(strtok(line, " |\n"));
		for (int i = 1; i < DIGIT_AMOUNT; i++)
			d->digit[i] = strdup(strtok(NULL, " |\n"));
		for (int i = 0; i < OUTPUT_AMOUNT; i++)
			d->screen[i] = strdup(strtok(NULL, " |\n"));

		vector_add(&display_vec, d);
	}

	free(line);
	return display_vec;
}

static void
process_display(struct Display *d)
{
	find_known_digits(d);

	// Digits can be found when this search order is followed
	find_digit(3, 1, d);
	find_digit(6, 1, d);
	find_digit(9, 3, d);
	find_digit(2, 9, d);
	find_digit(5, 2, d);
	find_digit(0, 5, d);

	d->segment[A] = find_segment(d->digit[7], d->digit[1]);
	d->segment[B] = find_segment(d->digit[4], d->digit[3]);
	d->segment[C] = find_segment(d->digit[3], d->digit[5]);
	d->segment[D] = find_segment(d->digit[8], d->digit[0]);
	d->segment[E] = find_segment(d->digit[8], d->digit[9]);
	d->segment[F] = find_segment(d->digit[1], d->digit[2]);

	// Segment G needs a custom search mask to be found
	char mask[6] = { 0 };
	strcpy(mask, d->digit[4]);
	mask[4] = d->segment[A];
	d->segment[G] = find_segment(d->digit[9], mask);

	decode_screen(d);
}

void
day08(void)
{
	struct Display **display_vec = input_data();

	for (int i = 0; i < vector_size(display_vec); i++)
		process_display(display_vec[i]);

	printf("Part 1: %i\n", calc_part1(display_vec));
	printf("Part 2: %i\n", calc_part2(display_vec));

	for (int i = 0; i < vector_size(display_vec); i++) {
		struct Display *d = display_vec[i];
		for (int i = 0; i < DIGIT_AMOUNT; i++)
			free(d->digit[i]);
		for (int i = 0; i < OUTPUT_AMOUNT; i++)
			free(d->screen[i]);
		free(d);
	}
	vector_free(display_vec);
}
