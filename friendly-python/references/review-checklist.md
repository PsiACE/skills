---
urls:
  - https://frostming.com/posts/2021/07-07/friendly-python-1/
  - https://frostming.com/posts/2021/07-23/friendly-python-2/
  - https://frostming.com/posts/2022/friendly-python-oop/
  - https://frostming.com/posts/2024/friendly-python-reuse/
  - https://frostming.com/posts/2025/friendly-python-port/
  - https://frostming.com/posts/2021/11-23/advanced-argparse/
---

# Review Checklist

## Core Questions

- Does naming reflect domain intent?
- Are there unnecessary cross-layer dependencies?
- Is there a clearer data structure choice?
- Is there over-abstraction or hidden magic?
- Does error handling preserve context?
- Do new features require edits in too many places?
- Is the entry point obvious for users?
- Are changes localized and reversible?

## Example

A growing if-else chain signals scattered change points:

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
