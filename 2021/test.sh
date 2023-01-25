#!/bin/bash

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
	"35511 3282"
)

executable="$(dirname "${BASH_SOURCE[0]}")/build/aoc"
pass="PASS!"
fail="FAIL!"

if [ ! -e "$executable" ]; then
	echo "executable not found"
	exit 1
fi

usage() { 
	echo "Usage: $0 [-d <1-25>] [-v]" 1>&2;
	exit 1;
}

print_result() {
	if [ "$1" ]; then
		printf "\033[0;92m%s" "$pass"
	else
		printf "\033[0;31m%s" "$fail"
	fi
	printf "\033[0m"
}

run_test() {
	printf "Testing day %02d... Correct output: " "$1"
	OUTPUT=$($executable "$1" | cut -d' ' -f11,14)
	[ "$OUTPUT" = "${RESULTS[$1 - 1]}" ]
	print_result "$?"

	if [ "$VALGRIND" ]; then
		printf " Memory safe: "
		valgrind --max-stackframe=4194304 --error-exitcode=1 --leak-check=full "$executable" "$DAY" &> /dev/null
		print_result "$?"
	fi

	printf "\n"
}

while getopts ":d:v" opt; do
	case $opt in
	d)
		SINGLE_DAY=$OPTARG
		[ "$SINGLE_DAY" -lt 1 ] || [ "$SINGLE_DAY" -gt 25 ] && usage
		;;
	v)
		VALGRIND=true
		;;
	*)
		usage
		;;
	esac
done

if [ "$SINGLE_DAY" ]; then
	run_test "$SINGLE_DAY"
else
	for DAY in {1..17}; do
		run_test "$DAY"
	done
fi
