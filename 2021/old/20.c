// Advent of Code 2021 - Day 20

#include <stdio.h>
#include <stdbool.h>

#include "utils.h"

static int
count_pixels(bool image[202][202])
{
	int count = 0;

	for (int y = 0; y < 202; y++) {
		for (int x = 0; x < 202; x++) {
			count += c->image[x][y];
		}
	}

	return count;
}

static void
store_image(bool image[202][202], bool copy[202][202])
{
	for (int y = 0; y < 202; y++) {
		for (int x = 0; x < 202; x++) {
			c->image[x][y] = copy[x][y];
		}
	}
}

static int
calc_pixel_value(bool image[202][202], int x, int y)
{
	int value = 0;

	value = c->image[x - 1][y - 1] << 1;
	value = (value | c->image[x][y - 1]) << 1;
	value = (value | c->image[x + 1][y - 1]) << 1;
	value = (value | c->image[x - 1][y]) << 1;
	value = (value | c->image[x][y]) << 1;
	value = (value | c->image[x + 1][y]) << 1;
	value = (value | c->image[x - 1][y + 1]) << 1;
	value = (value | c->image[x][y + 1]) << 1;
	value = (value | c->image[x + 1][y + 1]);

	return value;
}

static void
enhance_image(char *algorithm, bool image[202][202])
{
	bool copy[202][202] = { 0 };

	for (int y = 1; y < 202; y++) {
		for (int x = 1; x < 202; x++) {
			int index = calc_pixel_value(c, x, y);

			copy[x][y] = c->algorithm[index] == '#';
		}
	}

	store_image(c, copy);
}

static void
input_image(bool image[202][202])
{
	char c = getchar();

	for (int y = 51; c != EOF; y++) {
		for (int x = 51; (c = getchar()) != '\n' && c != EOF; x++)
			image[x][y] = c - '.';
	}
}

void
day20(void)
{
	char *algorithm = input_line();
	bool image[202][202] = { 0 };
	input_image(image);

	for (int i = 0; i < 2; i++)
		enhance_image(algorithm, image);

	printf("Part 1: %u\n", count_pixels(image));

	// putchar('\n');
	// for (int y = IMGBUFFER; y < 100 + IMGBUFFER; y++) {
	// 	for (int x = IMGBUFFER; x < 100 + IMGBUFFER; x++) {
	// 		putchar(image[x][y] ? '#' : '.');
	// 	}
	// 	putchar('\n');
	// }


}

/*
// Types
typedef struct {
	char* algorithm;
	bool image[100 + BUF * 2][100 + BUF * 2];
	int size;
	int expanded;
} cntxt;

// Function declarations
void input_image(cntxt* c);
void enhance_image(cntxt* c);
int calc_pixel_value(cntxt* c, int x, int y);
void store_image(cntxt* c, bool copy[100 + BUF * 2][100 + BUF * 2]);
int count_pixels(cntxt* c);

int
main(void)
{
	cntxt c = {
		.algorithm = str_input(),
		.image = {{ 0 }},
		.size = 0,
		.expanded = 0
	};

	input_image(&c);

	for (int i = 0; i < 50; i++) {
		if (i == 2) {
			printf("Part 1: %i\n", count_pixels(&c));
		}

		enhance_image(&c);
	}

	printf("Part 2: %i\n", count_pixels(&c));

	mem_clean();

	return 0;
}

void
input_image(cntxt* c)
{
	getchar(); // Skip newline

	int y = BUF;
	char chr = getchar();

	do {
		for (int x = BUF; chr != '\n'; x++) {
			c->image[x][y] = chr == '#';
			chr = getchar();
		}

		y++;
		chr = getchar();
	} while (chr != EOF);

	c->size = y - BUF;
}

void
enhance_image(cntxt* c)
{
	bool copy[100 + BUF * 2][100 + BUF * 2] = { 0 };

	for (int y = 0; y < 100 + BUF * 2; y++) {
		for (int x = 0; x < 100 + BUF * 2; x++) {
			int index = calc_pixel_value(c, x, y);

			copy[x][y] = c->algorithm[index] == '#';
		}
	}

	store_image(c, copy);

	c->expanded++;
}

int
calc_pixel_value(cntxt* c, int x, int y)
{
	bool x_inside = 0 < x && x < 100 + BUF * 2 - 1;
	bool y_inside = 0 < y && y < 100 + BUF * 2 - 1;
	int value = 0;

	if (x_inside && y_inside) {
		value = c->image[x - 1][y - 1] << 1;
		value = (value | c->image[x][y - 1]) << 1;
		value = (value | c->image[x + 1][y - 1]) << 1;
		value = (value | c->image[x - 1][y]) << 1;
		value = (value | c->image[x][y]) << 1;
		value = (value | c->image[x + 1][y]) << 1;
		value = (value | c->image[x - 1][y + 1]) << 1;
		value = (value | c->image[x][y + 1]) << 1;
		value = (value | c->image[x + 1][y + 1]);
	} else {
		value = c->image[x][y] ? 511 : 0;
	}

	return value;
}

void
store_image(cntxt* c, bool copy[100 + BUF * 2][100 + BUF * 2])
{
	for (int y = 0; y < c->size + BUF * 2; y++) {
		for (int x = 0; x < c->size + BUF * 2; x++) {
			c->image[x][y] = copy[x][y];
		}
	}
}

int
count_pixels(cntxt* c)
{
	int count = 0;

	for (int y = 0; y < 100 + BUF * 2; y++) {
		for (int x = 0; x < 100 + BUF * 2; x++) {
			count += c->image[x][y];
		}
	}

	return count;
}
*/
