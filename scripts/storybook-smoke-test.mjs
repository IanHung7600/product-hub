#!/usr/bin/env node
// storybook-smoke-test.mjs — Phase 4.13 Storybook story runtime smoke test
//
// Why: 本 session 已踩 3 個 story runtime bug(Breadcrumb asChild / DataTable JSX comment
//   / Internal pattern visual)— `npm run build-storybook` 過(compile-time)≠
//   runtime stories 全 render 過(eg. React.Children.only 是 runtime error)。
//
// 流程:
//   1. assume storybook-static/ 已 build(CI 先跑 npm run build-storybook)
//   2. serve static via http.server(port 8920)
//   3. fetch index.json → 拿全部 story id list
//   4. Playwright visit 每個 iframe.html?id=<story>
//   5. assert 0 console error AND 0 pageerror
//   6. 任一 fail → exit 1 with details
//
// Hook 進 ci.yml verify job → fail = block main merge / 防 Storybook runtime regression。

import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const STATIC_DIR = join(REPO_ROOT, 'storybook-static')
const PORT = 8920

if (!existsSync(STATIC_DIR)) {
  console.error('❌ storybook-static/ not found. Run `npm run build-storybook` first.')
  process.exit(1)
}

// Spawn http.server
console.log('=== Spawn http.server ===')
const server = spawn('python3', ['-m', 'http.server', String(PORT), '--directory', STATIC_DIR], {
  stdio: ['ignore', 'pipe', 'pipe'],
})
await new Promise((r) => setTimeout(r, 1500))

let exitCode = 0

try {
  // Fetch story index
  console.log('=== Fetch story index ===')
  const indexRes = await fetch(`http://localhost:${PORT}/index.json`)
  if (!indexRes.ok) {
    console.error(`❌ Cannot fetch index.json: HTTP ${indexRes.status}`)
    process.exit(1)
  }
  const index = await indexRes.json()
  const storyIds = Object.keys(index.entries || {}).filter((id) => index.entries[id].type === 'story')
  console.log(`  ${storyIds.length} stories to probe`)

  // Playwright probe(import lazily)
  const { chromium } = await import(join(REPO_ROOT, 'node_modules/playwright/index.mjs'))
  const browser = await chromium.launch()
  const ctx = await browser.newContext()

  const failures = []
  let probedCount = 0

  for (const id of storyIds) {
    const page = await ctx.newPage()
    const pageErrors = []
    page.on('pageerror', (e) => pageErrors.push(e.message))
    page.on('console', (m) => {
      if (m.type() === 'error') {
        const text = m.text()
        // Filter known-noisy non-actionable errors
        if (text.includes('Failed to load resource') && text.includes('404')) return
        pageErrors.push(text)
      }
    })

    try {
      await page.goto(
        `http://localhost:${PORT}/iframe.html?id=${encodeURIComponent(id)}`,
        { waitUntil: 'networkidle', timeout: 30000 },
      )
      await page.waitForTimeout(800)  // settle React effects
    } catch (e) {
      pageErrors.push(`GOTO timeout: ${e.message}`)
    }

    probedCount++
    if (pageErrors.length > 0) {
      failures.push({ id, errors: pageErrors })
    }
    await page.close()

    if (probedCount % 50 === 0) {
      console.log(`  probed ${probedCount}/${storyIds.length}...`)
    }
  }

  await browser.close()

  // Report
  console.log('')
  console.log(`=== Result ===`)
  console.log(`Total stories probed: ${probedCount}`)
  console.log(`Failures:             ${failures.length}`)

  if (failures.length > 0) {
    console.log('')
    console.log('=== Failed stories ===')
    for (const { id, errors } of failures.slice(0, 20)) {
      console.log(`  ✗ ${id}`)
      for (const e of errors.slice(0, 2)) {
        console.log(`      ${e.slice(0, 200)}`)
      }
    }
    if (failures.length > 20) {
      console.log(`  ...(${failures.length - 20} more)`)
    }
    exitCode = 1
  } else {
    console.log('✅ All stories render with 0 console error')
  }
} finally {
  server.kill('SIGTERM')
}

process.exit(exitCode)
