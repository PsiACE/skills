---
urls:
  - https://github.com/piglei/one-python-craftsman/blob/master/zh_CN/15-thinking-in-edge-cases.md
---

# Edge Cases

## Guidance
- Keep the main path clear; avoid branching noise when possible.
- Prefer EAFP when it makes the intent and flow simpler.

## Bad Example (LBYL)

```python
def counter_lbyl(values):
    result = {}
    for key in values:
        if key in result:
            result[key] += 1
        else:
            result[key] = 1
    return result
```

## Good Example (EAFP)

```python
def counter_eafp(values):
    result = {}
    for key in values:
        try:
            result[key] += 1
        except KeyError:
            result[key] = 1
    return result
```
