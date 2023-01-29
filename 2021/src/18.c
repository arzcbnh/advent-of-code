// At this point, I no longer care about writing shit. I've been writing and rewriting this project
// for a whole year and just want to be done with it.

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <ctype.h>

#include "vec.h"

#define MAX(a, b) (a > b ? a : b)

enum TokenSymbol { OPEN = -4, CLOSE, COMMA, TERMINATOR };
struct TreeNode { int left_number, right_number; struct TreeNode *left_child, *right_child, *parent; };
typedef char Token;

// static void
// freetree(struct TreeNode *n)
// {
// 	if (n->left_child)
// 		freetree(n->left_child);
// 	if (n->right_child)
// 		freetree(n->right_child);
// 	free(n);
// }

static int
calc_magnitude(struct TreeNode *n)
{
	int left = n->left_child ? calc_magnitude(n->left_child) : n->left_number;
	int right = n->right_child ? calc_magnitude(n->right_child) : n->right_number;

	return 3 * left + 2 * right;
}

static struct TreeNode*
token_to_tree(Token *s)
{
	struct TreeNode *curr = calloc(1, sizeof(struct TreeNode));
	enum { LEFT, RIGHT } side = LEFT;

	while (*(++s + 1) != TERMINATOR) {
		switch (*s) {
		case OPEN:
			struct TreeNode *tmp = calloc(1, sizeof(struct TreeNode));

			if (side == LEFT)
				curr->left_child = tmp;
			else
				curr->right_child = tmp;

			tmp->parent = curr;
			curr = tmp;
			side = LEFT;
			break;
		case COMMA:
			side = RIGHT;
			break;
		case CLOSE:
			curr = curr->parent;
			break;
		default:
			if (side == LEFT)
				curr->left_number = *s;
			else
				curr->right_number = *s;
		}
	}

	return curr;
}

// static void
// print_token(Token *s)
// {
// 	do {
// 		switch (*s) {
// 		case OPEN:
// 			putchar('[');
// 			break;
// 		case CLOSE:
// 			putchar(']');
// 			break;
// 		case COMMA:
// 			putchar(',');
// 			break;
// 		default:
// 			// putchar(*s + '0');
// 			printf("%d", *s);
// 		}
// 	} while (*(++s) != TERMINATOR);
// 	putchar('\n');
// }

// static void
// tokeninsert(Token *t, size_t i, Token s)
// {
// 	Token tmp = t[i];
// 	t[i] = s;

// 	while (t[i] != TERMINATOR)
// }

static bool
istokendigit(Token t)
{
	return t >= 0;
}

static size_t
tokenlen(const Token *tks)
{
	size_t i;

	for (i = 0; tks[i] != TERMINATOR; i++)
		;
	
	return i;
}

// static void
// tokenappend(Token *t, Token s)
// {
// 	size_t len = tokenlen(t);
// 	t[len] = s;
// 	t[len + 1] = TERMINATOR;
// }

static void
tokencat(Token *dest, const Token *src)
{
	while (*dest != TERMINATOR)
		dest++;
	while ((*dest++ = *src++) != TERMINATOR)
		;
}

static Token*
tokendup(Token *src)
{
	Token *copy = malloc(tokenlen(src) + 1);
	*copy = TERMINATOR;
	tokencat(copy, src);
	return copy;
}

// static void
// tokenncpy(Token *dest, Token *src, size_t count)
// {
// 	size_t i;

// 	for (i = 0; i < count && src[i] != TERMINATOR; i++)
// 		dest[i] = src[i];
// 	dest[i] = TERMINATOR;
// }

static void
tokencpy(Token *dest, Token *src)
{
	Token *b = tokendup(src);

	while ((*dest++ = *b++) != TERMINATOR)
		;
}

static Token*
split_number(Token *n, size_t index)
{
	float num = n[index] / 2.0;
	Token middle[] = { OPEN, num, COMMA, num + 0.5, CLOSE, TERMINATOR };
	
	// printf("%lu\n", index);
	// print_token(*n);
	// fflush(stdout);
	// print_token(*n + index + 5);
	// print_token(*n + index + 1);
	// fflush(stdout);

	n = realloc(n, tokenlen(n) + 5);
	tokencpy(n + index + 5, n + index + 1);
	// print_token(*n);
	// fflush(stdout);
	(n)[index++] = middle[0];
	(n)[index++] = middle[1];
	(n)[index++] = middle[2];
	(n)[index++] = middle[3];
	(n)[index++] = middle[4];
	// print_token(*n);
	// fflush(stdout);

	return n;
}

static size_t
can_split(Token *n)
{
	size_t i;

	for (i = 0; n[i] != TERMINATOR; i++)
		if (n[i] >= 10)
			return i;
	
	return 0;
}

static void
explode_number(Token *n, size_t index)
{
	for (size_t i = index - 1; i > 0; i--)
		if (n[i] >= 0) {
			n[i] += n[index + 1];
			break;
		}

	for (size_t i = index + 4; n[i] != TERMINATOR; i++)
		if (n[i] >= 0) {
			n[i] += n[index + 3];
			break;
		}
	// print_token(n);

	n[index] = 0;
	n[index + 1] = TERMINATOR;
	// print_token(n);

	tokencat(n, n + index + 5);
	// print_token(n);
}

static size_t
can_explode(Token *n)
{
	int depth = 1;

	for (size_t i = 1; n[i] != TERMINATOR; i++) {
		if (n[i] == OPEN)
			depth++;
		else if (n[i] == CLOSE)
			depth--;
		if (depth > 4 && istokendigit(n[i + 1]) && istokendigit(n[i + 3]))
			return i;
	}

	return 0;
}

static Token*
reduce_number(Token *n)
{
	bool reduced = true;
	size_t index;

	while (reduced) {
		reduced = false;

		if ((index = can_explode(n))) {
			explode_number(n, index);
			reduced = true;
		}

		if (reduced == false && (index = can_split(n))) {
			n = split_number(n, index);
			reduced = true;
		}
	}

	return n;
}

static Token*
sum_numbers(const Token *a, const Token *b)
{
	const Token open[] = { OPEN, TERMINATOR };
	const Token comma[] = { COMMA, TERMINATOR };
	const Token close[] = { CLOSE, TERMINATOR };

	const Token *number_layout[5] = { open, a, comma, b, close };

	Token *result = malloc(tokenlen(a) + tokenlen(b) + 5);
	*result = TERMINATOR;

	for (size_t i = 0; i < 5; i++)
		tokencat(result, number_layout[i]);

	return result;
}

static Token
tokenize_char(const char c)
{
	switch (c) {
	case '[':
		return OPEN;
	case ']':
		return CLOSE;
	case ',':
		return COMMA;
	case 0:
		return TERMINATOR;
	default:
		return c - '0';
	}
}

static Token*
tokenize_string(const char *str)
{
	Token *converted = strdup(str);
	size_t i;

	for (i = 0; str[i] != 0; i++)
		converted[i] = tokenize_char(str[i]);
	converted[i] = TERMINATOR;

	return converted;
}

static void
trimnewline(char *str)
{
	char *newline = strchr(str, '\n');
	*newline = 0;
}

static Token**
input_numbers(void)
{
	Token **number_vec = vector_create();
	char *line = NULL;
	size_t len;

	while (getline(&line, &len, stdin) != EOF) {
		trimnewline(line);
		Token *number = tokenize_string(line);
		vector_add(&number_vec, number);
	}

	free(line);
	return number_vec;
}

void
day18(void)
{
	Token **number_vec = input_numbers();
	Token *number = tokendup(number_vec[0]);

	for (size_t i = 1; i < vector_size(number_vec); i++) {
		Token *sum = sum_numbers(number, number_vec[i]);
		Token *reduced = reduce_number(sum);
		number = reduced;
	}

	struct TreeNode* tree = token_to_tree(number);
	printf("Part 1: %u\n", calc_magnitude(tree));

	int max_magnitude = 0;

	for (size_t i = 0; i < vector_size(number_vec); i++)
		for (size_t j = 0; j < vector_size(number_vec); j++) {
			if (i == j)
				continue;
			Token *sum = sum_numbers(number_vec[i], number_vec[j]);
			sum = reduce_number(sum);
			struct TreeNode *tree = token_to_tree(sum);
			int magnitude = calc_magnitude(tree);
			max_magnitude = MAX(max_magnitude, magnitude);
		}
	
	printf("Part 2: %u\n", max_magnitude);
}
