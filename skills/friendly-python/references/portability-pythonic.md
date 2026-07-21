---
urls:
  - https://frostming.com/posts/2025/friendly-python-port/
---

# Portability and Pythonic Choices

## Goals

- Avoid copying foreign patterns that fight Python.
- Prefer Pythonic constructs that fit local conventions.

## Guidance

- Use keyword arguments for configuration.
- Avoid importing the builder pattern verbatim.
- Replace multi-callback APIs with `try/except/finally` or generators.
- Prefer context managers for lifecycle patterns like `useEffect`.

## Example

Builder-style APIs do not translate well as-is:

```rust
// Pick a builder and configure it.
let mut builder = services::S3::default();
builder.bucket("test");

// Init an operator
let op = Operator::new(builder)?
    // Init with logging layer enabled.
    .layer(LoggingLayer::default())
    .finish();

// Use operator
```

A Pythonic configuration favors keyword arguments:

```python
op = Operator(
    service="s3",
    bucket="test",
)
op.layer(LoggingLayer())
# Use operator
```

Prefer `try/except/finally` for lifecycle callbacks:

```python
try:
    data = await download_file(url)
    # onSuccess
except Exception as err:
    pass  # onError
finally:
    pass  # onComplete
```

Prefer context managers for effect-like lifecycles:

```python
from contextlib import contextmanager

@contextmanager
def my_effect():
    # effect
    try:
        yield
    finally:
        # cleanup

use_effect(my_effect, [])
```
