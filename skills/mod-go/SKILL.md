---
name: mod-go
description: Practical guidance for Go module and package design with minimal public APIs, single-responsibility boundaries, stateless-first implementation, one-way state flow, and orchestration-to-capability decomposition. Use when creating, refactoring, or reviewing Go architecture, package boundaries, interfaces, reusable utility packages, managers, builders, and execution flows.
---

# mod-go

Concise guidance for designing Go modules that stay small, focused, and easy to evolve.

## Purpose and Triggers

- Use for Go module or package design, refactoring, and code review.
- Focus on API surface, responsibility boundaries, state handling, and flow decomposition.
- Use when deciding whether logic should stay local, move to `xxxutil`, or become a `Manager` or `Builder` abstraction.
- Prefer explicit boundaries over convenience exports.

## Decision Order

1. Keep public surface minimal and intentional.
2. One package, one responsibility.
3. Stateless functions before stateful objects.
4. If state is required, prefer one-way state flow.
5. Allow extra exports only for stable contracts.
6. Keep orchestration separate from atomic capability methods.
7. Extract pure helpers into `xxxutil` packages only when reuse across packages is real.
8. For lifecycle-managed work, use an `XXXManager` (for example, `SessionManager`) with ID-addressable operations.
9. For complex parameter sets, provide a dedicated `Builder` type (for example, `QemuArgsBuilder`).
10. Keep gRPC/HTTP handlers thin: avoid business logic and delegate to injected `XXXManager` or domain `XXXHandler` dependencies.
11. Prefer context-driven shutdown; expose explicit `Close()` methods only for external contracts.

## Workflow

1. Define one package responsibility.
2. Expose one obvious primary entry point (type, interface, or function).
3. Keep helpers local and unexported unless cross-package reuse clearly justifies an `xxxutil` package.
4. Export additional symbols only when they are stable domain contracts.
5. Choose the smallest fitting abstraction: stateless functions, `XXXManager`, or `Builder`.
6. Keep transport handlers focused on input/output type conversion and protocol mapping.
7. Compose orchestration from focused functions.
8. Re-check the package against the review bullets in references.

## Topics

| Topic | Guidance | Reference |
| --- | --- | --- |
| Module Boundary | Expose minimal API and separate deep vs wide interfaces | [references/module-boundary.md](references/module-boundary.md) |
| State Flow | Use stateless functions and one-shot state objects | [references/state-flow.md](references/state-flow.md) |
| Orchestration | Use a single public executor and internal helpers | [references/orchestration.md](references/orchestration.md) |
| Review Checklist | Run a fast architecture sanity check before merge | [references/review-checklist.md](references/review-checklist.md) |

## References

- Reference files are intentionally short and task-focused.
- Source links are listed in each reference file frontmatter `urls`.
