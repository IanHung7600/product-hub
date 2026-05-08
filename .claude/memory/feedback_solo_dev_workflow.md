# Solo dev workflow — branch push for preview,user 拍板才 push main

**Codified 2026-05-04** — 2 次更正:第 1 次我寫「push direct main」是錯的;user 糾正後改寫。

## 真實 workflow(2-step gating)

```
1. AI edit code
2. AI commit + push 到 working branch        ← Netlify auto-deploy preview URL
3. User 點 Netlify preview URL 檢查
4. user 說「push」/「OK」                     ← gate 1
5. AI merge / push 到 main                    ← Netlify deploy production
6. (loop)user 說「改 X」→ AI 繼續 step 1
```

## 為什麼是 2-step

- **Netlify deploy-preview 預設啟用 per-branch**(`netlify.toml` 註解寫明:任何 branch push → 自動 preview)
- **main = production deploy**(用戶可見的真環境)
- 編輯 → preview 給 user 預檢 → user 拍板 → 才 push main
- **AI 不主動 push main**,等 user 明確說「push」/「OK」

## 一個 chat = 一條 working branch

- harness session-start 通常分配 `claude/<task>-XXX` working branch
- 整個 chat 的所有 edit / commit 都 push 該 branch(觸發多次 preview deploy)
- user 在 preview 看到滿意 → 說「push」→ merge 該 branch 到 main + delete branch

## 不要做的事

- ❌ 開 **多** branch(split / fix-forward / hotfix branch)— 1 chat = 1 working branch
- ❌ 開 PR(直接 merge 即可)
- ❌ AI 自己決定 push main(沒收到 user「push」指令前不 push main)
- ❌ 同 chat 留 deferred / 「下個 session 處理」措辭
- ❌ 邊 edit 邊跳到別的 branch(loop 內穩定 working branch)

## 該做的事

- ✓ Edit + commit + push working branch(每次 commit 都觸發 preview deploy)
- ✓ 告訴 user preview URL or 主要 change(讓 user 知道要看什麼)
- ✓ user 說「push」/「OK」→ merge to main(squash 1 commit OR fast-forward)
- ✓ merge 後 delete remote branch(避 stale)
- ✓ 設計衝突真需 user 拍板才停下中間 phase
- ✓ user 說「改 X」→ 繼續 working branch edit + push

## 例外:harness session-start 沒給 branch

罕見。若無分配 → 開單一 `claude/<task>-XXX` 自命名 working branch,後續同上。

## Trigger phrase reference

User 說以下 → push main:
- 「push」
- 「OK」/「好」/「沒問題」(在「請我看 preview」context 下)
- 「合進去」/ 「合 main」

User 說以下 → 繼續 edit 不 push main:
- 「改 X」/「不對」
- 「再看看」/「等等」

## 反 pattern(2026-05-02→04 session 我犯的錯)

1. 把 1 個原始 PR 拆 2 PR(product + governance) — 多餘
2. 開 fix-forward PR(post-merge review 找到 bug)— 應該繼續同 working branch 修
3. 開 hotfix PR(我引入 bug)— 應該直接 working branch 修 + push main
4. 留 6 個 stale branch(harness 不允許 delete remote,user 手動清)
5. 第一版 memory 寫「push direct main」— 錯解 workflow,跳過 user 預檢

## 2026-05-08 — 第 3 次違反 → 升 mechanical hook (M28)

同 session 開 5 branch + 2 PR(#7、#8)+ 4 個 sequential 新 branch (gitignore-stop-hook-state / git-solo-work-canonical / fix-canonical-solo-workflow / governance-threshold-calibration)。Markdown rule (本檔 2026-05-04 codified) + CLAUDE.md pointer (cd8733d) 都不夠擋 — 我跳過 grep 本檔直接憑印象。

**Mechanical 升級**:
- M28 加入 `.claude/rules/meta-patterns.md`(mindset #2 AI-ops 子規則)
- `.claude/hooks/check_solo_workflow.sh` PreToolUse Bash + mcp github tools:
  - R1 BLOCK: 第 2 個 `git checkout -b claude/*` in same session(track via `.claude/logs/session-branch-track.jsonl`)
  - R2 BLOCK: PR creation(`gh pr create` / `mcp__github__create_pull_request`)
  - R3 BLOCK: push/merge to main 無 user「push/OK/好/合 main」trigger keyword in 近 10 user messages
- Override:`CLAUDE_BYPASS_SOLO_WORKFLOW=1` env var,bypass 寫 `.claude/logs/solo-workflow-bypass.jsonl` 留審計

**自我反省**:本次違反 mindset #2「優先消費既有」— 本檔 2026-05-04 寫得清楚,我沒 grep 直接憑印象重新 codify(PR #8 寫成「branch + PR + merge」全錯)。Hook 攔住的不是「不知道」,是「不查」。M28 強制 git-ops 也算 mindset #2 scope,違反 = hook BLOCK exit 2 不能繞過(除非 explicit env override)。

## 對齊既有 governance

- Mindset #1「對標世界級」≠ 對標「multi-reviewer team workflow」。也不等於「無 review push main」。
- M21「Premature abstraction」延伸:**Premature workflow ceremony 也算**(branch + PR 是 multi-dev ceremony,solo 不需多 branch)
- M14 AUTO integrate:5-layer 完成才 stop;不 deferred / 不分 session
