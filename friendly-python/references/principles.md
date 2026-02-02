---
urls:
  - https://frostming.com/posts/2021/07-07/friendly-python-1/
  - https://frostming.com/posts/2021/07-23/friendly-python-2/
---

# Core Principles

## Goals

- Newcomers should understand intent without hidden context.
- Future maintainers should find entry points and change locations quickly.
- The implementation should explain why it is written this way.

## Decision Order

1. Correctness and clear boundaries
2. Readability and maintainability
3. Extensibility and evolution cost
4. Performance and optimization

## Principles

- Prefer one obvious way; avoid multiple styles for the same task.
- Favor intent over cleverness.
- Reduce deep nesting; extract steps into small functions.
- Centralize change in a few extension points.
- Make inputs, outputs, errors, and state changes explicit.

## Example

A clear linear flow makes the program easy to follow:

```python
# main.py
class NewsGrabber:
    def get_news(self, source: Optional[str] = None) -> Iterable[News]:
        # TODO

    def format_news(self, news: Iterable[News]) -> str:
        result: List[str] = []
        for item in self.get_news():
            result.append(self._format_one_news(item))
        return '\n'.join(result)

    def send_message(self, message: str) -> None:
        channel = self._read_config()
        self._send_to_channel(message, channel)

    def run(self, source: Optional[str] = None) -> None:
        news = self.get_news()
        message = self.format_news(news)
        self.send_message(message)
```
