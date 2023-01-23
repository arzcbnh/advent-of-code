#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define INITIAL_SIZE 100
#define EXPANDED_SIZE 500

struct Node { int risk, total_risk; bool visited; struct Node *neighbours[4]; };
struct QueueElement { struct Node *item; struct QueueElement *next; };

static void
free_queue(struct QueueElement *curr)
{
	struct QueueElement *prev;

	while (curr != NULL) {
		prev = curr;
		curr = curr->next;
		free(prev);
	}
}

static struct QueueElement*
get_preceding_element_by_total_risk(struct QueueElement *head, struct Node *node)
{
	struct QueueElement *element = head;

	while (element->next != NULL && element->next->item->total_risk < node->total_risk)
		element = element->next;
	
	return element;
}

static struct QueueElement*
get_preceding_element(struct QueueElement *head, struct Node *n)
{
	struct QueueElement *element = head;

	while (element->next != NULL && element->next->item != n)
		element = element->next;

	return element;
}

static struct QueueElement*
extract_element(struct QueueElement *head, struct Node *n)
{
	struct QueueElement *element = NULL;
	struct QueueElement *preceding = get_preceding_element(head, n);

	if (preceding->next != NULL) {
		element = preceding->next;
		preceding->next = element->next;
	}

	return element;
}

static void
update_queue(struct QueueElement *head, struct Node *n)
{
	struct QueueElement *element = extract_element(head, n);
	struct QueueElement *preceding = get_preceding_element_by_total_risk(head, n);

	if (element == NULL) {
		element = malloc(sizeof(struct QueueElement));
		element->item = n;
	}

	element->next = preceding->next;
	preceding->next = element;
}

static void
init_nodes(struct Node *map[][EXPANDED_SIZE], int size)
{
	for (int y = 0; y < size; y++)
		for (int x = 0; x < size; x++) {
			struct Node *n = map[x][y];
			int i = 0;

			n->total_risk = -1;
			n->visited = false;

			if (x > 0)
				n->neighbours[i++] = map[x - 1][y];
			if (y > 0)
				n->neighbours[i++] = map[x][y - 1];
			if (x < size - 1)
				n->neighbours[i++] = map[x + 1][y];
			if (y < size - 1)
				n->neighbours[i] = map[x][y + 1];
		}

	map[0][0]->total_risk = 0;
}

static struct QueueElement*
init_queue(struct Node *first)
{
	struct QueueElement *head = calloc(1, sizeof(struct QueueElement));
	struct QueueElement *element = calloc(1, sizeof(struct QueueElement));

	element->item = first;
	head->next = element;

	return head;
}

static int
pathfind(struct Node *map[][EXPANDED_SIZE], int size)
{
	struct QueueElement *head = init_queue(map[0][0]);
	init_nodes(map, size);

	while (!map[size - 1][size - 1]->visited) {
		struct Node *node = head->next->item;
		free(extract_element(head, node));
		node->visited = true;

		for (int i = 0; i < 4 && node->neighbours[i] != NULL; i++) {
			struct Node *neighbour = node->neighbours[i];
			int cur_total_risk = neighbour->total_risk;
			int new_total_risk = node->total_risk + neighbour->risk;

			if (!neighbour->visited && (cur_total_risk == -1 || cur_total_risk > new_total_risk)) {
				neighbour->total_risk = new_total_risk;
				update_queue(head, neighbour);
			}
		}
	}

	free_queue(head);
	return map[size - 1][size - 1]->total_risk;
}

static void
expand_map(struct Node *map[][EXPANDED_SIZE])
{
	for (int y = 0; y < INITIAL_SIZE; y++)
		for (int x = 0; x < INITIAL_SIZE; x++) {

			int original_risk = map[x][y]->risk;
			free(map[x][y]);

			for (int i = 0; i < EXPANDED_SIZE; i += INITIAL_SIZE)
				for (int j = 0; j < EXPANDED_SIZE; j += INITIAL_SIZE) {

					int new_risk = original_risk + i / INITIAL_SIZE + j / INITIAL_SIZE;
					map[x + j][y + i] = calloc(1, sizeof(struct Node));
					map[x + j][y + i]->risk = new_risk < 10 ? new_risk : new_risk - 9;
				}
		}
}

static void
skip_newline(void)
{
	getchar();
}

static void
input_map(struct Node *map[][EXPANDED_SIZE])
{
	for (int y = 0; y < INITIAL_SIZE; y++) {
		for (int x = 0; x < INITIAL_SIZE; x++) {
			map[x][y] = calloc(1, sizeof(struct Node));
			map[x][y]->risk = getchar() - '0';
		}
		
		skip_newline();
	}
}

void
day15(void)
{
	struct Node *map[EXPANDED_SIZE][EXPANDED_SIZE];

	input_map(map);
	printf("Part 1: %u\n", pathfind(map, INITIAL_SIZE));
	expand_map(map);
	printf("Part 2: %u\n", pathfind(map, EXPANDED_SIZE));

	for (int y = 0; y < EXPANDED_SIZE; y++)
		for (int x = 0; x < EXPANDED_SIZE; x++)
			free(map[x][y]);
}
