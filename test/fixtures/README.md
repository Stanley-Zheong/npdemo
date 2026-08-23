# Fixture Ownership

Current executable fixture:

| Fixture | Owner | Mutation | Readback | Cleanup | Parallel isolation |
| --- | --- | --- | --- | --- | --- |
| health-api | backend runtime | none | `/api/health` response body | none | worker-safe |
| health-ui-success | frontend runtime + backend runtime | none | frontend status text `npdemo-api is UP` | none | worker-safe |
| health-ui-api-failure | Playwright page route | none | frontend status text `API is unavailable` | route abort scoped to page | worker-safe |

Business fixtures are not approved yet. Each future fixture must record:

- template object or factory name;
- owning case ID and worker/run ID suffix;
- create command;
- strong readback command;
- cleanup or restore command;
- resources that must not be shared across parallel workers.
