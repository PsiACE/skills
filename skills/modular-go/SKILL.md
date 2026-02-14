---
name: modular-go
description: Practical guidance for Go package design with minimal public APIs, single-responsibility boundaries, stateless-first flow, one-way state transitions, and orchestration-to-capability separation. Use when creating, refactoring, or reviewing Go architecture, package boundaries, interfaces, handlers, managers, builders, and execution flows.
---

# modular-go

Concise guidance for designing Go packages that stay small, focused, and easy to evolve.

## Purpose and Triggers

- Use for Go package design, refactoring, and code review.
- Focus on API boundaries, state modeling, and flow decomposition.
- Use when deciding the right abstraction level: local helper, utility package, manager, or builder.
- Prefer explicit boundaries over convenience exports.

## Design Principles

1. Every export is a promise — keep the public surface minimal and intentional.
2. One package, one responsibility you can explain in one sentence.
3. Depth over breadth — narrow interfaces that hide rich implementations outlast wide, shallow ones.
4. Stateless by default — treat mutable state as liability that must justify its lifecycle cost.
5. Split along responsibility seams, not file size — every new boundary must earn its indirection cost.
6. Orchestration tells the story; capability methods do the work.
7. Boundaries are translation layers — convert errors, types, and protocols at the edges, not in core logic.
8. Choose the smallest abstraction that solves the real problem; resist premature generalization.
9. Lifecycle is a first-class design concern — design shutdown paths alongside startup paths.

## Workflow

1. Define one package responsibility.
2. Expose one obvious primary entry point (type, interface, or function).
3. Keep helpers local by default; extract to `xxxutil` only for real cross-package reuse.
4. Keep transport handlers focused on protocol mapping and delegate behavior to injected dependencies.
5. Compose orchestration from focused functions, with short stage-intent comments.
6. Re-evaluate boundaries when a package can no longer be explained in one sentence.
7. Re-check against the reference checklists before merge.

## Topics

| Topic | Guidance | Reference |
| --- | --- | --- |
| Module Boundary | Expose minimal API and separate deep vs wide interfaces | [references/module-boundary.md](references/module-boundary.md) |
| State Flow | Use stateless functions and one-shot state objects | [references/state-flow.md](references/state-flow.md) |
| Orchestration | Use a single public executor and internal helpers | [references/orchestration.md](references/orchestration.md) |
| gRPC Practices | Keep handlers as thin translators; isolate transport from domain | [references/grpc-practices.md](references/grpc-practices.md) |
| Review Checklist | Run a fast architecture sanity check before merge | [references/review-checklist.md](references/review-checklist.md) |

## References

- Reference files are intentionally short and task-focused.
- Source links are listed in each reference file frontmatter `urls`.
