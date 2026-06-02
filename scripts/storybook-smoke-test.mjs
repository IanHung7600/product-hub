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
// 2026-06-02: 改 ThreadingHTTPServer — 原單執行緒 `http.server` 撐不住 6 並行 → 大量請求
// GOTO timeout → 被靜默 skip → 「probed 59/945」假綠燈(SizeMatrix crash 漏掉 ship beta.44 root cause 之一)。
const server = spawn('python3', ['-c', "import os,sys;os.chdir(sys.argv[2]);from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler;ThreadingHTTPServer(('',int(sys.argv[1])),SimpleHTTPRequestHandler).serve_forever()", String(PORT), STATIC_DIR], {
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
  const allStoryIds = Object.keys(index.entries || {}).filter((id) => index.entries[id].type === 'story')

  // Mode selection:
  //   `node storybook-smoke-test.mjs`              → SAMPLE(~100 stories,daily CI fast lane)
  //   `node storybook-smoke-test.mjs --full`       → FULL 947 stories(weekly / release pre-publish)
  //   `node storybook-smoke-test.mjs --full --shard=N/M`  → shard N of M(full sweep parallel via CI matrix)
  //
  // 2026-05-26 sharding 升級(user 永久 directive「不要抽樣要全盤驗證」):
  //   release.yml GitHub matrix N=4 parallel jobs,each handles ~237 stories,wall time ~3-5 min
  //   全 947 stories cover(不 sample)+ 20-min job budget 不再 timeout
  //   對齊 Jest --shard / Playwright --shard / Vitest --shard canonical
  const FULL_MODE = process.argv.includes('--full')
  const SHARD_ARG = process.argv.find(a => a.startsWith('--shard='))
  let shardIndex = 0
  let shardTotal = 1
  if (SHARD_ARG) {
    const [n, m] = SHARD_ARG.replace('--shard=', '').split('/').map(Number)
    if (!Number.isInteger(n) || !Number.isInteger(m) || n < 1 || m < 1 || n > m) {
      console.error(`  ✗ Invalid --shard format(got "${SHARD_ARG}",expect "N/M" with 1<=N<=M)`)
      process.exit(1)
    }
    shardIndex = n - 1  // 0-indexed
    shardTotal = m
  }
  let storyIds
  if (FULL_MODE) {
    // Deterministic shard split:sort then slice by(index % shardTotal === shardIndex)
    const sortedIds = [...allStoryIds].sort()
    storyIds = sortedIds.filter((_, i) => i % shardTotal === shardIndex)
    if (shardTotal > 1) {
      console.log(`  FULL mode shard ${shardIndex + 1}/${shardTotal}: ${storyIds.length}/${allStoryIds.length} stories`)
    } else {
      console.log(`  FULL mode: ${storyIds.length} stories(weekly / pre-publish gate)`)
    }
  } else {
    // Sample = 1 story per component family(by title prefix)+ guarantee critical components
    // Critical = those with runtime trap history(Breadcrumb / DataTable / Dialog / Popover etc.)
    const CRITICAL_PREFIXES = [
      'design-system-components-breadcrumb',
      'design-system-components-button',
      'design-system-components-datatable',
      'design-system-components-dialog',
      'design-system-components-popover',
      'design-system-components-sheet',
      'design-system-components-timepicker',
      'design-system-components-sidebar',
      'design-system-components-tooltip',
      'design-system-internal-overflowindicator',
      'design-system-patterns',
    ]
    const critical = allStoryIds.filter((id) => CRITICAL_PREFIXES.some((p) => id.startsWith(p)))
    // 1 story per other component(first overview)
    const byComponent = new Map()
    for (const id of allStoryIds) {
      const componentKey = id.split('--')[0]
      if (!byComponent.has(componentKey)) byComponent.set(componentKey, id)
    }
    const sampled = [...new Set([...critical, ...byComponent.values()])]
    storyIds = sampled
    console.log(`  SAMPLE mode: ${storyIds.length}/${allStoryIds.length} stories(critical + 1/component overview)`)
    console.log(`  Use --full flag for full scan(weekly / pre-publish)`)
  }

  // Playwright probe(import lazily,parallelize with concurrency)
  const { chromium } = await import(join(REPO_ROOT, 'node_modules/playwright/index.mjs'))
  const browser = await chromium.launch()
  const ctx = await browser.newContext()

  // Known noise patterns(non-actionable runtime warnings,not real errors)
  // — recharts: width(-1)/height(-1) info messages when story renders w/o size container
  // — Radix Dialog Description aria warning(Storybook isolated render lacks full app context)
  // — DOM 404 misc resource(filtered)
  const NOISE_PATTERNS = [
    /Failed to load resource.*404/i,
    /Failed to load resource.*ERR_NAME_NOT_RESOLVED/i,  // external image / URL fetch in sandbox
    /Failed to load resource.*ERR_INTERNET_DISCONNECTED/i,
    /width\(-?\d+\) and height\(-?\d+\) of chart should be greater than 0/i,
    /Missing `Description` or `aria-describedby=\{undefined\}` for/i,
    /Each child in a list should have a unique "key"/i,  // Storybook controls warning
  ]
  function isNoise(text) {
    return NOISE_PATTERNS.some((p) => p.test(text))
  }

  const failures = []
  const unprobed = []  // 2026-06-02: retry 耗盡仍載不起的 story — 不靜默 skip,計入 coverage gate
  let probedCount = 0
  const CONCURRENCY = 6  // 6 parallel pages = ~6x speedup

  // Process in batches of CONCURRENCY
  for (let i = 0; i < storyIds.length; i += CONCURRENCY) {
    const batch = storyIds.slice(i, i + CONCURRENCY)
    await Promise.all(
      batch.map(async (id) => {
        const page = await ctx.newPage()
        const pageErrors = []
        page.on('pageerror', (e) => pageErrors.push(`PAGE: ${e.message}`))
        page.on('console', (m) => {
          if (m.type() === 'error') {
            const text = m.text()
            if (isNoise(text)) return
            pageErrors.push(text)
          }
        })

        // 2026-06-02: retry(escalating timeout)+ finally-close + 不靜默 skip。
        // 任一 story retry 耗盡仍載不起 → 記入 unprobed → 最後 coverage gate 失敗(防假綠燈)。
        try {
          let loaded = false
          for (const t of [15000, 25000]) {
            try {
              await page.goto(
                `http://localhost:${PORT}/iframe.html?id=${encodeURIComponent(id)}`,
                { waitUntil: 'domcontentloaded', timeout: t },
              )
              loaded = true
              break
            } catch (e) {
              if (pageErrors.length > 0) { loaded = true; break }  // 已收到 React crash = 真錯,不必重試
            }
          }
          await page.waitForTimeout(500)  // settle React effects + late console.error
          if (!loaded && pageErrors.length === 0) {
            unprobed.push(id)  // 載不起且無 error 訊號 → 不靜默 skip,記為未覆蓋
            return
          }
          probedCount++
          if (pageErrors.length > 0) {
            failures.push({ id, errors: pageErrors })
          }
        } finally {
          await page.close()  // 永遠 close(原 skip 路徑沒 close → page 洩漏 → timeout 連鎖)
        }
      })
    )

    if (probedCount % 60 === 0 || i + CONCURRENCY >= storyIds.length) {
      console.log(`  probed ${probedCount}/${storyIds.length}...`)
    }
  }

  await browser.close()

  // Report
  console.log('')
  console.log(`=== Result ===`)
  console.log(`Total stories probed: ${probedCount}/${storyIds.length}`)
  console.log(`Failures:             ${failures.length}`)
  console.log(`Unprobed (載不起):    ${unprobed.length}`)

  // 2026-06-02 COVERAGE GATE:probed + unprobed 必 == 目標總數,且 unprobed 必為 0。
  // 原本「probed 59/945 + Failures 0 → ✅」是假綠燈(886 靜默 skip)。現在覆蓋率不足 = 紅燈。
  if (unprobed.length > 0) {
    console.log('')
    console.log(`❌ COVERAGE GAP:${unprobed.length} 個 story retry 耗盡仍載不起(不可當綠燈 — 可能真崩或 server 太慢):`)
    for (const id of unprobed.slice(0, 20)) console.log(`   ◦ ${id}`)
    if (unprobed.length > 20) console.log(`   ...(${unprobed.length - 20} more)`)
    exitCode = 1
  }

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
  }

  if (failures.length === 0 && unprobed.length === 0) {
    console.log(`✅ All ${probedCount} stories render with 0 console error(full coverage)`)
  }
} finally {
  server.kill('SIGTERM')
}

process.exit(exitCode)
