# PsiACE/Skills

A small, shared skill library by builders, for builders.

[This repo](https://github.com/psiace/skills) includes skills from me and my friends. The content comes from our own practice and selected public sources. Give them a try, read along, and enjoy the craft of building.

Online docs: https://skills.psiace.me/

## Installation

```bash
pnpx skills add PsiACE/skills --skill='*'
```

Or install globally:

```bash
pnpx skills add PsiACE/skills --skill='*' -g
```

## Skills

| Skill | Description |
| --- | --- |
| [friendly-python](skills/friendly-python/SKILL.md) | Practical guidance for writing, refactoring, and reviewing friendly Python code |
| [piglet](skills/piglet/SKILL.md) | Practical Python craftsmanship guidance based on One Python Craftsman |
| [fast-rust](skills/fast-rust/SKILL.md) | Practical guidance for writing, refactoring, and reviewing fast, reliable, and maintainable Rust code |

## Documentation

Install doc dependencies with uv and preview locally:

```bash
uv sync --group docs
uv run mkdocs serve -f mkdocs.yml
```

Build the static site:

```bash
uv run mkdocs build -f mkdocs.yml
```

## Notes

- This collection is small by design and may change as we learn.

## Acknowledgements

See [skills/ACKNOWLEDGEMENTS.md](skills/ACKNOWLEDGEMENTS.md).
