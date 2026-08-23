#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const TEXT_EXTENSIONS = new Set(['.md', '.json', '.yaml', '.yml', '.ts', '.js', '.mjs'])
const DEFAULT_MAX_BYTES = 60000

function parseArgs(argv) {
  const args = { skill: '', query: '', caseId: '', maxBytes: DEFAULT_MAX_BYTES }
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index]
    const value = argv[index + 1]
    if (key === '--skill') {
      args.skill = value ?? ''
      index += 1
    } else if (key === '--query') {
      args.query = value ?? ''
      index += 1
    } else if (key === '--case-id') {
      args.caseId = value ?? ''
      index += 1
    } else if (key === '--max-bytes') {
      args.maxBytes = Number.parseInt(value ?? '', 10)
      index += 1
    } else if (key === '--help' || key === '-h') {
      args.help = true
    } else {
      throw new Error(`unknown argument: ${key}`)
    }
  }
  if (!Number.isInteger(args.maxBytes) || args.maxBytes < 1000) {
    throw new Error('--max-bytes must be an integer >= 1000')
  }
  return args
}

function usage() {
  return [
    'Usage:',
    '  node sbin/skill-asset-query.mjs --skill <test-skill> [--case-id <ID>] [--query <terms>] [--max-bytes <n>]',
    '',
    'Returns bounded JSON evidence from docs/ and test/ for Jarvis test lifecycle stages.',
  ].join('\n')
}

function repoRoot() {
  return resolve(fileURLToPath(new URL('..', import.meta.url)))
}

function walkFiles(root, dirs) {
  const files = []
  const visit = (path) => {
    let current
    try {
      current = statSync(path)
    } catch {
      return
    }
    if (current.isDirectory()) {
      for (const entry of readdirSync(path)) {
        if (entry === 'node_modules' || entry === 'target' || entry === 'dist' || entry === '.cache') continue
        visit(join(path, entry))
      }
      return
    }
    if (current.isFile() && TEXT_EXTENSIONS.has(extname(path))) {
      files.push(path)
    }
  }
  for (const dir of dirs) visit(join(root, dir))
  return files.sort()
}

function tokensFrom(value) {
  return String(value)
    .toLowerCase()
    .split(/[^a-z0-9\u4e00-\u9fff_-]+/u)
    .filter((token) => token.length >= 2)
}

function lineMatches(line, tokens) {
  if (tokens.length === 0) return true
  const lower = line.toLowerCase()
  return tokens.some((token) => lower.includes(token))
}

function withSerializedBytes(payload) {
  let next = { ...payload, bytes: 0 }
  while (true) {
    const bytes = Buffer.byteLength(JSON.stringify(next, null, 2), 'utf8')
    if (bytes === next.bytes) return next
    next = { ...next, bytes }
  }
}

export function queryAssets(options) {
  const root = repoRoot()
  const queryTokens = tokensFrom(`${options.caseId} ${options.query}`)
  const files = walkFiles(root, ['docs', 'test'])
  const results = []

  for (const file of files) {
    const text = readFileSync(file, 'utf8')
    const lines = text.split(/\r?\n/)
    const matches = []
    for (let index = 0; index < lines.length; index += 1) {
      if (lineMatches(lines[index], queryTokens)) {
        matches.push({ line: index + 1, text: lines[index].slice(0, 300) })
      }
      if (matches.length >= 12) break
    }
    if (matches.length > 0) {
      results.push({ path: relative(root, file), matches })
    }
  }

  const payload = {
    ok: true,
    skill: options.skill,
    case_id: options.caseId,
    query: options.query,
    max_bytes: options.maxBytes,
    result_count: results.length,
    results,
  }

  let output = JSON.stringify(withSerializedBytes(payload), null, 2)
  if (Buffer.byteLength(output, 'utf8') > options.maxBytes) {
    const clipped = { ...payload, clipped: true, results: [] }
    for (const result of results) {
      const candidate = withSerializedBytes({ ...clipped, results: [...clipped.results, result] })
      const candidateText = JSON.stringify(candidate, null, 2)
      const candidateBytes = Buffer.byteLength(candidateText, 'utf8')
      if (candidateBytes > options.maxBytes) break
      clipped.results.push(result)
    }
    clipped.result_count = clipped.results.length
    return withSerializedBytes(clipped)
  }
  return withSerializedBytes(payload)
}

function main() {
  try {
    const args = parseArgs(process.argv.slice(2))
    if (args.help) {
      console.log(usage())
      return
    }
    if (!args.skill) throw new Error('--skill is required')
    const result = queryAssets(args)
    console.log(JSON.stringify(result, null, 2))
  } catch (error) {
    console.error(error.message)
    console.error(usage())
    process.exit(2)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
