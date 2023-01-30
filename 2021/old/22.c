// Advent of Code 2021 - Day 22
// Written by Henry Peaurt

// I absolutely don't care about the silly fussy opinions in Stack Overflow, I'm using global variables, PascalCase for
// types, and I'm considering camelCase for functions. I'm going crazy. At least I was able to finish it, and it
// doens't look half bad...

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#include "strmanip.h"
#include "memmanage.h"

// Types
typedef struct Cuboid {
	bool on;
	int min_x, min_y, min_z;
	int max_x, max_y, max_z;
	struct Cuboid *next;
} Cuboid;

// Function declarations
Cuboid *input_cube(void);
void compare_cubes(Cuboid *start, Cuboid *c);
bool intersect(Cuboid* a, Cuboid* b);
Cuboid *gen_inverse(Cuboid *a, Cuboid* b);
void link_cube(Cuboid *to, Cuboid *from, bool chain);
long sum_cubes(Cuboid *start, bool part1);
bool outside_limit(Cuboid *c);
double min(double a, double b);
double max(double a, double b);

int
main(void)
{
	Cuboid *c, *start = input_cube();

	while ((c = input_cube())) {
		compare_cubes(start, c);
		if (c->on) link_cube(start, c, false);
	}

	printf("Part 1: %lu\n", sum_cubes(start, true));
	printf("Part 2: %lu\n", sum_cubes(start, false));

	mem_clean();

	return 0;
}

Cuboid *
input_cube(void)
{
	Cuboid *c = NULL;
	char *s;

	if ((s = str_input())) {
		c = mem_alloc(sizeof(Cuboid));

		c->on = str_word(0, s)[1] == 'n';
		c->min_x = atoi(str_word(2, s));
		c->max_x = atoi(str_word(3, s));
		c->min_y = atoi(str_word(5, s));
		c->max_y = atoi(str_word(6, s));
		c->min_z = atoi(str_word(8, s));
		c->max_z = atoi(str_word(9, s));
	}

	return c;
}

void
compare_cubes(Cuboid *start, Cuboid *c)
{
	// I wish I could initialize new here, but it has to be done inside the loop.
	Cuboid *new = NULL;

	for (Cuboid *i = start; i != NULL; i = i->next) {
		if (!intersect(c, i))
			continue;

		if (new != NULL)
			link_cube(new, gen_inverse(c, i), false);
		else
			new = gen_inverse(c, i);
	}

	if (new != NULL)
		link_cube(start, new, true);
}

bool
intersect(Cuboid* a, Cuboid* b)
{
	return (
		a->max_x >= b->min_x && a->min_x <= b->max_x &&
		a->max_y >= b->min_y && a->min_y <= b->max_y &&
		a->max_z >= b->min_z && a->min_z <= b->max_z
	);
}

Cuboid *
gen_inverse(Cuboid *a, Cuboid* b)
{
	Cuboid *inv = mem_alloc(sizeof(Cuboid));

	// This is actually an implementation of XOR, but I don't know if it's a good one.
	inv->on = (a->on || b->on) && (a->on != b->on) ? a->on : !(a->on);
	inv->min_x = max(a->min_x, b->min_x);
	inv->max_x = min(a->max_x, b->max_x);
	inv->min_y = max(a->min_y, b->min_y);
	inv->max_y = min(a->max_y, b->max_y);
	inv->min_z = max(a->min_z, b->min_z);
	inv->max_z = min(a->max_z, b->max_z);

	return inv;
}

void
link_cube(Cuboid *to, Cuboid *from, bool chain)
{
	Cuboid *tmp = to->next;
	to->next = from;

	while (chain && from->next != NULL)
		from = from->next;

	from->next = tmp;
}

long
sum_cubes(Cuboid *start, bool part1)
{
	long sum = 0;

	for (Cuboid *i = start; i != NULL; i = i->next) {
		if (part1 && outside_limit(i))
			continue;

		long area = (i->max_x - i->min_x + 1L) * (i->max_y - i->min_y + 1L) * (i->max_z - i->min_z + 1L);
		sum += area * (i->on ? 1 : -1);
	}

	return sum;
}

bool
outside_limit(Cuboid *c)
{
	return c->min_x < -50 || 50 < c->max_x || c->min_y < -50 || 50 < c->max_y || c->min_z < -50 || 50 < c->max_z;
}

double
min(double a, double b)
{
	return a < b ? a : b;
}

double
max(double a, double b)
{
	return a > b ? a : b;
}
