# 系统测试用例

[online-learning-exam-system.md](online-learning-exam-system.md) 是 V1 系统测试基线。实现接口和页面后，自动化候选仍须补齐稳定元素、fixture 所有权、并行隔离、强回读和清理合同。

## 自动化交接边界

- 每个 canonical case 行只表达一个 primary claim。一个操作同时覆盖 API、UI、集成或安全面时，自动化合同必须拆成独立执行 owner，再用 traceability 关联。
- `Lane` 表示第一执行 owner，不表示已经自动化。当前允许值为 `API`、`UI`、`INT`、`SEC`、`PERF`、`RUNBOOK`。
- 进入 spec generation 前，必须在 `test/contracts/` 冻结 claim、fixture、action、oracle、cleanup、environment 和 isolation。
- 当前仓库业务能力尚未实现；`test/specs/health-smoke.spec.ts` 仅覆盖 starter health vertical slice，不替代 V1 业务验收。
