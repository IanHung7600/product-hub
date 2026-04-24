#!/usr/bin/env node
/**
 * Story Auto-Compile POC — Phase 3
 *
 * 讀 tsx componentMeta export + spec.md YAML frontmatter,
 * 驗 keys 一致性,產出 canonical story rows(variant/size/state/token matrix)。
 *
 * Usage:
 *   node scripts/compile-stories.mjs <ComponentName>
 *     e.g. node scripts/compile-stories.mjs Button
 *
 * 本 POC 只做 Phase 3 核心 step:
 * 1. Parse spec.md frontmatter(YAML)
 * 2. Extract componentMeta from tsx(regex,之後改 AST)
 * 3. Validate variants / sizes keys 對齊
 * 4. 產 anatomy Overview canonical block(markdown for now,之後產 tsx)
 *
 * Phase 4 會加:AST-based tsx parse / pre-commit hook / drift detection。
 */

import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'

const componentName = process.argv[2]
if (!componentName) {
  console.error('Usage: node scripts/compile-stories.mjs <ComponentName>')
  process.exit(1)
}

const lowerKebab = componentName.replace(/[A-Z]/g, (c, i) => (i === 0 ? c.toLowerCase() : `-${c.toLowerCase()}`))
const specPath = `src/design-system/components/${componentName}/${lowerKebab}.spec.md`
const tsxPath = `src/design-system/components/${componentName}/${lowerKebab}.tsx`

// ── 1. Parse spec.md frontmatter ──────────────────
const specContent = fs.readFileSync(specPath, 'utf-8')
const fmMatch = specContent.match(/^---\n([\s\S]*?)\n---\n/)
if (!fmMatch) {
  console.error(`❌ ${specPath} 無 YAML frontmatter — Phase 2 migration 未做`)
  process.exit(1)
}
const specMeta = yaml.load(fmMatch[1])

// ── 2. Extract componentMeta from tsx(POC regex)─────
const tsxContent = fs.readFileSync(tsxPath, 'utf-8')
const metaMatch = tsxContent.match(/export const \w+Meta = (\{[\s\S]*?\n\}) as const/)
if (!metaMatch) {
  console.error(`❌ ${tsxPath} 無 componentMeta export — Phase 1 migration 未做`)
  process.exit(1)
}
// POC:eval in sandbox(Phase 4 改 AST parse,避免 eval 安全風險)
const tsxMeta = eval(`(${metaMatch[1]})`)

// ── 3. Validate keys 對齊 ───────────────────────────
const errors = []
const specVariants = Object.keys(specMeta.variants || {})
const tsxVariants = Object.keys(tsxMeta.variants || {})
const missing = specVariants.filter(k => !tsxVariants.includes(k))
const extra = tsxVariants.filter(k => !specVariants.includes(k))
if (missing.length) errors.push(`variants spec-only: ${missing.join(', ')}`)
if (extra.length) errors.push(`variants tsx-only: ${extra.join(', ')}`)

const specSizes = Object.keys(specMeta.sizes || {})
const tsxSizes = Object.keys(tsxMeta.sizes || {})
const sMissing = specSizes.filter(k => !tsxSizes.includes(k))
const sExtra = tsxSizes.filter(k => !specSizes.includes(k))
if (sMissing.length) errors.push(`sizes spec-only: ${sMissing.join(', ')}`)
if (sExtra.length) errors.push(`sizes tsx-only: ${sExtra.join(', ')}`)

if (errors.length) {
  console.error(`❌ ${componentName} — spec/tsx canonical drift:`)
  errors.forEach(e => console.error(`  - ${e}`))
  process.exit(1)
}
console.log(`✅ ${componentName} — spec + tsx canonical keys 對齊`)

// ── 4. Generate anatomy Overview canonical block(markdown POC)──
console.log('')
console.log('=== AUTO-COMPILED anatomy Overview section ===')
console.log('')
console.log(`# ${componentName} 元件總覽`)
console.log('')
console.log(`**Layout Family**: ${tsxMeta.family}`)
console.log(`**Default**: variant=\`${tsxMeta.defaultVariant}\` / size=\`${tsxMeta.defaultSize}\``)
console.log('')
console.log('## Variants')
console.log('')
console.log('| Variant | When | World-class 對照 |')
console.log('|---------|------|-----------------|')
for (const [key, specV] of Object.entries(specMeta.variants)) {
  const wc = (specV['world-class'] || []).join(' / ')
  console.log(`| \`${key}\` | ${specV.when} | ${wc} |`)
}

console.log('')
console.log('## Sizes')
console.log('')
console.log('| Size | Field Height | Icon | Typography | When |')
console.log('|------|-------------|------|-----------|------|')
for (const [key, tsxS] of Object.entries(tsxMeta.sizes)) {
  const specS = specMeta.sizes[key] || {}
  console.log(`| \`${key}\` | ${tsxS.fieldHeight}px | ${tsxS.iconSize}px | ${tsxS.typography} | ${specS.when || '—'} |`)
}

console.log('')
console.log('## States')
console.log('')
console.log(tsxMeta.states.map(s => `- ${s}`).join('\n'))

console.log('')
console.log('## Tokens consumed')
console.log('')
for (const [cat, tokens] of Object.entries(tsxMeta.tokens)) {
  console.log(`- **${cat}**: ${tokens.map(t => `\`${t}\``).join(', ')}`)
}

// ── 5. Do/Don't from spec.禁止事項 ─────────────────
if (specMeta['禁止事項']) {
  console.log('')
  console.log('## Do / Don\'t(auto from spec 禁止事項)')
  console.log('')
  specMeta['禁止事項'].forEach((d, i) => {
    console.log(`**${i + 1}. ❌ ${d.rule}**`)
    console.log(`   - Why: ${d.reason}`)
    console.log(`   - 反例: \`${d['反例']}\``)
    console.log('')
  })
}

console.log('=== END AUTO-COMPILED block ===')
console.log('')
console.log(`Phase 3 POC done. Next: Phase 4 integration(pre-commit hook + drift detection + tsx AST parse + 44 元件 migration).`)
