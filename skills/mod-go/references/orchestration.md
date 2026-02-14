# Orchestration

## Goals

- Keep complex flows readable without leaking helper complexity.
- Isolate sequencing decisions from low-level implementation details.
- Make the main execution path obvious and testable.

## Guidance

- For a complex flow, expose one obvious executor entry point.
- Use either a package-level function (`Run`/`Execute`) or an object method, based on package style.
- Construct services in one place: wire dependencies, start background loops, and register shutdown callbacks in the constructor.
- For transport handlers (gRPC/HTTP), avoid embedding business logic; delegate behavior to injected `XXXManager` or domain `XXXHandler` dependencies.
- Keep handlers focused on protocol concerns: input validation, type conversion, and output/status mapping.
- Keep all helper methods unexported and focused on one operation each.
- Treat orchestration as composition of focused functions:
  - Orchestration method handles order, branching, and error mapping.
  - Capability methods handle one task each.
- Keep orchestration thin; push domain work to small, testable functions.

## Review Bullets

- Is there exactly one obvious entry point for this flow?
- Are helper operations small enough to test independently?
- Is constructor-time wiring explicit for background workers and shutdown paths?
- For gRPC/HTTP handlers, is business logic delegated to injected manager/handler dependencies?
- Do handlers focus on I/O mapping and protocol translation instead of domain decisions?
- Does the executor only coordinate, instead of doing all details itself?
- Can you read the primary `Run`/`Execute` flow top-to-bottom as a story?
