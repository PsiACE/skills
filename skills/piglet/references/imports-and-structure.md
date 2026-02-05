---
urls:
  - https://github.com/piglei/one-python-craftsman/blob/master/zh_CN/9-a-story-on-cyclic-imports.md
---

# Imports and Dependencies

## Guidance
- Avoid cyclic imports by moving imports inside functions or methods.
- Keep module boundaries clear to prevent mutual dependency.

## Bad Example

```python
# users.py
from .marketing import send_sms

class User:
    def add_notification(self, message, enable_sms=False):
        if enable_sms:
            send_sms(self.mobile_number, message)
```

```python
# marketing.py
from .users import User


def query_user_points(users):
    pass
```

## Good Example

```python
# users.py
class User:
    def add_notification(self, message, enable_sms=False):
        if enable_sms:
            from .marketing import send_sms
            send_sms(self.mobile_number, message)
```
