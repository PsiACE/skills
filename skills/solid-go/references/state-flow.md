# State Flow

## Goals

- Prefer deterministic functions with explicit inputs and outputs.
- Minimize hidden mutation to simplify testing and review.
- Keep unavoidable state moving in one direction.

## Guidance

- Prefer stateless functions for transformation, validation, and composition.
- Pass dependencies and data explicitly; avoid global mutable state.
- If state is unavoidable, model it as one-shot state:
  - Initialize once.
  - Advance through explicit phases.
  - Finalize once and prevent backward transitions.
- Avoid reusable mutable objects that can return to previous states.

## Review Bullets

- Can this logic be a pure function instead of a mutable object?
- Are state transitions explicit and forward-only?
- Does the API prevent calling methods after finalization?
- Is state scope limited to one flow execution?
