#!/bin/env sh

script="src/arzcbnh/aoc/cli.py"
export PYTHONPATH="src"

if command -v python3 > /dev/null; then
  python3 "$script" "$@"
elif command -v python > /dev/null; then
  python "$script" "$@"
elif command -v py > /dev/null; then
  py "$script" "$@"
else
  echo "Python interpreter not found"
  exit 1
fi
