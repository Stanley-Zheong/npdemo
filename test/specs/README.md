# Playwright Specs

`health-smoke.spec.ts` is the only current executable Playwright spec. It covers
the existing starter health vertical slice and maps to `HEALTH-001`,
`HEALTH-002`, and `HEALTH-003`.

Run it with:

```bash
make qa-health
```

V1 business specs must not be generated until their contract in
`test/contracts/` has `generation_ready: true`.
