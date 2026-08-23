import { execFileSync } from 'node:child_process'
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

describe('skill asset query', () => {
  it('returns bounded evidence for a case id', () => {
    const stdout = execFileSync(process.execPath, [
      'sbin/skill-asset-query.mjs',
      '--skill',
      'test-case-review',
      '--case-id',
      'IAM-005C',
      '--max-bytes',
      '20000',
    ], { encoding: 'utf8' })

    const payload = JSON.parse(stdout)
    assert.equal(payload.ok, true)
    assert.equal(payload.exact_case_required, true)
    assert.equal(payload.exact_case_found, true)
    assert.ok(payload.bytes <= 20000)
    const canonicalDoc = payload.results.find((result) => result.path.includes('online-learning-exam-system.md'))
    assert.ok(canonicalDoc)
    assert.ok(canonicalDoc.matches.some((match) => match.text.includes('IAM-005C')))
  })

  it('keeps exact case evidence ahead of broad query matches', () => {
    const stdout = execFileSync(process.execPath, [
      'sbin/skill-asset-query.mjs',
      '--skill',
      'test-case-review',
      '--case-id',
      'OPS-010',
      '--query',
      'API',
      '--max-bytes',
      '20000',
    ], { encoding: 'utf8' })

    const payload = JSON.parse(stdout)
    assert.equal(payload.ok, true)
    assert.equal(payload.exact_case_found, true)
    const canonicalDoc = payload.results.find((result) => result.path.includes('online-learning-exam-system.md'))
    assert.ok(canonicalDoc)
    assert.ok(canonicalDoc.matches.some((match) => match.text.includes('OPS-010')))
  })

  it('fails closed when a requested exact case id is absent', () => {
    const missingCaseId = ['NOPE', '999'].join('-')
    const stdout = execFileSync(process.execPath, [
      'sbin/skill-asset-query.mjs',
      '--skill',
      'test-case-review',
      '--case-id',
      missingCaseId,
      '--query',
      'API',
      '--max-bytes',
      '20000',
    ], { encoding: 'utf8' })

    const payload = JSON.parse(stdout)
    assert.equal(payload.ok, false)
    assert.equal(payload.exact_case_found, false)
    assert.equal(payload.result_count, 0)
  })

  it('reports the actual serialized byte length when clipped', () => {
    const stdout = execFileSync(process.execPath, [
      'sbin/skill-asset-query.mjs',
      '--skill',
      'test-case-review',
      '--query',
      'IAM CRS EXM OPS NFR',
      '--max-bytes',
      '1000',
    ], { encoding: 'utf8' })

    const payload = JSON.parse(stdout)
    assert.equal(payload.clipped, true)
    assert.equal(payload.bytes, Buffer.byteLength(stdout.trimEnd(), 'utf8'))
    assert.ok(payload.bytes <= 1000)
  })
})
