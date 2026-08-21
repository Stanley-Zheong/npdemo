# Architecture

`npdemo` is a monorepo containing two independently testable applications:

- `backend`: Spring Boot owns server behavior and JSON endpoints under `/api`.
- `frontend`: Vue 3 owns browser behavior and consumes the relative `/api` base path.

Vite proxies API calls during development. The production Docker build copies the frontend bundle into Spring Boot static resources, producing one deployable process and one public port.

The initial `GET /api/health` vertical slice proves routing, serialization, frontend request and failure handling, automated tests, and production packaging without inventing a business domain.

Add backend packages by business feature, database migrations with the first persisted object, Vue routes when user workflows need stable URLs, and authentication only after roles and permissions are specified.
