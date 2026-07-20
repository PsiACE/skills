---
urls:
  - https://frostming.com/posts/2022/friendly-python-oop/
---

# OOP Design

## Goals

- Keep construction and the public contract explicit.
- Hide implementation details without adding boilerplate.

## Guidance

- Distinguish public and private members. Prefix private modules, models,
  classes, methods, and attributes with `_`.
- Export only the members callers need. Avoid exposing registries, metaclasses,
  descriptors, or storage details.
- Store simple values as normal class or instance attributes.
- Use `@property` only when a value must be computed on access.
- Avoid mutually exclusive flags in `__init__`. Use a named class method or
  standalone factory for an alternate construction path.
- Do not add repetitive validation to trusted internal objects. Validate
  user-controlled input at the interface boundary with Pydantic.

## Example

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

`CreateAccountInput` validates user input. `Account` receives trusted values,
keeps its internal state private, and computes only the derived value.
