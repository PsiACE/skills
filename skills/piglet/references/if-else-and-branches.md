---
urls:
  - https://github.com/piglei/one-python-craftsman/blob/master/zh_CN/2-if-else-block-secrets.md
---

# Branching and Conditions

## Guidance
- Avoid deep nesting; use early returns or raises.
- Extract complex conditions into named helpers.
- Watch for duplicated code across branches.

## Bad Example

```python
def buy_fruit(nerd, store):
    if store.is_open():
        if store.has_stocks("apple"):
            if nerd.can_afford(store.price("apple", amount=1)):
                nerd.buy(store, "apple", amount=1)
                return
            else:
                nerd.go_home_and_get_money()
                return buy_fruit(nerd, store)
        else:
            raise MadAtNoFruit("no apple in store!")
    else:
        raise MadAtNoFruit("store is closed!")
```

## Good Example

```python
def buy_fruit(nerd, store):
    if not store.is_open():
        raise MadAtNoFruit("store is closed!")

    if not store.has_stocks("apple"):
        raise MadAtNoFruit("no apple in store!")

    if nerd.can_afford(store.price("apple", amount=1)):
        nerd.buy(store, "apple", amount=1)
        return

    nerd.go_home_and_get_money()
    return buy_fruit(nerd, store)
```
