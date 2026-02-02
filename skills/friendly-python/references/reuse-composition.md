---
urls:
  - https://frostming.com/posts/2024/friendly-python-reuse/
---

# Reuse and Composition

## Goals

- Balance reuse with readability.
- Avoid unnecessary layers.

## Guidance

- Prefer thin wrappers and composition.
- Use existing extension points before inventing new ones.
- Preserve error context; avoid double serialization.

## Example

Use requests' auth hook instead of duplicating request logic:

```python
class AuthBase:
    """Base class that all auth implementations derive from"""

    def __call__(self, r):
        raise NotImplementedError("Auth hooks must be callable.")
```

```python
class VolcAuth(AuthBase):
    def __init__(self, service_info, credentials):
        self.service_info = service_info
        self.credentials = credentials

    def __call__(self, r):
        # new_sign omitted
        new_sign(r, self.service_info, self.credentials)
        return r
```

```python
auth = VolcAuth(service_info, credentials)
res = requests.post(url, json=body, auth=auth)
```
