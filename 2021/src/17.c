#include <stdio.h>
#include <stdbool.h>
#include <math.h>

struct Square { int x1, y1, x2, y2; };

static bool
check_landing(struct Square target, int vel_x, int vel_y)
{
	bool landed = false;
	int x, y;
	x = y = 0;

	while (x <= target.x2 && y >= target.y1) {
		landed = x >= target.x1 && y <= target.y2;
		x += vel_x;
		y += vel_y;
		vel_x -= vel_x > 0;
		vel_y--;
	}

	return landed;
}

static int
count_shots(struct Square target)
{
	int min_vel_x = (sqrt(1 + 8 * target.x1) - 1) / 2; // It's Bhaskara
	int max_vel_x = target.x2;
	int min_vel_y = target.y1;
	int max_vel_y = -(target.y1 + 1);
	int count = 0;

	for (int vel_x = min_vel_x; vel_x <= max_vel_x; vel_x++)
		for (int vel_y = min_vel_y; vel_y <= max_vel_y; vel_y++)
			count += check_landing(target, vel_x, vel_y);

	return count;
}

static int
calc_max_height(struct Square target)
{
	// It's just a triangular number
	return target.y1 * (target.y1 + 1) / 2;
}

void
day17(void)
{
	struct Square target;
	scanf("target area: x=%i..%i, y=%i..%i\n", &target.x1, &target.x2, &target.y1, &target.y2);		

	printf("Part 1: %u\n", calc_max_height(target));
	printf("Part 2: %u\n", count_shots(target));
}
