# Preferred C compiler and options
CC = gcc -g -I $(INCDIR) -lm

# Source directory tree
OBJDIR = build
SRCDIR = src
INCDIR = include

# File lists
SRCS = $(wildcard $(SRCDIR)/*.c)
OBJS = $(subst $(SRCDIR),$(OBJDIR),$(patsubst %.c,%.o,$(SRCS)))

aoc: $(OBJS) $(wildcard $(INCDIR)/*.h)
	$(CC) $^ -o $@

$(OBJDIR)/%.o: $(SRCDIR)/%.c | $(OBJDIR)
	$(CC) -c $^ -o $@

$(OBJDIR) :
	mkdir $(OBJDIR)