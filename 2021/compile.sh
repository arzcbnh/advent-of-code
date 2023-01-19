#!/bin/sh

[ ! -d "build" ] && meson build
meson compile -C build &&
cp build/aoc .