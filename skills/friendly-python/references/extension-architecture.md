---
urls:
  - https://frostming.com/posts/2021/07-07/friendly-python-1/
---

# Extension Architecture

## Goals

- Extension changes should be predictable and localized.
- New features should not break stable paths.

## Guidance

- Use a registry or mapping instead of long if-else chains.
- Expose extension points as explicit interfaces.
- Keep the default path simple; add extensions as optional paths.
- If you use plugin loading, define when and how it loads.

## Example

A growing if-else chain spreads change across the core path:

```python
# main.py
import itertools
from sources import HNSource, V2Source, RedditSource

class NewsGrabber:
    def get_news(self, source: Optional[str] = None) -> Iterable[News]:
        if source is None:
            return itertools.chain(HNSource().iter_news(), V2Source().iter_news(), RedditSource().iter_news())
        if source == 'HN':
            return HNSource().iter_news()
        elif source == 'V2':
            return V2Source().iternews()
        elif source == 'Reddit':
            return RedditSource().iternews()
        else:
            raise ValueError(f"Not supported source: {source}")
```

A registry centralizes extension points:

```python
# sources/base.py
source_map: Dict[str, BaseSource] = {}

def register(source_cls):
    source_map[source_cls.name] = source_cls()
    return source_cls
```

```python
# sources/hn.py
from sources.base import BaseSource, register

@register
class HNSource(BaseSource):
    name = "HN"

    # omitted
```
