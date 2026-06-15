# 產品資源庫平台 — PRD（產品需求文件）

> 版本：v0.1（draft）｜日期：2026-06-15｜作者：UX Lead
> 狀態：規劃對齊中（P0）｜本文件不含實作 code，作為 PM / dev / UX 三方對齊基準
> 落點說明：此 app 使用 Scenario A（workspace link），DS source 在 `packages/design-system/src/`

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

### 1.3 與 DS repo 的關係（Scenario A）
本平台使用 **Scenario A（workspace local link）**，DS source 在 `packages/design-system/src/`：
- 改 DS 元件 → 平台立即反映（無需等發版）
- 52 個公開元件 + 公開 patterns 直接可用
- 如需新增 DS variant/元件，可直接在 `packages/design-system/src/` 修改（需 user approval，hook 攔截）

---

## 2. 目標使用者與 JTBD（Jobs To Be Done）

| 角色 | 主要場景 | Job To Be Done |
|------|---------|----------------|
| **PM（產品經理）** | 發想 / 規劃期 | 「當我要規劃一個新的員工面產品時，我想快速看到公司已有哪些可複用的流程模板與情境，好讓我不必從零畫起、且能說服 stakeholder 這是成熟方案。」 |
| **Dev（工程師）** | 接手實作期 | 「當 PM 指定要用某個 Module 時，我想看到它依賴哪些 DS 元件、可調整的 props/slots、客製化邊界，好讓我直接引用而非重寫。」 |
| **UX Lead（設計治理）** | 維護期 | 「當產品團隊各自客製時，我想確保大家都基於同一套基礎模板與有限變種，好讓視覺與操作行為維持一致、不漂移。」 |

---

## 3. 資訊架構（IA）

### 3.1 三層心智模型
| 層級 | 是什麼 | 例子 |
|------|--------|------|
| **L1 元件（Component）** | DS 原子積木 | Button、Input、DataTable、Dialog |
| **L2 模組（Module）** | 共用能力流程（本平台核心）| 表單問卷、多層級簽核、待辦、通知 |
| **L3 產品案例（Product）** | 真實產品如何組合 | 「請假系統」「報銷系統」 |

### 3.2 主導航（Sitemap）
```
首頁（Home）
├─ 共用能力目錄（Modules）           ← 平台核心，L2 列表
│   └─ Module 詳情（Module Detail）   ← 雙視圖 + live demo
├─ 產品案例庫（Showcase）
├─ 設計系統元件（Components）         ← 連結至 Storybook
├─ 治理規範（Guidelines）
└─ 如何引用（Getting Started）
```

### 3.3 技術路由
- 需引入 **React Router**（template 預設無 router，多頁平台必需）
- 語系切換採 **runtime 切換**（非 URL `/ja/`，起步簡單）

---

## 4. 核心平台功能

### 4.1 探索 / 瀏覽 / 搜尋
- 分類瀏覽、全域搜尋（跨 Module + 產品案例）、卡片列表
- 消費元件：`Tabs`、`Input`、`Badge`、`Tag`、`Empty`

### 4.2 Module 詳情 — 雙視圖
| 視圖 | 給誰 | 內容 |
|------|------|------|
| **流程視圖** | PM | 互動 live demo、情境敘述、變種對照 |
| **規格視圖** | Dev | 依賴 DS 元件、props/slots、程式碼片段 |

消費元件：`Tabs`/`SegmentedControl`、`DescriptionList`、`Steps`

### 4.3 採用關係反查
Module → 產品 / 產品 → Module，雙向查閱

### 4.4 版本與破壞性變更標記
DS 升版時標記破壞性變更（吃自家狗糧：用通知 Module 實作）

### 4.5 客製化邊界明示（治理護欄）
每個 Module 明示：可改（文案/欄位）/ 有限變種 / 鎖死（核心行為）

---

## 5. 共用能力 Module 目錄規格（首期 4 個）

### 5.1 表單問卷（Forms）
| 欄位 | 內容 |
|------|------|
| **用途** | 動態表單 / 問卷填寫，員工面最高頻流程 |
| **變種** | ① 單頁 ② 分步（wizard）③ 問卷模式 |
| **消費 DS 元件** | `Field`、`FieldControlGroup`、`Input`、`Textarea`、`Select`、`Combobox`、`RadioGroup`、`Checkbox`、`Switch`、`NumberInput`、`DatePicker`、`TimePicker`、`Slider`、`Rating`、`PeoplePicker`、`FileUpload`、`Steps`、`Button` |
| **客製邊界** | 可改：欄位組成、驗證規則、文案；鎖死：欄位元件樣式、錯誤態 |
| **mock 互動** | 填寫 → 驗證 → 分步切換 → 提交 toast |

### 5.2 多層級 / 多方簽核（Approvals）
| 欄位 | 內容 |
|------|------|
| **用途** | 序簽 / 會簽、簽核狀態追蹤 |
| **變種** | ① 序簽 ② 會簽 ③ 混合 |
| **消費 DS 元件** | `Steps`、`Avatar`、`Badge`、`Tag`、`DescriptionList`、`Button`、`Dialog`、`DataTable` |
| **客製邊界** | 可改：簽核層級數、角色；鎖死：狀態機、時間軸視覺 |
| **mock 互動** | 檢視流程 → 核准/退回 → 狀態更新 → 加簽彈窗 |

### 5.3 待辦事項（Todos）
| 欄位 | 內容 |
|------|------|
| **用途** | 任務清單與狀態管理 |
| **變種** | ① 清單 ② 看板 ③ 含指派+到期 |
| **消費 DS 元件** | `DataTable`、`Checkbox`、`Badge`、`Tag`、`Avatar`、`DatePicker`、`DropdownMenu`、`BulkActionBar`、`Empty` |
| **客製邊界** | 可改：欄位、狀態分類；鎖死：批次互動、卡片版面 |
| **mock 互動** | 勾選完成 → 批次操作 → 篩選 → 切換視圖 |

### 5.4 通知與提醒（Notifications）
| 欄位 | 內容 |
|------|------|
| **用途** | 通知中心、即時提醒、未讀管理 |
| **變種** | ① 通知中心面板 ② 即時 toast ③ 分類通知 |
| **消費 DS 元件** | `Popover`、`Sheet`、`Badge`、`Toast`、`Tabs`、`Avatar`、`Empty`、`Button` |
| **客製邊界** | 可改：通知分類、文案；鎖死：未讀行為、toast 位置 |
| **mock 互動** | 開面板 → 切分類 → 標記已讀 → 觸發 toast |

---

## 6. 跨系統規範

| 規範 | 復用既有 | 缺口（需補）|
|------|---------|-----------|
| **i18n 繁/英/日** | `packages/design-system/src/lib/i18n/i18n-context.tsx` | 僅簡中 fallback → 補繁中/英/日 label；日文 CJK 斷行驗證 |
| **Dark/Light** | `data-theme` + `tokens/color/semantic.css` | 多數元件未寫 dark CSS，需補齊 |
| **RWD** | Tailwind v4 + `use-is-narrow-viewport` + density token | Sidebar 收合、表格→卡片、流程可單手操作 |

---

## 7. 測試用例

| ID | Given / When / Then | 驗收 |
|----|---------------------|------|
| TC-A1 | 進首頁 / 找「簽核流程」/ ≤3 點擊到詳情 | 點擊路徑 ≤3 |
| TC-A2 | 搜尋「請假」/ 回傳 Module + 產品案例 | 兩類皆出現 |
| TC-B1 | 開「多層級簽核」/ 預設 / live demo 可互動 | demo 可點擊 |
| TC-B2 | Module 詳情 / 切換雙視圖 / 內容對應切換 | 雙視圖齊全 |
| TC-C1 | 規格視圖 / 點「如何引用」/ 取得程式碼片段 | 可複製 |
| TC-D1 | 任一 Module / 切 Dark↔Light / 對比達 WCAG AA | 無白字白底 |
| TC-D2 | 切換三語系 / 各語系 / 無溢出截斷 | 排版正常 |
| TC-D4 | Desktop→Mobile / 縮窄 / Sidebar 收合、可單手操作 | 各斷點可用 |
| TC-E1 | 新 Module 入庫前 / 僅消費 DS canonical 元件 | 0 手刻違規 |

---

## 8. 競品分析

| 類別 | 代表 | 差異 |
|------|------|------|
| 元件文件庫 | Storybook / zeroheight | 停在 L1，PM 看不懂 |
| 模組目錄 | Knapsack / Specify | 弱在跨產品流程 Module |
| 開發者入口 | Backstage / Port | 偏後端，UI 流程組裝弱 |
| 低代碼 | OutSystems / Retool | 跳脫 DS，治理失控 |

**差異化**：「面向員工產品的共用流程 Module（L2）」是市場現成工具沒有的。

---

## 9. 路線圖

| 階段 | 內容 |
|------|------|
| **P0** | PRD 對齊（本文件）|
| **P1** | 平台殼（AppShell + 導航 + 首頁）+ 表單 Module live demo |
| **P2** | 補齊 4 Module + 雙視圖 + 客製邊界 |
| **P3** | 採用圖譜 + 版本通知 + i18n 三語 + dark mode 補齊 |

---

> 下一步：確認 React Router 引入方式，進入 P1 實作。
