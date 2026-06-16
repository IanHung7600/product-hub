#!/usr/bin/env node
// checkbox-group-handcraft-invariant — 防「手刻容器包多個 option Checkbox」復發
//
// 不變式(2026-06-15;user 連抓 popover/sheet/coachmark/checkbox.principles 漏網):
//   一組「邏輯相關的選項 Checkbox」(filter / 權限 / 通知偏好 / 同意條款組)必須用
//   <CheckboxGroup>,不可手刻 <div grid|flex-col|space-y-N> + 多個 <Checkbox>。
//   CheckboxGroup 自帶 zero-gap canonical(間距 = SelectionItem py,與 RadioGroup SSOT 共用,
//   checkbox.spec.md L225 / selection-item.tsx)。手刻 space-y-N / gap-N 破壞此 SSOT。
//
// 零誤判判別:
//   - 只抓有「可見 label=」的 Checkbox(= 選項組)；只有 aria-label= 的(狀態展示
//     off/on/indeterminate/disabled,如 checkbox.stories 狀態行)不算選項組 → 不誤判。
//   - 也抓 raw <label><input type="checkbox">選項</label> ×2(popover anatomy 類);
//     bare <input checked onChange>(story dev knob)不匹配。
//   - 不再排除 checkbox 路徑檔(2026-06-15 修:原排除害 checkbox.principles 漏掃)。

import { readFileSync, globSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')

// 可見 label= 的 Checkbox(排除 aria-label=:用 negative lookbehind 擋 `-label`)
const DS_GROUP = /<div className="[^"]*(?:grid|flex-col|flex flex-col|flex flex-wrap|space-y-[0-9])[^"]*">\s*(?:<Checkbox\b(?:(?!\/>)[\s\S]){0,400}?(?<!-)label=(?:(?!\/>)[\s\S]){0,400}?\/>\s*){2,}/g
// raw <label><input type=checkbox>text</label> ×2(option group,非 bare dev knob)
const RAW_GROUP = /(?:<label[^>]*>\s*<input[^>]*type="checkbox"[^>]*\/?>[^<]*<\/label>\s*){2,}/g

export function checkSource(src) {
  const out = []
  for (const m of src.matchAll(DS_GROUP)) {
    const before = src.slice(Math.max(0, m.index - 200), m.index)
    if (!before.includes('CheckboxGroup')) out.push(src.slice(0, m.index).split('\n').length)
  }
  for (const m of src.matchAll(RAW_GROUP)) out.push(src.slice(0, m.index).split('\n').length)
  return out
}

function selftest() {
  const c = [
    { n: 'space-y-2 包 2 個 label Checkbox = 該抓', src: '<div className="space-y-2"><Checkbox label="a" /><Checkbox label="b" /></div>', e: 1 },
    { n: 'CheckboxGroup 包 = 合格', src: '<CheckboxGroup><Checkbox label="a" /><Checkbox label="b" /></CheckboxGroup>', e: 0 },
    { n: '狀態展示(aria-label,flex gap-4)= 不抓', src: '<div className="flex items-center gap-4"><Checkbox aria-label="off" /><Checkbox aria-label="on" /></div>', e: 0 },
    { n: '單一 Checkbox = 不抓', src: '<div className="space-y-2"><Checkbox label="a" /></div>', e: 0 },
    { n: 'raw input option group ×2 = 該抓', src: '<label className="x"><input type="checkbox"/> A</label><label className="x"><input type="checkbox"/> B</label>', e: 1 },
    { n: 'bare dev knob input = 不抓', src: '<input type="checkbox" checked={v} onChange={f} />', e: 0 },
  ]
  let ok = true
  for (const t of c) {
    const got = checkSource(t.src).length
    const pass = (t.e === 0) === (got === 0)
    console.log(`  ${pass ? '✓' : '✗'} ${t.n}(got ${got})`)
    if (!pass) ok = false
  }
  return ok
}

if (process.argv.includes('--selftest')) {
  console.log('checkbox-group-handcraft selftest:')
  process.exit(selftest() ? 0 : 1)
}

const files = globSync('packages/design-system/src/**/*.tsx', { cwd: ROOT })
const v = []
for (const rel of files) {
  for (const ln of checkSource(readFileSync(path.join(ROOT, rel), 'utf8'))) {
    v.push(`  - ${rel}:${ln} 手刻容器包多個 option Checkbox → 用 <CheckboxGroup>(zero-gap canonical,與 RadioGroup 間距 SSOT)`)
  }
}
if (v.length) { console.error('❌ 手刻 checkbox option-group:'); console.error(v.join('\n')); process.exit(1) }
console.log(`✓ checkbox-group-handcraft:${files.length} 檔,0 個手刻選項組`)
