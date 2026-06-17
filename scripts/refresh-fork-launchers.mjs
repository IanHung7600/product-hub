#!/usr/bin/env node
// refresh-fork-launchers.mjs — C-prime 接線骨架刷新(sync-all 呼叫 + harness 可測)
//
// 既有 fork 的「接線骨架」(committed .claude/settings.json hooks 區塊 + 3 個 thin 啟動器)原本
// 不隨 npm 同步 → DS 改接線層後 user fork 拿不到(2026-06-17 user 抓:完全同步不偏移未達成)。
// 本模組從 npm-current 的 ds-canonical/fork/launchers/ 把骨架 idempotent 刷新進 fork:
//   1. copy 3 啟動器 .sh → .claude/hooks/(官方控管,覆蓋)
//   2. merge settings-hooks.json 進 .claude/settings.json:
//      - strip 所有 event 裡「引用 3 啟動器」的舊註冊(去重)
//      - append canonical 啟動器註冊
//      - union permissions.allow(只加治理所需、不移除 user 既有)
//      → 不 clobber user 自有「非治理」hook;重跑結果一致(idempotent)
// 安全:.github/no-governance-sync opt-out → 整段 skip;launchers 未 ship(舊 npm)→ skip 不報錯。
//
// 抽成獨立模組 = sync-all 呼叫 + test-fork-governance.mjs 直接測(不需真跑 npm install)。

import { readFileSync, writeFileSync, copyFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const LAUNCHERS = ['check_governance_bootstrap.sh', 'fork-governance-dispatcher.sh', 'inject_fork_governance_preamble.sh']
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
// path-segment 比對:啟動器必以 `/<name>` 出現(它一律在 .claude/hooks/ 路徑下)且後接邊界(引號/空白/結尾)。
// 避免 loose substring 誤刪「command 只是『含』啟動器名為子字串」的 user hook(adversarial FINDING 2b)。
const refsLauncher = (cmd) => LAUNCHERS.some((l) => new RegExp(`/${escRe(l)}(?=["'\\s]|$)`).test(cmd || ''))

// 刷新 projectDir 的接線骨架;回傳 {copied, settingsMerged, skipped}
export function refreshLaunchers(projectDir) {
  const result = { copied: [], settingsMerged: false, skipped: null }

  // opt-out:fork user 明確不要官方覆蓋骨架
  if (existsSync(join(projectDir, '.github/no-governance-sync'))) {
    result.skipped = 'opt-out(.github/no-governance-sync 存在)'
    return result
  }

  const src = join(projectDir, 'node_modules/@qijenchen/design-system/ds-canonical/fork/launchers')
  if (!existsSync(join(src, 'settings-hooks.json'))) {
    result.skipped = 'launchers 未 ship(npm 套件版本過舊或治理本體未安裝)'
    return result
  }

  // 1. copy 啟動器 .sh → .claude/hooks/
  const hooksDir = join(projectDir, '.claude/hooks')
  mkdirSync(hooksDir, { recursive: true })
  for (const f of readdirSync(src).filter((f) => f.endsWith('.sh'))) {
    copyFileSync(join(src, f), join(hooksDir, f))
    result.copied.push(f)
  }

  // 2. idempotent merge settings hooks + permissions
  const canonical = JSON.parse(readFileSync(join(src, 'settings-hooks.json'), 'utf8'))
  const settingsPath = join(projectDir, '.claude/settings.json')
  const s = existsSync(settingsPath) ? JSON.parse(readFileSync(settingsPath, 'utf8')) : {}
  s.hooks = s.hooks || {}

  // strip 舊 launcher 註冊(所有 event)→ 去重,重跑不疊加
  for (const ev of Object.keys(s.hooks)) {
    s.hooks[ev] = (s.hooks[ev] || [])
      .map((g) => ({ ...g, hooks: (g.hooks || []).filter((h) => !refsLauncher(h.command)) }))
      .filter((g) => (g.hooks || []).length > 0)
    if (s.hooks[ev].length === 0) delete s.hooks[ev]
  }
  // append canonical 啟動器註冊
  for (const ev of Object.keys(canonical.hooks || {})) {
    s.hooks[ev] = (s.hooks[ev] || []).concat(canonical.hooks[ev])
  }
  // union permissions.allow(治理需要 npm/git;只加不刪 user 既有)
  if (canonical.permissions && Array.isArray(canonical.permissions.allow)) {
    s.permissions = s.permissions || {}
    s.permissions.allow = Array.from(new Set([...(s.permissions.allow || []), ...canonical.permissions.allow]))
  }

  writeFileSync(settingsPath, JSON.stringify(s, null, 2) + '\n')
  result.settingsMerged = true
  return result
}
