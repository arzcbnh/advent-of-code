import argparse
import getpass
import http.client
import os
import subprocess
import sys
import time
from concurrent.futures.thread import ThreadPoolExecutor
from pathlib import Path


def main():
    args = parse_args()
    year, day, part = args.year, args.day, args.part
    data = get_data(year, day)
    cmd, env = get_event_config(year)
    cmd += [str(day)]

    if part is None:
        pretty_print(year, day, cmd, env, data)
    else:
        raw_print(cmd + [str(part)], env, data)


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('year', type=int, choices=[2020])
    parser.add_argument('day', type=int, choices=range(1, 26))
    parser.add_argument('part', type=int, nargs='?', choices=[1, 2])
    return parser.parse_args()


def get_cache_dir():
    if sys.platform == 'win32':
        base_cache = os.environ['LOCALAPPDATA']
    elif sys.platform == 'darwin':
        base_cache = os.path.expanduser('~/Library/Caches')
    elif 'XDG_CACHE_HOME' in os.environ:
        base_cache = os.environ['XDG_CACHE_HOME']
    else:
        base_cache = os.path.expanduser('~/.cache')

    return os.path.join(base_cache, 'arzcbnh', 'aoc', '2020')


def get_data(year, day):
    cache_file = os.path.join(get_cache_dir(), f'{day:02d}.txt')

    if not sys.stdin.isatty():
        data = sys.stdin.read()
    elif os.path.exists(cache_file):
        data = Path(cache_file).read_text(encoding='utf-8')
    else:
        try:
            user = getpass.getuser()
        except OSError:
            user = 'unknown'

        token = os.environ['AOC_TOKEN']
        agent = f'https://github.com/arzcbnh/advent-of-code by {user}'
        headers = {'Cookie': f'session={token}', 'User-Agent': agent}
        connection = http.client.HTTPSConnection('adventofcode.com')
        connection.request('GET', f'/{year}/day/{day}/input', headers=headers)
        response = connection.getresponse()
        data = response.read().decode('utf-8')
        connection.close()

        if response.status != 200:
            raise ConnectionError(f'Failed to fetch input: {data}')

        os.makedirs(os.path.dirname(cache_file), exist_ok=True)
        Path(cache_file).write_text(data, encoding='utf-8')

    return data


def get_event_config(year):
    env = {**os.environ}

    if year == 2020:
        cmd = ['python3', '2020/src/arzcbnh/aoc/__init__.py']
        env.update({'PYTHONPATH': '2020/src'})

    return cmd, env


def raw_print(cmd, env, data):
    p = spawn(cmd, env, data)
    print(p.stdout.strip())


def pretty_print(year, day, cmd, env, data):
    print('\033[?25l', end='')
    print(f'--- Advent of Code {year}, day {day} ---')

    with ThreadPoolExecutor(max_workers=2) as executor:
        part1 = executor.submit(spawn, cmd + ['1'], env, data)
        part2 = executor.submit(spawn, cmd + ['2'], env, data)
        res1 = err1 = res2 = err2 = None
        spinner_index = 0

        while res1 is None or res2 is None:
            spinner_frame = '-\\|/'[spinner_index := (spinner_index + 1) % 4]

            if res1 is None and part1.done():
                res1, err1 = get_answer(part1)
                if err1 is not None:
                    print(err1)

            if res2 is None and part2.done():
                res2, err2 = get_answer(part2)
                if err2 is not None:
                    print(err2)

            print(f'Part 1: {res1 or spinner_frame}')
            print(f'Part 2: {res2 or spinner_frame}')
            print('\033[2F', end='')

            time.sleep(0.1)

    print('\033[2E\033[?25h', end='')


def get_answer(future):
    proc = future.result()
    if proc.stderr == '':
        return proc.stdout.strip(), None
    else:
        return 'Fail', proc.stderr


def spawn(cmd, env, data):
    return subprocess.run(cmd, env=env, input=data, capture_output=True, text=True)


if __name__ == '__main__':
    main()
