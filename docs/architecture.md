# Architecture

`npdemo` is a monorepo containing two independently testable applications:

- `backend`: Spring Boot owns server behavior and JSON endpoints under `/api`.
- `frontend`: Vue 3 owns browser behavior and consumes the relative `/api` base path.

Vite proxies API calls during development. The production Docker build copies the frontend bundle into Spring Boot static resources, producing one deployable process and one public port.

The initial `GET /api/health` vertical slice proves routing, serialization, frontend request and failure handling, automated tests, and production packaging without inventing a business domain.

Verification commands use repository-owned dependency caches. Maven reads
`backend/.mvn/maven.config`, which points at `../.cache/maven` from the backend
project, and frontend npm commands in `Makefile` use `.cache/npm`. These caches
are local generated state and are not part of source control, but they keep
managed QA runs isolated from shared host cache corruption.

QA automation assets live under `test/`. Canonical testcase prose remains in
`docs/hs-test-cases-all/`; `test/contracts/` records executable claim contracts,
`test/fixtures/` records data ownership and cleanup, `test/specs/` owns
Playwright specs, and `sbin/skill-asset-query.mjs` provides bounded evidence
lookup for Jarvis test lifecycle stages. The Vite dev proxy defaults to
`http://localhost:8080` and can be redirected with `NPDEMO_API_PROXY_TARGET` for
isolated Playwright runs.

Add backend packages by business feature, database migrations with the first persisted object, Vue routes when user workflows need stable URLs, and authentication only after roles and permissions are specified.
