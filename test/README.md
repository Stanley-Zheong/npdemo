# QA Automation Assets

This directory is the handoff area for issue #7 test automation work.

Current state:

- `contracts/` contains source-backed automation contracts.
- `fixtures/` records fixture ownership, isolation, readback, and cleanup rules.
- `specs/` contains Playwright specs that are safe to generate or run.
- `data/` contains test data builders and manifests.

`HEALTH-001`, `HEALTH-002`, `HEALTH-003`, `CRS-001A`, and `CRS-001B` are
generation-ready. The course-draft cases cover the implemented create/read,
unique-code, and owned-draft cleanup behavior. Other V1 business cases in
`docs/hs-test-cases-all/online-learning-exam-system.md` stay blocked until the
matching API/UI behavior exists and their contract is approved.

Useful commands:

```bash
make qa-assets
make qa-health
make qa-course-draft
node --test test/asset-query.test.mjs
```

The QA commands install the test package dependencies and run either one suite
or all executable contracts. They remain separate from `make test` because they
start browser and application processes. CI uses PostgreSQL for parity; the
controlled local business runner uses an owned in-memory H2 database.

`make qa-course-draft` starts a test-classpath Spring process with an in-memory
H2 database, runs the two business specs, and stops that process on every exit
path. The specs reject direct execution unless the controlled runner or CI marks
the database as disposable. CI runs `npm run test:all` against its job-owned
PostgreSQL service.
