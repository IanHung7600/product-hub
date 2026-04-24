# .claude/planning/ Charter

## 這裡只收:**未開工但已規劃的大型任務**(on-disk 冗餘 spec)

Spec + scope + execution plan 已寫完但未執行的工作。AI session 間持續性的 on-disk 設計文件,**不受 memory 快取 / compaction / MEMORY.md 行數 cap 影響**。

## 當前居民(3 檔,2026-04-24)

| Plan | 狀態 | 開工 trigger(user 說) |
|------|------|----------------------|
| `ds-devmode.md` | Planned | 「開工 ds-devmode / 做 Figma Dev Mode addon」 |
| `story-auto-compile.md` | Phase 1-3 POC done,Phase 4 infra done,Phase 4 migration pending | 「ds 完整 audit / 做 migration / phase 4」(也 auto-chain by audit Dim 23)|
| `row-primitive-consolidation.md` | Phase 1+2 done(Sidebar / TreeView 共用 ROW_PADDING_BY_SIZE),full MenuItem consume deferred | 「開工 row primitive consolidation」 |

## 這裡**不收**(反例 + 正確去處)

| 疑似要放這但其實不是 | 正確去處 | 為什麼 |
|---------------------|---------|--------|
| 已開工且 in-progress 的 task | `TaskCreate` / TaskList(session-local)+ commit progress | planning 是 spec,不是 progress tracker |
| 設計 canonical judgment | `spec.md` | 已執行的 canonical 不該寄生 planning |
| 跨 session feedback / 用戶偏好 | `memory/` | memory 管 preferences,planning 管未來 tasks |
| 單次探索思考 / 過程紀錄 | commit messages / memory | planning 是定稿 execution plan,非思考 scratch |

## 新 planning 的 criteria

1. **Scope ≥ 1 day focused work**(小任務用 TaskCreate 或直接 commit)
2. **有明確 phases + deliverables**(否則是 wish-list,不該存)
3. **明示 開工 trigger**(user 說哪些話觸發)
4. **成功 criteria 清楚**(做到什麼算 done)

## Memory vs Planning 分工

- **Memory**(`~/.claude/.../memory/`)- pointer 指向 planning doc + 1-line summary(索引 + trigger 提醒)
- **Planning**(本 dir)- 完整 spec / scope / phases / deliverables

Rationale:memory 會被 MEMORY.md 行數 cap 約束,planning doc 存 git 永久在。**冗餘一層**,防 AI forget。

## Plan 完成後處理

- **執行中 key learning** → session 結束 commit 到 planning doc(append「Execution notes」節)
- **完成後**:rename `plan-foo.md.completed.YYYYMMDD.md` 歸檔 OR retire(視是否再參考)
- **放棄**:rename `plan-foo.md.rejected.YYYYMMDD.md` + 寫 rejection rationale
