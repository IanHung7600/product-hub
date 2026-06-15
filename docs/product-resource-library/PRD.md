# 產品資源庫平台 — PRD（產品需求文件）

> 版本：v0.1（draft）｜日期：2026-06-15｜作者：UX Lead
> 狀態：規劃對齊中（P0）｜本文件不含實作 code，作為 PM / dev / UX 三方對齊基準

---

## 0. 一句話定位

一個**可瀏覽的展示目錄（catalog）**，讓 PM 與工程師在產品**發想階段**就能查看公司既有的共用 UI Module 與共用能力流程（表單、簽核、待辦、通知），並理解如何在自己的產品中**引用與組合**，最大化複用、減少從零規劃。

**本期非目標（Out of Scope）**：
- 不是低代碼 builder（不在平台上拖拉產生可跑的 app）
- 不接真實後端 API（Module 為純前端可互動 demo，使用 mock 資料）
- 權限控管不列為獨立展示 Module（改作橫切治理關注點，見 §4.5）

---

## 1. 產品目標與背景

### 1.1 問題陳述
公司內大小系統產品各自規劃，導致：
- 同類流程（請假、報銷、簽核、問卷）在不同產品**重複設計、重複實作**，型態不一致
- PM 在發想期缺乏「可參考的既有資產」，常從零開始畫 wireframe
- 設計系統（DS）已收斂到 **component 層**，但 **component 之上、產品之下的「Module 流程層」尚無統一載體**，知識散落在各產品 repo
- dev 不知道「別的產品已經做過這個流程」，無從複用

### 1.2 目標成果
| 指標方向 | 期望 |
|---------|------|
| 複用率 | 新產品發想期能引用 ≥1 個既有 Module 作為起點 |
| 一致性 | 共用流程跨產品型態收斂（同一基礎模板 + 有限變種） |
| 溝通效率 | PM 與 dev 用同一份 Module 詳情頁對齊，減少口頭傳達落差 |
| 發想速度 | 「從資源庫引用組合」取代「從零規劃」成為預設工作流 |

### 1.3 與既有 repo 的關係（重要）
本平台**不從零開始**。現有 `product-hub` monorepo 已是天然底座：
- DS 已有 **52 個公開元件 + 公開 patterns**（SSOT：`packages/design-system/src/index.ts`）
- 已有 **i18n / dark-light / RWD** 基礎建設（見 §6）
- 已有 **app 模板與場景架構**（`apps/template/`、`.claude/references/scenario-definition.md`）

本平台要新增的是**兩個缺口**：
1. **Module 層**（component 之上、app 之下的共用能力流程合成）
2. **資源庫平台 UI**（讓 PM/dev 瀏覽引用的展示站本身）

---

## 2. 目標使用者與 JTBD（Jobs To Be Done）

| 角色 | 主要場景 | Job To Be Done |
|------|---------|----------------|
| **PM（產品經理）** | 發想 / 規劃期 | 「當我要規劃一個新的員工面產品時，我想快速看到公司已有哪些可複用的流程模板與情境，好讓我不必從零畫起、且能說服 stakeholder 這是成熟方案。」 |
| **Dev（工程師）** | 接手實作期 | 「當 PM 指定要用某個 Module 時，我想看到它依賴哪些 DS 元件、可調整的 props/slots、客製化邊界，好讓我直接引用而非重寫。」 |
| **UX Lead（設計治理）** | 維護期 | 「當產品團隊各自客製時，我想確保大家都基於同一套基礎模板與有限變種，好讓視覺與操作行為維持一致、不漂移。」 |

**雙視圖原則**：同一個 Module 詳情頁，需同時服務 PM（流程/情境視角）與 dev（規格/code 視角）。見 §4.2。

---

## 3. 資訊架構（IA）

### 3.1 三層心智模型
平台的核心是讓使用者理解「複用的三個層級」：

| 層級 | 是什麼 | 例子 | 既有 SSOT |
|------|--------|------|-----------|
| **L1 元件（Component）** | DS 原子積木 | Button、Input、DataTable、Dialog | `packages/design-system/src/index.ts` |
| **L2 模組（Module）** | 共用能力流程（本平台新增層）| 表單問卷、多層級簽核、待辦、通知 | 本 PRD §5 |
| **L3 產品案例（Product）** | 真實產品如何組合 L2 + L1 | 「請假系統」「報銷系統」 | 各產品 app |

### 3.2 主導航（Sitemap）
```
首頁（Home）
├─ 共用能力目錄（Modules）           ← 平台核心，L2 列表
│   └─ Module 詳情（Module Detail）   ← 雙視圖 + live demo
├─ 產品案例庫（Showcase）            ← L3，真實產品的組合範例
│   └─ 產品詳情（引用了哪些 Module）
├─ 設計系統元件（Components）         ← L1，連結至 Storybook
├─ 治理規範（Guidelines）            ← 客製化邊界、貢獻流程、版本政策
└─ 關於 / 如何引用（Getting Started）
```

### 3.3 導航實作建議
- 採 **AppShell + Sidebar + ChromeHeader**（復用 `apps/template/src/App.tsx` 既有組裝）
- Sidebar 主導航 = 上述 6 區；窄螢幕收合為抽屜（見 §6.3）
- 頂部 ChromeHeader 放：全域搜尋、語系切換、Dark/Light 切換

---

## 4. 核心平台功能

### 4.1 探索 / 瀏覽 / 搜尋
- **分類瀏覽**：依能力類型（表單 / 簽核 / 待辦 / 通知）+ 適用對象（員工面 / 客戶面）篩選
- **全域搜尋**：關鍵字同時跨 Module 與產品案例（如搜「請假」→ 回傳簽核 Module + 已採用的產品）
- **卡片列表**：每個 Module 卡片顯示名稱、一句話用途、變種數、已被幾個產品採用
- 消費元件：`Tabs`（分類）、`Input`（搜尋）、`Badge`/`Tag`（標記）、`Empty`（無結果）

### 4.2 Module 詳情 — 雙視圖（核心差異化功能）
單一 Module 詳情頁，以 `Tabs` 或 `SegmentedControl` 切換兩種視角：

| 視圖 | 給誰 | 內容 |
|------|------|------|
| **流程視圖（Flow）** | PM | 互動 live demo、使用情境敘述、變種對照、典型操作流程圖 |
| **規格視圖（Spec）** | Dev | 依賴的 DS 元件清單、可調 props/slots、客製化邊界、引用方式（程式碼片段）|

- live demo 區以 mock 資料驅動，可實際點擊操作
- 消費元件：`Tabs`/`SegmentedControl`（切換）、`DescriptionList`（規格表）、`Steps`（流程）

### 4.3 採用關係反查
- **正查**：此 Module 被哪些產品採用了（從 Module → 產品）
- **反查**：此產品引用了哪些 Module（從產品 → Module）
- 價值：影響評估（改 Module 會影響誰）+ 信任建立（PM 看到「已有 N 個產品在用」）
- 消費元件：`DescriptionList`、`Avatar`（產品代表）、`Badge`（採用數）

### 4.4 版本與破壞性變更標記
- Module 標示其依賴的 DS 版本（如 `@qijenchen/design-system@0.1.0-beta.67`）
- DS 或 Module 升版時，標記破壞性變更，通知引用方
- **吃自家狗糧**：此功能本身用「通知與提醒」Module（§5.4）實作
- 消費元件：`Alert`/`Badge`（變更標記）、`Toast`（即時通知）

### 4.5 客製化邊界明示（治理護欄）
這是「保留彈性 vs 維持一致」的關鍵機制。每個 Module 明示：
- **可改**：文案、欄位增減、顏色主題（在 DS token 範圍內）
- **有限變種**：如 Header 提供 2-3 種預設型態，產品從中選
- **鎖死**：核心操作行為、互動模式、DS 元件本身的樣式
- **權限控管落點**：以「誰能看 / 引用哪些 Module」呈現（角色 × Module 矩陣），而非獨立 Module
- 消費元件：`DescriptionList`、`Tag`（可改/鎖死標記）

### 4.6 貢獻回流
- 產品團隊若做出好的新變種，可提案升級回資源庫成為共用 Module
- 流程：提案 → UX Lead 審核（一致性把關）→ 收斂為新變種 → 入庫
- 本期僅在「治理規範」頁說明流程，不做線上提案系統

---

## 5. 共用能力 Module 目錄規格（首期 4 個）

> 每個 Module 規格含 5 欄位：用途 / 變種 / 消費的 DS 元件 / 客製化邊界 / mock 互動腳本。
> 所有元件名取自 `packages/design-system/src/index.ts`（真實公開元件）。

### 5.1 表單問卷（Forms）
| 欄位 | 內容 |
|------|------|
| **用途** | 動態表單 / 問卷填寫與收集，員工面產品最高頻流程（請假、報銷、申請、調查）|
| **變種** | ① 單頁表單 ② 分段/分步表單（wizard）③ 問卷模式（題組 + 進度）|
| **消費 DS 元件** | `Field`、`FieldControlGroup`、`Input`、`Textarea`、`Select`、`Combobox`、`RadioGroup`、`Checkbox`、`Switch`、`NumberInput`、`DatePicker`、`TimePicker`、`Slider`、`Rating`、`PeoplePicker`、`LinkInput`、`FileUpload`、`Steps`（分步）、`Button` |
| **客製化邊界** | 可改：欄位組成、驗證規則、文案；鎖死：欄位元件樣式、錯誤態行為 |
| **mock 互動** | 填寫 → 即時驗證 → 分步切換 → 提交成功 toast（無真實送出）|

### 5.2 多層級 / 多方簽核（Approvals）
| 欄位 | 內容 |
|------|------|
| **用途** | 序簽 / 會簽流程、簽核狀態追蹤，員工面審批場景核心 |
| **變種** | ① 序簽（依序）② 會簽（並行）③ 混合流程 |
| **消費 DS 元件** | `Steps`（簽核階段）、`Avatar`（簽核人）、`Badge`/`Tag`（狀態：待簽/通過/退回）、`DescriptionList`（簽核意見）、`Button`（核准/退回/加簽）、`Dialog`（簽核確認）、`DataTable`（簽核歷程）|
| **客製化邊界** | 可改：簽核層級數、角色、意見欄；鎖死：狀態機邏輯、時間軸視覺 |
| **mock 互動** | 檢視流程 → 模擬核准/退回 → 狀態即時更新 → 加簽彈窗 |

### 5.3 待辦事項（Todos）
| 欄位 | 內容 |
|------|------|
| **用途** | 任務 / 待辦清單與狀態管理，跨產品的「我的工作」入口 |
| **變種** | ① 清單模式 ② 看板模式（分欄）③ 含指派與到期 |
| **消費 DS 元件** | `DataTable`（清單）、`Checkbox`（完成）、`Badge`/`Tag`（優先級/狀態）、`Avatar`（指派人）、`DatePicker`（到期）、`DropdownMenu`（操作）、`BulkActionBar`（批次）、`Empty`（無待辦）|
| **客製化邊界** | 可改：欄位、狀態分類、排序；鎖死：批次操作互動、卡片版面 |
| **mock 互動** | 勾選完成 → 批次操作 → 篩選 → 切換清單/看板 |

### 5.4 通知與提醒（Notifications）
| 欄位 | 內容 |
|------|------|
| **用途** | 通知中心、即時提醒、未讀管理，跨產品共用的訊息層 |
| **變種** | ① 通知中心面板 ② 即時 toast ③ 分類通知（系統/待辦/提及）|
| **消費 DS 元件** | `Popover`/`Sheet`（通知面板）、`Badge`（未讀數）、`Toast`（即時）、`Tabs`（分類）、`Avatar`（來源）、`Empty`（無通知）、`Button`（標記已讀）|
| **客製化邊界** | 可改：通知分類、文案、來源；鎖死：未讀標記行為、toast 出現位置 |
| **mock 互動** | 開啟面板 → 切分類 → 標記已讀（未讀數遞減）→ 觸發即時 toast |

---

## 6. 跨系統規範（復用既有 + 缺口）

### 6.1 i18n 多語系（繁中 / 英 / 日）
- **復用**：`packages/design-system/src/lib/i18n/i18n-context.tsx`（context + prop fallback 機制已就位）
- **缺口**：
  - 目前僅簡中 fallback → 需補繁中 / 英 / 日完整 label
  - **日文排版需專門驗證**：CJK 與拉丁混排、長複合詞斷行、字距（不可假設繁中 OK 日文就 OK）
- **待決**：語系是否反映在 URL（`/ja/...`，利於分享/SEO）或純 runtime 切換 → 見 §10

### 6.2 Dark / Light 模式
- **復用**：`data-theme="dark"` 機制 + `packages/design-system/src/tokens/color/semantic.css`（semantic token）
- **缺口**：多數元件未寫專屬 dark CSS，採用率低 → 需在平台範圍內補齊與驗證對比度
- 切換點：ChromeHeader 全域開關

### 6.3 RWD 響應式（Desktop + Mobile Web）
- **復用**：Tailwind v4 breakpoints + `use-is-narrow-viewport` hook + density token
- **轉換規則**：
  - Sidebar：寬螢幕展開 → 窄螢幕收合為 icon / 抽屜
  - DataTable：寬螢幕表格 → 窄螢幕卡片化
  - 簽核流程：時間軸縱向堆疊，可單手操作
- 視口 meta 已在 `index.html` 就位

---

## 7. 測試用例（Test Cases）

> Given-When-Then 格式，每條附驗收標準。對應原始 4 大訴求。

### A. 探索 / 瀏覽
| ID | Given / When / Then | 驗收 |
|----|---------------------|------|
| TC-A1 | 進入首頁 / 找「簽核流程」/ 應在 ≤3 點擊內到達其詳情 | 點擊路徑 ≤3 |
| TC-A2 | 在搜尋框輸入「請假」/ 送出 / 結果同時含 Module + 採用該 Module 的產品 | 兩類結果皆出現 |
| TC-A3 | 篩選「員工面產品」/ 套用 / 列表只回傳符合項 | 無不符項 |

### B. Module 檢視
| ID | Given / When / Then | 驗收 |
|----|---------------------|------|
| TC-B1 | 開啟「多層級簽核」Module / 預設視圖 / 顯示 live demo + 變種清單 | demo 可互動 |
| TC-B2 | 在 Module 詳情 / 切換流程視圖↔規格視圖 / 內容對應切換 | 雙視圖皆完整 |
| TC-B3 | 切換 Header Module 的某變種 / 選擇 / 預覽即時更新且不破版 | 無 layout shift 破版 |
| TC-B4 | 規格視圖 / 檢視 / 顯示依賴的 DS 元件 + 可調 props + 客製邊界 | 三者皆列出 |

### C. 引用 / 組合
| ID | Given / When / Then | 驗收 |
|----|---------------------|------|
| TC-C1 | 在 Module 規格視圖 / 點「如何引用」/ 取得可交接給 dev 的程式碼片段 | 片段可複製 |
| TC-C2 | 同一頁組合表單 + 簽核兩個 Module / 並列 / 版面與行為一致無衝突 | 無樣式衝突 |
| TC-C3 | 檢視某產品案例 / 開啟 / 顯示它引用了哪些 Module（反查）| 反查清單正確 |

### D. 跨系統規範
| ID | Given / When / Then | 驗收 |
|----|---------------------|------|
| TC-D1 | 任一 Module / 切 Dark↔Light / 兩模式對比度與可讀性達標 | 無白字白底，對比達 WCAG AA |
| TC-D2 | 切換 繁中/英/日 / 各語系 / 文字不溢出、CJK 與拉丁排版正常 | 無截斷/溢出 |
| TC-D3 | 日文語系 / 檢視長複合詞 / 斷行與字距正確 | 無異常斷行 |
| TC-D4 | Desktop→Mobile 縮窄 / 觀察 / Sidebar 收合、表格轉卡片、流程可單手操作 | 各斷點皆可用 |
| TC-D5 | 無權限使用者 / 檢視受限 Module / 看不到或引用按鈕 disabled | 權限正確生效 |

### E. 治理一致性
| ID | Given / When / Then | 驗收 |
|----|---------------------|------|
| TC-E1 | 新 Module 入庫前 / 檢核 / 僅消費 DS canonical token/元件、無手刻樣式 | 0 手刻違規 |
| TC-E2 | DS 升版 / 後 / 資源庫內 Module live demo 反映新版、破壞性變更被標記 | 變更有標記 |
| TC-E3 | 產品客製某 Module / 修改 / 不影響該 Module 其他引用者（隔離性）| 無串改 |

---

## 8. 競品分析

你的平台是**四類產品的交集**，市面無單一完美對應 — 這正是切入縫隙。

| 類別 | 代表 | 它做什麼 | 與本平台差異 |
|------|------|---------|--------------|
| 元件文件庫 | Storybook / zeroheight / Supernova | 展示 DS 元件 + 文件 | 停在 **L1 元件層**，無 L2 流程 Module，PM 看不懂 |
| 模組/組裝目錄 | Knapsack / Specify | DS + pattern + 部分組裝 | 偏設計交付，弱在「**跨產品共用能力流程**」 |
| 開發者入口 | Spotify Backstage / Port | 服務目錄、Software Templates | 偏後端/服務治理，**UI 流程組裝弱** |
| 低代碼組裝 | OutSystems / Mendix / Retool | 拖拉組裝可跑 app | 跳脫自家 DS，**治理一致性失控** |

**差異化定位**：最接近的心智模型 = Backstage「Software Templates」+ Storybook「live component」+ 自家 DS 治理。**獨特價值 = 「面向員工產品的共用流程 Module（L2 層）」是市場現成工具都沒有的**。

---

## 9. 功能缺口檢查（易漏的重要區塊）

對照「讓 PM 發想期最大化引用」目標，以下 7 塊容易被漏：

1. **採用關係圖譜 / 反查**（§4.3）— 缺則治理與影響評估做不了
2. **版本與破壞性變更通知**（§4.4）— 引用方需被通知
3. **客製化邊界明示**（§4.5）— 否則「保留彈性」退化成「各做各的」
4. **貢獻回流機制**（§4.6）— 雙向，不只單向消費
5. **PM 友善的非技術雙視圖**（§4.2）— PM 看流程、dev 看 code
6. **引用產物的可交接性**（§4.1/TC-C1）— PM 引用後 dev 能直接接手
7. **可存取性基線**（TC-D1/D2）— a11y / 對比 / 鍵盤；可接 repo 既有 `npm run a11y:check`

---

## 10. 技術棧決策

### 10.1 確認與 repo 一致（無衝突）
React + TypeScript + Vite + DS（`@qijenchen/design-system`）+ Tailwind v4 + i18n + dark/light + RWD — 與既有 `product-hub` 完全一致，**直接複用、不重造**。

### 10.2 待決事項（需你拍板）
| # | 決策點 | 選項與建議 |
|---|--------|-----------|
| ① | **路由** | template 目前無 router → 建議引入 **React Router**（Vite SPA 標準），平台多頁必需 |
| ② | **Module 層落點** | (a) app 內 `apps/<platform>/src/modules/` composite（建議：本期最輕、不污染 DS）/ (b) DS 內新增 module 層 / (c) 設定驅動 registry。**建議 (a)**，待型態穩定再考慮上移 |
| ③ | **i18n 路由策略** | URL `/ja/...`（利分享/SEO）vs runtime 純切換（簡單）。**建議 runtime 切換**起步，本期非對外 SEO 產品 |

### 10.3 落點建議
- 平台本身 = `apps/` 下新建一個 product app（`npm run create-app resource-library`），**消費 DS 而非修改 DS**
- 對應 Scenario A 工作流（`.claude/references/scenario-definition.md`）

---

## 11. 路線圖（Phasing）

| 階段 | 內容 | 產出 |
|------|------|------|
| **P0** | 本 PRD 對齊（IA / 功能 / Module 清單 / 待決決策）| 本文件 + 你的回饋 |
| **P1** | 資源庫平台殼（AppShell + 導航 + 首頁 + 搜尋）+ 1 個 Module（表單）live demo prototype | 可點擊 prototype |
| **P2** | 補齊 4 個 Module（簽核 / 待辦 / 通知）+ 雙視圖 + 客製邊界 | 完整 Module 目錄 |
| **P3** | 採用關係反查 + 版本通知 + 治理護欄 + i18n 三語補齊 + dark mode 驗證 | 治理完整版 |

---

## 12. 風險與待決事項

| 風險 | 說明 | 緩解 |
|------|------|------|
| Module 層抽象過早 | 變種需求未明就硬抽象，導致僵化 | 先 app 內 composite（§10.2 (a)），型態穩定再上移 |
| 日文排版 | CJK 長詞斷行 / 字距易出錯 | 專門 QA 回合（TC-D3），不假設繁中 OK |
| Dark mode 補齊工作量 | 多數元件未寫 dark CSS | P3 集中處理 + 對比度自動檢核 |
| PM 採用率 | 平台做好但 PM 不用 | 雙視圖 + 真實情境範例（非 Lorem ipsum）降低門檻 |

### 待你回饋的決策（§10.2）
1. 路由：採 React Router？
2. Module 層落點：採 app 內 `modules/` composite？
3. i18n：採 runtime 切換起步？

---

> 下一步：你 review 本 PRD 後，確認 §10.2 三項待決決策，即可進入 **P1**（資源庫平台殼 + 表單 Module live demo prototype）。
