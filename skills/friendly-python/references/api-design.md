---
urls:
  - https://frostming.com/posts/2021/07-23/friendly-python-2/
---

# API and Entry-Point Design

## Goals

- Provide reasonable defaults for common use.
- Hide internal wiring; expose a small, clear entry point.
- Make resource lifecycles obvious.

## Guidance

- Offer a simple constructor for common cases.
- Allow limited multi-type parameters without overloading meaning.
- Keep the default usage to a few lines.

## Example

Too much manual wiring forces users to know internal objects:

```python
from awesome_sdk.client import AwesomeClient
from awesome_sdk.core.auth.basic import AwesomeBasicAuth
from awesome_sdk.core.connection.tcp import AwesomeTCPConnection

# Build an auth object
auth = AwesomeBasicAuth(username=os.getenv("USERNAME"), password=os.getenv("PASSWORD"))
# Build a connection
connection = AwesomeTCPConnection(host="127.0.0.1", port=5762, timeout=10, retry_times=3, auth=auth)
# Build a client
client = AwesomeClient(connection=connection, type="test", scope="read")
# Use client
print(client.get_resources())
# Close connection
connection.close()
```

A simpler entry point and context manager improve usability:

```python
from awesome_sdk import AwesomeClient

client = AwesomeClient(type="test", scope="read", auth=(os.getenv("USERNAME"), os.getenv("PASSWORD")))

with client.connect():
    print(client.get_resources())
```

Advanced auth can still be supported:

```python
client = AwesomeClient(..., auth=SSHAuth(...))
```
