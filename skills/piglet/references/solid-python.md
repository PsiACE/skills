---
urls:
  - https://github.com/piglei/one-python-craftsman/blob/master/zh_CN/12-write-solid-python-codes-part-1.md
  - https://github.com/piglei/one-python-craftsman/blob/master/zh_CN/13-write-solid-python-codes-part-2.md
  - https://github.com/piglei/one-python-craftsman/blob/master/zh_CN/14-write-solid-python-codes-part-3.md
---

# SOLID in Python

## Guidance
- Single responsibility: keep classes and functions focused.
- Open/closed: extend behavior without rewriting consumers.
- Liskov substitution: subclasses must be safely substitutable.
- Interface segregation: avoid forcing clients to depend on unused methods.
- Dependency inversion: depend on abstractions, not concrete details.

## Bad Example

```python
class User(Model):
    def __init__(self, username: str):
        self.username = username

    def deactivate(self):
        self.is_active = False
        self.save()


class Admin(User):
    def deactivate(self):
        raise RuntimeError("admin can not be deactivated!")
```

## Good Example

```python
class User(Model):
    def __init__(self, username: str):
        self.username = username

    def allow_deactivate(self) -> bool:
        return True

    def deactivate(self):
        self.is_active = False
        self.save()


class Admin(User):
    def allow_deactivate(self) -> bool:
        return False


def deactivate_users(users):
    for user in users:
        if not user.allow_deactivate():
            logger.info(
                f"user {user.username} does not allow deactivating, skip."
            )
            continue
        user.deactivate()
```
