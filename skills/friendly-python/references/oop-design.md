---
urls:
  - https://frostming.com/posts/2022/friendly-python-oop/
---

# OOP Design

## Goals

- Construction paths should be explicit and unambiguous.
- Avoid leaking internal mechanics to callers.

## Guidance

- Avoid piling mutually exclusive flags in `__init__`.
- Use `@classmethod` or standalone factories for alternate construction.
- Prefer explicit fields; use descriptors when you need DRY plus IDE hints.
- Avoid exposing metaclasses or internal registries to users.

## Example

Multiple switches in `__init__` quickly become unclear:

```python
class Settings:
    ...
    def __init__(self, **kwargs, from_env=False, from_file=None):
        if from_env:
            self._load_from_env()
        elif from_file:
            self._load_from_file(from_file)
        else:
            for k, v in kwargs.items():
                setattr(self, k, v)
```

Descriptors make configuration explicit without hiding behavior:

```python
class ConfigItem:
    def __set_name__(self, owner, name):
        self.name = name
        self.env_name = "CONFIG_" + name.upper()

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return instance._data[self.name] or os.getenv(self.env_name)

# Usage
class Settings:
    db_url = ConfigItem()
    db_password = ConfigItem()
    ...
```

```python
class Settings:

    db_user = ConfigItem()

    @ConfigItem
    def db_password(self, value):
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters")
        return value
```
