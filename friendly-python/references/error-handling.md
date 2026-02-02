---
urls:
  - https://frostming.com/posts/2023/error-handling/
  - https://blog.yanli.one/ideas-about-exception-catch
  - https://blog.miguelgrinberg.com/post/the-ultimate-guide-to-error-handling-in-python
---

# Error Handling

## Goals

- Make failure paths explicit and understandable.
- Catch exceptions only where you can recover.
- Preserve error context for debugging.

## Guidance

- Prefer EAFP where it improves clarity, but keep failure scope tight.
- Catch specific exceptions; avoid blanket catches.
- Batch tasks can isolate per-item failures; pipelines often stop early.
- When re-raising, keep the original context.

## Examples

EAFP vs LBYL style checks:

```python
if can_i_do_x():
    do_x()
else:
    handle_error()
```

```python
try:
    do_x()
except SomeError:
    handle_error()
```

Raising and handling a specific error path:

```python
def foo():
    # do something
    raise Exception("something wrong")

try:
    foo()
except Exception as e:
    # handle exception
```

Batch-style call site:

```python
for bar in bars:
    foo(bar)
```
