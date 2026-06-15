#!/usr/bin/env node
// checkbox-group-handcraft-invariant — 防「手刻 div 包多個 Checkbox 當邏輯選項組」復發
//
// 不變式(2026-06-15 user 抓 Popover/Sheet/Coachmark filter panel 漏網):
//   一組「邏輯相關的選項 Checkbox」(filter / 通知偏好等)必須用 <CheckboxGroup> 包,
//   不可手刻 <div className="grid|flex-col"> + 多個 <Checkbox>。CheckboxGroup 自帶
//   zero-gap canonical + Context 隔離(checkbox.spec.md L225);手刻 div 的 gap 不受控、
//   跟 group selection a11y 脫鉤。2026-04-29 migration 只改主 popover story,漏了 6 處
//   principles/sheet/coachmark demo = 典型「改一處沒看三處」。
//
// 違規簽名(零誤判):<div className="...grid|flex-col..."> **直接** 包 ≥2 個連續
//   <Checkbox .../>(中間無其他 wrapper)。獨立 checkbox(DataTable 行選取 / TreeView 節點 /
//   各自 <Field> 的單 checkbox)不符此簽名 → 不誤判。

import { readFileSync, globSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const RE = /<div className="[^"]*(?:grid|flex-col|flex flex-col)[^"]*">\s*(?:<Checkbox\b[^>]*\/>\s*){2,}/g

export function checkSource(src) {
  // 排除 checkbox 元件自身(CheckboxGroup demo / 定義)
  const out = []
  for (const m of src.matchAll(RE)) {
    const before = src.slice(Math.max(0, m.index - 200), m.index)
    if (!before.includes('CheckboxGroup')) {
      out.push(src.slice(0, m.index).split('\n').length)
    }
  }
  return out
}

function selftest() {
  const cases = [
    { n: '手刻 grid 包 2 Checkbox = 該抓', src: `<div className="grid"><Checkbox label="a" /><Checkbox label="b" /></div>`, expect: 1 },
    { n: 'CheckboxGroup 包 = 合格', src: `<CheckboxGroup><Checkbox label="a" /><Checkbox label="b" /></CheckboxGroup>`, expect: 0 },
    { n: '單一 Checkbox = 不抓', src: `<div className="grid"><Checkbox label="a" /></div>`, expect: 0 },
    { n: '各自 Field 的獨立 checkbox = 不抓', src: `<Field><Checkbox label="a" /></Field><Field><Checkbox label="b" /></Field>`, expect: 0 },
  ]
  let ok = true
  for (const c of cases) {
    const got = checkSource(c.src).length
    const pass = got === c.expect
    console.log(`  ${pass ? '✓' : '✗'} ${c.n}（got ${got}, expect ${c.expect}）`)
    if (!pass) ok = false
  }
  return ok
}

if (process.argv.includes('--selftest')) {
  console.log('checkbox-group-handcraft selftest:')
  process.exit(selftest() ? 0 : 1)
}

const files = globSync('packages/design-system/src/**/*.tsx', { cwd: ROOT }).filter(
  (f) => !f.toLowerCase().includes('checkbox'),
)
const violations = []
for (const rel of files) {
  for (const ln of checkSource(readFileSync(path.join(ROOT, rel), 'utf8'))) {
    violations.push(`  - ${rel}:${ln} 手刻 div 包多個 Checkbox → 改 <CheckboxGroup>(checkbox.spec.md L225 zero-gap canonical）`)
  }
}
if (violations.length) {
  console.error('❌ 手刻 checkbox-group div 偏移:')
  console.error(violations.join('\n'))
  process.exit(1)
}
console.log(`✓ checkbox-group-handcraft:${files.length} 檔,0 個手刻選項組 div`)
