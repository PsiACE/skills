---
urls:
  - https://go.dev/blog/context
  - https://go.dev/doc/effective_go#concurrency
---

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
- For lifecycle-managed collections, introduce an `XXXManager` (for example, `SessionManager`) to coordinate members.
- Assign each managed member a stable ID and expose lifecycle operations by ID (for example: `Start(id)`, `Stop(id)`, `Status(id)`).
- For manager-owned mutable registries, guard state maps with explicit synchronization and keep lock scope minimal.
- For shared resource acquisition, return an explicit release closure to make ownership and cleanup boundaries unambiguous.
- Prefer shutdown through `context.Context` cancellation and deadlines.
- Avoid exposing explicit `Close()` methods unless required by external contracts.

## Review Bullets

- Can this logic be a pure function instead of a mutable object?
- Are state transitions explicit and forward-only?
- Does the API prevent calling methods after finalization?
- Is state scope limited to one flow execution?
- If a manager exists, are member operations exposed by ID rather than direct member references?
- Are lock boundaries explicit and narrow for shared mutable state?
- Is every acquired shared resource paired with a deterministic release path?
- Is shutdown driven by `context.Context` rather than public `Close()` calls?
