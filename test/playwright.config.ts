import { defineConfig, devices } from '@playwright/test'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const testRoot = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(testRoot, '..')
const isCI = Boolean(process.env.CI)
const skipWebServer = Boolean(process.env.NPDEMO_SKIP_WEBSERVER)
const apiPort = process.env.NPDEMO_API_PORT ?? '18082'
const webPort = process.env.NPDEMO_WEB_PORT ?? '5173'
const apiBaseUrl = process.env.NPDEMO_API_BASE_URL ?? `http://127.0.0.1:${apiPort}`
const webBaseUrl = process.env.NPDEMO_BASE_URL ?? `http://127.0.0.1:${webPort}`

export default defineConfig({
  testDir: './specs',
  fullyParallel: true,
  retries: isCI ? 1 : 0,
  outputDir: resolve(repoRoot, 'test-results'),
  reporter: [['list'], ['html', { open: 'never', outputFolder: resolve(repoRoot, 'playwright-report') }]],
  use: {
    baseURL: webBaseUrl,
    trace: 'on-first-retry',
  },
  webServer: skipWebServer ? undefined : [
    {
      command: `mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=${apiPort}`,
      cwd: resolve(repoRoot, 'backend'),
      url: `${apiBaseUrl}/api/health`,
      timeout: 120000,
      reuseExistingServer: !isCI,
      stdout: isCI ? 'pipe' : 'ignore',
      stderr: 'pipe',
    },
    {
      command: `npm run dev -- --host 127.0.0.1 --port ${webPort}`,
      cwd: resolve(repoRoot, 'frontend'),
      env: {
        ...process.env,
        NPDEMO_API_PROXY_TARGET: apiBaseUrl,
      },
      url: webBaseUrl,
      timeout: 120000,
      reuseExistingServer: !isCI,
    },
  ],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
