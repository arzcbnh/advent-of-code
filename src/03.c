#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define INPUT_AMOUNT 1000

typedef enum { CO2, O2 } Gas;

static int
get_common_bit(char *bins[], int count, int position, Gas detecting)
{
	int frequency = 0;

	for (int i = 0; i < count; i++)
		frequency += bins[i][position] - '0' ? 1 : -1;

	return detecting == CO2 && frequency < 0 || detecting == O2 && frequency >= 0;
}

static int
find_rate(char *bins[], Gas detecting)
{
	char *copy[INPUT_AMOUNT] = { 0 };
	for (int i = 0; i < INPUT_AMOUNT; i++)
		copy[i] = bins[i];

	int count = INPUT_AMOUNT;
	for (int position = 0; count > 1; position++) {
		char common = get_common_bit(copy, count, position, detecting) + '0';
		int remain = 0;

		for (int i = 0; i < count; i++)
			if (copy[i][position] == common)
				copy[remain++] = copy[i];

		count = remain;
	}

	int length = strlen(*bins);
	int n = 0;
	for (int i = 0; i < length; i++)
		n = copy[0][i] - '0' ? ~(~n << 1) : n << 1;

	return n;
}

static int
find_gamma(char *bins[])
{
	int length = strlen(*bins);
	int n = 0;

	for (int i = 0; i < length; i++)
		n = get_common_bit(bins, INPUT_AMOUNT, i, O2) ? ~(~n << 1) : n << 1;

	return n;
}

static void
input_data(char *bins[])
{
	char bin[16];

	for (int i = 0; i < INPUT_AMOUNT; i++) {
		fgets(bin, 16, stdin);
		bin[strcspn(bin, "\n")] = 0;
		bins[i] = strdup(bin);
	}
}

void
day03(void)
{
	char *bins[INPUT_AMOUNT] = { 0 };
	input_data(bins);

	int gamma = find_gamma(bins);
	int epsilon = ~(~0U << strlen(*bins)) ^ gamma;
	int o2_rate = find_rate(bins, O2);
	int co2_rate = find_rate(bins, CO2);

	printf("Part 1: %u\n", gamma * epsilon);
	printf("Part 2: %u\n", o2_rate * co2_rate);
	
	for (int i = 0; i < INPUT_AMOUNT; i++)
		free(bins[i]);
}
