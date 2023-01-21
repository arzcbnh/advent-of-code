#include <stdio.h>
#include <stdbool.h>
#include <limits.h>

#define MAX_POSITION 2000
#define PART1 false
#define PART2 true
#define ABSOLUTE(x) x > 0 ? x : -x

static int
calc_fuel(int *crabs_at, bool progressive_cost)
{
	int optimal = INT_MAX;

	for (int i = 0; i < MAX_POSITION; ++i) {
		int fuel = 0;

		for (int j = 0; j < MAX_POSITION; ++j) {
			int diff = ABSOLUTE((i - j));
			fuel += (progressive_cost ? diff * (diff + 1) / 2 : diff) * crabs_at[j];
		}

		optimal = fuel < optimal ? fuel : optimal;
	}

	return optimal;
}

static void
input_data(int *crabs_at)
{
	int position;

	do {
		scanf("%d", &position);
		crabs_at[position]++;
	} while (getchar() != '\n');
}

void
day07(void)
{
	int crabs_at[MAX_POSITION] = { 0 };
	input_data(crabs_at);

	printf("Part 1: %u\n", calc_fuel(crabs_at, PART1));
	printf("Part 2: %u\n", calc_fuel(crabs_at, PART2));
}
