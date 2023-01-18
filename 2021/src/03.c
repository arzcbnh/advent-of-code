#include <stdio.h>

#include "sds.h"
#include "vec.h"

typedef enum { CO2, O2 } Gas;

static int
find_common_bit(char **binaries_vec, int index, Gas detecting)
{
	int frequency = 0;

	for (int i = 0; i < vector_size(binaries_vec); i++)
		frequency += binaries_vec[i][index] - '0' ? 1 : -1;

	return (detecting == CO2 && frequency < 0) || (detecting == O2 && frequency >= 0);
}

static int
find_rate(char **binaries_vec, Gas detecting)
{
	char **copy_vec = vector_create();
	
	for (int i = 0; i < vector_size(binaries_vec); i++)
		vector_add(&copy_vec, binaries_vec[i]);

	for (int index = 0; vector_size(copy_vec) > 1; index++) {
		char common = find_common_bit(copy_vec, index, detecting) + '0';

		for (int i = 0; i < vector_size(copy_vec); i++)
			if (copy_vec[i][index] != common)
				vector_remove(&copy_vec, i--);
	}

	int n = 0;

	for (int i = 0; i < sdslen(*binaries_vec); i++)
		n = (*copy_vec)[i] - '0' ? ~(~n << 1) : n << 1;

	vector_free(copy_vec);
	return n;
}

static int
find_gamma(char **binaries_vec)
{
	int n = 0;

	for (int i = 0; i < sdslen(*binaries_vec); i++)
		n = find_common_bit(binaries_vec, i, O2) ? ~(~n << 1) : n << 1;

	return n;
}

static void
input_data(char ***binaries_vec)
{
	char *bin = NULL;
	size_t len = 0;

	while (getline(&bin, &len, stdin) > 0) {
		sds bin_sds = sdsnew(bin);
		sdstrim(bin_sds, "\n");
		vector_add(binaries_vec, bin_sds);
	}

	free(bin);
}

void
day03(void)
{
	char **binaries_vec = vector_create();
	input_data(&binaries_vec);

	int gamma = find_gamma(binaries_vec);
	int epsilon = ~(~0U << sdslen(*binaries_vec)) ^ gamma;
	int o2_rate = find_rate(binaries_vec, O2);
	int co2_rate = find_rate(binaries_vec, CO2);

	printf("Part 1: %u\n", gamma * epsilon);
	printf("Part 2: %u\n", o2_rate * co2_rate);

	for (int i = 0; i < vector_size(binaries_vec); i++)
		sdsfree(binaries_vec[i]);
	vector_free(binaries_vec);
}
