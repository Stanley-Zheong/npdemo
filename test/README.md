# QA Automation Assets

This directory is the handoff area for issue #7 test automation work.

Current state:

- `contracts/` contains source-backed automation contracts.
- `fixtures/` records fixture ownership, isolation, readback, and cleanup rules.
- `specs/` contains Playwright specs that are safe to generate or run.
- `data/` contains test data builders and manifests.

Only `HEALTH-001` is generation-ready today because the repository currently
implements only the `/api/health` vertical slice. V1 business cases in
`docs/hs-test-cases-all/online-learning-exam-system.md` stay blocked until the
matching API/UI behavior exists and their contract is approved.

Useful commands:

```bash
make qa-assets
node --test test/asset-query.test.mjs
```

Playwright specs require a running app and Playwright installation in the test
environment. They are not part of `make test` until a business slice and its
environment contract are ready.
