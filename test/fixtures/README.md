# Fixture Ownership

Current executable fixture:

| Fixture | Owner | Mutation | Readback | Cleanup | Parallel isolation |
| --- | --- | --- | --- | --- | --- |
| health-service | application runtime | none | `/api/health` and frontend status text | none | worker-safe |

Business fixtures are not approved yet. Each future fixture must record:

- template object or factory name;
- owning case ID and worker/run ID suffix;
- create command;
- strong readback command;
- cleanup or restore command;
- resources that must not be shared across parallel workers.
