---
urls:
  - https://github.com/piglei/one-python-craftsman/blob/master/zh_CN/5-function-returning-tips.md
---

# Functions and Returns

## Guidance
- A function should have a single responsibility and a stable return type.
- Avoid returning error tuples in Python; raise exceptions instead.
- Use partial or small wrapper functions when you need specialized behavior.

## Bad Example

```python
def get_users(user_id=None):
    if user_id is not None:
        return User.get(user_id)
    return User.filter(is_active=True)
```

## Good Example

```python
def get_user_by_id(user_id):
    return User.get(user_id)


def get_active_users():
    return User.filter(is_active=True)
```

## Bad Example

```python
def create_item(name):
    if len(name) > MAX_LENGTH_OF_NAME:
        return None, "name of item is too long"
    if len(CURRENT_ITEMS) > MAX_ITEMS_QUOTA:
        return None, "items quota is full"
    return Item(name=name), ""
```

## Good Example

```python
class CreateItemError(Exception):
    """Raised when an item cannot be created."""


def create_item(name):
    if len(name) > MAX_LENGTH_OF_NAME:
        raise CreateItemError("name of item is too long")
    if len(CURRENT_ITEMS) > MAX_ITEMS_QUOTA:
        raise CreateItemError("items quota is full")
    return Item(name=name)
```
