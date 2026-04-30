#!/usr/bin/env node
/**
 * sync-memory — harness user-local memory ↔ repo `.claude/memory/` 雙向同步
 *
 * Default: harness → repo(commit 前用,讓 cloud sandbox 看到最新 memory)
 * `--reverse`: repo → harness(cloud 第一次啟動同步;`.devcontainer/devcontainer.json`
 *               的 postCreate 已 inline 處理,reverse 多半 manual rare-use)
 *
 * 用法:
 *   node scripts/sync-memory.mjs           # harness → repo
 *   node scripts/sync-memory.mjs --reverse # repo → harness
 *   npm run sync-memory                    # alias
 *
 * 為什麼存在:auto memory 的 SSOT 是 harness user-local path,本機編輯後若沒同步到 repo
 * `.claude/memory/`,cloud sandbox(claude.ai/code / Codespaces / Cursor)看不到最新 state。
 * 這個 script 是 drift defense — 推薦 commit 前跑一次。
 */

import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, copyFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

const REVERSE = process.argv.includes('--reverse')

const HARNESS_DIR = join(
  homedir(),
  '.claude',
  'projects',
  '-Users-chenqiren-Library-CloudStorage-GoogleDrive-qijenchen-gmail-com--------my-project',
  'memory',
)
const REPO_DIR = '.claude/memory'

const SRC = REVERSE ? REPO_DIR : HARNESS_DIR
const DST = REVERSE ? HARNESS_DIR : REPO_DIR

if (!existsSync(SRC)) {
  console.error(`[sync-memory] source missing: ${SRC}`)
  process.exit(1)
}

if (!existsSync(DST)) {
  console.log(`[sync-memory] creating dest: ${DST}`)
  mkdirSync(DST, { recursive: true })
}

const SKIP = new Set(['README.md']) // README 是 repo-only doc,不同步

let copied = 0
let skipped = 0
let unchanged = 0

for (const name of readdirSync(SRC)) {
  if (SKIP.has(name)) {
    skipped++
    continue
  }
  if (!name.endsWith('.md')) continue
  const srcPath = join(SRC, name)
  const dstPath = join(DST, name)
  const srcStat = statSync(srcPath)
  if (existsSync(dstPath)) {
    const dstStat = statSync(dstPath)
    if (srcStat.size === dstStat.size && srcStat.mtimeMs <= dstStat.mtimeMs) {
      // dst 等大且不舊於 src → 已同步
      unchanged++
      continue
    }
  }
  copyFileSync(srcPath, dstPath)
  copied++
  console.log(`[sync-memory] ${name}`)
}

console.log(
  `[sync-memory] direction: ${REVERSE ? 'repo → harness' : 'harness → repo'} | copied: ${copied} | unchanged: ${unchanged} | skipped: ${skipped}`,
)
