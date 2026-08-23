import { expect, test } from '@playwright/test'

test.describe('HEALTH-001 starter health', () => {
  test('API health is reachable', async ({ request }) => {
    const response = await request.get('/api/health')
    expect(response.ok()).toBe(true)
    await expect(response.json()).resolves.toEqual({ status: 'UP', service: 'npdemo-api' })
  })

  test('frontend renders API health state', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('status')).toContainText(/npdemo-api is UP|API is unavailable/)
  })
})
