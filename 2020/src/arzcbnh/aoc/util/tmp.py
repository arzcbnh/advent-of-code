import time
from collections.abc import Callable


def timed[**P, R](func: Callable[P, R]) -> Callable[P, R]:
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        start = time.perf_counter()
        result = func(*args, **kwargs)
        end = time.perf_counter()
        elapsed = (end - start) * 1000  # Convert to milliseconds
        print(f'{func.__name__}: {elapsed:.3f}ms')
        return result

    return wrapper
