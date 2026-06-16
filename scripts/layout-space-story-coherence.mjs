#!/usr/bin/env node
// layout-space-story-coherence — 防 layoutSpace overview story 顯示值跟 CSS 真值 drift
//
// 不變式(2026-06-15 user 抓 story 顯示 tight 8/12、bottom 24/32 但 CSS 真值是 12/16、48/48):
//   layoutSpace.stories.tsx 的 <SpaceRow utility lgValue mdValue> 顯示值,必須等於
//   layoutSpace.css 的 :root(md)+ [data-layout-space=lg](lg)真實 token 值。
//   story hardcode 顯示值沒從 CSS 衍生 → 會 silent drift,稽核從沒比對過(本 anchor)。

import { readFileSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const CSS = readFileSync(path.join(ROOT, 'packages/design-system/src/tokens/layoutSpace/layoutSpace.css'), 'utf8')
const STORY = readFileSync(path.join(ROOT, 'packages/design-system/src/tokens/layoutSpace/layoutSpace.stories.tsx'), 'utf8')

// 解析 CSS:md = :root 第一次出現;lg = [data-layout-space="lg"] / [data-density="lg"] 區塊
function cssVal(name, block) {
  const re = new RegExp(`--layout-space-${name}:\\s*([0-9]+px)`, 'g')
  const all = [...CSS.matchAll(re)].map((m) => m[1])
  // :root 在前、lg 區塊在後(檔案順序);md = all[0],lg = all[1] ?? all[0]
  return block === 'lg' ? (all[1] ?? all[0]) : all[0]
}

const violations = []
for (const name of ['tight', 'loose', 'bottom']) {
  const row = STORY.match(new RegExp(`<SpaceRow utility="--layout-space-${name}"[^>]*?mdValue="([0-9]+px)"[^>]*?lgValue="([0-9]+px)"`))
    || STORY.match(new RegExp(`<SpaceRow utility="--layout-space-${name}"[^>]*?lgValue="([0-9]+px)"[^>]*?mdValue="([0-9]+px)"`))
  if (!row) { violations.push(`  - story 找不到 --layout-space-${name} 的 SpaceRow`); continue }
  // 依正則順序對應 md/lg(第一個 pattern md 先;第二個 lg 先)
  const isMdFirst = STORY.indexOf(`mdValue`) < STORY.indexOf(`lgValue`)
  const storyMd = isMdFirst ? row[1] : row[2]
  const storyLg = isMdFirst ? row[2] : row[1]
  const cssMd = cssVal(name, 'md')
  const cssLg = cssVal(name, 'lg')
  if (storyMd !== cssMd) violations.push(`  - --layout-space-${name} md:story 顯示 ${storyMd} ≠ CSS ${cssMd}`)
  if (storyLg !== cssLg) violations.push(`  - --layout-space-${name} lg:story 顯示 ${storyLg} ≠ CSS ${cssLg}`)
}

if (violations.length) {
  console.error('❌ layoutSpace story 顯示值 ≠ CSS 真值(drift):')
  console.error(violations.join('\n'))
  console.error('   修:對齊 layoutSpace.stories.tsx 的 SpaceRow mdValue/lgValue 到 layoutSpace.css')
  process.exit(1)
}
console.log('✓ layout-space-story-coherence:story 顯示值 = CSS 真值(tight/loose/bottom × md/lg)')
