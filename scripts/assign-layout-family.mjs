#!/usr/bin/env node
/**
 * Batch-assign Layout Family to 56 components' componentMeta + spec frontmatter.
 * Replaces Phase 1 mechanical `family: null` TODO placeholder with real assignments.
 */

import fs from 'node:fs'
import path from 'node:path'

const COMPONENTS_DIR = 'src/design-system/components'

// Layout Family assignments per CLAUDE.md 4-Family Model + spec inspection
const FAMILY = {
  // Family 1 Menu item:菜單內掃視單列(scanning)
  // 主要在 Menu/menu-item.tsx(已 migrated 前),其他 Menu / DropdownMenu 是 overlay composite

  // Family 2 List item:頁面閱讀式單列(reading)
  FileItem: 2,
  Steps: 2,

  // Family 3 Pill:單行互動 pill(Button-like)
  Button: 3, // already migrated in original buttonMeta
  Chip: 3,
  Tag: 3,
  Badge: 3,

  // Family 4 Field control:可編輯資料輸入
  Input: 4,
  Textarea: 4,
  NumberInput: 4,
  LinkInput: 4,
  Select: 4,
  Combobox: 4,
  DatePicker: 4,
  TimePicker: 4,
  Checkbox: 4,
  RadioGroup: 4,
  Switch: 4,
  Rating: 4,
  Slider: 4,
  PeoplePicker: 4,
  SelectMenu: 4, // Field-like selection menu

  // Non-family(composite / overlay / layout / display)— family: null
  Field: null, // Layout wrapper
  Alert: null, Notice: null, Toast: null, Coachmark: null,
  Dialog: null, Sheet: null, Popover: null, DropdownMenu: null,
  Tooltip: null, HoverCard: null, FileViewer: null,
  Sidebar: null, TreeView: null, DataTable: null,
  Breadcrumb: null, Tabs: null, Accordion: null,
  Command: null, OverflowIndicator: null,
  NameCard: null, SelectionControl: null, Menu: null,
  Avatar: null, AspectRatio: null, Carousel: null,
  Calendar: null, Chart: null,
  Empty: null, ScrollArea: null, Separator: null, Skeleton: null,
  ProgressBar: null, CircularProgress: null,
  SegmentedControl: null, DateGrid: null, DescriptionList: null,
  FileUpload: null,
}

function toKebab(name) {
  return name.replace(/[A-Z]/g, (c, i) => (i === 0 ? c.toLowerCase() : `-${c.toLowerCase()}`))
}

let updated = 0
let skipped = []

for (const [compName, family] of Object.entries(FAMILY)) {
  const kebab = toKebab(compName)
  const tsxPath = path.join(COMPONENTS_DIR, compName, `${kebab}.tsx`)
  const specPath = path.join(COMPONENTS_DIR, compName, `${kebab}.spec.md`)

  if (!fs.existsSync(tsxPath) || !fs.existsSync(specPath)) {
    skipped.push(`${compName}: missing file`)
    continue
  }

  const tsx = fs.readFileSync(tsxPath, 'utf-8')
  const spec = fs.readFileSync(specPath, 'utf-8')

  const familyLiteral = family === null ? 'null' : String(family)

  // Update tsx: `family: null` → `family: {n}` or keep `null`
  let newTsx = tsx
  const tsxFamilyRe = /family:\s*(?:null|\d+)(,)?\s*\/\/ TODO[^\n]*/
  if (tsxFamilyRe.test(tsx)) {
    newTsx = tsx.replace(
      tsxFamilyRe,
      family === null
        ? `family: null, // non-family composite / overlay / layout`
        : `family: ${familyLiteral},`,
    )
  } else {
    // Look for existing family line (may already be updated)
    const updated2 = /family:\s*\d+\b/.test(tsx)
    if (!updated2) skipped.push(`${compName}: tsx family line not found`)
  }

  // Update spec frontmatter: `family: null` → `family: {n}`
  let newSpec = spec
  const specFrontmatterRe = /(---\n[\s\S]*?)family:\s*null([\s\S]*?\n---)/
  if (specFrontmatterRe.test(spec)) {
    newSpec = spec.replace(
      specFrontmatterRe,
      `$1family: ${family === null ? 'null' : family}$2`,
    )
  }

  if (newTsx !== tsx) fs.writeFileSync(tsxPath, newTsx)
  if (newSpec !== spec) fs.writeFileSync(specPath, newSpec)
  if (newTsx !== tsx || newSpec !== spec) updated++
}

console.log(`\n✅ Assigned family to ${updated} components`)
if (skipped.length) {
  console.log(`\n⚠️  Skipped:`)
  for (const s of skipped) console.log(`  ${s}`)
}
