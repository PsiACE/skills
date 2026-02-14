---
name: solid-go
description: Practical guidance for Go module and package design with minimal public APIs, strict single responsibility, stateless-first implementation, one-way state transitions, and orchestration-to-capability decomposition. Use when creating, refactoring, or reviewing Go architecture, package boundaries, interfaces, and execution flows.
---

# solid-go

Concise guidance for designing Go modules that stay small, focused, and easy to evolve.

## Purpose and Triggers

- Use for Go module or package design, refactoring, and code review.
- Focus on API surface, responsibility boundaries, state handling, and flow decomposition.
- Prefer explicit boundaries over convenience exports.

## Decision Order

1. Keep public surface minimal and intentional.
2. One package, one responsibility.
3. Stateless functions before stateful objects.
4. If state is required, enforce one-way state flow.
5. Allow extra exports only for stable contracts.
6. Keep orchestration separate from atomic capability methods.

## Workflow

1. Define one package responsibility.
2. Expose one obvious primary entry point (type, interface, or function).
3. Keep helper logic unexported and local.
4. Export additional symbols only when they are stable domain contracts.
5. Compose orchestration from focused functions.
6. Re-check the package against the review bullets in references.

## Topics

| Topic | Guidance | Reference |
| --- | --- | --- |
| Module Boundary | Expose minimal API and separate deep vs wide interfaces | [references/module-boundary.md](references/module-boundary.md) |
| State Flow | Use stateless functions and one-shot state objects | [references/state-flow.md](references/state-flow.md) |
| Orchestration | Use a single public executor and internal helpers | [references/orchestration.md](references/orchestration.md) |
