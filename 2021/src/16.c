#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#include "vec.h"

enum PacketType {
	SUM, PRODUCT, MINIMUM, MAXIMUM, LITERAL,
	GREATER_THAN, LESS_THAN, EQUAL_TO
};
enum LengthType { LENGTH = '0', SUBP_AMOUNT };
struct Packet {
	int version;
	enum PacketType ptype;
	enum LengthType lentype;
	long literal;
	struct Packet **subpackets_vec;
};

const char *BINARY_HEXCODE[16] = {
	"0000",	"0001",	"0010",	"0011",	"0100",	"0101",	"0110",	"0111",
	"1000",	"1001",	"1010",	"1011",	"1100",	"1101",	"1110",	"1111"
};

static void
free_packet(struct Packet *p)
{
	if (p->ptype != LITERAL) {
		for (size_t i = 0; i < vector_size(p->subpackets_vec); i++)
			free_packet(p->subpackets_vec[i]);
		vector_free(p->subpackets_vec);
	}

	free(p);
}

static long
evaluate_transmission(struct Packet *p)
{
	long result;

	if (p->ptype == LITERAL) {
		result = p->literal;
	} else {
		long *long_vec = vector_create();

		for (size_t i = 0; i < vector_size(p->subpackets_vec); i++)
			vector_add(&long_vec, evaluate_transmission(p->subpackets_vec[i]));

		result = long_vec[0];

		for (size_t i = 1; i < vector_size(p->subpackets_vec); i++)
			switch (p->ptype) {
			case SUM:
				result += long_vec[i];
				break;
			case PRODUCT:
				result *= long_vec[i];
				break;
			case MINIMUM:
				result = result < long_vec[i] ? result : long_vec[i];
				break;
			case MAXIMUM:
				result = result > long_vec[i] ? result : long_vec[i];
				break;
			case GREATER_THAN:
				result = result > long_vec[i];
				break;
			case LESS_THAN:
				result = result < long_vec[i];
				goto exit;
			case EQUAL_TO:
				result = result == long_vec[i];
				goto exit;
			}
		
		exit:
		vector_free(long_vec);
	}

	return result;
}

static long
sum_versions(struct Packet *p)
{
	long sum = p->version;

	if (p->ptype != LITERAL)
		for (size_t i = 0; i < vector_size(p->subpackets_vec); i++)
			sum += sum_versions(p->subpackets_vec[i]);

	return sum;
}

static int
decode_binstr(char *str, size_t start, size_t end)
{
	int n = 0;

	for (size_t i = start; i < end; i++)
		n = str[i] == '1' ? ~(~n << 1) : n << 1;

	return n;
}

static long
decode_literal(char *transmission, size_t *index)
{
	long literal = 0;

	do {
		*index += 5;
		literal <<= 4;
		literal |= decode_binstr(transmission, *index - 4, *index);
	} while (transmission[*index - 5] == '1');

	return literal;
}

static void
decode_packet(char *transmission, struct Packet *p)
{
	static size_t index;

	p->version = decode_binstr(transmission, index, index + 3);
	index += 3;
	p->ptype = decode_binstr(transmission, index, index + 3);
	index += 3;

	if (p->ptype == LITERAL) {
		p->literal = decode_literal(transmission, &index);
	} else {
		p->lentype = transmission[index++];
		p->subpackets_vec = vector_create();

		switch (p->lentype) {
		case LENGTH:
			size_t length = decode_binstr(transmission, index, index + 15);
			index += 15;
			size_t end = index + length;

			while (index < end) {
				struct Packet *child = malloc(sizeof(struct Packet));
				decode_packet(transmission, child);
				vector_add(&p->subpackets_vec, child);
			}

			break;
		case SUBP_AMOUNT:
			size_t amount = decode_binstr(transmission, index, index + 11);
			index += 11;

			while (vector_size(p->subpackets_vec) < amount) {
				struct Packet *child = malloc(sizeof(struct Packet));
				decode_packet(transmission, child);
				vector_add(&p->subpackets_vec, child);
			}

			break;
		}
	}
}

static int
htod(char c)
{
	return isdigit(c) ? c - '0' : c - 'A' + 10;
}

static char*
input_transmission(void)
{
	size_t len = 0;
	size_t capacity = 128;
	char *transmission = calloc(1, capacity);

	for (char c = getchar(); c != '\n'; c = getchar()) {
		strcat(transmission, BINARY_HEXCODE[htod(c)]);
		len += 4;

		if (len >= capacity - 8)
			transmission = realloc(transmission, capacity *= 2);
	}

	return transmission;
}

void
day16(void)
{
	char *transmission = input_transmission();
	struct Packet *head = malloc(sizeof(struct Packet));
	decode_packet(transmission, head);
	
	printf("Part 1: %lu\n", sum_versions(head));
	printf("Part 2: %lu\n", evaluate_transmission(head));

	free(transmission);
	free_packet(head);
}
