#include <stdio.h>

static unsigned long
sum_fish(unsigned long *f)
{
	unsigned long n = 0;

	for (int i = 0; i < 9; ++i) {
		n += f[i];
	}

	return n;
}

static void
step_fish(unsigned long *f)
{
	unsigned long tmp = f[0];

	for (int i = 0; i < 8; ++i) {
		f[i] = f[i + 1];
	}

	f[6] += tmp;
	f[8] = tmp;
}

static void
input_data(unsigned long *f)
{
	do {
		++f[getchar() - '0'];
	} while (getchar() != '\n');
}

void
day06(void)
{
	unsigned long fish[9] = { 0 };

	input_data(fish);

	for (int i = 0; i < 80; ++i) {
		step_fish(fish);
	}

	printf("Part 1: %lu\n", sum_fish(fish));

	for (int i = 0; i < 256 - 80; ++i) {
		step_fish(fish);
	}

	printf("Part 2: %lu\n", sum_fish(fish));
}
