// Advent of Code - Day 24
// Written by Henry Peaurt

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <math.h>

#include "strmanip.h"
#include "memmanage.h"

// Types
typedef struct { int inp1, inp2, n; } OpData;

// Function declarations
void input_data(OpData *d);
void skip_lines(int n);
long find_model(OpData d[], bool part1);

int
main(void)
{
	OpData d[7];
	input_data(d);

	printf("Part 1: %lu\n", find_model(d, true));
	printf("Part 2: %lu\n", find_model(d, false));

	mem_clean();

	return 0;
}

void
input_data(OpData *d)
{
	struct { int inp, c; } stack[7];
	int i = 0;

	for (int inp = 0; inp < 14; inp++) {
		skip_lines(4);
		
		int a = atoi(str_word(2, str_input()));
		int b = atoi(str_word(2, str_input()));

		skip_lines(9);

		int c = atoi(str_word(2, str_input()));

		skip_lines(2);

		if (a == 1) {
			stack[i].inp = inp;
			stack[i++].c = c;
		} else {
			// The 1st input is actually the 14th digit of the model, so you
			// need to reverse the order by subbing 13 and multiplying by -1.
			d->inp1 = (stack[--i].inp - 13) * -1;
			d->inp2 = (inp - 13) * -1;
			(d++)->n = stack[i].c + b;
		}
	}
}

void
skip_lines(int n)
{
	for (int ln = 0; ln < n; ln += getchar() == '\n')
		;
}

long
find_model(OpData d[], bool part1)
{
	long model = 0;

	for (int i = 0; i < 7; i++) {
		for (int w = part1 ? 9 : 1; part1 && w > 0 || !part1 && w < 10; w += part1 ? -1 : 1) {
			if (part1 && w + d[i].n < 10 || !part1 && w + d[i].n > 0) {
				model += w * pow(10, d[i].inp1);
				model += (w + d[i].n) * pow(10, d[i].inp2);
				break;
			}
		}
	}

	return model;
}
