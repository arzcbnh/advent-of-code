#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "vec.h"

enum Problem { MISSING, CORRUPT };
struct Line { char *full, *missing, corrupt; long score; };

static long
sum_scores(struct Line **line_vec)
{
	long sum = 0;

	for (int i = 0; i < vector_size(line_vec); i++)
		sum += line_vec[i]->score;

	return sum;
}

static int
compare_scores(const void *a, const void *b)
{
	const struct Line *l1 = *(const struct Line**) a;
	const struct Line *l2 = *(const struct Line**) b;

	return (l1->score > l2->score) - (l1->score < l2->score);
}

static int
scores_table(char c, enum Problem status)
{
	switch (c) {
	case ')':
		return status == MISSING ? 1 : 3;
	case ']':
		return status == MISSING ? 2 : 57;
	case '}':
		return status == MISSING ? 3 : 1197;
	case '>':
		return status == MISSING ? 4 : 25137;
	}

	return 0;
}

static long
calc_score(struct Line *l, enum Problem status)
{
	switch (status) {
	case MISSING:
		long score = 0;
		// Because of how the missing characters are stored, they end up reversed
		for (size_t i = strlen(l->missing); i; i--)
			score = score * 5 + scores_table(l->missing[i - 1], MISSING);
		return score;

	case CORRUPT:
		return scores_table(l->corrupt, CORRUPT);
	}

	return 0;
}

static enum Problem
analyze_line(struct Line *l)
{
	char *queue = l->full;
	size_t length = 0;
		
	for (int i = 0; l->full[i] != '\0'; i++) {
		char c = l->full[i];

		if (c == '(' || c == '[' || c == '{' || c == '<') {
			// Turns into the closing character. The closing parentheses is one
			// unit above the opening one, but closing brackets, braces and
			// inequality are two units above the opening ones.
			queue[length++] = c == '(' ? c + 1 : c + 2;
		} else if (c != queue[--length]) {
			l->corrupt = c;
			return CORRUPT;
		}
	}

	queue[length] = 0;
	l->missing = queue;
	return MISSING;
}

void
day10(void)
{
	struct Line **missing_vec = vector_create();
	struct Line **corrupt_vec = vector_create();
	char *input = NULL;
	size_t length;

	while (getline(&input, &length, stdin) != EOF) {
		struct Line *l = calloc(1, sizeof(struct Line));

		input[strlen(input) - 1] = 0;
		l->full = strdup(input);

		enum Problem state = analyze_line(l);

		vector_add((state == MISSING ? &missing_vec : &corrupt_vec), l);
		l->score = calc_score(l, state);
	}

	qsort(missing_vec, vector_size(missing_vec), sizeof(struct Line*), compare_scores);

	printf("Part 1: %lu\n", sum_scores(corrupt_vec));
	printf("Part 2: %lu\n", missing_vec[vector_size(missing_vec) / 2]->score);

	free(input);
	for (int i = 0; i < vector_size(missing_vec); i++) {
		free(missing_vec[i]->full);
		free(missing_vec[i]);
	}
	for (int i = 0; i < vector_size(corrupt_vec); i++) {
		free(corrupt_vec[i]->full);
		free(corrupt_vec[i]);
	}
	vector_free(missing_vec);
	vector_free(corrupt_vec);
}
