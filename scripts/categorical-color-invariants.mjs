#!/usr/bin/env node
// categorical-color-invariants.mjs — 守 categorical 色相 SSOT 的 3 條不變條件:
//   (I1) 1:1 名實一致(零 offset):map 的 key X 的值只能引用 X 的色相 token
//        ——`--color-X-*`(bg/border/text)或 `--X-hover` / `--X-active`(互動)。
//        根治「red variant 接 --color-deep-orange」這類 categorical-vs-semantic 混淆。
//   (I2) 完整性:全 12 色相(CATEGORICAL_HUES)都必出現在每個 map(無漏色相)。
//   (I3) Token 存在性:categorical-color.ts 引用的每個 `var(--token)` 都必在
//        primitives.css / semantic.css 真實定義(catch typo / 不存在的 token,如 lime-hover scare)。
//
// 改 categorical-color.ts / 加色相必跑此 script。fail → exit 1。
// Run: `node scripts/categorical-color-invariants.mjs`(release-preflight 已 chain)。

import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SSOT = join(ROOT, 'packages/design-system/src/tokens/categorical-color.ts')
const PRIMITIVES = join(ROOT, 'packages/design-system/src/tokens/color/primitives.css')
const SEMANTIC = join(ROOT, 'packages/design-system/src/tokens/color/semantic.css')

const src = readFileSync(SSOT, 'utf8')
const failures = []
const passes = []
const rec = (id, label, pass, detail = '') =>
  pass ? passes.push(`✓ ${id} | ${label}`) : failures.push(`✗ ${id} | ${label}${detail ? ' | ' + detail : ''}`)

// ── 解析 CATEGORICAL_HUES(從 SSOT 自身取,避免 drift)──
const huesBlock = src.match(/export const CATEGORICAL_HUES\s*=\s*\[([\s\S]*?)\]\s*as const/)
if (!huesBlock) { console.error('✗ 無法解析 CATEGORICAL_HUES'); process.exit(1) }
const HUES = [...huesBlock[1].matchAll(/'([a-z-]+)'/g)].map((m) => m[1])
rec('I2', `CATEGORICAL_HUES 解析出 12 色相`, HUES.length === 12, `got ${HUES.length}: ${HUES.join(',')}`)

// ── 解析每個 map 的 block(export const NAME...= { ... }) ──
// 7 個 categorical map:CAT_SUBTLE / CAT_SOLID / CAT_INTERACT / CAT_SUBTLE_TOKENS /
// CAT_SOLID_TOKENS / CAT_EVENT / CAT_ACCENT。neutral 非色相,不在 map(consumer 自處理),不檢查。
const MAP_NAMES = ['CAT_SUBTLE', 'CAT_SOLID', 'CAT_INTERACT', 'CAT_SUBTLE_TOKENS', 'CAT_SOLID_TOKENS', 'CAT_EVENT', 'CAT_ACCENT']

function extractMapBlock(name) {
  // 從 `export const NAME` 到該宣告的第一個 top-level `}` 收尾(map 內無巢狀 { 除了 CAT_INTERACT 的 { hover, active })。
  const start = src.indexOf(`export const ${name}`)
  if (start === -1) return null
  // 找該 const 的 `= {` 起點,然後配對大括號
  const eq = src.indexOf('= {', start)
  if (eq === -1) return null
  let depth = 0, i = eq + 2
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++
    else if (src[i] === '}') { depth--; if (depth === 0) { i++; break } }
  }
  return src.slice(eq + 3, i - 1)
}

// 取某 hue 在 map block 內的「該行 / 該 entry」原始字串
function entryFor(block, hue) {
  // key 可能是 `blue:` 或 `'deep-orange':`
  const re = new RegExp(`(?:^|\\n)\\s*(?:'${hue}'|${hue})\\s*:\\s*([^\\n]*)`, 'g')
  const m = re.exec(block)
  return m ? m[1] : null
}

for (const name of MAP_NAMES) {
  const block = extractMapBlock(name)
  if (block === null) { rec('parse', `map ${name} 存在`, false, '找不到 export const'); continue }

  // I2 完整性:12 色相皆在
  for (const h of HUES) {
    const entry = entryFor(block, h)
    rec('I2', `${name} 含色相 ${h}`, entry !== null)
    if (entry === null) continue

    // I1 1:1:該 entry 引用的所有色相 token 都必 === h
    if (name === 'CAT_INTERACT') {
      // 值形如 { hover: 'var(--blue-hover)', active: 'var(--blue-active)' }
      const refs = [...entry.matchAll(/--([a-z-]+)-(hover|active)\b/g)].map((m) => m[1])
      const bad = refs.filter((r) => r !== h)
      rec('I1', `${name}.${h} 互動 token 名實一致`, refs.length === 2 && bad.length === 0,
        bad.length ? `引用了 ${bad.join(',')} 的 hover/active(應為 ${h})` : `refs=${refs.length}(應 2)`)
    } else {
      // bg/border/text class 或 token:抓所有 --color-XXX-N,每個 XXX 必 === h
      const refs = [...entry.matchAll(/--color-([a-z-]+)-\d/g)].map((m) => m[1])
      const bad = refs.filter((r) => r !== h)
      rec('I1', `${name}.${h} 色相 token 名實一致(零 offset)`, refs.length >= 1 && bad.length === 0,
        bad.length ? `引用了 --color-${bad.join(',')}-*(應為 --color-${h}-*)` : `無 --color-${h}-* 引用`)
    }
  }
}

// ── I3 Token 存在性:SSOT 引用的每個 var(--token) 都必在 CSS 定義 ──
const cssDefs = new Set()
for (const f of [PRIMITIVES, SEMANTIC]) {
  const css = readFileSync(f, 'utf8')
  for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:/g)) cssDefs.add(m[1])
}
const referenced = new Set([...src.matchAll(/var\((--[a-z0-9-]+)/g)].map((m) => m[1]))
// neutral / 通用 semantic token(--secondary 等)亦在 CSS;若有不在 CSS 的 → 漏定義
for (const tok of referenced) {
  rec('I3', `引用 token ${tok} 已在 CSS 定義`, cssDefs.has(tok), '未在 primitives.css / semantic.css 找到定義')
}

// ── Output ──
console.log('\n=== Categorical Color SSOT Invariants ===')
console.log(`PASS: ${passes.length}   FAIL: ${failures.length}\n`)
if (failures.length) {
  console.log(failures.join('\n'))
  console.error(`\n✗ ${failures.length} invariant(s) failed — categorical 色相 SSOT 偏移 / 漏色相 / 漏 token。Block.`)
  process.exit(1)
}
console.log(`✓ All ${passes.length} categorical-color invariants pass(12 色相 × 7 map,1:1 零 offset + token 存在性).`)
process.exit(0)
