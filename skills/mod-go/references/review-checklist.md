---
urls:
  - https://go.dev/wiki/CodeReviewComments
---

# Mod Go Review Checklist

Use this checklist for a fast architecture sanity check before merge.

## API and Boundaries

- Is package responsibility explainable in one sentence?
- Is there one obvious primary entry point?
- Are exported symbols limited to stable contracts?
- Are concrete infrastructure details hidden behind narrow interfaces?

## State and Lifecycle

- Can core logic be stateless functions instead of mutable objects?
- If a manager exists (for example, `SessionManager`), are member operations exposed by ID?
- Are shared mutable registries synchronized with explicit, narrow lock scope?
- Is every shared resource acquisition paired with a deterministic release path?

## Parameters and Construction

- For simple optional parameters, are option functions sufficient and stable for call sites?
- For complex or coupled parameter sets, is a dedicated `Builder` provided (for example, `QemuArgsBuilder`)?

## Orchestration and Shutdown

- Is orchestration thin, with helper methods focused on one capability each?
- Does each orchestration stage include a short intent comment?
- Are dependencies, background loops, and shutdown callbacks wired in one constructor path?
- For gRPC/HTTP handlers, is business logic delegated to injected `XXXManager` or `XXXHandler` dependencies?
- Are handlers limited to protocol input/output conversion and status/error mapping?
- Is shutdown driven by `context.Context` cancellation/deadlines instead of public `Close()` when possible?
