#include <stdio.h>
#include <stdbool.h>
#include <ctype.h>

#include "vec.h"

typedef struct { int n[25], winner; bool mark[25]; } Table;

static unsigned int
calc_score(Table *t)
{
	unsigned int score = 0;

	for (int i = 0; i < 25; i++)
		score += t->n[i] * !t->mark[i];

	return score * t->winner;
}

static void
check_win(Table ***tables_vec, Table ***won_tables_vec)
{
	for (int i = 0; i < vector_size(*tables_vec); i++) {
		bool *mark = (*tables_vec)[i]->mark;

		for (int row = 0; row < 5; row++) {
			int row_marks, column_marks;
			row_marks = column_marks = 0;

			for (int column = 0; column < 5; ++column) {
				row_marks    += mark[row * 5 + column];
				column_marks += mark[row + 5 * column];
			}

			if (row_marks == 5 || column_marks == 5) {
				vector_add(won_tables_vec, (*tables_vec)[i]);
				vector_remove(tables_vec, i--);
				break;
			}
		}
	}
}

static void
mark_tables(int drawn, Table **tables_vec)
{
	for (int i = 0; i < vector_size(tables_vec); i++) {
		Table *t = tables_vec[i];
		t->winner = drawn;

		for (int j = 0; j < 25; j++) {
			if (t->n[j] == drawn) {
				t->mark[j] = true;
				break;
			}
		}
	}
}

static Table**
input_tables(void)
{
	Table **tables_vec = vector_create();

	while (getchar() == '\n') {
		Table *t = malloc(sizeof(Table));

		for (int i = 0; i < 25; i++) {
			char c = getchar();
			t->n[i] = ((c - '0') * (isdigit(c) != false)) * 10 + getchar() - '0';
			getchar(); // Skip space and newline between numbers
		}

		vector_add(&tables_vec, t);
	}

	return tables_vec;
}

static int*
input_draws(void)
{
	int *draws_vec = vector_create();
	int num;

	do {
		scanf("%d", &num);
		vector_add(&draws_vec, num);
	} while (getchar() != '\n');

	return draws_vec;
}

void
day04(void)
{
	int *draws_vec = input_draws();
	Table **tables_vec = input_tables();
	Table **won_tables_vec = vector_create();

	for (int i = 0; i < vector_size(draws_vec) && vector_size(tables_vec) > 0; i++) {
		mark_tables(draws_vec[i], tables_vec);
		check_win(&tables_vec, &won_tables_vec);
	}

	printf("Part 1: %u\n", calc_score(won_tables_vec[0]));
	printf("Part 2: %u\n", calc_score(won_tables_vec[vector_size(won_tables_vec) - 1]));

	for (int i = 0; i < vector_size(tables_vec); i++)
		free(tables_vec[i]);
	for (int i = 0; i < vector_size(won_tables_vec); i++)
		free(won_tables_vec[i]);
	vector_free(draws_vec);
	vector_free(tables_vec);
	vector_free(won_tables_vec);
}
