# .claude/hooks/ Charter

## 這裡只收:pre/post tool event 的機械化自動檢查

每個 hook 是一個 shell / python script,在 Claude Code tool event 上自動觸發:
- **PreToolUse**:tool 執行前(可 block 或 inject context)
- **PostToolUse**:tool 執行後(通常 inject 提醒 / warning)
- **Stop**:turn 結束(sanity / harvest / metric capture)
- **SessionStart**:session 開始(governance check)

**核心特徵**:**不依賴 AI 自律**,tool 層強制執行;規則可用 `grep` / 條件判斷自動驗證。

## 當前居民(2026-04-26 重整,以 `settings.json` 註冊為準)

### PreToolUse(Edit / Write / MultiEdit)

| Hook | 做什麼 |
|------|--------|
| `enforce_home_charter.sh` | classification-sensitive dir / 新檔案的 charter gate(Write only) |
| `check_file_size_budget.sh` | CLAUDE.md / spec / SKILL / memory 行數預算警告 |
| `check_story_anatomy.sh` | **BLOCKS** stories 繞 DS canonical hand-craft(raw `<div>` 不用 MenuItem / Empty / Popover 等) |
| `check_story_slot_split.sh` | stories slot 拆分結構(同 slot rule 不該拆兩 story:WithStartIcon + WithEndIcon → WithIcon grid) |
| `check_story_category.sh` | stories trait coverage(hasSizes → AllSizes / isOverlay → OpenSnapshot / isInputLike → WithError) |
| `check_principles_canonical.sh` | `*.principles.stories.tsx` Polaris-aligned core(WhenToUse / WhenNotToUse / Vs*Rule / ContentGuidelines)≥ 2 攔截 |
| `check_l3_primitive_import.sh` | L3 primitive(L1 token / L2 atom)使用順序驗證 |

### PostToolUse(Edit / Write / MultiEdit)

| Hook | 做什麼 |
|------|--------|
| `block_prototype_imports.py` | 產品 code 禁止 import `explorations/` |
| `check_token_hygiene.sh` | 硬寫 shadow / shadcn compat alias / overflow raw class |
| `check_hardcoded_strings.sh` | 偵測元件 / spec 內疑似硬寫字串(應走 token / 變數) |
| `check_code_quality.sh` | clean-code 量化警告(`any` / dead export / long function / magic number) |
| `check_cva_default_sync.sh` | 動到 cva `defaultVariants` 時三方(code / spec / story)同步警告 |
| `check_story_compile_drift.sh` | 改元件 tsx / spec 自動跑 compile-stories `--check`(stories 機械產 vs hand-edit drift) |
| `check_layout_space_canonical.sh` | layoutSpace 規則違規(block 旁邊 tight margin / 全 inline form 用 gap-tight)|
| `check_story_name_jargon.sh` | story name 含 spec 內部代號(L1-L7 / canonical / spec X)|
| `check_person_data_richness.sh` | sparse PersonData literal 違反 NameCard 一致呈現 canonical |
| `log_governance_fires.sh` | 治理檔 fire log 寫入 `.claude/logs/hook-fires.jsonl`(L2 anti-bloat) |

### PostToolUse(Skill)

| Hook | 做什麼 |
|------|--------|
| `log_skill_invokes.sh` | skill invoke log 寫入 `.claude/logs/skill-invokes.jsonl` |

### Stop

| Hook | 做什麼 |
|------|--------|
| `stop_tsc_sanity.sh` | turn 動到 `.ts` / `.tsx` 時跑 `tsc -b` 檢查 |
| `stop_governance_drift_check.sh` | turn 動到 governance 檔(CLAUDE.md / rules / skills / memory)時 drift 檢查 |
| `stop_self_audit.sh` | turn 行為 audit(claim 沒 verify / prune trigger / topic 重複 ≥ 3 次 → silent log,不 inject — 詳 known issue 段) |
| `stop_meta_self_audit.sh` | turn infra-score audit(8 維 score 跌 ≥ 5 / 任何 dim < 80 → silent log,不 inject — 詳 known issue 段) |
| `stop_harvest_corrections.sh` | 掃 session 的 user 糾正信號寫 `.claude/logs/user-corrections.jsonl` |
| `stop_capture_metrics.sh` | session 結束 metric snapshot |

### SessionStart

| Hook | 做什麼 |
|------|--------|
| `session_start_governance_check.sh` | 4 check(行數 / prune / corrections / benchmarks 過期 auto-fetch) |

### UserPromptSubmit

| Hook | 做什麼 |
|------|--------|
| `inject_pending_self_audit.sh` | 讀 stop_self_audit / stop_meta_self_audit silent log,dedup + 24h filter + 3KB cap,inject 到 next turn additionalContext。修補 Stop hook silent-log 不 inject 的 known issue。 |

### Helper(非註冊 hook)

| File | 用途 |
|------|------|
| `_log-fire.sh` | 各 hook source 的 fire-logging helper |

## Anti-bloat 落地

- **L1 Pre-write**:`check_file_size_budget.sh` + `check_l3_primitive_import.sh` + `check_principles_canonical.sh` 等(PreToolUse 阻擋 / 警告)
- **L2 Per-commit**:`log_governance_fires.sh` → `.claude/logs/hook-fires.jsonl`(governance file 編輯軌跡)+ `log_skill_invokes.sh`
- **L3 Periodic**:`/knowledge-prune` skill 季度跑,retire ≥ 5%

## 這裡**不收**(反例)

| 疑似要放這但其實不是 | 實際應去 | 為什麼 |
|-------------------|---------|--------|
| 需要 AI 走流程才能判斷的規則 | `.claude/skills/` | hook 只能機械判斷,複雜 workflow 屬 skill |
| 每 session signal rule | `CLAUDE.md` | hook 是 tool-level,不是 session-level |
| 單一元件的 lint rule | 該元件 spec + code | hook 是跨元件系統級,單元件屬 spec |

## 新 hook 的 criteria(必須全部通過)

1. **規則可機械判斷**(grep / 條件邏輯,不需人類 judgment)
2. **觸發 event 清楚**(PreToolUse / PostToolUse / Stop / SessionStart + matcher)
3. **已有明確 tech debt 或 bug class**(不做預防性空守衛)
4. **失敗模式安全**(hook 掛掉不會 block 合法操作 / 誤殺)

## 接線到 settings.json

新 hook 必須在 `.claude/settings.json` 的 `hooks.PreToolUse` / `hooks.PostToolUse` / `hooks.Stop` / `hooks.SessionStart` 陣列註冊,並用 `$CLAUDE_PROJECT_DIR` 作為路徑前綴。範例:

```json
{
  "type": "command",
  "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/hooks/your-hook.sh\""
}
```

## Hook 退出碼約定(Claude Code 協議)

- `exit 0` — 正常,不 inject context
- `exit 2` + stderr — **blocking**,AI 看到 stderr 訊息後必須處理
- `stdout` with `{"hookSpecificOutput":{"hookEventName":"...","additionalContext":"..."}}` — non-blocking context injection

## 已修(2026-04-28):Stop hook → UserPromptSubmit inject 鏈路

**症狀**:Stop hooks(`stop_self_audit` / `stop_meta_self_audit`)silent-log 但不 inject,M14 / M20 的「auto-inject corrective prompt」 不生效 → AI reactive 模式持續。

**修法**:加 `inject_pending_self_audit.sh` 註冊在 UserPromptSubmit hook(該 event 確認支援 `hookSpecificOutput.additionalContext`)。鏈路:

```
turn 結束 Stop event → stop_self_audit / stop_meta_self_audit silent log to .claude/logs/
                                              ↓
user 下一個 prompt → UserPromptSubmit fires → inject_pending_self_audit.sh
                                              ↓
                                        讀 log (since last-inject-ts)
                                        dedup + 24h filter + 3KB cap
                                              ↓
                                        inject 給 AI next-turn context
```

**Self-test**:`bash .claude/hooks/tests/test_inject_pending_self_audit.sh`(5/5 pass)。

## Retired

`retired/` 目錄存舊 hook(不再註冊),保留 reference 不刪除。當前已 retire 的 hook 不在本 inventory 列出 — 以 `settings.json` 為 SSOT。

最近 retire(2026-04-28):
- `check_button_icon_literal.sh` — 違反 Rule-of-3(DS-wide 0 hits,只我 1 次失誤建)

## 建立前必 Read

本 README + 最接近的既有 hook 當範本 + CLAUDE.md `# 治理 canonical` 的 Hook 章節。
