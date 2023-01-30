// Advent of Code 2021 - Day 25
// Written by Henry Peaurt

#include <stdio.h>
#include <stdbool.h>

// Types
typedef enum { EMPTY = '.', RIGHT = '>', DOWN = 'v' } Cucumber;
typedef struct { Cucumber a[139][137]; int x, y; } MapStruct;

// Function declarations
void input_map(MapStruct *map);
int step_cucumbers(MapStruct *map);

int
main(void)
{
	MapStruct map;
	int steps = 0;

	input_map(&map);

	while (step_cucumbers(&map) != 0)
		steps++;

	printf("Part 1: %u\n", steps + 1);
	puts("Part 2: get all stars!");

	return 0;
}

void
input_map(MapStruct *map)
{
	map->x = 0;
	map->y = 0;
	char c;

	while ((c = getchar()) != EOF) {
		for (map->x = 0; c != '\n'; map->x++) {
			map->a[map->x][map->y] = c;
			c = getchar();
		}

		map->y++;
	}
}

int
step_cucumbers(MapStruct *map)
{
	int moved = 0;

	// Really wish I didn't have to resort to an explicit double iteration,
	// but using bools and tertiary operators look super messy.
	for (int y = 0; y < map->y; y++) {
		bool wrap = map->a[0][y] == EMPTY;

		for (int x = 0; x < map->x; x++) {
			if (map->a[x][y] != RIGHT) continue;

			int nx = x == map->x - 1 ? 0 : x + 1;

			if (nx != 0 && map->a[nx][y] == EMPTY || nx == 0 && wrap) {
				map->a[x][y] = EMPTY;
				map->a[nx][y] = RIGHT;
				moved++;
				x++;
			}
		}
	}

	for (int x = 0; x < map->x; x++) {
		bool wrap = map->a[x][0] == EMPTY;

		for (int y = 0; y < map->y; y++) {
			if (map->a[x][y] != DOWN) continue;

			int ny = y == map->y - 1 ? 0 : y + 1;

			if (ny != 0 && map->a[x][ny] == EMPTY || ny == 0 && wrap) {
				map->a[x][y] = EMPTY;
				map->a[x][ny] = DOWN;
				moved++;
				y++;
			}
		}
	}

	return moved;
}
