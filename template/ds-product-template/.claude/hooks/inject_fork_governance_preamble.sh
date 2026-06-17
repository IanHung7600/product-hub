#!/bin/bash
# inject_fork_governance_preamble.sh — C-prime 事前指引注入(committed in fork,SessionStart)
#
# 這是「讓 fork AI 事前主動遵循設計原則」的核心機制(codex 共識 #3/#4)。
# 讀 npm-current 的 fork 治理 preamble(node_modules,npm install/sync-all 後最新)→ 經
# additionalContext 注入進 session context。這條路可靠(committed SessionStart hook web 已實證 fire)
# + npm-current(讀 node_modules,非 committed 副本 → 零 drift)+ 不靠 @import/path-scoped-rules
# (那兩個 docs 證實不可靠:@import 在 code block 不解析 / path-scoped 只 Read 載入 #38487)。
#
# fail-open:preamble 缺(還沒 npm install)→ 不輸出、exit 0,永不 brick(bootstrap 另發 notice)。
# 對齊既有 13 個用 additionalContext 的 hook 的輸出契約。

set -uo pipefail
PD="${CLAUDE_PROJECT_DIR:-.}"
PREAMBLE="$PD/node_modules/@qijenchen/design-system/ds-canonical/fork/preamble.md"

# 治理本體缺(雲端 fresh-clone 還沒裝)→ 安靜放行(bootstrap 會發 npm install notice)
[ -f "$PREAMBLE" ] || exit 0

CONTENT=$(cat "$PREAMBLE" 2>/dev/null)
[ -z "$CONTENT" ] && exit 0

# 經 additionalContext 注入(SessionStart);用 jq 安全 JSON-escape preamble 全文
jq -n --arg ctx "$CONTENT" '{
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: ("# DS 設計治理(npm-current,事前主動遵循)\n\n" + $ctx)
  }
}'
exit 0
