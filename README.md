# arzcbnh's Advent of Code

Solutions for Advent of Code using a different language each event.

| Year | Language                     | Status                    |
|------|------------------------------|---------------------------|
| 2018 | Lua 5.4                      | Unfinished (up to day 3)  |
| 2020 | Python 3.14                  | Ongoing                   |
| 2021 | C99                          | Unfinished (up to day 18) |
| 2023 | TypeScript 5.6 on Node 22.10 | Unfinished (up to day 17) |
| 2024 | Java SE 21                   | Unfinished (up to day 8)  |

## Compliance with automation guidelines

This project follows the [r/adventofcode](https://www.reddit.com/r/adventofcode) community wiki [automation guidelines](https://www.reddit.com/r/adventofcode/wiki/faqs/automation):

- Inputs are cached locally after download.
- Network requests include a `User-Agent` header.
- Solutions are limited to one request per execution, and no automated or scheduled requests are performed.

### Caching

Inputs are cached in the platform-specific base cache directories:

- Windows: `%LOCALAPPDATA%`.
- macOS: `~/Library/Caches`.
- Linux and other platforms: `$XDG_CACHE_HOME`, or `~/.cache` if not set.

The project cache follows the structure `arzcbnh/aoc/YEAR/DAY.txt`. Days smaller than ten are preceded by a zero for sorting. Examples:

```
C:\Users\arzcbnh\AppData\Local\arzcbnh\aoc\2020\07.txt
/home/arzcbnh/.cache/arzcbnh/aoc/2023/14.txt
```

### `User-Agent` header

All input fetching procedures include a `User-Agent` header. If not specified through the environment variable `AOC_USER_AGENT`, a string is composed from the template below, using a platform-provided username if possible, or `unknown` otherwise:

```
https://github.com/arzcbnh/advent-of-code by username
```

## Conventional Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for the sake of it.

### Types

- **feat**: a day, part, or year implementation; additions or removals to utility libraries.
- **chore**: comments, maintenance of dependencies, project configuration, helper scripts, etc.
- **refactor**: code refactoring.
- **fix**: a bug fix.

### Scopes

- **aoc**: the entire project, or parts of it that are external to any event or other subproject.
- **\<year>**: an entire year.
- **\<year>/\<day>**: a specific day.
