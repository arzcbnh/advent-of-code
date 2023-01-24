#!/bin/bash

ROOTDIR=$(dirname $BASH_SOURCE)

RESULTS=(
	"1292 1262"
	"1499229 1340836560"
	"4103154 4245351"
	"14093 17388"
	"7380 21373"
	"372984 1681503251694"
	"344605 93699985"
	"390 1011785"
	"585 827904"
	"278475 3015539998"
	"1705 265"
	"5254 149385"
	"842 ###..####.#..#.###...##....##.####.#..#."
	"3906 4441317262452"
	"619 2922"
	"963 1549026292886"
)

if [ ! -e $ROOTDIR/build/aoc ]; then
	echo "executable not found"
	exit 1
fi

for DAY in {1..15}; do
	OUTPUT=$(eval "$ROOTDIR/build/aoc $DAY")
	OUTPUT=$(echo $OUTPUT | cut -d' ' -f11,14)
	echo $OUTPUT

	printf "day %02d: " "$DAY"
	if [ "$OUTPUT" = "${RESULTS[$DAY - 1]}" ]; then
		printf "OK "
	else
		printf "FAIL "
	fi

	if valgrind --max-stackframe=4194304 --error-exitcode=1 --leak-check=full "$ROOTDIR/build/aoc" "$DAY" &> /dev/null; then
		echo "MEMORY SAFE"
	else
		echo "MEMORY LEAK"
	fi
done
