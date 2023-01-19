#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#include "vec.h"

#define SIZE 1000
#define CONSIDER_DIAGONAL 1

typedef struct { int x1, y1, x2, y2; } Vent;

static unsigned int
count_overlaps(int *map)
{
	int count = 0;

	for (int i = 0; i < SIZE * SIZE; ++i) {
		count += map[i] > 1;
	}

	return count;
}

static void
lay_vents(int *map, Vent **vents_vec, bool consider_diagonal)
{

	for (int i = 0; i < vector_size(vents_vec); i++) {
		Vent *v = vents_vec[i];
		bool is_diagonal = !(v->x1 == v->x2 || v->y1 == v->y2);

		if ((consider_diagonal && !is_diagonal) || (!consider_diagonal && is_diagonal)) {
			continue;
		}
		
		int x1 = v->x1;
		int y1 = v->y1;
		int x2 = v->x2;
		int y2 = v->y2;
		int dirx = x1 <= x2 ? x1 < x2 : -1;
		int diry = y1 <= y2 ? y1 < y2 : -1;
		
		while (x1 != x2 || y1 != y2) {
			++map[x1 + y1 * SIZE];
			x1 += dirx;
			y1 += diry;
		}

		++map[x1 + y1 * SIZE]; // The loop doesn't run for the last coordinate
	}
}

static Vent**
input_data(void)
{
	Vent **vents_vec = vector_create();
	int x1, y1, x2, y2;

	while (scanf("%d,%d -> %d,%d", &x1, &y1, &x2, &y2) != EOF) {
		Vent *v = malloc(sizeof(Vent));
		v->x1 = x1;
		v->y1 = y1;
		v->x2 = x2;
		v->y2 = y2;

		vector_add(&vents_vec, v);
	}
	
	return vents_vec;
}

void
day05(void)
{
	Vent **vents_vec = input_data();
	int *map = calloc(SIZE * SIZE, sizeof(int));
	// I could use the stack, but it overflows when allocating the map

	lay_vents(map, vents_vec, !CONSIDER_DIAGONAL);
	printf("Part 1: %u\n", count_overlaps(map));

	lay_vents(map, vents_vec, CONSIDER_DIAGONAL);
	printf("Part 2: %u\n", count_overlaps(map));

	for (int i = 0; i < vector_size(vents_vec); i++) {
		free(vents_vec[i]);
	}
	vector_free(vents_vec);
	free(map);
}
