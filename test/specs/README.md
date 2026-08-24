# Playwright Specs

`health-smoke.spec.ts` covers `HEALTH-001`, `HEALTH-002`, and `HEALTH-003`.
`course-draft.spec.ts` covers the implemented business contracts `CRS-001A`
and `CRS-001B` with API readback. It requires a run-owned disposable database
because the current product contract has no draft-delete API.

Run it with:

```bash
make qa-health
make qa-course-draft
```

The course-draft target owns and disposes its local in-memory database. The
complete `npm run test:all` command is reserved for CI or an equivalent runner
that owns the PostgreSQL lifecycle.

V1 business specs must not be generated until their contract in
`test/contracts/` has `generation_ready: true`.
