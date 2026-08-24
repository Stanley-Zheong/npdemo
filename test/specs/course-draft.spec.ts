import { expect, test } from '@playwright/test'
import { courseDraftData } from '../data/course-draft'

const apiBaseUrl = process.env.NPDEMO_API_BASE_URL ?? 'http://127.0.0.1:18082'

test.beforeAll(() => {
  expect(process.env.NPDEMO_QA_DISPOSABLE_DB, 'business specs require a run-owned disposable database').toBe('1')
})

test('CRS-001A creates and reopens a course draft', async ({ request }, testInfo) => {
  const draft = courseDraftData('CRS-001A', testInfo)
  const created = await request.post(`${apiBaseUrl}/api/admin/course-drafts`, {
    data: { ...draft, code: ` ${draft.code} ` },
  })
  const createdText = await created.text()
  expect(created.status(), createdText).toBe(201)
  const location = created.headers().location
  expect(location).toMatch(/^\/api\/admin\/course-drafts\/[0-9a-f-]+$/)
  const createdBody = JSON.parse(createdText)

  expect(createdBody).toMatchObject({ ...draft, status: 'DRAFT', createdBy: 'training-admin', version: 0 })
  const readback = await request.get(`${apiBaseUrl}${location}`)
  expect(readback.status()).toBe(200)
  await expect(readback.json()).resolves.toMatchObject({ ...draft, id: createdBody.id })
})

test('CRS-001B rejects a duplicate code without changing the original', async ({ request }, testInfo) => {
  const draft = courseDraftData('CRS-001B', testInfo)
  const created = await request.post(`${apiBaseUrl}/api/admin/course-drafts`, { data: draft })
  const createdText = await created.text()
  expect(created.status(), createdText).toBe(201)
  const location = created.headers().location
  expect(location).toBeTruthy()

  const duplicate = await request.post(`${apiBaseUrl}/api/admin/course-drafts`, {
    data: { ...draft, name: 'Must not replace the owned draft' },
  })
  expect(duplicate.status()).toBe(409)
  await expect(duplicate.json()).resolves.toMatchObject({ code: 'COURSE_CODE_ALREADY_EXISTS' })

  const readback = await request.get(`${apiBaseUrl}${location}`)
  expect(readback.status()).toBe(200)
  await expect(readback.json()).resolves.toMatchObject({ ...draft, version: 0 })
})
