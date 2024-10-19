#!/usr/bin/env sh

set -e
cd "$(dirname "$0")"

error() {
    printf "\033[1;37;41m$1\033[0m\n" 1>&2
    exit 1
}

if [ -z "$1" ] || [ -z "$2" ]; then
    error "usage: ./fetch-input <year> <day>"
fi

if [ ! -e session ]; then
    error "error: missing session token"
fi

YEAR=$1
DAY=$2
SESSION=$(cat session)
mkdir -p "cache/$YEAR"

if [ ! -e "cache/$YEAR/$DAY" ]; then
    URL="https://adventofcode.com/$YEAR/day/$DAY/input"
    INPUT=$(curl -sSfb "session=$SESSION" "$URL")
    printf "$INPUT" > "cache/$YEAR/$DAY"
fi

cat "cache/$YEAR/$DAY"
