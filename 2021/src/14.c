#include <stdio.h>
#include <string.h>
#include <limits.h>

#define ATOM_AMOUNT 26

struct Pair { int result; long old, new; };

static long
calc_atom_diff(long atoms[])
{
	long max = LONG_MIN;
	long min = LONG_MAX;

	for (int i = 1; i < ATOM_AMOUNT; i++) {
		if (atoms[i] == 0)
			continue;

		max = atoms[i] > max ? atoms[i] : max;
		min = atoms[i] < min ? atoms[i] : min;
	}

	return max - min;
}

static void
count_atoms(struct Pair pairs[][ATOM_AMOUNT], long atoms[], int edges[])
{
	for (int a = 0; a < ATOM_AMOUNT; a++)
		for (int b = 0; b < ATOM_AMOUNT; b++) {
			atoms[a] += pairs[a][b].old;
			atoms[b] += pairs[a][b].old;
		}

	for (int i = 0; i < ATOM_AMOUNT; i++)
		atoms[i] /= 2;
	
	atoms[edges[0]]++;
	atoms[edges[1]]++;
}

static void
step_polymer(struct Pair pairs[][ATOM_AMOUNT])
{
	for (int a = 0; a < ATOM_AMOUNT; a++)
		for (int b = 0; b < ATOM_AMOUNT; b++) {
			int result = pairs[a][b].result;

			pairs[a][result].new += pairs[a][b].old;
			pairs[result][b].new += pairs[a][b].old;
		}

	for (int a = 0; a < ATOM_AMOUNT; a++)
		for (int b = 0; b < ATOM_AMOUNT; b++) {
			pairs[a][b].old = pairs[a][b].new;
			pairs[a][b].new = 0;
		}
}

static int
char_to_index(char c)
{
	return c - 'A';
}

static void
input_rules(struct Pair pairs[][ATOM_AMOUNT])
{
	char a, b, result;

	while (scanf("%c%c -> %c\n", &a, &b, &result) > 0)
		pairs[char_to_index(a)][char_to_index(b)].result = char_to_index(result);
}

static void
skip_newline(void)
{
	getchar();
}

static void
input_polymer(struct Pair pairs[][ATOM_AMOUNT], int edges[])
{
	int b, a = char_to_index(getchar());
	edges[0] = a;

	while((b = getchar()) != '\n') {
		b = char_to_index(b);
		pairs[a][b].old++;
		a = b;
	}

	edges[1] = a;
	skip_newline();
}

void
day14(void)
{
	struct Pair pairs[ATOM_AMOUNT][ATOM_AMOUNT] = { 0 };
	long atoms[ATOM_AMOUNT] = { 0 };
	int edges[2];

	input_polymer(pairs, edges);
	input_rules(pairs);

	for (int i = 0; i < 10; i++)
		step_polymer(pairs);

	count_atoms(pairs, atoms, edges);
	printf("Part 1: %lu\n", calc_atom_diff(atoms));

	for (int i = 0; i < 30; i++)
		step_polymer(pairs);
	
	memset(atoms, 0, sizeof(long) * ATOM_AMOUNT);
	count_atoms(pairs, atoms, edges);
	printf("Part 2: %lu\n", calc_atom_diff(atoms));
}
