// You may look at this mess and think, what the hell is going on. This is the
// moment I gave up. Here's the algorithm:
// 1. Check if scanners *a* and *b* overlap by counting if there's 66 euclidean
// distances overlapping.
// 2. Find two pairs of overlapping beacons by checking if their vector
// distances have the same components.
// 3. Rotate pair *b* until the components overlap perfectly with pair *a* to
// find the general rotation matrix.
// 4. Apply the rotation matrix to scanner *b*.
// 5. Merge scanner *b* into *a*.
// It works well and quickly... for the example input. For some reason, it's
// detecting overlapping scanners in the actual input that require mirroring the
// dimensions. I looked up every topic on Reddit about this day. I followed
// exactly the algorithm that was described. I don't care. I'll come back to
// this later. As in, years later.

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <math.h>

#include <assert.h>
#include <unistd.h>

#include "vec.h"

struct Scanner { struct Coord **beacon_vec; bool adjusted; /* struct Coord *offset; struct Scanner *previous, *next; */ };
struct Coord { int x, y, z; };

const int ORIENTATION_MATRIX[][3][3] = {
	// Permutations of face x
	{ { 1, 0, 0 }, { 0, 1, 0 }, { 0, 0, 1 } }, { { 1, 0, 0 }, { 0, 0,-1 }, { 0, 1, 0 } },
	{ { 1, 0, 0 }, { 0,-1, 0 }, { 0, 0,-1 } }, { { 1, 0, 0 }, { 0, 0, 1 }, { 0,-1, 0 } },
	// Permutations of face -x
	{ {-1, 0, 0 }, { 0,-1, 0 }, { 0, 0, 1 } }, { {-1, 0, 0 }, { 0, 0,-1 }, { 0,-1, 0 } },
	{ {-1, 0, 0 }, { 0, 1, 0 }, { 0, 0,-1 } }, { {-1, 0, 0 }, { 0, 0, 1 }, { 0, 1, 0 } },
	// Permutations of face y
	{ { 0, 1, 0 }, {-1, 0, 0 }, { 0, 0, 1 } }, { { 0, 1, 0 }, { 0, 0,-1 }, {-1, 0, 0 } },
	{ { 0, 1, 0 }, { 1, 0, 0 }, { 0, 0,-1 } }, { { 0, 1, 0 }, { 0, 0, 1 }, { 1, 0 ,0 } },
	// Permutations of face -y
	{ { 0,-1, 0 }, { 1, 0, 0 }, { 0, 0, 1 } }, { { 0,-1, 0 }, { 0, 0,-1 }, { 1, 0, 0 } },
	{ { 0,-1, 0 }, {-1, 0 ,0 }, { 0, 0,-1 } }, { { 0,-1, 0 }, { 0, 0, 1 }, {-1, 0, 0 } },
	// Permutations of face z
	{ { 0, 0, 1 }, { 0, 1, 0 }, {-1, 0 ,0 } }, { { 0, 0, 1 }, { 1, 0, 0 }, { 0, 1, 0 } },
	{ { 0, 0, 1 }, { 0,-1, 0 }, { 1, 0, 0 } }, { { 0, 0, 1 }, {-1, 0 ,0 }, { 0,-1, 0 } },
	// Permutations of face -z
	{ { 0, 0,-1 }, { 0,-1, 0 }, {-1, 0 ,0 } }, { { 0, 0,-1 }, { 1, 0, 0 }, { 0,-1, 0 } },
	{ { 0, 0,-1 }, { 0, 1, 0 }, { 1, 0, 0 } }, { { 0, 0,-1 }, {-1, 0 ,0 }, { 0, 1, 0 } },
};

static struct Coord
calculate_distance_vector(struct Coord *a, struct Coord *b)
{
	struct Coord vec = {
		.x = a->x - b->x,
		.y = a->y - b->y,
		.z = a->z - b->z
	};

	return vec;
}

static long
calculate_euclidean_distance(struct Coord *a, struct Coord *b)
{
	struct Coord vec = calculate_distance_vector(a, b);
	return pow(vec.x, 2) + pow(vec.y, 2) + pow(vec.z, 2);
}

static bool
same_exact_components(struct Coord *a, struct Coord *b)
{
	return a->x == b->x && a->y == b->y && a->z == b->z;
}

static bool
same_absolute_components(struct Coord *a, struct Coord *b)
{
	a->x = abs(a->x);
	a->y = abs(a->y);
	a->z = abs(a->z);
	b->x = abs(b->x);
	b->y = abs(b->y);
	b->z = abs(b->z);

	return (a->x == b->x || a->x == b->y || a->x == b->z) &&
	       (a->y == b->x || a->y == b->y || a->y == b->z) &&
		   (a->z == b->x || a->z == b->y || a->z == b->z);
}

static struct Scanner*
merge_scanners(struct Scanner **vec)
{
	struct Scanner *merge = malloc(sizeof(struct Scanner));
	merge->beacon_vec = vector_create();

	// for (size_t i = 0; i < vector_size(a); i++)
	// 	vector_add(&new, a[i]);

	// restart:
	for (size_t k = 0; k < vector_size(vec); k++)
	for (size_t i = 0; i < vector_size(vec[k]->beacon_vec); i++) {
		bool exists = false;

		for (size_t j = 0; j < vector_size(merge->beacon_vec); j++) {
			if (same_exact_components(vec[k]->beacon_vec[i], merge->beacon_vec[j])) {
				exists = true;
				break;
				// vector_remove(&b, j);
			}
		}

		if (!exists)
			vector_add(&merge->beacon_vec, vec[k]->beacon_vec[i]);
	}

	return merge;

	// for (int i = 0; !beacon_orientations_match(a, b) && i < 24; i++)
	// 	orient_beacons(...)

	// struct CoordList *identical = find_identical_beacons(a, b);
	// struct Coord *offset = generate_offset(identical);
	// // puts("generated");
	// // if (a->count >= 208) puts("generated");
	// int tmp_count = a->count;
	// bool found;

	// for (int spins = 1; /* spins <= 24 && */ !scanners_match(a, b, offset); spins++) {
	// 	// puts("spinning");
	// 	// if (a->count >= 208) { printf("spinning %i\n", spins); }

	// 	enum Action action;

	// 	if (spins % 8 == 0)
	// 		action = SWAP;
	// 	else if ((spins + 4) % 8 == 0)
	// 		action = INVERT;
	// 	else
	// 		action = ROTATE;
		
	// 	spin_scanner(b, action);
	// 	offset = generate_offset(identical);
	// }
	// // if (a->count >= 208) puts("spun");


	// // printf("offset: %i,%i,%i\n",offset->x,offset->y,offset->z);
	// // if (i > 24) return;

	// for (int j = 0; j < b->count; j++) {
	// 	b->list[j]->x += offset->x;
	// 	b->list[j]->y += offset->y;
	// 	b->list[j]->z += offset->z;
	// 	found = false;

	// 	for (int i = 0; i < tmp_count && !found; i++)
	// 		found = found || compare_beacons(a->list[i], b->list[j]);

	// 	if (!found) {
	// 		EXPAND_LIST(a, struct Coord*, 32);
	// 		INSERT_LIST(a, b->list[j]);
	// 	}
	// }
}

static void
offset_beacons(struct Coord **b, struct Coord offset)
{
	for (size_t i = 0; i < vector_size(b); i++) {
		b[i]->x += offset.x;
		b[i]->y += offset.y;
		b[i]->z += offset.z;
	}
}

static struct Coord
calc_offset(struct Coord *a, struct Coord *b)
{
	return calculate_distance_vector(a, b);
}

static struct Coord
reorient_beacon(struct Coord *b, size_t i)
{
	struct Coord reoriented = {
		.x = b->x * ORIENTATION_MATRIX[i][0][0] + b->y * ORIENTATION_MATRIX[i][0][1] + b->z * ORIENTATION_MATRIX[i][0][2],
		.y = b->x * ORIENTATION_MATRIX[i][1][0] + b->y * ORIENTATION_MATRIX[i][1][1] + b->z * ORIENTATION_MATRIX[i][1][2],
		.z = b->x * ORIENTATION_MATRIX[i][2][0] + b->y * ORIENTATION_MATRIX[i][2][1] + b->z * ORIENTATION_MATRIX[i][2][2]
	};

	return reoriented;
}

static void
orient_beacons(struct Coord **b, size_t orientation_index)
{
	for (size_t i = 0; i < vector_size(b); i++)
		*b[i] = reorient_beacon(b[i], orientation_index);
}

static size_t
find_orientation_matrix_index(struct Coord **b)
{
	struct Coord goal = calculate_distance_vector(b[0], b[1]);
	struct Coord current = calculate_distance_vector(b[2], b[3]);
	size_t index = 0;

	printf("%d,%d,%d\n", b[0]->x, b[0]->y, b[0]->z);
	printf("%d,%d,%d\n", b[1]->x, b[1]->y, b[1]->z);
	printf("%d,%d,%d\n", b[2]->x, b[2]->y, b[2]->z);
	printf("%d,%d,%d\n", b[3]->x, b[3]->y, b[3]->z);

	while (!same_exact_components(&goal, &current)) {
		index++;
		struct Coord copy1 = reorient_beacon(b[2], index);
		struct Coord copy2 = reorient_beacon(b[3], index);
		current = calculate_distance_vector(&copy1, &copy2);
	}

	return index;
}

static struct Coord**
find_matching_beacons(struct Coord **a, struct Coord **b)
{
	for (size_t i = 0; i < vector_size(a); i++) {
	for (size_t j = 0; j < vector_size(a); j++) {
		if (i == j)
			continue;
	for (size_t k = 0; k < vector_size(b); k++) {
	for (size_t l = 0; l < vector_size(b); l++) {
		if (k == l)
			continue;

		struct Coord dist_a = calculate_distance_vector(a[i], a[j]);
		struct Coord dist_b = calculate_distance_vector(b[k], b[l]);

		if (same_absolute_components(&dist_a, &dist_b)) {
			// puts("found");
			struct Coord **matching_vec = vector_create();

			vector_add(&matching_vec, a[i]);
			vector_add(&matching_vec, a[j]);
			vector_add(&matching_vec, b[k]);
			vector_add(&matching_vec, b[l]);

			return matching_vec;
		}
	}}}}

	return NULL;
}

// static int
// sort_distances(const void *a, const void *b)
// {
// 	long n1 = *(const long*) a;
// 	long n2 = *(const long*) b;

// 	return (n1 > n2) - (n1 < n2);
// }

static struct Coord**
generate_distances(struct Scanner *s)
{
	struct Coord **distance_vec = vector_create();

	for (size_t i = 0; i < vector_size(s->beacon_vec); i++) {
		for (size_t j = i + 1; j < vector_size(s->beacon_vec); j++) {
			struct Coord dist = calculate_distance_vector(s->beacon_vec[i], s->beacon_vec[j]);
			struct Coord *m = malloc(sizeof(struct Coord));
			*m = dist;
			vector_add(&distance_vec, m);
		}
	}
	
	return distance_vec;
}

static bool
scanners_overlap(struct Scanner *scanner_a, struct Scanner *scanner_b)
{
	struct Coord **distances_a = generate_distances(scanner_a);
	struct Coord **distances_b = generate_distances(scanner_b);
	int i, j, matches;
	i = j = matches = 0;

	// qsort(distances_a, vector_size(distances_a), sizeof(long), sort_distances);
	// qsort(distances_b, vector_size(distances_b), sizeof(long), sort_distances);
	// for (int i = 0; i < vector_size(distances_a); i++)
	// 	printf("%ld\n", distances_a[i]);
	// printf("-----\n");
	// for (int i = 0; i < vector_size(distances_b); i++)
	// 	printf("%ld\n", distances_b[i]);

	for (int i = 0; i < vector_size(distances_a); i++)
	for (int j = 0; j < vector_size(distances_b); j++) {
		struct Coord *n1 = distances_a[i];
		struct Coord *n2 = distances_b[j];

		matches += same_absolute_components(n1, n2);

		if (matches >= 66)
			return true;
	}

	// while (matches < 66 && i < vector_size(distances_a) && j < vector_size(distances_b)) {
	// 	int n1 = distances_a[i];
	// 	int n2 = distances_b[j];
	// 	// if (distances_a[i] == distances_b[j]) 
	// 	// 	printf("%d: %i == %i\n", matches, distances_a[i], distances_b[j]);
		
	// 	matches += n1 == n2;
	// 	i += n1 <= n2;
	// 	j += n1 >= n2;

	// 	if (matches >= 66)
	// 		return true;
	// }

	// printf("%d %d\n", distances_a[1], distances_b[0]);
	// printf("dists: %i\n", matches);
	// abort();
	return false;
}

static void
skip_newline(void)
{
	getchar();
}

static struct Coord**
input_beacons(void)
{
	struct Coord** beacon_vec = vector_create();
	int x, y, z;

	while (scanf("%d,%d,%d\n", &x, &y, &z) == 3) {
		// puts("Getting beacons");
		// printf("%s in\n", str);
		// putchar(tmp + '0');
		struct Coord *b = malloc(sizeof(struct Coord));

		b->x = x;
		b->y = y;
		b->z = z;

		vector_add(&beacon_vec, b);
	}

	// putchar(getchar());
	// putchar(getchar());
	// putchar(getchar());
	// putchar(getchar());
	// putchar(getchar());
	// putchar(getchar());
	// putchar(getchar());
	// putchar(getchar());
	// putchar(getchar());
	// putchar(getchar());
	// putchar(getchar());
	// fflush(stdout);
	// fflush(stdout);
	// fflush(stdout);
	// fflush(stdout);
	// puts("");

	// abort();

	return beacon_vec;
}

static struct Scanner**
input_scanners(void)
{
	struct Scanner **scanner_vec = vector_create();

	// For some reason it eats the first dashes and has to be read as a string
	while (scanf("%*s scanner %*d ---\n") != EOF) {
		// puts("Getting scanner");
		// putchar(getchar());
		// putchar(tmp + '0');
		// puts(str);
		struct Scanner *s = malloc(sizeof(struct Scanner));

		s->beacon_vec = input_beacons();
		vector_add(&scanner_vec, s);
		skip_newline();

		// str = TMPinput_line();

		// puts(str);

		// str = TMPinput_line();
		// putchar(getchar());
		// putchar(getchar());
		// putchar(getchar());
		// putchar(getchar());
		// putchar(getchar());
	}
	// printf("%s out\n", str);

	return scanner_vec;
}

void
day19(void)
{
	struct Scanner **scanner_vec = input_scanners();

	// printf("%ld\n", vector_size(scanner_vec));
	// for (size_t i = 0; i < vector_size(scanner_vec); i++) {
	// 	long **distances_p = &scanner_vec[i]->distances;


	// 	*distances_p = generate_distances(scanner_vec[i]);
	// 	// printf("%d ", i);
	// 	qsort(*distances_p, vector_size(*distances_p), sizeof(long), sort_distances);
	// }
// int o = 0;
	// o++;
// 	for (int j = 0; j < vector_size(scanner_vec[0]->beacon_vec); j++)
// 		printf("%d, %d, %d\n", scanner_vec[0]->beacon_vec[j]->x, scanner_vec[0]->beacon_vec[j]->y, scanner_vec[0]->beacon_vec[j]->z);
// 	printf("---\n");
	// if (o == 5) abort();
	struct Scanner **adjusted_vec = vector_create();
	vector_add(&adjusted_vec, scanner_vec[0]);
	vector_remove(&scanner_vec, 0);

	restart:
	while (vector_size(scanner_vec) > 0) {
		for (size_t i = 0; i < vector_size(adjusted_vec); i++) {
			for (size_t j = 0; j < vector_size(scanner_vec); j++) {
				// if (scanner_vec[j] == NULL || scanner_vec[i] == NULL)
				// 	continue;
				struct Scanner *a = adjusted_vec[i];
				struct Scanner *b = scanner_vec[j];
				// printf("%d %d\n", i, j);
				// puts("here");
	// printf("scanner %d\n", i);
	// for (int j = 0; j < vector_size(a->beacon_vec); j++)
	// 	printf("%d, %d, %d\n", a->beacon_vec[j]->x, a->beacon_vec[j]->y, a->beacon_vec[j]->z);
	// printf("---\n");
	// printf("scanner %d\n", j);
	// for (int j = 0; j < vector_size(b->beacon_vec); j++)
	// 	printf("%d, %d, %d\n", b->beacon_vec[j]->x, b->beacon_vec[j]->y, b->beacon_vec[j]->z);
	// printf("---\n");
					// sleep(5);
					// printf("scanners %d and %i\n", i, j);

				if (scanners_overlap(a, b)) {
					printf("adjusting %i with %i\n", j, i);
					struct Coord **matching_vec = find_matching_beacons(a->beacon_vec, b->beacon_vec);
					// printf("%p %p %p %p %p\n", matching_vec, matching_vec[0], matching_vec[1], matching_vec[2], matching_vec[3]);
					size_t orientation_index = find_orientation_matrix_index(matching_vec);
					// printf("%d ind\n", orientation_index);

					orient_beacons(b->beacon_vec, orientation_index);
					puts("---");
					// printf("%d,%d,%d == %d,%d,%d\n", a->beacon_vec[9]->x,a->beacon_vec[9]->y,a->beacon_vec[9]->z,b->beacon_vec[0]->x,b->beacon_vec[0]->y,b->beacon_vec[0]->z);

					struct Coord offset = calc_offset(matching_vec[0], matching_vec[2]);
					// printf("%d,%d,%d\n", offset.x, offset.y, offset.z);

					offset_beacons(b->beacon_vec, offset);

					vector_add(&adjusted_vec, scanner_vec[j]);
					vector_remove(&scanner_vec, j);
					// scanner_vec[j] = NULL;
					// long **distances_p = &scanner_vec[i]->distances;
					// *distances_p = generate_distances(scanner_vec[i]);
					// qsort(*distances_p, vector_size(*distances_p), sizeof(long), sort_distances);
					// printf("removed %lu, remaining %lu\n", j, vector_size(scanner_vec));
					goto restart;
				}
			}
		}
	}

	struct Scanner *final = merge_scanners(adjusted_vec);
	printf("Part 1: %lu\n", vector_size(final->beacon_vec));
		
	// for (int i = 0; i < vector_size(scanner_vec[0]->distances); i++) {
	// 	printf("%ld\n", scanner_vec[0]->distances[i]);
	// }
}

// struct CoordList { struct Coord **list; int count, cap; };
// struct IntList { int *list, count, cap; };
// enum Action { ROTATE, INVERT, SWAP };
// // enum Object { VOID, BEACON, SCANNER };

// // static int
// // count_matches(struct Scanner *a, struct Scanner *b, struct Beacon offset)
// // {
// // 	int count = 0;

// // 	for (int i = 0; i < a->beacons->count; i++) {
// // 		for (int j = 0; j < b->beacons->count; j++) {
// // 			struct Beacon *ba = a->beacons->list[i];
// // 			struct Beacon *bb = b->beacons->list[j];

// // 			if (bb->x - offset.x == ba->x && bb->y - offset.y == ba->y && bb->z - offset.z == ba->z) {
// // 				count++;
// // 				break;
// // 			}
// // 		}
// // 	}

// // 	return count;
// // }

// // static bool
// // offset_iteration(struct Scanner *a, struct Scanner *b)
// // {
// // 	for (int i = 0; i < a->beacons->count; i++) {
// // 		for (int j = 0; j < b->beacons->count; j++) {
// // 			struct Beacon *ba = a->beacons->list[i];
// // 			struct Beacon *bb = b->beacons->list[j];
// // 			struct Beacon offset = {
// // 				.x = ba->x - bb->x,
// // 				.y = ba->y - bb->y,
// // 				.z = ba->z - bb->z
// // 			};

// // 			if (count_matches(a, b, offset) >= 12)
// // 				return true;
// // 		}
// // 	}

// // 	return false;
// // }

// // static bool
// // compare_scanners(struct Scanner *a, struct Scanner *b)
// // {
// // 	bool match = offset_iteration(a, b);

// // 	for (int i = 0; i < 24 && !match; i++) {
// // 		// rotate(b);
// // 		match = offset_iteration(a, b);
// // 	}

// // 	return match;
// // }

// static bool
// compare_beacons(struct Coord *a, struct Coord *b)
// {
// 	return a->x == b->x && a->y == b->y && a->z == b->z;
// }

// static int
// pythagoras_3d(struct Coord *a, struct Coord *b)
// {
// 	return pow(abs(a->x - b->x), 2) + pow(abs(a->y - b->y), 2) + pow(abs(a->z - b->z), 2);
// }

// static void
// spin_scanner(struct CoordList *beacons, enum Action action)
// {
// 	for (int i = 0; i < beacons->count; i++) {
// 		struct Coord *b = beacons->list[i];
// 		int tmp;

// 		switch (action) {
// 		case ROTATE:
// 			tmp = b->y;
// 			b->y = b->z;
// 			b->z = -tmp;
// 			break;
// 		case INVERT:
// 			b->x = -b->x;
// 			b->y = -b->y;
// 			break;
// 		case SWAP:
// 			tmp = b->x;
// 			b->x = b->y;
// 			b->y = b->z;
// 			b->z = tmp;
// 			break;
// 		}
// 	}
// }

// static bool
// scanners_match(struct CoordList *a, struct CoordList *b, struct Coord *offset)
// {
// 	int matches = 0;

// 	for (int i = 0; i < a->count && matches < 12; i++) {
// 		struct Coord *oriented = malloc(sizeof(struct Coord));
// 		bool match = false;

// 		// printf("orientedx: %i\n", oriented->x);
// 		oriented->x = a->list[i]->x - offset->x;
// 		oriented->y = a->list[i]->y - offset->y;
// 		oriented->z = a->list[i]->z - offset->z;

// 		for (int j = 0; j < b->count && !match; j++)
// 			match = compare_beacons(b->list[j], oriented);
		
// 		matches += match;
// 	}

// 	// printf("%i\n", matches);
// 	return matches >= 12;
// }

// static struct Coord*
// generate_offset(struct CoordList *identical)
// {
// 	struct Coord *a1 = identical->list[0];
// 	struct Coord *a2 = identical->list[1];
// 	struct Coord *b1 = identical->list[2];
// 	struct Coord *b2 = identical->list[3];

// 	struct Coord *off1 = malloc(sizeof(struct Coord));
// 	off1->x = a1->x - b1->x;
// 	// printf("a1b1x: %i %i\n",a1->x,b1->x);
// 	off1->y = a1->y - b1->y;
// 	off1->z = a1->z - b1->z;

// 	struct Coord *off2 = malloc(sizeof(struct Coord));
// 	off2->x = a1->x - b2->x;
// 	off2->y = a1->y - b2->y;
// 	off2->z = a1->z - b2->z;

// 	if (a2->x - off1->x == b2->x && a2->y - off1->y == b2->y && a2->z - off1->z == b2->z)
// 		return off1;
// 	else
// 		return off2;
// }

// static struct CoordList*
// find_identical_beacons(struct CoordList *a, struct CoordList *b)
// {
// 	struct CoordList *identical = calloc(1, sizeof(struct CoordList));
// 	struct Coord *a1, *a2, *b1, *b2;

// 	for (int i = 0; i < a->count; i++) {
// 		for (int j = 0; j < a->count; j++) {
// 			if (i == j)	continue;

// 			for (int k = 0; k < b->count; k++) {
// 				for (int l = 0; l < b->count; l++) {
// 					if (k == l) continue;

// 					a1 = a->list[i];
// 					a2 = a->list[j];
// 					b1 = b->list[k];
// 					b2 = b->list[l];
// 					// if (a->count >= 208) printf("%i %i %i %i\n", i, j,k,l);

// 					int distance_a = pythagoras_3d(a1, a2);
// 					int distance_b = pythagoras_3d(b1, b2);

// 					if (distance_a == distance_b)
// 						goto outside_loop;
// 				}
// 			}
// 		}
// 	}

// outside_loop:
// 	EXPAND_LIST(identical, struct Coord*, 4);
// 	INSERT_LIST(identical, a1);
// 	INSERT_LIST(identical, a2);
// 	INSERT_LIST(identical, b1);
// 	INSERT_LIST(identical, b2);

// 	return identical;
// }



// void
// day19(void)
// {
// 	struct Scanner **scanner_vec = input_scanners();
// 	struct Scanner *head = input_data();
// 	struct Scanner *zero = head->next;
// 	struct Scanner *curr = zero->next;

// 	while (zero->next != NULL) {
// 		struct IntList *distances_a = calc_distances(zero->beacons);
// 		struct IntList *distances_b = calc_distances(curr->beacons);

// 		// for (int i = 0; i < distances_a->count; i++)
// 		// 	printf("%i\n", distances_a->list[i]);
// 		// putchar('\n');
// 		// for (int i = 0; i < distances_b->count; i++)
// 		// 	printf("%i\n", distances_b->list[i]);
// 		// printf("\n%i\n", compare_distances(distances_a, distances_b));

// 		if (scanners_overlap(distances_a, distances_b)) {
// 			// puts("samesies");
// 			printf("zcount: %i\n", zero->beacons->count);
// 			// if (zero->beacons->count == 77) {
// 			// 	int i, j;
// 			// 	for (i = j = 0; i < distances_a->count; i++, j++) {
// 			// 		printf("%9i %9i\n", distances_a->list[i], j < distances_b->count ? distances_b->list[j] : 0);
// 			// 	}
// 			// 	abort();
// 			// }
// 			merge_beacons(zero->beacons, curr->beacons);
// 			// return;
// 			if (curr->next != NULL) curr->next->previous = curr->previous;
// 			curr->previous->next = curr->next;
// 			curr = zero->next;
// 		} else {
// 			puts("skipped one");
// 			curr = curr->next;
// 		}
// 	}

// 	printf("Part 1: %u\n", zero->beacons->count);

// 	// while (zero != NULL) {
// 	// 	for (int i = 0; i < zero->beacons->count; i++)
// 	// 		printf("%i,%i,%i\n", zero->beacons->list[i]->x, zero->beacons->list[i]->y, zero->beacons->list[i]->z);
		
// 	// 	zero = zero->next;
// 	// }

// 	// char c;
// 	// while (( c = getchar()) != EOF)
// 	// 	putchar(c);
// 	// while (zero->next != NULL) {
// 	// 	bool matches = compare_scanners(zero, curr);

// 		// if (matches) {
// 		// 	merge(zero, curr);
// 		// 	curr->previous = curr->next;
// 		// }
// 	// }
// }

// // /*
// // // Written by Henry Peaurt

// // // These programs are getting progressively worse. I tried to match scanners on the run, but the program was becoming
// // // so complicated I thought it was better and simpler to pregen the sets of rotated scanners.

// // #include <stdio.h>
// // #include <stdlib.h>
// // #include <stdbool.h>
// // #include <math.h>

// // #include "strmanip.h"
// // #include "memmanage.h"

// // // Types
// // typedef struct Beacon { int x, y, z; struct Beacon *next; } Beacon;
// // typedef struct Scanner {
// // 	Beacon b[24];
// // 	bool rotated;
// // 	struct Scanner *next;
// // } Scanner;

// // // Function declarations
// // Scanner *input_scanners(void);
// // Beacon input_beacons(void);
// // Beacon dup_beacons(Beacon *start);
// // void rotate_beacons(Beacon *start, int x, int y, int z);
// // void spin_scanner(Scanner *a, Scanner *b);
// // bool xor_rotated(Scanner *a, Scanner *b);
// // bool beacons_overlap(Beacon *a, Beacon *b, bool orient);
// // bool same_distance(Beacon *a1, Beacon *a2, Beacon *b1, Beacon *b2);
// // bool same_orientation(Beacon *a1, Beacon *a2, Beacon *b1, Beacon *b2);

// // #include <assert.h>

// // void
// // superrotate_scanner_whatever(Scanner *a, Scanner *b, Beacon *a1, Beacon *a2, Beacon *b1, Beacon *b2)
// // {
// // }

// // int
// // main(void)
// // {
// // 	Scanner *start = input_scanners();
// // 	start->rotated = true;

// // 	for (Scanner *iter = start; iter != NULL; iter = iter->next)
// // 	for (int j = 1; j < 24; j++) {
// // 		int x = j % 4;
// // 		int y = j / 4 % 4 * (j < 16);
// // 		int z = (j >= 16) + (j >= 20) * 2;

// // 		iter->b[j] = dup_beacons(&(iter->b[0]));
// // 		rotate_beacons(&(iter->b[j]), x, y, z);
// // 	}

// // 	for (Scanner *i = start; i != NULL; i = i->next)
// // 	for (Scanner *j = start; j != NULL; j = j->next)
// // 		if (xor_rotated(i, j) && beacons_overlap(&(i->b[0]), &(j->b[0]), true))
// // 		{
// // 			if (!i->rotated) { Scanner *tmp = j; j = i; i = tmp; }
// // 			spin_scanner(i, j);

// // 			for (Beacon *ai = &(i->b[0]);	   matches < 66 && ai != NULL; ai = ai->next)
// // 			for (Beacon *aj = ai->next; matches < 66 && aj != NULL; aj = aj->next)
// // 			for (Beacon *bi = &(j->b[0]);	   matches < 66 && bi != NULL; bi = bi->next)
// // 			for (Beacon *bj = bi->next; matches < 66 && bj != NULL; bj = bj->next)
// // 			{
// // 				if (same_distance(ai, aj, bi, bj))
// // 				{
// // 					superrotate_scanner_whatever(i, j, ai, aj, bi, bj);
// // 					goto out;
// // 				}
// // 			}
// // out:
// // 		}

// // 	// /*
// // 	// assert(start->b[1].next->y == 409);
// // 	// assert(start->b[2].next->y == 643);
// // 	// assert(start->b[18].next->y == 528);
// // 	// */

// // 	// /*
// // 	// for (int i = 0; i < 24; i++)
// // 	// 	printf("%i %i %i\n", start->b[i].x, start->b[i].y, start->b[i].z);
// // 	// */

// // 	// /*
// // 	// assert(start->b[0].next->next->next->y == -675);
// // 	// assert(start->b[17].next->next->next->y == -675);
// // 	// assert(start->next->next->b[0].next->next->next->y == 584);
// // 	// assert(start->next->next->b[17].next->next->next->y == 584);
// // 	// */

// // 	// /*
// // 	// Beacon a1, a2, b1, b2;
// // 	// a1.x = a1.y = a1.z = 4;
// // 	// a2.x = a2.y = a2.z = 10;
// // 	// b1.x = b1.y = b1.z = 6;
// // 	// b2.x = b2.y = b2.z = 12;
// // 	// assert(same_orientation(&a1, &a2, &b1, &b2));
// // 	// b1.x = b1.y = b1.z = 12;
// // 	// b2.x = b2.y = b2.z = 6;
// // 	// assert(same_orientation(&a1, &a2, &b1, &b2) == false);
// // 	// */

// // 	// /*
// // 	// assert(scanners_overlap(start->next->next, start->next->next->next->next, false));
// // 	// assert(scanners_overlap(start->next->next, start->next->next->next->next, true) == false);
// // 	// */

// // 	return 0;
// // }

// // Scanner *
// // input_scanners(void)
// // {
// // 	Scanner *start;
// // 	Scanner **curr = &start;

// // 	while (getchar() != EOF) {
// // 		skip_lines(1);
// // 		(*curr) = mem_alloc(sizeof(Scanner));
// // 		(*curr)->b[0] = input_beacons();

// // 		curr = &((*curr)->next);
// // 	}

// // 	return start;
// // }

// // Beacon
// // input_beacons(void)
// // {
// // 	Beacon *start;
// // 	Beacon **curr = &start;
// // 	char *s;

// // 	while (s = str_input()) {
// // 		(*curr) = mem_alloc(sizeof(Beacon));

// // 		(*curr)->x = atoi(str_word(0, s));
// // 		(*curr)->y = atoi(str_word(1, s));
// // 		(*curr)->z = atoi(str_word(2, s));

// // 		curr = &((*curr)->next);
// // 	}

// // 	return *start;
// // }

// // Beacon
// // dup_beacons(Beacon *start)
// // {
// // 	Beacon *new;
// // 	Beacon **curr = &new;

// // 	for (Beacon *i = start; i != NULL; i = i->next)	{
// // 		*curr = mem_alloc(sizeof(Beacon));
// // 		**curr = *i;
// // 		curr = &((*curr)->next);
// // 	}

// // 	return *new;
// // }

// // void
// // rotate_beacons(Beacon *start, int x, int y, int z)
// // {
// // 	for (Beacon *i = start; i != NULL; i = i->next) {
// // 		int nx = i->x;
// // 		int ny = i->y;
// // 		int nz = i->z;

// // 		for (int n = 0; n < x; n++) {
// // 			int tmp = nz;
// // 			nz = -ny;
// // 			ny =  tmp;
// // 		}

// // 		for (int n = 0; n < y; n++) {
// // 			int tmp = nx;
// // 			nx = -nz;
// // 			nz =  tmp;
// // 		}

// // 		for (int n = 0; n < z; n++) {
// // 			int tmp = nx;
// // 			nx = -ny;
// // 			ny =  tmp;
// // 		}

// // 		i->x = nx;
// // 		i->y = ny;
// // 		i->z = nz;
// // 	}
// // }

// // void
// // spin_scanner(Scanner *a, Scanner *b)
// // {
// // 	Scanner *rot  = a->rotated ? a : b;
// // 	Scanner *nrot = a->rotated ? b : a;
// // 	int i;

// // 	for (i = 1; !beacons_overlap(&(rot->b[0]), &(nrot->b[i]), false); i++)
// // 		;

// // 	nrot->rotated = true;
// // 	nrot->b[0] = nrot->b[i];
// // }

// // bool
// // xor_rotated(Scanner *a, Scanner *b)
// // {
// // 	return !(a->rotated && b->rotated) && (a->rotated || b->rotated);
// // }

// // bool
// // beacons_overlap(Beacon *a, Beacon *b, bool dist)
// // {
// // 	int matches = 0;

// // 	for (Beacon *ai = a;	   matches < 66 && ai != NULL; ai = ai->next)
// // 	for (Beacon *aj = a->next; matches < 66 && aj != NULL; aj = aj->next)
// // 	for (Beacon *bi = b;	   matches < 66 && bi != NULL; bi = bi->next)
// // 	for (Beacon *bj = b->next; matches < 66 && bj != NULL; bj = bj->next)
// // 		matches += dist ? same_distance(ai, aj, bi, bj) : same_orientation(ai, aj, bi, bj);

// // 	return matches >= 66;
// // }

// // bool
// // same_distance(Beacon *a1, Beacon *a2, Beacon *b1, Beacon *b2)
// // {
// // 	int ax = abs(a1->x - a2->x);
// // 	int ay = abs(a1->y - a2->y);
// // 	int az = abs(a1->z - a2->z);

// // 	int bx = abs(b1->x - b2->x);
// // 	int by = abs(b1->y - b2->y);
// // 	int bz = abs(b1->z - b2->z);

// // 	return ax * ay * az == bx * by * bz;
// // }

// // bool
// // same_orientation(Beacon *a1, Beacon *a2, Beacon *b1, Beacon *b2)
// // {
// // 	bool x = b1->x - a1->x + a2->x == b2->x;
// // 	bool y = b1->y - a1->y + a2->y == b2->y;
// // 	bool z = b1->z - a1->z + a2->z == b2->z;

// // 	return x && y && z;
// // }
// // */

// // /*
// // RotationData
// // compare_scanners()
// // {

	
	
// // }
// // */

// // /*
// // void
// // gen_rotated_sets(scanner* scn)
// // {
// // 	rotate_plane(X, Y);
// // 	gen_rotated_sets(scn, 1);
// // 	rotate_plane(X, Y);
// // 	gen_rotated_sets(scn, 2);
// // 	rotate_plane(X, Y);
// // 	gen_rotated_sets(scn, 3);

// // 	invert_front_axis(scn);
// // 	gen_rotated_sets(scn, 4);
// // 	rotate_plane(X, Y);
// // 	gen_rotated_sets(scn, 5);
// // 	rotate_plane(X, Y);
// // 	gen_rotated_sets(scn, 6);
// // 	rotate_plane(X, Y);
// // 	gen_rotated_sets(scn, 7);

// // 	gen_rotated_sets(scn, 8);
// // 	rotate_plane(X, Y);
// // 	gen_rotated_sets(scn, 9);
// // 	rotate_plane(X, Y);
// // 	gen_rotated_sets(scn, 10);
// // 	rotate_plane(X, Y);
// // 	gen_rotated_sets(scn, 11);

// // 	invert_front_axis(scn);
// // 	gen_rotated_sets(scn, 12);
// // 	rotate_plane(X, Y);
// // 	gen_rotated_sets(scn, 13);
// // 	rotate_plane(X, Y);
// // 	gen_rotated_sets(scn, 14);
// // 	rotate_plane(X, Y);
// // 	gen_rotated_sets(scn, 15);

// // 	gen_rotated_sets(scn, 16);
// // 	rotate_plane(X, Y);
// // 	gen_rotated_sets(scn, 17);
// // 	rotate_plane(X, Y);
// // 	gen_rotated_sets(scn, 18);
// // 	rotate_plane(X, Y);
// // 	gen_rotated_sets(scn, 19);
	
// // 	invert_front_axis(scn);
// // 	gen_rotated_sets(scn, 20);
// // 	rotate_plane(X, Y);
// // 	gen_rotated_sets(scn, 21);
// // 	rotate_plane(X, Y);
// // 	gen_rotated_sets(scn, 22);
// // 	rotate_plane(X, Y);
// // 	gen_rotated_sets(scn, 23);
// // }

// // rotate_plane(axis a, axis b)
// // {
// // 	for (int i = 0; i < c.
// // }

// // gen_rotated_sets(scanner* scn, int index)
// // {
// // }
// // */

// // /*
// // void
// // orient_scanner(cntxt* c, scanner* scn)
// // {
// // 	for (int i = 0; i < c->beacon_cnt - 1; i++) {
// // 		for (int j = i + 1; j < c->beacon_cnt - 1; j++) {
// // 			long dist = measure_distance(c->beacon_list[i], c->beacon_list[j]);
// // 			beacon_pair* bp = find_matching_pair(dist, scn);

// // 			if (bp == NULL) { continue; }

// // 			beacon b_stack[4] = {
// // 				c->beacon_list[i],
// // 				c->beacon_list[j],
// // 				bp->a,
// // 				bp->b
// // 			};

// // 			rotation_info* rotinf = calc_orientation(b_stack);
// // 		}
// // 	}
// // }

// // rotation_info*
// // calc_orientation(beacon b_stack[4])
// // {
// // 	rotation_info* rotinf = mem_alloc(sizeof(rotation_info));

// // 	rotate_x(b_stack, rotinf);

// // 	if (rotinf->ax != NONE) {
// // 		return rotinf;
// // 	}

// // 	rotate_y(b_stack, rotinf);

// // 	if (rotinf->ax != NONE) {
// // 		return rotinf;
// // 	}

// // 	rotate_z(b-stack, rotinf);

// // 	if (rotinf->ax != NONE) {
// // 		puts("EROOR");
// // 		return rotinf;
// // 	}
// // 	return rotinf;
// // }

// // void
// // rotate_x(beacon b_stack[4], rotation_info* rotinf)
// // {
// // 	const int center_z = b_stack[2]->z;
// // 	const int center_y = b_stack[2]->y;
// // 	int curr_z = b_stack[3]->z;
// // 	int curr_y = b_stack[3]->y;

// // 	for (int rot_x = 90; rot_x <= 360; rot_x += 90) {
// // 		new_z = center_z + center_y - curr_y;
// // 		new_y = center_y - center_z + curr_z;
// // 		curr_z = new_z;
// // 		curr_y = new_y;

// // 		if (
// // 			b_stack[1]->z - b_stack[0]->z + center_z == curr_z &&
// // 			b_stack[1]->y - b_stack[0]->y + center_y == curr_y
// // 		   ) {
// // 			rotinf->ax = X;
// // 			rotinf->degrees = rot_x;
// // 			return;
// // 		}
// // 	}
// // }

// // void
// // rotate_y(beacon b_stack[4], rotation_info* rotinf)
// // {
// // 	const int center_z = b_stack[2]->z;
// // 	const int center_y = b_stack[2]->y;
// // 	int curr_z = b_stack[3]->z;
// // 	int curr_y = b_stack[3]->y;

// // 	for (int rot_x = 90; rot_x <= 360; rot_x += 90) {
// // 		new_z = center_z + center_y - curr_y;
// // 		new_y = center_y - center_z + curr_z;
// // 		curr_z = new_z;
// // 		curr_y = new_y;

// // 		if (
// // 			b_stack[1]->z - b_stack[0]->z + center_z == curr_z &&
// // 			b_stack[1]->y - b_stack[0]->y + center_y == curr_y
// // 		   ) {
// // 			rotinf->ax = X;
// // 			rotinf->degrees = rot_x;
// // 			return;
// // 		}
// // 	}
// // }

// // void
// // rotate_x(beacon b_stack[4], rotation_info* rotinf)
// // {
// // 	const int center_z = b_stack[2]->z;
// // 	const int center_y = b_stack[2]->y;
// // 	int curr_z = b_stack[3]->z;
// // 	int curr_y = b_stack[3]->y;

// // 	for (int rot_x = 90; rot_x <= 360; rot_x += 90) {
// // 		new_z = center_z + center_y - curr_y;
// // 		new_y = center_y - center_z + curr_z;
// // 		curr_z = new_z;
// // 		curr_y = new_y;

// // 		if (
// // 			b_stack[1]->z - b_stack[0]->z + center_z == curr_z &&
// // 			b_stack[1]->y - b_stack[0]->y + center_y == curr_y
// // 		   ) {
// // 			rotinf->ax = X;
// // 			rotinf->degrees = rot_x;
// // 			return;
// // 		}
// // 	}
// // }

// // 	for (int rot_x = 0; rot_x <= 360; rot_x += 90) {
// // 		a1->x 
// // 		for (int rot_y = 0; rot_y <= 360; rot_y += 90) {
// // 			for (int rot_z = 0; rot_z= < 360; rot_z += 90) {
// // 				if (
// // 					a2->x + b1->x - a1->x != b2->x &&
// // 					a2->y + b1->y - a1->y != b2->y &&
// // 					a2->z + b1->z - a1->z != b2->z
// // 				   ) {
// // 					orientation_data od = {
// // 						.rot_x = rot_x,
// // 						.rot_y = rot_y,
// // 						.rot_z = rot_z
// // 					};

// // 					return od;
// // 				}
// // 			}
// // 		}
// // 	}

// // 	orientation_data od = {
// // 		.rot_x = -1,
// // 		.rot_y = -1,
// // 		.rot_z = -1
// // 	};

// // 	return od;
// // }

// // long
// // measure_distance(beacon* a, beacon* b)
// // {
// // 	int x = a->x - b->x;
// // 	x *= x > 0 ? 1 : -1;
// // 	int y = a->y - b->y;
// // 	y *= y > 0 ? 1 : -1;
// // 	int z = a->z - b->z;
// // 	z *= z > 0 ? 1 : -1;

// // 	// Not the actual distance, but there's no need to calculate square root.
// // 	return x * x + y * y + z * z;
// // }

// // beacon_pair*
// // find_matching_pair(long dist, scanner* scn)
// // {
// // 	for (int i = 0; i < scn->b_count - 1; i++) {
// // 		for (int j = 0; j < scn->b_count; j++) {
// // 			if (measure_distance(scn->b_list[i], scn->b_list[j]) == dist) {
// // 				beacon_pair bp = mem_alloc(sizeof(beacon_pair));
// // 				bp->a = scn->b_list[i];
// // 				bp->b = scn->b_list[j];

// // 				return bp;
// // 			}
// // 		}
// // 	}

// // 	return NULL;
// // }

// // void
// // match_beacons(beacon b[4])
// // {
// // }
// // */

// // /*
// // void
// // find_scanner_positions(cntxt* c)
// // {
// // 	for (int i = 0; i < c->scanner_cnt; i++) {
// // 		for (int j = 1; j < c->scanner_cnt; j++) {
// // 			measure_against(c->scanner_list, c->scanner_cnt);
// // 		}
// // 	}
// // }
// // */
