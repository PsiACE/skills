---
urls:
  - https://github.com/piglei/one-python-craftsman/blob/master/zh_CN/8-tips-on-decorators.md
---

# Decorators

## Guidance
- Use functools.wraps to preserve the original function signature and metadata.
- Keep decorator layers shallow and readable.
- Prefer class-based decorators when you need state or extra methods.

## Bad Example

```python
import random
import time


def timer(wrapped):
    """Decorator that prints execution time."""
    def decorated(*args, **kwargs):
        start = time.time()
        ret = wrapped(*args, **kwargs)
        print("execution took: {} seconds".format(time.time() - start))
        return ret
    return decorated


@timer
def random_sleep():
    """Sleep for a short random time."""
    time.sleep(random.random())
```

## Good Example

```python
import functools
import time


def timer(wrapped):
    """Decorator that prints execution time."""
    @functools.wraps(wrapped)
    def decorated(*args, **kwargs):
        start = time.time()
        ret = wrapped(*args, **kwargs)
        print("execution took: {} seconds".format(time.time() - start))
        return ret
    return decorated
```
