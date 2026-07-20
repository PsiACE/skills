---
urls:
  - https://github.com/octoenergy/public-conventions/blob/main/conventions/application.md
  - https://github.com/octoenergy/public-conventions/blob/main/conventions/patterns.md
  - https://github.com/octoenergy/public-conventions/blob/main/conventions/python.md
---

# Application Architecture and Operations

## Layout

Use domain names instead of generic `utils` or `helpers` modules:

```text
src/invoicing/
├── interfaces/http.py
├── application/create_invoice.py
├── domain/invoices.py
└── infrastructure/invoice_repository.py
tests/
├── unit/application/test_create_invoice.py
├── unit/domain/test_invoices.py
├── integration/infrastructure/test_invoice_repository.py
└── functional/test_create_invoice.py
```

## Boundaries

- Let interfaces translate transport input and output.
- Let application functions orchestrate one use case.
- Keep reusable business behavior in domain modules or domain objects.
- Keep infrastructure access visible and controllable at the unit boundary.
- Follow the project's chosen Active Record or Data Mapper model consistently.
- Validate user-controlled payloads in interfaces with Pydantic. Pass trusted
  values inward without repeating boilerplate validation.
- Separate read queries from state-changing operations only when it improves
  discovery.
- Serialize rich objects before template rendering when attribute access could
  trigger I/O or business behavior.

## Example

Place `CreateInvoiceInput` in `interfaces/http.py`, the domain objects in
`domain/invoices.py`, and `create_invoice` in the application layer.

```python
from collections.abc import Callable
from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class CreateInvoiceInput(BaseModel):
    account_id: str = Field(min_length=1)
    amount: Decimal = Field(gt=0)


@dataclass(frozen=True)
class Invoice:
    account_id: str
    amount: Decimal
    issued_at: datetime


def create_invoice(
    *,
    account_id: str,
    amount: Decimal,
    issued_at: datetime,
    save_invoice: Callable[[Invoice], None],
) -> Invoice:
    invoice = Invoice(
        account_id=account_id,
        amount=amount,
        issued_at=issued_at,
    )
    save_invoice(invoice)
    return invoice
```

The interface validates the payload and owns the clock, then passes trusted
values inward. The infrastructure adapter supplies `save_invoice`.

## Operations

- Distinguish anticipated business failures from unanticipated failures.
- Log a stable action-oriented message with `logger.exception` at the boundary
  that can handle or report the failure.
- Use stable event names, IDs, and ISO-formatted timestamps.
- Treat background-job payloads as deployed contracts. Use additive fields or a
  two-phase rollout when old and new workers may coexist.
- Model periods with an inclusive lower bound and exclusive upper bound.
