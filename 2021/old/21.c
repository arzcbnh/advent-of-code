// Advent of Code 2021 - Day 21
// Written by Henry Peaurt

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#include "strmanip.h"
#include "memmanage.h"

// Types
typedef struct { int pos, scr; } Player;
typedef struct { Player p1, p2; } State;
typedef struct { long p1, p2; bool done; } Wins;

// Function declarations
long play_deterministic(State st);
Wins play_quantum(State st);
void sum_wins(Wins *a, Wins b, int factor);
State move_player(State old, int n);

int
main(void)
{
	Player p1 = { .pos = atoi(str_word(4, str_input())) - 1, .scr = 0 };
	Player p2 = { .pos = atoi(str_word(4, str_input())) - 1, .scr = 0 };
	State initial = { .p1 = p1, .p2 = p2 };
	Wins w = play_quantum(initial);

	printf("Part 1: %lu\n", play_deterministic(initial));
	printf("Part 2: %lu\n", w.p1 > w.p2 ? w.p1 : w.p2);

	return 0;
}

long
play_deterministic(State st)
{
	int dice = 1;
	int rolls = 0;

	while (st.p2.scr < 1000) {
		st = move_player(st, dice * 3 + 3);
		dice += 3;
		rolls += 3;
	}

	return (st.p1.scr < st.p2.scr ? st.p1.scr : st.p2.scr) * rolls;
}

Wins
play_quantum(State st)
{
	static Wins cache[10][21][10][21];
	Wins *ch = &(cache[st.p1.pos][st.p1.scr][st.p2.pos][st.p2.scr]);

	if (st.p2.scr >= 21) {
		Wins w = { .p1 = 0, .p2 = 1 };
		return w;
	} else if (!ch->done) {
		sum_wins(ch, play_quantum(move_player(st, 3)), 1);
		sum_wins(ch, play_quantum(move_player(st, 4)), 3);
		sum_wins(ch, play_quantum(move_player(st, 5)), 6);
		sum_wins(ch, play_quantum(move_player(st, 6)), 7);
		sum_wins(ch, play_quantum(move_player(st, 7)), 6);
		sum_wins(ch, play_quantum(move_player(st, 8)), 3);
		sum_wins(ch, play_quantum(move_player(st, 9)), 1);

		ch->done = true;
	}

	return *ch;
}

void
sum_wins(Wins *a, Wins b, int factor)
{
	a->p1 += b.p2 * factor;
	a->p2 += b.p1 * factor;
}

State
move_player(State old, int n)
{
	Player p1 = { .pos = old.p2.pos, .scr = old.p2.scr };
	Player p2 = { .pos = (old.p1.pos + n) % 10, .scr = (old.p1.pos + n) % 10 + 1 + old.p1.scr };
	State new = { .p1 = p1, .p2 = p2 };

	return new;
}
