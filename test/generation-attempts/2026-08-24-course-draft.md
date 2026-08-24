# Course Draft Generation Attempt - 2026-08-24

## Inputs

- Testcases: `CRS-001A`, `CRS-001B`
- Contracts: `test/contracts/crs-001a.yaml`, `test/contracts/crs-001b.yaml`
- Fixture register: `test/fixtures/README.md`
- Data builder: `test/data/course-draft.ts`
- Target spec: `test/specs/course-draft.spec.ts`

## Coverage

- `CRS-001A`: create response and independent GET persistence readback.
- `CRS-001B`: duplicate-code conflict and full original-row business-field
  readback after rejection.
- Not covered: publishing, authorization, materials, questions, exams, or
  concurrent duplicate requests.
- Cleanup: the suite is admitted only to a run-owned disposable database; no
  shared staging database is eligible for these mutating specs.

## Gates

- Static/type gate: Playwright test listing and TypeScript compilation.
- Runtime gate: exact spec with two workers against PostgreSQL.
- Repository gate: `make test`; no product API or dependency changes.

The runtime result is recorded in the delivery artifact; this file describes
the repeatable gate rather than a branch-specific pass status.
