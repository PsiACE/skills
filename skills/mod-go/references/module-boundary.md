# Module Boundary

## Goals

- Keep each package easy to understand at a glance.
- Reduce change impact by shrinking the exported surface.
- Make responsibilities discoverable from package names and public types.

## Guidance

- Expose one obvious primary entry point per package.
- Let the primary entry point be an exported type, interface, or function.
- Export functions only when they are true entry points for callers.
- Keep helper types, parsing details, and validation internals unexported.
- Export additional symbols only when they represent stable domain contracts
  (for example: error kinds, option types, small value objects).
- Prefer a deep module with a narrow API over a wide module with many public knobs.
- Keep runtime contracts in narrow interfaces, and isolate concrete infrastructure in separate implementation files or packages.
- When constructor parameters grow, prefer a constructor plus option functions for extensibility and stable call sites.
- If pure helper functions can be grouped by concern, place them in an `xxxutil` package.
- Keep `xxxutil` packages stateless: no stateful structs, only pure utility functions.
- For APIs with complex parameter groups, expose a dedicated `Builder` type (for example, `QemuArgsBuilder`) to assemble validated options.

## Deep vs Wide Interfaces

- Deep interface: few operations, high leverage, business-oriented semantics, stable over time.
- Wide interface: many operations, adapter-oriented semantics, integration details exposed.
- Keep deep interfaces in core packages.
- Keep wide interfaces at boundaries (transport, storage, SDK adapters).

## Review Bullets

- Can a new reader identify package responsibility in one sentence?
- Is there one obvious primary entry point?
- Is every additional exported symbol a stable contract?
- Can internal helpers be moved behind unexported boundaries?
- Does the package expose behavior contracts rather than assembly details?
- Are interfaces focused on behavior while implementation details stay behind constructors?
- If an `xxxutil` package exists, does it avoid stateful structs?
- If parameters are complex or coupled, would a `Builder` make construction clearer and safer?
