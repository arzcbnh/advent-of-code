#!/usr/bin/env bash

set -e
set -o pipefail

readonly YEAR=$1
readonly DAY=$2
readonly PART=$3

validate_args() {
  if [ "$YEAR" != 2020 ]; then
    echo "error: year $YEAR not supported"
    exit 1
  fi

  if [ "$DAY" -le 0 ] || [ "$DAY" -gt 25 ]; then
    echo "error: day must be a number between 1 and 25, got: $DAY"
    exit 1
  fi

  if [ -n "$PART" ] && [ "$PART" -ne 1 ] && [ "$PART" -ne 2 ]; then
    echo "error: part must be either 1 or 2, got: $PART"
    exit 1
  fi
}

get_cache_dir() {
  local cache_home

  case $OSTYPE in
    *Windows*|*windows*|*Msys*|*CYGWIN*|*MINGW*)
      cache_home=$LOCALAPPDATA
      ;;
    *Darwin*)
      cache_home="$HOME/Library/Caches"
      ;;
    *)
      cache_home="${XDG_CACHE_HOME:-$HOME/.cache}"
      ;;
  esac

 echo "$cache_home/arzcbnh/aoc/$YEAR"
}

get_cache_filepath() {
  local cache_dir=$1
  printf '%s/%02d.txt' "$cache_dir" "$DAY"
}

fetch_input() {
  local cookie="session=$AOC_TOKEN"
  local user_agent="https://github.com/arzcbnh/advent-of-code by $USER"
  local url="https://adventofcode.com/$YEAR/day/$DAY/input"

  curl --silent --show-error --fail-with-body -b "$cookie" -A "$user_agent" "$url"
}

get_input() {
  local cache_dir cache_filepath input

  cache_dir=$(get_cache_dir)
  cache_filepath=$(get_cache_filepath "$cache_dir")

  if [ ! -t 0 ]; then
    # From stdin
    cat -
  elif [ -f "$cache_filepath" ]; then
    # From cache
    cat "$cache_filepath"
  else
    # From web
    input=$(fetch_input) || return 1
    mkdir -p "$cache_dir"
    printf '%s' "$input" > "$cache_filepath"
    echo "$input"
  fi
}

setup_year_env() {
  case $YEAR in
    2020)
      PYTHONPATH="$(pwd)/2020/src"
      export PYTHONPATH
      ;;
  esac
}

get_year_cmd() {
  case $YEAR in
    2020)
      echo "python $(pwd)/2020/src/arzcbnh/aoc/__init__.py $DAY"
      ;;
  esac
}

raw_print() {
  local cmd=$1
  local input=$2
  $cmd "$PART" <<< "$input"
}

get_spinner_frame() {
  local index=$1

  case $index in
    0) echo '-';;
    1) echo '\';;
    2) echo '|';;
    3) echo '/';;
  esac
}

pretty_print() {
  local cmd=$1
  local input=$2
  local frame_index=0
  local part1 part2 fd1 fd2 frame

  # Compute in parallel
  coproc proc1 { $cmd 1; } <<< "$input"
  coproc proc2 { $cmd 2; } <<< "$input"
  exec {fd1}<&${proc1[0]}
  exec {fd2}<&${proc2[0]}

  # Hide cursor and print header
  printf '\033[?25l--- Advent of Code %s, day %s ---\n' "$YEAR" "$DAY"

  while [ -z "$part1" ] || [ -z "$part2" ]; do
    frame=$(get_spinner_frame "$frame_index")
    frame_index=$(( (frame_index + 1) % 4 ))

    if [ -z "$part1" ]; then
      if read -t 0 -u ${fd1}; then
        part1=$(cat <&${fd1})
      fi
      printf '\033[KPart 1: %s\n\033[F' "${part1:-$frame}"
    fi

    if [ -z "$part2" ]; then
      if read -t 0 -u ${fd2}; then
        part2=$(cat <&${fd2})
      fi
      printf '\033[E\033[KPart 2: %s\n\033[2F' "${part2:-$frame}"
    fi

    sleep 0.15
  done

  # Restore cursor position
  printf '\033[2E\033[?25h'
}

main() {
  local cmd input

  validate_args
  setup_year_env

  cmd=$(get_year_cmd)
  input=$(get_input)

  if [ -n "$PART" ]; then
    raw_print "$cmd" "$input"
  else
    pretty_print "$cmd" "$input"
  fi
}

# Restore cursor visibility on exit
trap "printf '\033[?25h'" EXIT HUP INT QUIT TERM

main
