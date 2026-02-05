---
urls:
  - https://github.com/piglei/one-python-craftsman/blob/master/zh_CN/1-using-variables-well.md
---

# Variables and Naming

## Guidance
- Use descriptive names. Avoid generic or overly short names.
- Hint types with naming conventions (is/has/allow for booleans).
- Keep names consistent and avoid reusing a name for different types.
- Avoid globals() and locals(); prefer explicit mappings.
- Define variables close to where they are used.

## Bad Example

```python
def render_trip_page(request, user_id, trip_id):
    user = User.objects.get(id=user_id)
    trip = get_object_or_404(Trip, pk=trip_id)
    suggested = is_suggested(user, trip)
    # Use locals() to save lines
    return render(request, "trip.html", locals())
```

## Good Example

```python
def render_trip_page(request, user_id, trip_id):
    user = User.objects.get(id=user_id)
    trip = get_object_or_404(Trip, pk=trip_id)
    suggested = is_suggested(user, trip)
    return render(request, "trip.html", {
        "user": user,
        "trip": trip,
        "is_suggested": suggested,
    })
```

## Naming Examples
- Bad: day, host, cards, temp
- Good: day_of_week, hosts_to_reboot, expired_cards
