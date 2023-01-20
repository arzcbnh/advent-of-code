#!/bin/bash

ROOTDIR=$(dirname $BASH_SOURCE)

RESULTS=(
	"1292 1262"
	"1499229 1340836560"
	"4103154 4245351"
	"14093 17388"
	"7380 21373"
)

if [ ! -e $ROOTDIR/build/aoc ]; then
	echo "executable not found"
	exit 1
fi

for DAY in {1..5}; do
	OUTPUT=$(eval "$ROOTDIR/build/aoc $DAY")
	OUTPUT=$(echo $OUTPUT | cut -d' ' -f11,14)

	printf "day %02d: " "$DAY"
	if [ "$OUTPUT" = "${RESULTS[$DAY - 1]}" ]; then
		echo "OK"
	else
		echo "FAIL"
	fi
done