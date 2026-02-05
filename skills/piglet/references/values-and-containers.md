---
urls:
  - https://github.com/piglei/one-python-craftsman/blob/master/zh_CN/3-tips-on-numbers-and-strings.md
  - https://github.com/piglei/one-python-craftsman/blob/master/zh_CN/4-mastering-container-types.md
---

# Numbers, Strings, Containers

## Guidance
- Replace repeated magic literals with named constants or enums.
- Prefer sets or dicts for membership checks.
- Use lazy iterables when possible to avoid large allocations.

## Bad Example

```python
def mark_trip_as_featured(trip):
    if trip.source == 11:
        do_some_thing(trip)
    elif trip.source == 12:
        do_some_other_thing(trip)
    return
```

## Good Example

```python
from enum import IntEnum

class TripSource(IntEnum):
    FROM_WEBSITE = 11
    FROM_IOS_CLIENT = 12


def mark_trip_as_featured(trip):
    if trip.source == TripSource.FROM_WEBSITE:
        do_some_thing(trip)
    elif trip.source == TripSource.FROM_IOS_CLIENT:
        do_some_other_thing(trip)
    return
```

## Bad Example

```python
VALID_NAMES = ["piglei", "raymond", "bojack", "caroline"]

def validate_name(name):
    if name not in VALID_NAMES:
        raise ValueError(f"{name} is not a valid name!")
```

## Good Example

```python
VALID_NAMES = ["piglei", "raymond", "bojack", "caroline"]
VALID_NAMES_SET = set(VALID_NAMES)

def validate_name(name):
    if name not in VALID_NAMES_SET:
        raise ValueError(f"{name} is not a valid name!")
```
