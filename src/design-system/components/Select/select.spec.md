# Select 設計原則

## 定位

Select 是**單選下拉的表單 control**——從 3+ 選項中挑恰好一個，選項收在 dropdown 內展開。底層走原生 `<select>`，透過 CSS 客製視覺。

共用規則見 `field-controls.spec.md`。本文件只記錄 Select 特有的原則。

---

## 何時用

- **選項 3+ 且空間受限**：表單欄位、toolbar filter、table cell
- **選項不需要一眼全看**：使用者先看 label，點開才瀏覽選項
- **value 可能是「即時套用」或「隨 form 送出」皆可**（見下文「即時 vs on-submit」）

## 何時不用

| 場景 | 改用 | 原因 |
|------|------|------|
| 2-5 個選項且需要一眼全看 | `RadioGroup` | 視覺掃視快，不用兩次點擊 |
| 2-5 個緊湊切換（filter / view mode） | `SegmentedControl` | 更 compact，跟 Button / Input 並排不違和。詳見 `segmented-control.spec.md` |
| 選項需要多行描述或圖文並列 | `RadioGroup` | Select option 是單行純文字，無法承載複雜排版 |
| 多選 | `Combobox` | Select 永遠單選 |
| 布林切換（on / off） | `Switch` | 布林不需要「選一個」的心智模型 |
| 6-10 選項且沒有搜尋需求 | `Select`（仍然）| Select 在這個範圍是最佳 |
| 10+ 選項、使用者記得起關鍵字 | `Select` with `searchable` 或 `Combobox` | 純捲動 dropdown 會變低效 |

---

## 即時 vs on-submit

Select 的值套用時機是**由 onChange handler 的副作用決定**，不是 Select 本身的屬性——兩種場景都是正當用法：

### 即時套用（change → API）

選值一變就直接觸發外部動作，不經 form submit：

- **Jira-style view/edit**：task 的 status / priority / assignee 欄位，改了立刻寫回 DB
- **篩選器**：table 上方的 category / status filter，改了立刻篩 table
- **即時設定**：notification preference、theme dropdown
- **URL param 綁定**：改 value 立刻 push URL（deep-linkable）

這類場景的 onChange 通常呼叫 mutation / API / setState 更新父層。**沒有「取消」的概念**——改了就是改了。

### 隨 form 送出（change → local state → submit）

選值先寫進 local state，等 form submit 才套用：

- **建立 / 編輯表單**：create project 裡的 type、edit user 的 role
- **對話框設定**：dialog 內的選項，按確認才生效
- **精靈流程**：多步驟表單的中間選擇

這類場景 onChange 只更新 React state，直到 submit handler 才送出。**有「取消」可回復**。

### 設計規則

- 即時場景：用 `aria-label` 或旁邊的 label 明確告知「這個改了會立刻套用」
- on-submit 場景：搭配 `<Field>` 容器 + submit button，使用者清楚哪個動作觸發儲存
- **不要讓使用者搞不清楚是哪種**——這是 DS 最常見的信任破壞點

---

## 顯示模式（`display` prop）

| 模式 | 何時使用 |
|------|---------|
| `text`（預設） | 選項語意靠文字表達（類別、國家、角色） |
| `tag` | 選項有色彩語意，顏色加速掃視（狀態：紅黃綠） |

### text 模式

- 原生 select 純文字 + ChevronDown
- 可搭配 `startIcon`——代表 value 的圖示（如狀態 icon），不是裝飾
- startIcon 的語意是「描述目前選中的值」，不是「描述這個 field 的用途」

### tag 模式

- Tag 元件呈現選中值 + 隱藏的原生 select overlay
- Tag 設為 `pointer-events-none`，點擊穿透到底層 select
- edit 模式：Tag + ChevronDown + 可選 clear
- readonly / disabled：Tag 只顯示，無 ChevronDown

---

## Clearable

`clearable` 在有值時顯示 clear 按鈕。

- Clear 按鈕在 ChevronDown 左側
- 清除後回到 placeholder 狀態
- 只在 edit 模式顯示

**何時開 clearable**：
- 「無選擇」是有效狀態（選填欄位、可清除的 filter）→ 開
- 必須有選擇（每個項目都必須有 status）→ 不開

---

## 常見誤解

**誤解**：「Select 只用於表單送出，即時套用應該用別的元件」。
**事實**：Select 的表單送出與即時套用都是正當用法。Jira、Linear、Notion 的 inline status dropdown 都是 Select + 即時 onChange。關鍵是 onChange 的副作用清楚，不是 Select 本身。

**誤解**：「`searchable` 一定要在選項超過 N 個時開啟」。
**事實**：searchable 的判準是「使用者記不記得起 label 關鍵字」而不是選項數量。5 個國家 + 全球 200 個國家都可能需要 searchable。反之如果選項是 a/b/c/d 這種短清單，100 個也不需要 searchable。

---

## 禁止事項

- ❌ `startIcon` 不可用於 tag 模式——Tag 本身已有視覺標記，startIcon 是冗餘的
- ❌ 不自建 dropdown menu——使用原生 `<select>` 保證無障礙和行動裝置體驗
- ❌ 讓使用者搞不清楚是即時還是 on-submit——用 label / 按鈕位置明確傳達
- ❌ 2-5 個全可見選項場景用 Select 代替 RadioGroup——視覺掃視效率低

---

## 相關

- `segmented-control.spec.md` — 2-5 個緊湊互斥切換；「何時不用」的主要去處
- `checkbox.spec.md`（含 RadioGroup 設計原則）— 2-5 個全可見選項、需要描述文字時
- `combobox.spec.md` — 多選的對應元件
- `switch.spec.md` — 布林切換
- `field-controls.spec.md` — Select 作為 Field control 時的共用規則（mode、size、endAction）
