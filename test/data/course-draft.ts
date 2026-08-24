import type { TestInfo } from '@playwright/test'
import { createHash } from 'node:crypto'

const rawRunId = process.env.NPDEMO_QA_RUN_ID ?? `${Date.now()}`
const runHash = createHash('sha256').update(rawRunId).digest('hex').slice(0, 12)

export function courseDraftData(caseId: 'CRS-001A' | 'CRS-001B', testInfo: TestInfo) {
  const suffix = `${runHash}-W${testInfo.workerIndex}-R${testInfo.retry}`
  return {
    code: `${caseId}-${suffix}`,
    name: `${caseId} owned draft ${suffix}`,
    description: 'Created by the npdemo Playwright business contract.',
    coverUrl: `https://assets.example.test/${caseId.toLowerCase()}.png`,
    learningRequirements: 'Complete all assigned materials.',
  }
}
