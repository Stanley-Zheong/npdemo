# Health Smoke Coverage

The health smoke suite is the only executable end-to-end automation slice in
this repository today. It proves the QA asset lifecycle without claiming V1
business behavior.

| Case | Contract | Spec assertion | Execution gate |
| --- | --- | --- | --- |
| HEALTH-001 | `test/contracts/health-001.yaml` | `test/specs/health-smoke.spec.ts` checks the backend `/api/health` payload directly on the configured API port. | `make qa-health` and CI `playwright-health` |
| HEALTH-002 | `test/contracts/health-002.yaml` | `test/specs/health-smoke.spec.ts` checks the healthy frontend status text. | `make qa-health` and CI `playwright-health` |
| HEALTH-003 | `test/contracts/health-003.yaml` | `test/specs/health-smoke.spec.ts` aborts `/api/health` and checks the unavailable frontend status text. | `make qa-health` and CI `playwright-health` |

V1 cases in `docs/hs-test-cases-all/online-learning-exam-system.md` remain in
contract review until the product behavior, fixture ownership, cleanup, and
strong readback commands exist.
