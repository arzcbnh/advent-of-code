# Project guide

This is a personal project that is not accepting contributions. The purpose of this guide is to record internal structure for my own future reference, but also for other people to understand my decisions.

## Committing

I'm using conventional commits, although changelogs won't be generated since I'm not using semantic versioning. No hard limit is being imposed on the length of the header, and no line breaks are used in the body. I will often use the body to describe my feelings and experience with what is being done.

### Types

I personally have a hard time deciding when to use each of the conventional types, so I laid out a few ones, along with their applications, that will be useful for this project.

- **feat**: A day, part, or year conclusion; Additions or removals to utility libraries; Any other feature.
- **chore**: Maintenance of dependencies, configuration, and scripts.
- **refactor**: A code refactor.
- **fix**: A bug fix.

### Scopes

- **aoc**: The entire project or parts of it that are external to any challenge or other subproject.
- **\<year>**: An entire year.
- **\<year>/\<day>**: A specific day.
- **front**: The front-end.

## Caching

The session token necessary for fetching must be an environment variable. Inputs will be cached on `$XDG_CACHE_HOME` or `$HOME/.cache`. The cache will be structured as `arzcbnh-aoc/<year>/<day>`, where `<day>` has no leading zeros and no file extension. I still haven't decided how caching will be done on macOS and Windows.
