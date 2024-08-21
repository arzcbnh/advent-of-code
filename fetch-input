#!/usr/bin/env sh

# TODO:
#   - functionalize operations
#   - pre-cast arguments to numbers
#   - add option to clear cache

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "usage: ./fetch-input <year> <day>"
    return 1
fi

cd "$(dirname "$0")" || exit

year=$1
day=$2

if [ -e "cache/$year/$day" ]; then
    cat "cache/$year/$day"
    return
fi

session=$(cat session)
url="https://adventofcode.com/$year/day/$day/input"
response=$(curl -sb "session=$session" "$url")

echo "$response"

if [ "$response" = "404 Not Found" ]; then
    return 1
else
    mkdir -p "cache/$year"
    echo "$response" > "cache/$year/$day"
fi
