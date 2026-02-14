---
urls:
  - https://grpc.io/docs/languages/go/basics/
  - https://go.dev/blog/context
---

# gRPC Practices

## Goals

- Keep transport concerns isolated from domain logic.
- Make gRPC services easy to test without starting a real server.

## Guidance

- GRPC service impls are translators: unmarshal request, call domain service, marshal response.
- Keep all business decisions in injected `XXXManager` or domain `XXXHandler` dependencies, not in the GRPC service.go itself.
- Convert domain errors to gRPC status codes at the handler boundary in one centralized place.
- Use `context.Context` from the incoming RPC for cancellation and deadline propagation; do not create detached contexts.
- When handlers accumulate enough complexity, extract them into a dedicated package alongside the server definition.
- Let server initialization & GRPC service impl to be different packages: server package focus on dependency injection & initialization, service package focus on request / response translation.
- Register services through a constructor that accepts domain dependencies explicitly; avoid global state or init-time registration.

## Structuring a gRPC Package

- `server.go`: Server constructor, listener setup, graceful shutdown.
- `service.go`: Handler methods implementing the generated interface.
- Keep proto-generated code in its own module or a `proto/` subdirectory; do not mix generated and hand-written code.

## Review Bullets

- Does each handler method fit the pattern: unmarshal → delegate → marshal?
- Is business logic free of any gRPC-specific types (`codes`, `status`, proto messages)?
- Is error-to-status conversion centralized rather than scattered across handlers?
- Are domain dependencies injected via the constructor, not accessed through globals?
- Is `context.Context` from the RPC propagated to downstream calls?
