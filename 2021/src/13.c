#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#include "vec.h"

#define SIZE 2000

struct Paper { bool map[SIZE][SIZE]; int x, y; };
struct Order { char axis; int n; };

static void
print_paper(struct Paper *p)
{
	for (int y = 0; y < p->y; ++y) {
		for (int x = 0; x < p->x; ++x)
			putchar(p->map[x][y] ? '#' : '.');

	putchar('\n');
	}
}

static int
count_dots(struct Paper *p)
{
	int count = 0;

	for (int y = 0; y < p->y; ++y)
		for (int x = 0; x < p->x; ++x)
			count += p->map[x][y];

	return count;
}

static void
resize_paper(struct Paper *p, struct Order *o)
{
	if (o->axis == 'x')
		p->x -= o->n + 1;
	else
		p->y -= o->n + 1;
}

static void
fold_paper(struct Paper *p, struct Order *o)
{
	int n = o->n;
	char axis = o->axis;

	for (int y = 0; y < p->y; ++y)
		for (int x = 0; x < p->x; ++x) {
			bool opposite_dot = false;

			if (x < n && axis == 'x')
				opposite_dot = p->map[n + n - x][y];
			else if (y < n && axis == 'y')
				opposite_dot = p->map[x][n + n - y];
			else
				break;

			p->map[x][y] |= opposite_dot;
		}
}

static struct Order**
input_orders(void)
{
	struct Order **vec = vector_create();
	char axis;
	int n;

	while (scanf("fold along %c=%i\n", &axis, &n) > 0) {
		struct Order *o = calloc(1, sizeof(struct Order));
		o->axis = axis;
		o->n = n;
		vector_add(&vec, o);
	}

	return vec;
}

static struct Paper*
input_paper(void)
{
	struct Paper *p = calloc(1, sizeof(struct Paper));
	int x, y;

	while (scanf("%i,%i\n", &x, &y) > 0) {
		p->map[x][y] = true;
		p->x = p->x > x ? p->x : x;
		p->y = p->y > y ? p->y : y;
	}

	p->x++;
	p->y++;

	return p;
}

void
day13(void)
{
	struct Paper *paper = input_paper();
	struct Order **order_vec = input_orders();

	fold_paper(paper, order_vec[0]);
	resize_paper(paper, order_vec[0]);
	printf("Part 1: %i\n", count_dots(paper));

	for (int i = 1; i < vector_size(order_vec); i++) {
		fold_paper(paper, order_vec[i]);
		resize_paper(paper, order_vec[i]);
	}

	puts("Part 2:");
	print_paper(paper);

	for (int i = 0; i < vector_size(order_vec); i++)
		free(order_vec[i]);
	vector_free(order_vec);
	free(paper);
}
