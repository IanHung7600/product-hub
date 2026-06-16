#!/bin/bash
# check_governance_bootstrap.sh — C-prime fail-open 開機 bootstrap(committed in fork)
#
# SessionStart 跑:確認官方治理本體(node_modules/@qijenchen/design-system/ds-canonical/fork)在不在。
#   - 在 → 安靜(治理由 dispatcher 派發)
#   - 不在(還沒 npm install / dep 沒裝)→ 發「請 npm install 啟用治理」notice,但**絕不 exit 2 brick**
# 取代舊 block_production_edit_without_plugin.sh 的鎖死行為:改成「提醒不阻擋」。
#
# fail-open 鐵則:本 hook 任何情況都 exit 0;它只負責「告知」,不負責「攔截」。

set -uo pipefail
DS_FORK="${CLAUDE_PROJECT_DIR:-.}/node_modules/@qijenchen/design-system/ds-canonical/fork"

if [ -f "$DS_FORK/manifest.json" ]; then
  # 治理就位 — 安靜放行
  exit 0
fi

cat >&2 << 'EOF'
💡 DS 治理尚未啟用(node_modules 裡找不到 @qijenchen/design-system 的 fork 治理)。
   請執行 → npm install   (或 npm run sync-all 同步到最新)
   裝好後,設計治理(消費 DS 元件 / layout-space / item-anatomy / 防手刻 primitive 等)會自動生效。
   注:現在「不阻擋」你工作,只是提醒;治理就位後 hook 才會機械把關。
EOF
exit 0
