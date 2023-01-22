// Advent of Code 2021 - Day 09

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#include "vec.h"

struct Point { int x, y, basin_size; };

static int
calc_risk(int map[][100], struct Point **lowpoint_vec)
{
	int risk = 0;

	for(int i = 0; i < vector_size(lowpoint_vec); i++)
		risk += map[lowpoint_vec[i]->x][lowpoint_vec[i]->y] + 1;

	return risk;
}

static void
compare_basins(int largest_basins[], struct Point **lowpoint_vec)
{
	for (int i = 0; i < vector_size(lowpoint_vec); i++) {
		int size = lowpoint_vec[i]->basin_size;
		int smallest = largest_basins[0] < largest_basins[1] ? 0 : 1;
		smallest = largest_basins[smallest] < largest_basins[2] ? smallest : 2;
	
		if (size > largest_basins[smallest])
			largest_basins[smallest] = size;
	}
}

static int
measure_basin(int map[][100], int x, int y)
{
	static bool measured[100][100];
	int p = map[x][y];
	int size = 0;

	if (p == 9 || measured[x][y])
		return 0;

	measured[x][y] = true;

	if (x > 0 && map[x - 1][y] > p)
		size += measure_basin(map, x - 1, y);			
	if (y > 0 && map[x][y - 1] > p)
		size += measure_basin(map, x, y - 1);
	if (x < 99 && map[x + 1][y] > p)
		size += measure_basin(map, x + 1, y);
	if (y < 99 && map[x][y + 1] > p)
		size += measure_basin(map, x, y + 1);

	return size + 1;
}

static bool
islowpoint(int map[][100], int x, int y)
{
	int p = map[x][y];
	bool is = true;

	if (x > 0) 
		is = map[x - 1][y] > p;
	if (is && y > 0)
		is = map[x][y - 1] > p;
	if (is && x < 99) 
		is = map[x + 1][y] > p;
	if (is && y < 99) 
		is = map[x][y + 1] > p;

	return is;
}

static struct Point**
find_lowpoints(int map[][100])
{
	struct Point **lowpoint_vec = vector_create();

	for (int y = 0; y < 100; y++)
		for (int x = 0; x < 100; x++)
			if (islowpoint(map, x, y)) {
				struct Point *p = malloc(sizeof(struct Point));
				p->x = x;
				p->y = y;
				p->basin_size = measure_basin(map, x, y);
				vector_add(&lowpoint_vec, p);
			}
	
	return lowpoint_vec;
}

static void
input_data(int map[][100])
{
	char c = 0;

	for (int y = 0; c != EOF; y++)
		for (int x = 0; (c = getchar()) != '\n' && c != EOF; x++)
			map[x][y] = c - '0';
}

void
day09(void)
{
	int map[100][100];

	input_data(map);

	struct Point **lowpoint_vec = find_lowpoints(map);
	int largest_basins[3] = { 0 };

	compare_basins(largest_basins, lowpoint_vec);

	printf("Part 1: %u\n", calc_risk(map, lowpoint_vec));
	printf("Part 2: %u\n", largest_basins[0] * largest_basins[1] * largest_basins[2]);

	for (int i = 0; i < vector_size(lowpoint_vec); i++)
		free(lowpoint_vec[i]);
	vector_free(lowpoint_vec);
}
