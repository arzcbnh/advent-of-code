# File is completely borked as I can't understand the complexity. Here's the command I've used as of day 3
gcc -g -Iinclude -Ivendor/c-vector -Ivendor/getopt -Ivendor/sds src/01.c src/02.c src/03.c src/aoc.c vendor/c-vector/vec.c vendor/sds/sds.c -o aoc

# Preferred C compiler and options
CC = gcc -g $(addprefix -I ,$(INCDIR)) -lm

# Source directory tree
OBJDIR = build
SRCDIR = src
VENDIR = vendor
INCDIR = include $(wildcard $(VENDIR)/*)

# File lists
SRCS = $(wildcard $(SRCDIR)/*.c) $(wildcard $(VENDIR)/*/*.c)
OBJS = $(addprefix $(OBJDIR)/,$(patsubst %.c,%.o,$(notdir $(SRCS))))

.PHONY: clean asd

asd:
	echo $(addprefix $(OBJDIR)/,$(patsubst %.c,%.o,$(notdir $(SRCS))))

aoc: $(OBJS) include/aoc.h
	$(CC) $^ -o $@

03.c: $(VENDIR)/c-vector/vec.h $(VENDIR)/sds/sds.h

$(OBJDIR)/%.o: $(SRCDIR)/%.c | $(OBJDIR)
	$(CC) -c $^ -o $@

$(OBJDIR)/%.o: $(addsuffix /%.c,$(wildcard $(VENDIR)/*))
	$(CC) -c $^ -o $@

build/vec.o: vendor/c-vector/vec.c
	$(CC) -c $^ -o $@

build/tests.o:
	echo nothing

build/sds.o: vendor/sds/sds.c
	$(CC) -c $^ -o $@

$(OBJDIR):
	mkdir $(OBJDIR)

# Test
# test: $(OBJDIR)/test.o
# 	$(CC) $^ -o $@

# $(OBJDIR)/test.o: test.c $(INCDIR)/list.h | $(OBJDIR)
# 	$(CC) -c test.c -o $@

clean:
	rm -r build aoc