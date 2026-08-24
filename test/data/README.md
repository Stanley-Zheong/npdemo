# Test Data Scripts

`course-draft.ts` generates case/run/worker-scoped input for `CRS-001A` and
`CRS-001B`. The owning specs create the rows through the public API and read
them back by returned ID. These mutating cases run only against a database
owned and disposed by the current test run.

Future data scripts must live beside a reviewed contract and include:

- owned case IDs;
- created object graph;
- run ID naming rule;
- readback query;
- cleanup command;
- environment limitations.
