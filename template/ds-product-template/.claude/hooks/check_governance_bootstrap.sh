#!/bin/bash
# check_governance_bootstrap.sh — C-prime fail-open SessionStart bootstrap(committed in fork)
#
# 雲端事實(已查證 platform.claude.com/managed-agents/environments):每個 cloud session 是 fresh
# Linux container、sessions 不共享 filesystem → node_modules 每個新 session 都不在(gitignore),
# 且雲端不自動 npm install 專案依賴。→ 治理本體(node_modules/@qijenchen/design-system/ds-canonical/fork)
# 在 session 開始時缺席。
#
# 本 hook 在 SessionStart(已實證雲端會 fire + 雲端網路 unrestricted)偵測:
#   - 治理本體在 → 安靜放行
#   - 缺(雲端 fresh clone / 還沒裝)→ guarded 自動 npm install 啟用治理本體 → 同 session 後續 dispatcher 就有東西跑
#   - install 失敗 → notice,**永不 exit 2 brick**(fail-open)
# 本機(node_modules 已存在持久)→ 第一條就 exit 0,不會多跑 install。

set -uo pipefail
PD="${CLAUDE_PROJECT_DIR:-.}"
DS_FORK="$PD/node_modules/@qijenchen/design-system/ds-canonical/fork"

# 已就位 → 安靜(本機持久 / 已裝過)
[ -f "$DS_FORK/manifest.json" ] && exit 0

# 治理本體缺 → 嘗試自動裝(僅在有 package.json 時;雲端網路 unrestricted)
# codex risk 2:plain `npm install` 會被 lockfile 重現「舊」依賴樹 → 拿不到最新治理。
# 明確裝 @beta(對齊 sync-all)保證 npm-current,而非 lockfile pinned 舊版。
if [ -f "$PD/package.json" ]; then
  echo "💡 DS 治理本體缺(可能是雲端 fresh-clone session)→ 自動裝最新治理(@beta)…" >&2
  ( cd "$PD" && npm install @qijenchen/design-system@beta @qijenchen/storybook-config@beta --legacy-peer-deps --no-audit --no-fund >/dev/null 2>&1 ) || true
fi

# 裝完複驗
if [ -f "$DS_FORK/manifest.json" ]; then
  echo "✅ DS 治理本體已就位(本 session 後續編輯會自動套用設計治理)。" >&2
  exit 0
fi

# 仍缺(install 失敗 / 無 package.json)→ notice,不阻擋
cat >&2 << 'EOF'
💡 DS 治理尚未就位(npm install 未完成或失敗)。請手動執行 → npm install(或 npm run sync-all)。
   注:現在「不阻擋」你工作,只是提醒;治理本體就位後設計治理 hook 才會機械把關。
EOF
exit 0
