import os
import sys
from pathlib import Path


def get_cache_dir() -> str:
    """
    Get cache directory based on platform.
    """
    if sys.platform == 'win32':
        base = os.environ['LOCALAPPDATA']
    elif sys.platform == 'darwin':
        base = os.path.expanduser('~/Library/Caches')
    elif 'XDG_CACHE_HOME' in os.environ:
        base = os.environ['XDG_CACHE_HOME']
    else:
        base = os.path.expanduser('~/.cache')

    return os.path.join(base, 'arzcbnh', 'aoc', '2020')


def retrieve(day: int) -> str | None:
    input_path = os.path.join(get_cache_dir(), f'{day:02d}.txt')
    if os.path.exists(input_path):
        return Path(input_path).read_text(encoding='utf-8')

    return None


def store(day: int, data: str) -> None:
    input_path = os.path.join(get_cache_dir(), f'{day:02d}.txt')
    os.makedirs(os.path.dirname(input_path), exist_ok=True)
    Path(input_path).write_text(data, encoding='utf-8')
