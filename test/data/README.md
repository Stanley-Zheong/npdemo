# Test Data Scripts

No V1 business data script is generation-ready yet. The current repository has
only read-only health smoke fixtures plus a Playwright-scoped network failure
fixture, so data mutation scripts would be placeholders rather than executable
evidence.

Future data scripts must live beside a reviewed contract and include:

- owned case IDs;
- created object graph;
- run ID naming rule;
- readback query;
- cleanup command;
- environment limitations.
