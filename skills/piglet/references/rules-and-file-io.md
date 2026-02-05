---
urls:
  - https://github.com/piglei/one-python-craftsman/blob/master/zh_CN/10-a-good-player-know-the-rules.md
  - https://github.com/piglei/one-python-craftsman/blob/master/zh_CN/11-three-tips-on-writing-file-related-codes.md
---

# Rules and File I/O

## Guidance
- Use data structures that match the operation (set for membership).
- Prefer pathlib for file paths and file operations.

## Bad Example

```python
def find_potential_customers_v1(users_visited_phuket, users_visited_nz):
    """Find people who visited Phuket but not New Zealand."""
    for phuket_record in users_visited_phuket:
        is_potential = True
        for nz_record in users_visited_nz:
            if phuket_record["first_name"] == nz_record["first_name"] and \
                    phuket_record["last_name"] == nz_record["last_name"] and \
                    phuket_record["phone_number"] == nz_record["phone_number"]:
                is_potential = False
                break

        if is_potential:
            yield phuket_record
```

## Good Example

```python
def find_potential_customers_v2(users_visited_phuket, users_visited_nz):
    """Find people who visited Phuket but not New Zealand."""
    nz_records_idx = {
        (rec["first_name"], rec["last_name"], rec["phone_number"])
        for rec in users_visited_nz
    }

    for rec in users_visited_phuket:
        key = (rec["first_name"], rec["last_name"], rec["phone_number"])
        if key not in nz_records_idx:
            yield rec
```

## Bad Example

```python
import os
import os.path


def unify_ext_with_os_path(path):
    """Rename .txt files to .csv in a directory."""
    for filename in os.listdir(path):
        basename, ext = os.path.splitext(filename)
        if ext == ".txt":
            abs_filepath = os.path.join(path, filename)
            os.rename(abs_filepath, os.path.join(path, f"{basename}.csv"))
```

## Good Example

```python
from pathlib import Path


def unify_ext_with_pathlib(path):
    for fpath in Path(path).glob("*.txt"):
        fpath.rename(fpath.with_suffix(".csv"))
```
