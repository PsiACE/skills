---
urls:
  - https://github.com/piglei/one-python-craftsman/blob/master/zh_CN/16-stmt-expr-and-walrus-operator.md
---

# Walrus Operator

## Guidance
- Use assignment expressions to avoid repeating expensive expressions.
- Do not trade clarity for cleverness; keep the condition readable.

## Bad Example

```python
import re

LEADING_W_WORD = re.compile(r"\bw\w*?\b", re.I)
TRAILING_W_WORD = re.compile(r"\b\w*?w\b", re.I)


def find_w_word(s):
    if LEADING_W_WORD.search(s):
        word = LEADING_W_WORD.search(s).group()
        print(f"Found word starts with w: {word}")
    elif TRAILING_W_WORD.search(s):
        word = TRAILING_W_WORD.search(s).group()
        print(f"Found word ends with w: {word}")
```

## Good Example

```python
import re

LEADING_W_WORD = re.compile(r"\bw\w*?\b", re.I)
TRAILING_W_WORD = re.compile(r"\b\w*?w\b", re.I)


def find_w_word_v3(s):
    if (l_match := LEADING_W_WORD.search(s)):
        word = l_match.group()
        print(f"Found word starts with w: {word}")
    elif (t_match := TRAILING_W_WORD.search(s)):
        word = t_match.group()
        print(f"Found word ends with w: {word}")
```
