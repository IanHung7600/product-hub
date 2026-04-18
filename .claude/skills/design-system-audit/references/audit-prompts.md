# Audit Subagent Prompts

Each prompt is self-contained — designed to be pasted into an `Agent` call with `run_in_background: true` and `subagent_type: general-purpose`.

All prompts share this opening:

```
Working directory: (pass the project root absolute path)
```

Then the specific audit prompt below.

---

## 1. cva defaultVariants drift

```
Your job: audit cva `defaultVariants` three-way consistency (code vs spec.md vs anatomy story) across ALL variant keys.

For each component in src/design-system/components/ that has a `defaultVariants` block:
1. Grep its `cva(...)` calls → identify every `defaultVariants` key + value
2. Check its `.spec.md` — does the prop table / docblock mark THIS default correctly? Search for `★`, `預設`, `default` markers.
3. Check its `.tsx` top-of-file docblock (JSDoc) — does it mark the correct default?
4. Check its `.anatomy.stories.tsx` — SIZE_SPECS / prop table / default markers.

Priority candidates: Badge, Alert, Sheet, DataTable, Tag, Tabs, Steps, Sidebar, Button, SegmentedControl.

Report ONLY mismatches. Format:
- `ComponentName: cva says X='A', spec.md:N says ★B, anatomy:M says C`

If a component default is consistent across 3 places, don't report it — just count it.
End with: `N components checked, M mismatches found.` Under 400 words.

Don't fix. Report only.
```

---

## 2. Spec text quality (Rule A)

```
Your job: audit all `.spec.md` files under `src/design-system/` against Rule A in CLAUDE.md `# Spec 規則`.

Rule A — no visual-form / implementation pollution. Flag:
- Visual descriptions: 「窄長形」/ 「圓圓的」/ 「凸起」/ 「扁平」/ 「跳動」/ 「崩潰」/ 「看不出 X 邊界」/「看起來像 Y」
- Implementation leak: raw pixel values in running text (`5.5px`, `21px`), Tailwind class lists (`bg-muted rounded-md px-3`), CSS literal (`display: flex; gap: 8px;`), pseudo-element selectors (`::after`, `bottom: -1px`)
- Physical metaphors that belong in stories: 「空心洞」「浮在上面的異物」(ok in .stories, NOT in .spec)

Don't flag:
- Token names (`--field-height-md`, `var(--primary)`)
- cva variant string literals
- SSOT pointers that reference class names by necessity

Report: `file:line — 違規句子 — 建議替換方向`
End: `N specs checked, V violations, top offenders: [list]`. Under 500 words.
```

---

## 3. Spec boundary coverage (Rule B)

```
Your job: audit all `.spec.md` files against Rule B in CLAUDE.md `# Spec 規則` → Spec 邊界案例覆蓋, applying the **Scope 預設** guidance (field-family delegation, dark-mode via semantic token, pure wrappers).

For each spec, check coverage of:
- disabled / loading / empty
- dark mode (only flag if component has custom palette beyond semantic tokens)
- density (only flag if component doesn't use field-height or layout-space tokens)
- icon-only (only flag if component supports icon-only mode)

Apply scope defaults:
- Field-family (Input / NumberInput / DatePicker / Select / Combobox / LinkInput / Textarea / Switch / Slider / SegmentedControl / Checkbox / RadioGroup) — delegating to `field-controls.spec.md` is ACCEPTABLE
- Pure wrappers (Separator / Skeleton / Spinner / Empty) — "本元件無互動狀態" is acceptable

Report only GENUINE gaps (missing and non-delegating). Format:
- `ComponentName — missing: X / Y` + brief context (why not N/A)

End: `N specs checked, M genuine gaps, L scope-N/A accepted.` Under 500 words.
```

---

## 4. Story human-language

```
Your job: audit all `.stories.tsx` + `.principles.stories.tsx` for placeholder / abstract text per CLAUDE.md `# Story` → 範例選擇原則 → 明確禁止.

Flag:
- Placeholder: `Option A/B/C`, `Lorem ipsum`, `foo/bar`, `Test value`, `Item 1/2/3`
- Abstract 代號: `按鈕一 / 按鈕二`, `Variant X`, `Rule A/B`
- Extreme unrealistic: single Button with destructive 3-line text, 50-item filter, 5-level dialog nesting
- Visual symbols: `│─ 業務 ─│`, `A → B → C`, ASCII art
- spec 代號: `符合 Rule 3.2`, `Convention A`
- Variant names used as visible labels (e.g., literal `<Button>Primary</Button>` label)

DON'T flag:
- `aria-label` strings
- `placeholder=` input placeholder props
- cva value literals in variants table
- Badge / status terms where the label IS the real content (e.g., `<Badge>Beta</Badge>`, `<Tag>React</Tag>`)

Report: `file:line — violating text — suggested real scenario` (e.g., "suggest 發布 / 儲存草稿 / 放棄變更")
End: `N files checked, V violations across C components.` Prioritize .principles.stories.tsx > .stories.tsx. Under 600 words.
```

---

## 5. Anatomy Figma-inspect completeness

```
Your job: audit all `.anatomy.stories.tsx` per CLAUDE.md `# Story` → 設計規格 Story 標準.

Each anatomy must have:
1. 元件總覽 (Anatomy diagram + Variant 一覽 + Props table)
2. 元件檢閱器 (variant/state/size controls + blueprint + Inspect panel)
3. 色彩對照表 (Variant × State + live color swatches via `style={{backgroundColor:'var(--token)'}}`)
4. 尺寸對照表 (Size token table + Visual matrix)
5. 狀態行為 (interaction transitions + disabled for all variants)

Flag for each file:
- Missing sections (list which)
- **Density dual values** (`md density / lg density` columns, `28→32px` arrows) — CLAUDE.md forbids
- **"rest" used instead of "default"** — dev language violation
- **Token name shown but no live swatch** (e.g., `bg-primary` as text only, no color box)
- **Raw pixel without token** (when a token exists)
- **Content that belongs elsewhere** (design principles in anatomy, showcase demos in anatomy)

Report per file:
- `ComponentName (path) — missing: [sections] | issues: [brief list with line numbers]`

End: 
- `N anatomy files checked, I incomplete, F Figma-test fails.`
- Top 5 worst files listed.

Under 700 words. Don't fix.
```

---

## 6. SSOT pointer dead-link

```
Your job: verify all SSOT pointers in .spec.md / .tsx files resolve to real headings.

Grep patterns to collect pointers:
- `\.spec\.md「[^」]+」` — inline references
- `\.spec\.md\s*的「[^」]+」` — possessive form
- Any pointer with named heading

For each collected `xxx.spec.md「HEADING」`:
1. Open `xxx.spec.md`
2. Verify a `##` or `###` heading exactly matching HEADING exists
3. Report mismatches with exact `file:line — pointer — actual closest heading`

End: `N pointers checked, M dead, K soft-matches (suggest rename to exact heading)`. Under 300 words.

Don't fix.
```
