---
urls:
  - https://github.com/piglei/one-python-craftsman/blob/master/zh_CN/7-two-tips-on-loop-writing.md
---

# Loops and Iteration

## Guidance
- Flatten nested loops with iterator helpers when it improves clarity.
- Prefer iterator tools like itertools for structured iteration.

## Bad Example

```python
def find_twelve(num_list1, num_list2, num_list3):
    """Find three numbers that sum to 12."""
    for num1 in num_list1:
        for num2 in num_list2:
            for num3 in num_list3:
                if num1 + num2 + num3 == 12:
                    return num1, num2, num3
```

## Good Example

```python
from itertools import product


def find_twelve_v2(num_list1, num_list2, num_list3):
    for num1, num2, num3 in product(num_list1, num_list2, num_list3):
        if num1 + num2 + num3 == 12:
            return num1, num2, num3
```
