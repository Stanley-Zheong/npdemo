# Coding agent guide

## Purpose

Keep this repository a small, conventional Java/Vue application. Build only behavior backed by an issue or accepted specification. Prefer a complete vertical slice over speculative abstractions and placeholder modules.

## Ownership

- `backend/` owns HTTP contracts, validation, application behavior, persistence, security, and server configuration.
- `frontend/` owns browser behavior, presentation, client-side state, and API consumption.
- `docs/` owns durable architecture and developer guidance.
- Public endpoints live below `/api`; update tests and documentation with contract changes.
- Never commit credentials, generated output, IDE state, `node_modules`, or Maven `target` directories.

## Workflow

1. Read the issue, nearby code, and nearest tests before editing.
2. Record assumptions. Ask the owner before changing permissions, data ownership, destructive behavior, or a public contract without a specification.
3. Change the smallest owning boundary; do not add dependencies or extension points for hypothetical reuse.
4. Add or update the closest test that proves the behavior.
5. Run focused checks, then `make test`; run `make build` for structural or dependency changes.
6. Keep README and architecture documentation aligned with commands, configuration, and layout.

## Conventions

- Java: constructor injection, immutable data where practical, records for small DTOs, thin controllers, and feature packages as business capabilities appear.
- Vue/TypeScript: `<script setup lang="ts">`, typed API results, explicit loading/error states, and small components. Add global state only when shared mutable state exists.
- Tests: assert observable outcomes and avoid real networks, timing assumptions, and machine-specific state.

## Definition of done

- Requested behavior and its relevant failure path are covered.
- `make test` passes; `make build` passes when applicable.
- No secret, generated output, debug artifact, or unrelated refactor is included.
- Documentation remains accurate.
