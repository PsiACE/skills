---
urls:
  - https://github.com/octoenergy/public-conventions/blob/main/conventions/python.md
---

# Explicit Python Conventions

## Goals

- Make call contracts and package boundaries discoverable.
- Keep naming predictable and external work bounded.

## Layout

Use a package entry point only when all child modules are private:

```text
billing/
├── __init__.py   # Re-export the supported API.
├── _quotes.py    # Keep behavior and related errors together.
└── _transport.py # Bound external I/O and timeouts here.
```

If child modules are public, import them by explicit paths instead of building
a second API in `__init__.py`.

## Guidance

- Declare expected parameters explicitly. Reserve `*args` and `**kwargs` for
  forwarding or compatibility requirements.
- Prefer keyword-only parameters when positional meaning is unclear.
- Raise a specific exception or return an explicit result instead of silently
  skipping unsuccessful work.
- Use singular nouns for classes and enums. Name values by domain role.
- Distinguish public and private members. Prefix private modules, models,
  classes, methods, and attributes with `_`.
- Keep the public surface small and give each exported object one canonical
  import path. List re-exports explicitly and avoid wildcard imports.
- Prefer passing domain objects through public in-process APIs. Do not require
  callers to extract internal IDs unless identity is part of the contract.
- Use a trailing `_` only for a genuine name collision.
- Use type annotations for types, docstrings for public contracts, and comments
  for non-obvious implementation reasons.
- Store simple values as attributes. Use `@property` only for values computed
  on access.
- Validate user-controlled input with Pydantic at the interface boundary. Do
  not duplicate that validation in trusted internal models.
- Set explicit timeouts for external calls.
- Prefer immutable values when callers do not need mutation. Follow the
  project's established record type.

## Example

```python
from collections.abc import Mapping
from dataclasses import dataclass
from decimal import Decimal


@dataclass(frozen=True)
class QuoteRequest:
    product_code: str
    units: Decimal


class QuoteUnavailable(Exception):
    """Raised when a quote cannot be calculated."""


def calculate_quote(
    *,
    request: QuoteRequest,
    unit_prices: Mapping[str, Decimal],
) -> Decimal:
    try:
        unit_price = unit_prices[request.product_code]
    except KeyError as exc:
        raise QuoteUnavailable(request.product_code) from exc

    return request.units * unit_price
```

The example keeps input immutable, dependencies explicit, the return type
stable, and the handled exception specific.

## Review Questions

- Can callers understand inputs and failure modes from the signature?
- Does every public object have one obvious import path?
- Can an external dependency block forever?
