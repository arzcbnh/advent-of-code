#include <stdio.h>
#include <limits.h>
#include <stdbool.h>

#define SIZE  10
#define LEFT  x > 0
#define RIGHT x < 9
#define ABOVE y > 0
#define BELOW y < 9

static int
zero_octopi(int oct[][SIZE])
{
	int count = 0;

	for (int y = 0; y < SIZE; ++y)
		for (int x = 0; x < SIZE; ++x)
			if (oct[x][y] < 0) {
				oct[x][y] = 0;
				++count;
			}

	return count;
}

static void
flash_octopi(int oct[][SIZE])
{
	const int flashed = INT_MIN;

restart:
	for (int y = 0; y < SIZE; ++y)
		for (int x = 0; x < SIZE; ++x)
			if (oct[x][y] >= SIZE) {
				oct[x][y] = flashed;

				oct[x - 1][y] += LEFT;
				oct[x + 1][y] += RIGHT;
				oct[x][y - 1] += ABOVE;
				oct[x][y + 1] += BELOW;
				oct[x - 1][y - 1] += LEFT  && ABOVE;
				oct[x + 1][y - 1] += RIGHT && ABOVE;
				oct[x - 1][y + 1] += LEFT  && BELOW;
				oct[x + 1][y + 1] += RIGHT && BELOW;

				goto restart;
			}
}

static void
step_octopi(int oct[][SIZE])
{
	for (int y = 0; y < SIZE; ++y)
		for (int x = 0; x < SIZE; ++x)
			++oct[x][y];
}

static void
skip_newline(void)
{
	getchar();
}

static int
input_digit(void)
{
	return getchar() - '0';
}

static void
input_map(int oct[][SIZE])
{
	for (int y = 0; y < SIZE; y++) {
		for (int x = 0; x < SIZE; x++)
			oct[x][y] = input_digit();

		skip_newline();
	}
}

void
day11(void)
{
	int octopi[SIZE][SIZE];
	int steps = 0;
	int current_flashes, total_flashes = 0;
	bool part1_done = false;
	bool part2_done = false;

	input_map(octopi);

	while (!(part1_done && part2_done)) {
		step_octopi(octopi);
		flash_octopi(octopi);

		current_flashes = zero_octopi(octopi);
		total_flashes += current_flashes;
		steps++;

		if (steps == 100) {
			printf("Part 1: %u\n", total_flashes);
			part1_done = true;
		}

		if (current_flashes == 100) {
			printf("Part 2: %u\n", steps);
			part2_done = true;
		}
	}
}
