#!/usr/bin/env node
// item-content-leading-coherence — 防 Notice 類「reading gap token + compact 行高」off-grid 偏移復發
//
// 不變式(2026-06-15 user 拍板,根治 Notice off-grid 偏移):
//   消費 <ItemContent> 的元件,若在 className 套了 `leading-compact`(= scanning 行高),
//   就必須對該 ItemContent 顯式傳 mode="scanning"(讓 gap token 走 scanning,名實相符)。
//   否則 = ItemContent 預設 mode='reading' 拿 --item-gap-label-desc-reading gap,
//   行高卻被 leading-compact 壓成 1.3 = 第五種 off-grid 組合(reading gap + scanning 行高)。
//   正確範例:FileItem(顯式 mode="scanning" + leading-compact,一致)。
//   反例:Notice 修正前(leading-compact + 無 mode,已於 2026-06-15 收斂為純 reading-md)。
//
// 零誤判設計:(1) 先剝註解(// /* */ {/* */}),只看真 className —— Notice 修正後
//   leading-compact 只殘留在註解,不該誤判;(2) 排除定義源 item-anatomy.tsx(modeClass 內含
//   leading-compact 字面是 primitive 實作,非 consumer 套用)。

import { readFileSync } from 'node:fs'
import { globSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')

// 剝 JS 行註解 / 區塊註解 / JSX {/* */} 註解 — 只保留可能成為 runtime className 的文字
function stripComments(src) {
  return src
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ') // JSX {/* ... */}
    .replace(/\/\*[\s\S]*?\*\//g, ' ') // /* ... */
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1') // // ...(避開 http://)
}

// 核心判定:回傳 violation reason 或 null
export function checkSource(src, relPath) {
  if (relPath.includes('patterns/element-anatomy/item-anatomy.tsx')) return null // 定義源排除
  const code = stripComments(src)
  if (!/<ItemContent\b/.test(code)) return null
  if (!/\bleading-compact\b/.test(code)) return null
  // 有 ItemContent + 真 leading-compact className → 必須顯式 mode="scanning"
  if (/mode=["']scanning["']/.test(code)) return null
  return `套了 leading-compact(scanning 行高)卻未對 ItemContent 傳 mode="scanning" → reading gap token + scanning 行高 off-grid 偏移(同 Notice 2026-06-15 修正前)。修:傳 mode="scanning"(若真要 compact)或移除 leading-compact(若該 reading-md)`
}

function selftest() {
  const cases = [
    { name: 'Notice 修正後(leading-compact 只在註解)', src: `// 原 leading-compact 已移除\n<div className="text-body"><ItemContent label={t} /></div>`, expect: null },
    { name: 'FileItem 正確(顯式 scanning)', src: `<div className="text-body leading-compact"><ItemContent label={n} mode="scanning" /></div>`, expect: null },
    { name: 'Notice 修正前(leading-compact + 無 mode)= 該抓', src: `<div className="text-body leading-compact"><ItemContent label={t} /></div>`, expect: 'fail' },
    { name: '純 reading consumer(無 leading-compact)', src: `<div className="text-body"><ItemContent label={t} /></div>`, expect: null },
  ]
  let ok = true
  for (const c of cases) {
    const r = checkSource(c.src, 'x.tsx')
    const got = r ? 'fail' : null
    const pass = c.expect === 'fail' ? got === 'fail' : got === null
    console.log(`  ${pass ? '✓' : '✗'} ${c.name}`)
    if (!pass) ok = false
  }
  return ok
}

if (process.argv.includes('--selftest')) {
  console.log('item-content-leading-coherence selftest:')
  process.exit(selftest() ? 0 : 1)
}

const files = globSync('packages/design-system/src/**/*.tsx', { cwd: ROOT }).filter(
  (f) => !f.endsWith('.stories.tsx'),
)
const violations = []
for (const rel of files) {
  const r = checkSource(readFileSync(path.join(ROOT, rel), 'utf8'), rel)
  if (r) violations.push(`  - ${rel}: ${r}`)
}
if (violations.length) {
  console.error('❌ ItemContent leading-coherence 偏移:')
  console.error(violations.join('\n'))
  process.exit(1)
}
console.log(`✓ ItemContent leading-coherence:${files.length} 檔,0 個 reading-gap+compact-行高 off-grid 偏移`)
