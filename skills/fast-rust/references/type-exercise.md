---
urls:
  - https://github.com/skyzh/type-exercise-in-rust
---

# Type Exercise

## Core Goals

- Shift runtime branching into compile-time structure when the set of types and operations is known.
- Encode the cross-product of data representations and operations using associated types, GATs, and macros.
- Keep extensibility without relying on large, monolithic enum-based dispatch trees.

## Key Patterns

- **Reciprocal abstractions**: pair owners and builders (or owned and borrowed views) with associated types that bind views to owners.
- **GAT-based views**: unify fixed-width and variable-width references via a single `RefItem<'a>`-style projection.
- **Macro-driven dispatch**: generate repetitive branches with declarative macros while keeping core logic readable.
- **Semantic-to-representation mapping**: encode semantic types to physical representations through compile-time mappings.

## Design Checks

- Decide which APIs are zero-copy views and which are allocation or conversion boundaries.
- Keep associated type semantics stable to reduce churn in generic signatures.
- Use macros only for repetition; keep algorithms and invariants visible and testable.

## Common Pitfalls

- Over-constraining lifetimes in `RefItem<'a>`, which can explode trait bounds.
- Mixing enum dispatch with type dispatch, losing type information while duplicating branches.
- Pushing GATs too deep in the type graph, leading to steep compile-time costs.

## Example (validated with Rust)

```rust
use std::borrow::Cow;

trait Array {
    type Item;
    type RefItem<'a>
    where
        Self: 'a;
    type Builder: ArrayBuilder<Array = Self>;

    fn len(&self) -> usize;
    fn get(&self, idx: usize) -> Option<Self::RefItem<'_>>;
}

trait ArrayBuilder {
    type Array: Array;

    fn with_capacity(capacity: usize) -> Self;
    fn push(&mut self, item: Option<<Self::Array as Array>::RefItem<'_>>);
    fn finish(self) -> Self::Array;
}

#[derive(Debug, PartialEq, Eq)]
struct I32Array {
    data: Vec<Option<i32>>,
}

struct I32ArrayBuilder {
    data: Vec<Option<i32>>,
}

impl Array for I32Array {
    type Item = i32;
    type RefItem<'a> = i32 where Self: 'a;
    type Builder = I32ArrayBuilder;

    fn len(&self) -> usize {
        self.data.len()
    }

    fn get(&self, idx: usize) -> Option<Self::RefItem<'_>> {
        self.data[idx]
    }
}

impl ArrayBuilder for I32ArrayBuilder {
    type Array = I32Array;

    fn with_capacity(capacity: usize) -> Self {
        Self {
            data: Vec::with_capacity(capacity),
        }
    }

    fn push(&mut self, item: Option<<Self::Array as Array>::RefItem<'_>>) {
        self.data.push(item);
    }

    fn finish(self) -> Self::Array {
        I32Array { data: self.data }
    }
}

#[derive(Debug, PartialEq, Eq)]
struct StringArray {
    data: Vec<Option<String>>,
}

struct StringArrayBuilder {
    data: Vec<Option<String>>,
}

impl Array for StringArray {
    type Item = String;
    type RefItem<'a> = &'a str where Self: 'a;
    type Builder = StringArrayBuilder;

    fn len(&self) -> usize {
        self.data.len()
    }

    fn get(&self, idx: usize) -> Option<Self::RefItem<'_>> {
        self.data[idx].as_deref()
    }
}

impl ArrayBuilder for StringArrayBuilder {
    type Array = StringArray;

    fn with_capacity(capacity: usize) -> Self {
        Self {
            data: Vec::with_capacity(capacity),
        }
    }

    fn push(&mut self, item: Option<<Self::Array as Array>::RefItem<'_>>) {
        self.data.push(item.map(|value| value.to_owned()));
    }

    fn finish(self) -> Self::Array {
        StringArray { data: self.data }
    }
}

fn build_array_from_vec<A>(items: &[Option<A::RefItem<'_>>]) -> A
where
    A: Array,
    for<'a> A::RefItem<'a>: Copy,
{
    let mut builder = A::Builder::with_capacity(items.len());
    for item in items {
        builder.push(*item);
    }
    builder.finish()
}

fn main() {
    let ints = vec![Some(1), Some(2), None, Some(4)];
    let int_array = build_array_from_vec::<I32Array>(&ints);
    assert_eq!(int_array.len(), 4);
    assert_eq!(int_array.get(1), Some(2));

    let strings = vec![Some("a"), None, Some("b")];
    let str_array = build_array_from_vec::<StringArray>(&strings);
    assert_eq!(str_array.len(), 3);
    assert_eq!(str_array.get(2), Some("b"));

    let borrowed: Option<&str> = str_array.get(0);
    let owned: Cow<'_, str> = borrowed.map(Cow::from).unwrap_or_default();
    assert_eq!(owned, "a");
}
```

## Validation Notes

- If you add a non-`Copy` view type, change the builder to accept references instead of copying values.
- When mapping semantic types to representations, prefer macro-generated mappings and keep conversion logic explicit.
