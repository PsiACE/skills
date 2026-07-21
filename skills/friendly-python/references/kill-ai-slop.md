---
urls:
  - https://github.com/octoenergy/public-conventions/blob/main/conventions/python.md
  - https://github.com/octoenergy/public-conventions/blob/main/conventions/application.md
  - https://github.com/octoenergy/public-conventions/blob/main/conventions/patterns.md
---

# Kill AI Slop

Remove boilerplate that imitates safety while making contracts harder to see.

## Validation

- Do not build forests of primitive type guards such as `_string`,
  `_optional_string`, or `_integer` for user-controlled or untrusted serialized
  data.
- When validation is necessary at that boundary, define a Pydantic model and
  convert the result into trusted application or domain values once.
- Do not repeat boundary validation in application functions or domain models.
- Keep handwritten checks for behavioral domain invariants that a data schema
  cannot express clearly, not for recreating a runtime type system.

Use strict Pydantic fields when coercion would hide invalid stored data:

```python
from pydantic import BaseModel, ConfigDict


class StoredMemory(BaseModel):
    model_config = ConfigDict(strict=True)

    label: str
    value: str | None
    sequence: int
```

## Contracts

- Distinguish public and private members. Prefix private modules, models,
  classes, methods, and attributes with `_`, and export only what callers need.
- In public in-process APIs, accept the domain object when callers already have
  it instead of making them extract an internal ID. Keep identifiers at
  serialization, storage, or process boundaries, or when identity is the
  explicit contract.
- Store simple values as class or instance attributes. Use `@property` for
  values computed on access and descriptors for specialized reusable behavior.

## Failure Paths

- Raise and catch specific exceptions. Never catch `BaseException`.
- Catch `Exception` only at a boundary that preserves operational visibility by
  logging and re-raising, translating with explicit chaining, or returning a
  last-resort response.
- Treat broad catches, `pass`, and callback comments in illustrative examples
  as placeholders, not production patterns.

## Review Questions

- Does a helper merely restate a Pydantic field type?
- Is trusted data validated more than once?
- Does a public API expose an internal field only so another call can accept it?
- Is a property doing no computation?
- Does an exception path hide the failure or discard its context?
