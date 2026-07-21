---
urls:
  - https://github.com/octoenergy/public-conventions/blob/main/conventions/testing.md
---

# Testing Structure and Isolation

## Goals

- Make test scope and cost visible.
- Keep failures deterministic and focused on owned behavior.

## Layout

Mirror source paths for unit and integration tests. Name functional tests after
the journey:

```text
src/billing/_quotes.py
tests/unit/billing/test_quotes.py
tests/integration/billing/test_price_repository.py
tests/functional/test_create_quote.py
```

## Guidance

- Use unit tests for one behavior with controlled direct collaborators.
- Use integration tests for adapter or wiring behavior.
- Keep a small set of functional tests for critical journeys.
- Arrange state, perform one visible action, and assert observable outcomes.
- Group tests by callable or object when it improves navigation.
- Name values by role or state; avoid numbered names.
- Do not assert global database counts when tests can run concurrently.
- Inject clocks into units. Freeze time around setup and invocation in broader
  tests when injection is impractical.

## Example

```python
from decimal import Decimal

from billing import QuoteRequest, calculate_quote


class TestCalculateQuote:
    def test_returns_total_for_known_product(self) -> None:
        request = QuoteRequest(product_code="standard", units=Decimal("3"))
        unit_prices = {"standard": Decimal("1.50")}

        total = calculate_quote(
            request=request,
            unit_prices=unit_prices,
        )

        assert total == Decimal("4.50")
```

The blank lines expose arrange, act, and assert without comments. Add a separate
test for each failure contract rather than combining branches in one method.

## Review Questions

- Is this the narrowest scope that catches the regression?
- Would the test pass in parallel and at any wall-clock time?
- Does its name describe behavior rather than implementation?
