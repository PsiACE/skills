---
urls:
  - https://github.com/piglei/one-python-craftsman/blob/master/zh_CN/6-three-rituals-of-exceptions-handling.md
---

# Exception Handling

## Guidance
- Catch only the exceptions you can handle.
- Keep try blocks narrow to avoid hiding unrelated bugs.
- Preserve context with specific exception types and messages.

## Bad Example

```python
def save_website_title(url, filename):
    try:
        resp = requests.get(url)
        obj = re.search(r"<title>(.*)</title>", resp.text)
        if not obj:
            print("save failed: title tag not found in page content")
            return False

        title = obj.grop(1)
        with open(filename, "w") as fp:
            fp.write(title)
            return True
    except Exception:
        print(f"save failed: unable to save title of {url} to {filename}")
        return False
```

## Good Example

```python
from requests.exceptions import RequestException


def save_website_title(url, filename):
    try:
        resp = requests.get(url)
    except RequestException as exc:
        print(f"save failed: unable to get page content: {exc}")
        return False

    obj = re.search(r"<title>(.*)</title>", resp.text)
    if not obj:
        print("save failed: title tag not found in page content")
        return False
    title = obj.group(1)

    try:
        with open(filename, "w") as fp:
            fp.write(title)
    except IOError as exc:
        print(f"save failed: unable to write to file {filename}: {exc}")
        return False
    else:
        return True
```
