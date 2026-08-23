# Health Smoke Generation Attempt - 2026-08-23

## Inputs

- Contracts: `HEALTH-001`, `HEALTH-002`, `HEALTH-003`
- Fixture register: `test/fixtures/README.md`
- Target spec: `test/specs/health-smoke.spec.ts`

## Result

Generated one Playwright spec with three independent assertions:

- API health payload
- frontend healthy state
- frontend unavailable state

Each assertion carries its case ID in the test title. The positive frontend
path rejects the unavailable message as success evidence.

## Gates

- Static asset gate: `node --test test/asset-query.test.mjs`
- Local executable gate: `make qa-health`
- CI executable gate: `playwright-health`

V1 business testcases were not generated in this attempt because their product
behavior and fixture contracts are not implemented.
