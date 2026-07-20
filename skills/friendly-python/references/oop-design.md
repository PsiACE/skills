---
urls:
  - https://frostming.com/posts/2022/friendly-python-oop/
---

# OOP Design

## Goals

- Construction paths should be explicit and unambiguous.
- Avoid leaking internal mechanics to callers.

## Guidance

- Avoid piling mutually exclusive flags in `__init__`.
- Use `@classmethod` or standalone factories for alternate construction.
- Prefer explicit fields. Use `@property` only when a value must be computed on
  access.
- Distinguish public and private members. Prefix private modules, models,
  classes, methods, and attributes with `_`.
- Export only the members callers need. Avoid exposing metaclasses, internal
  registries, descriptors, or storage details.
- Do not add repetitive validation to trusted internal objects. Validate
  user-controlled input at the interface boundary with Pydantic.

## Example

Multiple switches in `__init__` quickly become unclear:

```python
class Settings:
    ...
    def __init__(self, **kwargs, from_env=False, from_file=None):
        if from_env:
            self._load_from_env()
        elif from_file:
            self._load_from_file(from_file)
        else:
            for k, v in kwargs.items():
                setattr(self, k, v)
```

Validate user input once, keep internal state private, and compute only derived
values:

```python
from decimal import Decimal

from pydantic import BaseModel, Field


class CreateAccountInput(BaseModel):
    balance: Decimal = Field(ge=0)


class Account:
    currency = "GBP"

    def __init__(self, *, account_id: str, balance: Decimal) -> None:
        self._account_id = account_id
        self._balance = balance
        self._reserved = Decimal("0")

    @property
    def available_balance(self) -> Decimal:
        return self._balance - self._reserved
```
