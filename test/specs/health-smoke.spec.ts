import { expect, test } from '@playwright/test'

const apiBaseUrl = process.env.NPDEMO_API_BASE_URL ?? 'http://127.0.0.1:18082'

test.describe('starter health vertical slice', () => {
  test('HEALTH-001 API health is reachable', async ({ request }) => {
    const response = await request.get(`${apiBaseUrl}/api/health`)
    expect(response.ok()).toBe(true)
    await expect(response.json()).resolves.toEqual({ status: 'UP', service: 'npdemo-api' })
  })

  test('HEALTH-002 frontend renders healthy API state', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('status')).toContainText('npdemo-api is UP')
  })

  test('HEALTH-003 frontend renders unavailable state when API fails', async ({ page }) => {
    await page.route('**/api/health', (route) => route.abort('failed'))
    await page.goto('/')
    await expect(page.getByRole('status')).toContainText('API is unavailable')
  })
})
