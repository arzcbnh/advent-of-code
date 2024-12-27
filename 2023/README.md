# Advent of Code 2023

Solutions for the Advent of Code 2023 written in TypeScript.

## Usage

```
npm run build
npm start <day> [example]
```

Where `<day>` is a number between 1 and 25. Passing any value to `[example]` makes the program look for a file named `example` at the project root to use as input.

The environment variable `AOC_SESSION` must be set to your Advent of Code session cookie for the fetching utility to work. Otherwise, you must create a directory `arzcbnh-aoc` in your personal cache directory and manually save the input for the day you want in a file with the number of the day and no extension. Using day 17 as an example: `arzcbnh-aoc/2023/inputs/17`. Refer to the [guide](../GUIDE.md#caching) for more details.
