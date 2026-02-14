---
urls:
  - https://go.dev/blog/context
  - https://go.dev/doc/effective_go#concurrency
---

# State Flow

## Goals

- Keep behavior deterministic and easy to reason about.
- Make state ownership and lifecycle explicit.

## Guidance

- Prefer stateless functions for transformation, validation, and composition.
- Pass dependencies and data explicitly; avoid global mutable state.
- If state is unavoidable, model one-way transitions (init → advance → finalize) and prevent backward transitions.
- Use `XXXManager` only for lifecycle-managed collections; expose operations by stable IDs.
- Guard manager-owned mutable registries with explicit synchronization and narrow lock scope.
- Pair shared resource acquisition with deterministic release paths.
- Prefer shutdown through `context.Context`; expose `Close()` only when external contracts require it.

## Review Bullets

- Can this logic be a pure function instead of a mutable object?
- Are state transitions explicit and forward-only?
- If a manager exists, are operations exposed by ID rather than direct member references?
- Are lock boundaries explicit and narrow?
- Is every acquired shared resource paired with a deterministic release path?
- Is shutdown driven by `context.Context` instead of public `Close()` where possible?
