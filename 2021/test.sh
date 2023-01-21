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
)

if [ ! -e $ROOTDIR/build/aoc ]; then
	echo "executable not found"
	exit 1
fi

for DAY in {1..7}; do
	OUTPUT=$(eval "$ROOTDIR/build/aoc $DAY")
	OUTPUT=$(echo $OUTPUT | cut -d' ' -f11,14)

	printf "day %02d: " "$DAY"
	if [ "$OUTPUT" = "${RESULTS[$DAY - 1]}" ]; then
		printf "OK "
	else
		printf "FAIL "
	fi

	if valgrind --error-exitcode=1 "$ROOTDIR/build/aoc" "$DAY" &> /dev/null; then
		echo "MEMORY SAFE"
	else
		echo "MEMORY LEAK"
	fi
done