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
    assert.ok(payload.bytes <= 20000)
    assert.ok(payload.results.some((result) => result.path.includes('online-learning-exam-system.md')))
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
