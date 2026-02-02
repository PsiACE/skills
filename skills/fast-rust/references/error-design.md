---
urls:
  - https://fast.github.io/blog/stop-forwarding-errors-start-designing-them/
---

# Error Design

## Goals

- Make error types express domain boundaries and caller responsibility.
- Control error visibility to avoid leaking internal details.
- Preserve diagnostic context for debugging and tracing.

## Guidance

- Define error semantics and layers before choosing where to use `?`.
- Map errors at boundaries instead of forwarding everything upward.
- Treat public error enums as contracts; avoid frequent breaking changes.
- Design stable tests and assertions for critical failure paths.
- Design for two audiences: machines need flat, actionable kinds; humans need rich context.
- Prefer error kinds based on caller action (retry, not found, invalid input) over dependency origin.
- Make context capture low-friction and consistent at module boundaries.

## Anti-Patterns

Origin-based enums that mirror dependencies and forward without context:

```rust
#[derive(Debug, thiserror::Error)]
pub enum ServiceError {
    #[error("db error: {0}")]
    Db(#[from] sqlx::Error),
    #[error("http error: {0}")]
    Http(#[from] reqwest::Error),
}

pub fn handle(req: Request) -> Result<Response, ServiceError> {
    let user = db_get(req.user_id)?;
    let data = fetch_api(user.api_key)?;
    Ok(render(data)?)
}
```

## Positive Patterns

Actionable error kinds plus low-friction context at boundaries:

```rust
#[derive(Debug, Clone, Copy)]
pub enum ErrorKind {
    NotFound,
    RateLimited,
    InvalidInput,
    Temporary,
}

#[derive(Debug)]
pub struct AppError {
    kind: ErrorKind,
    message: String,
}

impl AppError {
    pub fn new(kind: ErrorKind, message: impl Into<String>) -> Self {
        Self { kind, message: message.into() }
    }
}

pub fn fetch_user(id: &str) -> Result<User, AppError> {
    let raw = call_upstream(id)
        .map_err(|_| AppError::new(ErrorKind::Temporary, format!("fetch_user {id}")))?;
    parse_user(&raw)
        .map_err(|_| AppError::new(ErrorKind::NotFound, format!("user {id}")))
}
```
