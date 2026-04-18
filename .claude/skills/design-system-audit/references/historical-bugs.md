# Bug Classes This Skill Prevents

Curated from the `# 失敗記憶索引` in CLAUDE.md plus audit runs. Each entry names the bug class, how it originally slipped in, and which audit catches it.

---

## Three-way drift — cva vs spec vs anatomy

**First seen**: SegmentedControl (2026-04-18) — cva `defaultVariants.size = 'md'` but spec.md + tsx docblock + anatomy all wrote `sm ★default`. Three-way disagreement persisted unnoticed.

**Caught by**: Audit 1 (cva defaultVariants drift).

**Recurrence**: Steps anatomy prop table drift (orientation), SegmentedControl anatomy prop table drift (size still `'sm'` in anatomy-only location). Both caught in 2026-04-18 run.

**Why it recurs**: When developer changes `cva()` defaults, the sync checklist across 4 locations (cva + spec prop table + tsx docblock + anatomy prop table + anatomy story H3) is easy to miss. Automation via grep `"★|預設|default"` across a component's folder before committing is the primary guard.

---

## Spec text pollution — visual / implementation details

**First seen**: Multiple specs across the audit — Badge with `16px 高、10px 字`, Chip with `display: flex; gap: 8px;`, NameCard with `bg-muted rounded-md px-3 py-2`, Tabs with `::after bottom: -1px`, Slider with「被 range 圍住的空心洞」物理比喻.

**Caught by**: Audit 2 (Rule A).

**Why it recurs**: When writing specs, authors feel compelled to be "precise" — but precise pixel / class specs belong in `.tsx` (source of truth for values) and `.anatomy.stories.tsx` (visual reference). Spec is for design principles (why / when). Visual metaphors belong in `.principles.stories.tsx` (visualization).

**Rule of thumb**: if removing the sentence from spec would leave the principle intact, the sentence is describing implementation — remove it.

---

## Story placeholders — `Option A / B / C` / variant names as labels

**First seen**: Button principles used `<Button variant="primary">Primary</Button>` as a label, Tag used `分類 A / B / C / D / E`, Steps used `Step 1/2/3/4` without business scenario.

**Caught by**: Audit 4 (Story human-language).

**Why it recurs**: When authoring stories, it's tempting to use variant names or letters because "it demonstrates all the variants." But Storybook's受眾 is any designer / PM / engineer opening it — they should grasp the scenario from the example alone, not from the label.

**Rule of thumb**: every story example must pass the 「人」test (遮標題光看元件懂情境) — if it fails, use a real business scenario (Jira / Stripe / Notion).

---

## SSOT pointer drift — heading renamed, pointer not updated

**First seen**: `opacity.spec.md` pointed to `color.spec.md「Disabled 策略」` but actual heading was「Disabled 狀態 / 兩種 disabled 策略」. Similar issues across 4 pointers (radio-group, item-layout, name-card).

**Caught by**: Audit 6 (SSOT pointer dead-link).

**Why it recurs**: Headings get renamed for clarity. Pointers using 「heading」 format hard-code the old name. Grep-audit across `\.spec\.md「[^」]+」` surfaces these.

**Prevention**: when renaming a spec heading, grep the project for the old heading name first — find reverse references, update them.

---

## Anatomy incomplete — missing sections (no color matrix / no state matrix)

**First seen**: Popover / Sheet / Command / PeoplePicker / NameCard have only 1-3 stories where 5 are required. Live color swatches missing in SegmentedControl / Switch / Tabs / Toast / Steps / Slider / Textarea / Field / TreeView (tokens as text only).

**Caught by**: Audit 5 (Anatomy completeness).

**Why it recurs**: When a component is simple (single variant, single size), authors feel the full 5-section template is overkill. But even simple components benefit from explicit "本元件無 size" / "本元件無 state" statements — the skeleton provides Figma-inspect-parity for designers.

---

## Density dual values in anatomy

**First seen**: Tabs / SegmentedControl / Sidebar anatomy size tables had `md density / lg density` columns showing `28→32px` dual values.

**Caught by**: Audit 5 (Figma-test).

**Why it recurs**: Authors want to be thorough. But CLAUDE.md explicitly forbids — anatomy reflects *current* density (re-rendered on density switch); dual columns are noise. Token name is enough.

---

## Internal vs Components misclassification

**First seen**: HoverCard originally under `Components/` (behavior primitive, no default visual) — should be `Internal/`.

**Caught by**: CLAUDE.md has a 3-question test; audits cross-check.

**Why it recurs**: Name bias — HoverCard *sounds* like a public component. Always go by behavior (has default visuals? rendered directly anywhere?) not name.

---

## Field-height family default inconsistency

**First seen**: Chip was listed in the default-md family but is actually fixed single-size (h-field-sm, Material 3 convention). Clean-up in 2026-04-18.

**Caught by**: Audit 1 + Audit 3 scope application.

**Why it recurs**: Authors see "component consumes field-height token" and assume it's in the sm/md/lg family. Single-size consumers (Chip, Breadcrumb?) need separate classification.

---

## Chart of audit → bug class

| Audit | Primary bug class | Secondary |
|-------|-------------------|-----------|
| 1. cva drift | Three-way default drift | Family classification |
| 2. Rule A | Spec text pollution | Visual description leaks |
| 3. Rule B | Missing boundary coverage | Scope misapplication |
| 4. Story language | Placeholder / abstract labels | Extreme unrealistic |
| 5. Anatomy | Missing sections / dev-lang | Density dual / no swatches |
| 6. SSOT | Dead link pointers | Heading drift |
