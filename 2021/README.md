# Advent of Code 2021

## Building

Requires Meson to build.

```
$ meson setup build && cd build && meson compile
```

## Usage

```
./aoc [options] <day>

-i
	Loads a custom file called "input" from the root directory to be used as the program input. May be used to run arbitrary inputs for any day.

<day>
	Specify the day to solve. May be any integer between 1 and 25.
```
