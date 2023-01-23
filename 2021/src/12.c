// Advent of Code 2021 - Day 12

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <ctype.h>

#include "vec.h"

struct Cave { char name[16]; int visits; bool is_small; struct Cave **links; };

static int
pathfind(struct Cave *curr, int max_visits, bool visited_twice)
{
	if (strcmp(curr->name, "end") == 0)
		return 1;

	int found_paths = 0;
	bool small_visited = curr->is_small && curr->visits >= 1;
	bool named_start = strcmp(curr->name, "start") == 0;

	if (small_visited && (named_start || max_visits == 1 || visited_twice))
		return 0;

	++curr->visits;
	visited_twice = visited_twice || (curr->is_small && max_visits == 2 && curr->visits >= 2);

	for (int i = 0; i < vector_size(curr->links); i++)
		found_paths += pathfind(curr->links[i], max_visits, visited_twice);

	--curr->visits;

	return found_paths;
}

static void
link_caves(struct Cave *a, struct Cave *b)
{
	vector_add(&a->links, b);
	vector_add(&b->links, a);
}

static struct Cave*
add_cave(struct Cave ***caves, char *name)
{
	struct Cave *c = calloc(1, sizeof(struct Cave));
	strcpy(c->name, name);
	c->is_small = islower(*name);
	c->links = vector_create();

	vector_add(caves, c);

	return c;
}

static struct Cave*
get_cave(struct Cave **caves, char *name)
{
	for (int i = 0; i < vector_size(caves); ++i)
		if (strcmp(name, caves[i]->name) == 0)
			return caves[i];

	return NULL;
}

static struct Cave**
input_cave_system(void)
{
	struct Cave **caves = vector_create();
	char names[2][16];

	while (scanf("%15[^-]-%15[^\n]\n", names[0], names[1]) > 0) {
		struct Cave *a, *b;
		
		if ((a = get_cave(caves, names[0])) == NULL)
			a = add_cave(&caves, names[0]);
		if ((b = get_cave(caves, names[1])) == NULL)
			b = add_cave(&caves, names[1]);

		link_caves(a, b);
	}

	return caves;
}

void
day12(void)
{
	struct Cave **caves = input_cave_system();
	struct Cave *start = get_cave(caves, "start");

	printf("Part 1: %u\n", pathfind(start, 1, false));
	printf("Part 2: %u\n", pathfind(start, 2, false));

	for (int i = 0; i < vector_size(caves); i++) {
		vector_free(caves[i]->links);
		free(caves[i]);
	}
	vector_free(caves);
}
