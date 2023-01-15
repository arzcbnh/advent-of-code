#include <stdio.h>

typedef enum { FORWARD = 'f', DOWN = 'd', UP = 'u', END = EOF } Order;

void
day02(void)
{
	int n, depth1, depth2, position, aim;
	n = depth1 = depth2 = position = aim = 0;
	Order order = getchar();

	while (order != END) {
		scanf("%*s %d\n", &n);

		switch (order) {
		case FORWARD:
			position += n;
			depth2 += aim * n;
			break;
		case UP:
			depth1 -= n;
			aim -= n;
			break;
		case DOWN:
			depth1 += n;
			aim += n;
			break;
		case END:
		}

		order = getchar();
	}

	printf("Part 1: %u\n", position * depth1);
	printf("Part 2: %u\n", position * depth2);
}
