---
name: design-system-audit
description: Systematic audit of this design system for world-class quality. Runs 6 audits (cva defaultVariants drift, spec text quality, spec boundary coverage, story human-language, anatomy Figma-inspect completeness, SSOT pointer dead-links) and surfaces actionable fix lists. Invoke via /design-system-audit when asked to audit, re-audit, check quality, or verify design system health.
---

# Design System Audit

Purpose: catch the bug classes this project has historically shipped (cva three-way drift, spec visual-pollution, abstract story placeholders, broken SSOT pointers). Each audit has a clear rubric tied to CLAUDE.md rules — the skill reports findings; the user approves fixes before I touch files.

## When to run

- User asks to audit / re-audit / 檢查 / verify design system
- Before major release or version bump
- After large refactor that touched specs or cva defaults
- Periodic health check (monthly-ish)
- User mentions "world-class" or quality concerns

## Preconditions

- Working directory is the project root (check `src/design-system/` exists)
- Node modules are installed (for tsc check — not required for audit itself)
- Current branch is clean OR user acknowledges they'll review changes before commit

## Workflow

### Phase 0 — Setup
1. Read `CLAUDE.md` completely to refresh context (rules change; don't audit from memory)
2. Capture `git status --short` baseline
3. Create TaskList tracking all audit phases

### Phase 1 — Six parallel audits (delegate to subagents)

Run these in parallel (single message, multiple `Agent` calls with `run_in_background: true`):

1. **cva defaultVariants drift** — for every component with `cva(...)` + `defaultVariants`, verify spec prop table + tsx docblock + anatomy prop table all agree. Rubric: CLAUDE.md `# Story` → 高風險漂移點.

2. **Spec text quality (Rule A)** — grep all `.spec.md` for visual-form pollution (「窄長形」「會變寬」「看不出 X 邊界」「實作：Xpx 高 Ypx 字」「::after bottom:-1px」etc.). Rubric: CLAUDE.md `# Spec 規則` → Spec 文字品質.

3. **Spec boundary coverage (Rule B)** — for each component spec, check disabled/loading/empty/dark mode/density/icon-only coverage. Apply scope defaults: field-family can delegate to field-controls.spec.md; dark mode via semantic token is implicit; pure wrappers can say "無互動狀態". Rubric: CLAUDE.md `# Spec 規則` → Spec 邊界案例覆蓋.

4. **Story human-language** — audit `.stories.tsx` + `.principles.stories.tsx` for placeholder / abstract / extreme / ASCII-art / spec-code references. Rubric: CLAUDE.md `# Story` → 範例選擇原則 → 明確禁止 table.

5. **Anatomy Figma-inspect completeness** — verify each `.anatomy.stories.tsx` has 5 mandatory sections (元件總覽 / 元件檢閱器 / 色彩對照表 / 尺寸對照表 / 狀態行為), token-first (no raw px without token name), dev language (default not rest), no density dual values, live color swatches present where tokens are shown. Rubric: CLAUDE.md `# Story` → 設計規格 Story 標準.

6. **SSOT pointer dead-link check** — grep all `xxx.spec.md「section-name」` patterns; verify each target heading actually exists. Rubric: CLAUDE.md `# Spec 規則` → SSOT pointer 必須明確指 section.

Each audit MUST report:
- Violations only (skip confirmations)
- file:line for every finding
- Suggested fix direction (not actual fix)
- Final count: `N checked, M violations`

See [references/audit-prompts.md](references/audit-prompts.md) for exact prompts to paste into Agent calls.

### Phase 2 — Triage + user approval

Consolidate findings into a priority matrix:

| Priority | Category | Fix effort |
|---|---|---|
| P0 | Three-way drift (cva vs spec vs anatomy) | Low, surgical |
| P0 | SSOT dead links | Low, text-only |
| P1 | Spec text quality (Rule A) | Medium, per-file |
| P1 | Story human-language | Low, relabel |
| P2 | Anatomy completeness | High, per-component |
| P2 | Spec boundary coverage (Rule B) | Scope-dependent |

Present to user:
- "Found X P0 + Y P1 + Z P2 issues"
- "Recommend fix: all P0 + P1 this run, P2 via targeted follow-up"
- Wait for user approval before any edit

### Phase 3 — Surgical fixes (grouped commits)

Apply fixes in tight commits grouped by category:
- One commit per audit category (cva drift / Rule A / SSOT / story language / anatomy)
- Each commit message lists all files changed and what was fixed
- Run `npx tsc --noEmit` before each commit

### Phase 4 — Report + memory update

After all commits:
- Update `memory/project_audit_progress.md` with:
  - Date + audit coverage
  - Issues found + resolved
  - Known remaining gaps (P2) deferred to next run
- Short final report to user: commits created, deferred items, next re-audit trigger

## Non-goals

- Don't rewrite specs or stories from scratch (surgical fixes only)
- Don't fix pre-existing build / env / node_modules issues
- Don't add new components / features (that's separate work)
- Don't skip Phase 2 approval — user decides P2 scope

## Common failure modes

- **Agent hallucinates fixes that don't apply** → always cross-check file:line before editing
- **Rule B gaps are mostly scope-N/A** → apply scope defaults from CLAUDE.md, don't mechanically stub 46 specs
- **cva audit false positive on undocumented defaults** → only report if both spec/anatomy make a claim that contradicts code
- **Story human-language flags aria-label / cva values** → exclude these from violation criteria

## References

- [references/audit-prompts.md](references/audit-prompts.md) — Exact subagent prompts, tuned across multiple runs
- [references/historical-bugs.md](references/historical-bugs.md) — Bug classes this skill prevents (indexed by date)
