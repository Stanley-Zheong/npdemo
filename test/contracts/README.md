# Automation Contracts

Each file in this directory owns one executable primary claim. A contract must
not combine unrelated permissions, data mutations, UI behavior, and integration
behavior in one case.

When one product behavior has success and failure UI states, each state gets a
separate contract and spec assertion. A passing-path contract must not accept a
failure message as successful evidence.

Required fields:

```yaml
case_id:
claim:
fixture:
actions:
oracle:
negative_oracle:
cleanup:
environment:
isolation:
known_issues:
generation_ready: true | false
not_ready_reason:
```

`generation_ready: true` means the referenced product behavior, fixture,
readback, cleanup, and isolation are all concrete enough for spec generation.
