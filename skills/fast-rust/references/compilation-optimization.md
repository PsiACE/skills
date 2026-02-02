---
urls:
  - https://www.databend.com/blog/category-product/2023-04-20-optimizing-compilation-for-databend/
  - https://www.databend.com/blog/category-engineering/profile-guided-optimization/
---

# Compilation Optimization

## Goals

- Reduce edit-build-test latency in day-to-day development.
- Improve release performance with safe, measurable build changes.

## Measure First

- Use `cargo build --timings` to visualize compile time hot spots.
- For Rust 1.59 or earlier: `cargo +nightly build -Ztimings`.
- Inspect the HTML Gantt chart to decide on crate splitting or `codegen-units` tuning.

## Dependency Hygiene

- Remove unused dependencies; `cargo-udeps` is accurate but slow, `cargo-machete` is fast but heuristic.
- Sparse index is the default for crates.io in modern Cargo; only configure it explicitly for older toolchains or when forcing `git`.

## Build Configuration

- Keep toolchains current; upstream improvements often reduce compile time.
- Prefer CI caches that are reliable (e.g., sccache); incremental builds often hurt clean CI due to extra IO and dependency tracking.
- Use a fast linker (for example, `mold`) for large dependency graphs:

```toml
[target.x86_64-unknown-linux-gnu]
linker = "clang"
rustflags = ["-C", "link-arg=-fuse-ld=/path/to/mold"]
```

- On macOS, set `split-debuginfo = "unpacked"` to skip `dsymutil`.
- For release builds, `codegen-units = 1` improves optimization; override per crate if codegen is too slow:

```toml
[profile.release.package]
arrow2 = { codegen-units = 4 }
```

## Workspace Structure and Tests

- Split oversized crates to improve parallelism and reduce cross-dependencies.
- Organize integration tests under `tests/it/` to avoid many small binaries.
- Consider disabling doc tests if they dominate compile time, but weigh the API visibility cost.
- Prefer golden-file or logic-test frameworks for large query/result suites.

## Minimal PGO Workflow

1. Install LLVM tools: `rustup component add llvm-tools-preview` (ensure `llvm-profdata` is on PATH).
2. Clean old data: `rm -rf /tmp/pgo-data`.
3. Use release builds for both instrumentation and final compile.
4. Build instrumented binaries:

```bash
RUSTFLAGS="-Cprofile-generate=/tmp/pgo-data" cargo build --release --target=x86_64-unknown-linux-gnu
```

5. Run a representative workload to generate `.profraw` files.
6. Merge profiles and rebuild:

```bash
llvm-profdata merge -o /tmp/pgo-data/merged.profdata /tmp/pgo-data
RUSTFLAGS="-Cprofile-use=/tmp/pgo-data/merged.profdata -Cllvm-args=-pgo-warn-missing-function" \
  cargo build --release --target=x86_64-unknown-linux-gnu
```

Keep the workload realistic; PGO quality depends on the fidelity of the profile data.
