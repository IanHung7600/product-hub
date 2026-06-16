#!/usr/bin/env node
// build-fork-governance.mjs — C-prime fork-mode governance corpus 生成器(SSOT-driven)
//
// 讀 scripts/fork-hook-classification.json → 從 DS repo .claude/hooks/ SSOT 生成一套
// 「專給 consumer fork 用」的治理 corpus,輸出到 packages/design-system/ds-canonical/fork/。
// 該目錄隨 npm package ship(rides node_modules → npm install 覆蓋 = 官方控管不可客製)。
//
// fork 端只 commit 一個極穩定的 per-event dispatcher(讀本生成的 fork/manifest.json),
// 故 DS 未來治理增刪改 → 重生此 corpus → fork `npm install @beta` 即完全同步,
// 無需改 fork 自己 committed 設定(完全同步設計)。
//
// 四桶處理(per classification SSOT):
//   SHIP_AS_IS     → verbatim copy
//   SHIP_REWRITTEN → override 檔優先(scripts/fork-hook-overrides/<name>),否則套 path transform
//   REPLACE        → 用 override(scripts/fork-hook-overrides/<replaceWith>)
//   DROP           → 不生成、不註冊
//
// 用法:
//   node scripts/build-fork-governance.mjs            # 生成 ds-canonical/fork/
//   node scripts/build-fork-governance.mjs --check    # 驗:(1) 全 hook 已分類(漏接=FAIL)(2) 生成物與 SSOT 無 drift

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, rmSync, createWriteStream } from 'node:fs'
import { join, dirname } from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const HOOKS_DIR = join(ROOT, '.claude/hooks')
const CLS_PATH = join(ROOT, 'scripts/fork-hook-classification.json')
const OVERRIDE_DIR = join(ROOT, 'scripts/fork-hook-overrides')
const OUT_DIR = join(ROOT, 'packages/design-system/ds-canonical/fork')
const SETTINGS_PATH = join(ROOT, '.claude/settings.json')

const CHECK = process.argv.includes('--check')

const cls = JSON.parse(readFileSync(CLS_PATH, 'utf8'))
const settings = JSON.parse(readFileSync(SETTINGS_PATH, 'utf8'))

// ── (1) Coverage gate:全 .claude/hooks/*.{sh,py} 必須被分類,漏接 = FAIL ──
const realHooks = readdirSync(HOOKS_DIR).filter((f) => f.endsWith('.sh') || f.endsWith('.py'))
const classified = new Set()
for (const b of ['SHIP_AS_IS', 'SHIP_REWRITTEN', 'REPLACE', 'DROP']) {
  for (const e of cls[b]) classified.add(e.hook)
}
const unclassified = realHooks.filter((h) => !classified.has(h))
if (unclassified.length) {
  console.error(`❌ FORK-GOVERNANCE COVERAGE FAIL: ${unclassified.length} hook 未分類(新增 hook 必先分類進 fork-hook-classification.json):`)
  console.error(unclassified.map((h) => '   - ' + h).join('\n'))
  console.error('   修:把每個未分類 hook 加進 SHIP_AS_IS / SHIP_REWRITTEN / REPLACE / DROP 之一。')
  process.exit(1)
}
const ghost = [...classified].filter((h) => !realHooks.includes(h))
if (ghost.length) {
  console.error(`❌ FORK-GOVERNANCE GHOST FAIL: ${ghost.length} 個分類的 hook 在 .claude/hooks/ 不存在(stale 分類):`)
  console.error(ghost.map((h) => '   - ' + h).join('\n'))
  process.exit(1)
}

// ── event 對照(從 DS settings.json 取每個 hook 註冊在哪些 event)──
function eventsOf(hookName) {
  const evs = []
  for (const ev of Object.keys(settings.hooks || {})) {
    for (const g of settings.hooks[ev]) {
      for (const h of g.hooks || []) {
        if ((h.command || '').includes(hookName)) { if (!evs.includes(ev)) evs.push(ev); }
      }
    }
  }
  return evs
}

// ── SHIP_REWRITTEN 的 path transform(simple 機械改寫;複雜者用 override 檔)──
function applyTransform(content) {
  return content
    // DS src spec/story/token 路徑 → node_modules(fork 佈局)
    .replace(/packages\/design-system\/src/g, 'node_modules/@qijenchen/design-system/src')
    .replace(/\.\.\/\.\.\/packages\/design-system\/src/g, 'node_modules/@qijenchen/design-system/src')
}

// ── 生成 ──
function buildCorpus() {
  if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true, force: true })
  mkdirSync(join(OUT_DIR, 'hooks'), { recursive: true })

  const manifest = { _generated: 'build-fork-governance.mjs', hooks: {} } // event → [{file, source-hook}]
  const lockEntries = []

  const emit = (outName, content, sourceHook, bucket, evs) => {
    const outPath = join(OUT_DIR, 'hooks', outName)
    writeFileSync(outPath, content)
    const sha = createHash('sha256').update(content).digest('hex')
    lockEntries.push({ file: `hooks/${outName}`, sha256: sha, sourceHook, bucket })
    for (const ev of evs.length ? evs : ['PreToolUse']) {
      manifest.hooks[ev] = manifest.hooks[ev] || []
      manifest.hooks[ev].push({ file: `hooks/${outName}`, sourceHook, bucket })
    }
  }

  for (const e of cls.SHIP_AS_IS) {
    const content = readFileSync(join(HOOKS_DIR, e.hook), 'utf8')
    emit(e.hook, content, e.hook, 'SHIP_AS_IS', eventsOf(e.hook))
  }
  for (const e of cls.SHIP_REWRITTEN) {
    const ov = join(OVERRIDE_DIR, e.hook)
    let content
    if (existsSync(ov)) content = readFileSync(ov, 'utf8')
    else content = applyTransform(readFileSync(join(HOOKS_DIR, e.hook), 'utf8'))
    emit(e.hook, content, e.hook, 'SHIP_REWRITTEN', eventsOf(e.hook))
  }
  for (const e of cls.REPLACE) {
    const m = e.replaceWith.match(/([a-zA-Z0-9_-]+\.sh)/)
    const newName = m ? m[1] : ('replaced_' + e.hook)
    const ov = join(OVERRIDE_DIR, newName)
    if (!existsSync(ov)) {
      console.error(`❌ REPLACE override 缺檔:scripts/fork-hook-overrides/${newName}(${e.hook} 的取代版必須手寫)`)
      process.exit(1)
    }
    emit(newName, readFileSync(ov, 'utf8'), e.hook, 'REPLACE', eventsOf(e.hook))
  }
  // DROP: 不生成

  // dispatcher manifest + lock
  const manifestStr = JSON.stringify(manifest, null, 2) + '\n'
  writeFileSync(join(OUT_DIR, 'manifest.json'), manifestStr)
  lockEntries.push({ file: 'manifest.json', sha256: createHash('sha256').update(manifestStr).digest('hex') })
  const lockStr = JSON.stringify({ _purpose: 'sha256 of every shipped fork governance body + manifest (tamper-detect baseline)', entries: lockEntries.sort((a, b) => a.file.localeCompare(b.file)) }, null, 2) + '\n'
  writeFileSync(join(OUT_DIR, 'governance.lock'), lockStr)

  return { manifest, lockEntries, count: lockEntries.length - 1 }
}

if (CHECK) {
  // drift check:重生到暫存比對(這裡簡化為「重生 + 比對 lock」;CI 用)
  const before = existsSync(join(OUT_DIR, 'governance.lock')) ? readFileSync(join(OUT_DIR, 'governance.lock'), 'utf8') : ''
  const r = buildCorpus()
  const after = readFileSync(join(OUT_DIR, 'governance.lock'), 'utf8')
  if (before && before !== after) {
    console.error('❌ FORK-GOVERNANCE DRIFT: ds-canonical/fork/ 與 SSOT 重生結果不一致 — 重跑 `node scripts/build-fork-governance.mjs` 並 commit。')
    process.exit(1)
  }
  console.log(`✅ fork-governance --check PASS:53 hook 全分類 + 生成物與 SSOT 無 drift（${r.count} 個 fork hook body）`)
} else {
  const r = buildCorpus()
  const tally = cls._meta.tally
  console.log(`✅ fork governance corpus 生成 → packages/design-system/ds-canonical/fork/`)
  console.log(`   ship-as-is ${tally.SHIP_AS_IS} / rewritten ${tally.SHIP_REWRITTEN} / replaced ${tally.REPLACE} / dropped ${tally.DROP}`)
  console.log(`   → ${r.count} 個 fork hook body + manifest.json(dispatcher 清單)+ governance.lock(sha256 tamper baseline）`)
  const evs = Object.keys(r.manifest.hooks)
  console.log(`   events: ${evs.map((e) => `${e}(${r.manifest.hooks[e].length})`).join(' / ')}`)
}
