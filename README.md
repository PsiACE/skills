# PsiACE/Skills

A personal collection of reusable engineering practices and preferences.

## Installation

```bash
pnpx skills add PsiACE/skills --skill='*'
```

Or install globally:

```bash
pnpx skills add PsiACE/skills --skill='*' -g
```

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

Online docs:
https://skills.psiace.me/

## Skills

| Skill | Description |
| --- | --- |
| [friendly-python](skills/friendly-python/SKILL.md) | Practical guidance for writing, refactoring, and reviewing friendly Python code |
| [fast-rust](skills/fast-rust/SKILL.md) | Practical guidance for writing, refactoring, and reviewing fast, reliable, and maintainable Rust code |

## Notes

- This is a personal collection and may change without notice.
