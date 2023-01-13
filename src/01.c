#include <stdio.h>

void
day01(void)
{
	int anteprev, prev, curr, n;
	scanf("%d\n%d\n%d\n", &anteprev, &prev, &curr);

	int prev_sum = anteprev + prev + curr;
	int part1 = (anteprev < prev) + (prev < curr);
	int part2 = 0;

	while (scanf("%d\n", &n) != EOF) {
		anteprev = prev;
		prev = curr;
		curr = n;

		int curr_sum = anteprev + prev + curr;

		part1 += prev < curr;
		part2 += prev_sum < curr_sum;

		prev_sum = curr_sum;
	}

	printf("Part 1: %u\n", part1);
	printf("Part 2: %u\n", part2);
}
