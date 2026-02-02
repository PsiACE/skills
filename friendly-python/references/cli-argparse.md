---
urls:
  - https://frostming.com/posts/2021/11-23/advanced-argparse/
---

# CLI Design with argparse

## Goals

- Separate structured input parsing from business logic.
- Keep subcommands extensible and testable.

## Guidance

- Parse arguments in one layer, execute logic in another.
- Organize subcommands as classes or a registry.
- Instantiate command objects during parsing to inject context.
- Provide defaults and help text for common paths.

## Example

Define commands as classes with explicit arguments:

```python
class Command:
    """Base class"""
    def add_arguments(self, parser):
        pass  # Optional: no arguments

class GreetCommand(Command):
    """greet command"""
    def add_arguments(self, parser):
        parser.add_argument('-n', '--name', default='John Doe', help='name of the person to greet')
```

Register subcommands and bind handlers:

```python
for name, command in subcommands.items():
    cmd_instance = command()
    subparser = subparsers.add_parser(cmd_instance.name)
    subparser.set_defaults(handle=cmd_instance.handle)
    cmd_instance.add_arguments(subparser)
```
