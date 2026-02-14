---
urls:
  - https://go.dev/blog/context-and-structs
  - https://go.dev/blog/error-handling-and-go
---

# Orchestration

## Goals

- Keep complex flows readable and testable.
- Separate sequencing from implementation details.

## Guidance

- For a complex flow, expose one obvious executor entry point.
- Use either a package-level function (`Run`/`Execute`) or an object method, based on package style.
- Keep constructor-time wiring in one place (dependencies, background loops, shutdown callbacks).
- In orchestration flows, add one short comment line for each stage to state intent and improve scanability.
- Keep all helper methods unexported and focused on one operation each.
- Keep orchestration thin: handle order, branching, and error mapping only.
- Keep capability methods single-purpose and testable.
- When a package mixes distinct responsibilities, split along domain seams rather than by file size.
- Convert errors at HTTP/GRPC boundaries, not in core logic.

## Review Bullets

- Is there exactly one obvious entry point for this flow?
- Are helper operations small enough to test independently?
- Is constructor-time wiring explicit for background workers and shutdown paths?
- Does each orchestration stage include a short intent comment?
- Does the executor only coordinate, instead of doing all details itself?
- Can you read the primary `Run`/`Execute` flow top-to-bottom as a story?
- Is every package boundary justified by a distinct responsibility, not file size?
- Is error conversion happening at request boundaries only?
