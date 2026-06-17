---
name: project-cprime-governance-shipped
description: C-prime fork 治理已發版 beta.70;雲端首次-session install-timing 待 user 真機驗證
metadata: 
  node_type: memory
  type: project
  originSessionId: 3fb5856b-7b97-40a4-afa1-5db311326bea
---

**C-prime committed-config-first fork 治理**已建完 + 發版 **beta.70**(2026-06-17,commit `c8f198b5` tagged;main `81912f8d`)。

**架構**:fork 治理本體(fork hooks + 設計紀律 preamble + manifest)隨 npm ship 在 `node_modules/@qijenchen/design-system/ds-canonical/fork/`;committed `.claude/settings.json` 掛 2 個 thin 啟動器 —— `inject_fork_governance_preamble.sh`(SessionStart:install-if-missing 治理本體 + 注入 preamble,**單一 process sequential** 消除並行 race)+ `fork-governance-dispatcher.sh`(Pre/Post/UserPromptSubmit:讀 manifest 跑官方 fork hook)。`npm run sync-all` 同步本體 + idempotent 刷新接線骨架(`scripts/refresh-fork-launchers.mjs`:strip 舊 launcher + 移除 obsolete plugin-era hook 防 brick + union permissions,帶 `.github/no-governance-sync` opt-out)。**不需 plugin**(雲端 enabledPlugins #62174 靜默忽略 + 不認 node_modules → skills 非自動送達;治理核心靠 preamble + hooks)。

**驗證狀態**:
- ✅ 機械層全綠:`build-fork-governance --check` / `test-fork-governance` harness / dogfood(published tarball 含全 corpus 無 leak)/ mirror 0 leaks / tsc / preflight PASS。CI gate 已 wire 進 ci.yml + release.yml + packaging-canary。
- ✅ 4 輪獨立對抗稽核(Workflow)修掉 17 finding(4 BLOCKER 含「dispatcher 用 bash 跑 .py → exit 2 brick 所有 fork 編輯」+ 8 MAJOR 含 registry 漏 ship / 既有 fork 遷移 brick / 雲端 SessionStart 並行 race)。
- 🟡 **唯一待驗(本質無法 headless,等 user 真機)**:**雲端 claude.ai/code 首次 session 的 cold-install timing** —— inject 的 install→inject 雖 sequential 消除並行 race,但「cold `npm install @beta` 是否在 SessionStart hook 時間預算內跑完」只有真實雲端 session 能蓋章。驗法:開 claude.ai/code 連 `ajenchen/ds-product-template` → 新 session → 問 AI「有沒有 item-anatomy 設計紀律?」答得出=成功;答不出=install 超時需換策略(更輕 install / 第二機制)。

相關:[[reference_cloud_governance_loading]](committed hook 雲端 fire 已證 / plugin 不可靠)。SSOT 分類 = `scripts/fork-governance-classification.json`。
