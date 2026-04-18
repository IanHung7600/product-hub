# Badge 設計原則

## 定位

Badge 是通知計數指示器，用於未讀數量、待辦計數、狀態紅點。不是分類標籤（那是 Tag）。

**實作基礎**：純視覺 atom——styled span，無 external primitive base。

---

## 何時用

- **通知計數**：收件匣未讀數（3）、待辦事項數（12）、notification center 新訊息數
- **狀態紅點**（dot 模式）：新功能提示、「有新內容」不需具體數字
- **版本 / 角色標記**：「Beta」、「Pro」、「Admin」（當視覺重量需要比 Tag 更輕時）
- **疊加在互動元件右上角**：Button iconOnly + Badge 通知 icon（鈴鐺 + 3）

## 何時不用

| 場景 | 改用 | 原因 |
|------|------|------|
| 分類標籤（產品類別、角色分類）| `Tag` | Tag 較大、可含 icon/dismiss，適合承載語意；Badge 是計數指示器 |
| 狀態描述（In stock / Out of stock）| `Tag` + 色彩 | 狀態語意用 Tag 的 variant 系統（green/yellow/red）更明確 |
| 過濾 / 選擇（filter chip）| `Chip` | Badge 不可互動，Chip 是 filter 選取 |
| Loading 指示 | `Spinner` | Badge 是數字或 dot，loading 用旋轉動畫 |

---

## 層級（Variant）

四個層級代表通知的緊急程度，由高到低：

| Variant | 視覺 | 何時使用 |
|---------|------|----------|
| `critical`（預設） | 紅底白字（bg-notification） | 需要立即處理——未讀訊息、錯誤計數 |
| `high` | 藍底白字（bg-info） | 重要但不緊急——新功能、待辦事項 |
| `medium` | 淺藍底藍字（bg-info-subtle） | 參考資訊——更新數量、評論計數 |
| `low` | 灰底灰字（neutral-3 + neutral-7） | 被動計數——總數、已完成數量 |

### 層級與容器的關係

Badge 的層級應自然匹配容器的視覺重量。Primary button 是畫面上最強烈的元素，只有 `critical` 的對比度足以在深色底上清楚辨識。低層級 badge 放在高視覺重量的按鈕上是設計矛盾——通知不重要，按鈕卻最重要。

| 按鈕 variant | 適合的 Badge 層級 |
|---|---|
| primary、checked、secondary+danger | `critical` |
| secondary、tertiary | `critical`、`high` |
| text | 全部 |

---

## 模式

### Count（預設）

16px 高、10px 字、font-medium。

- 個位數：min-w-4 確保寬 = 高 = 16px → 正圓
- 多位數：px-1 等距左右 padding → 膠囊
- `max` prop 設定上限，超過顯示 "max+"（如 `max={99}` → "99+"）

### Dot

6×6px 純色圓點，無文字。用於不需顯示具體數量的場景（「有新東西」vs「有 N 個新東西」）。

---

## 禁止事項

- ❌ 不用 Badge 做分類標籤——那是 Tag
- ❌ 不在深色背景按鈕上用 `medium` / `low` 層級——對比不足
- ❌ dot 模式不帶數字——dot 是純視覺指示，數量用 count 模式

---

## 相關

- `../Tag/tag.spec.md` — 分類標籤、狀態標記（Badge vs Tag 的詳細對照在本 spec 定位段落）
- `../Button/button.spec.md` — iconOnly Button + Badge overlay 通知 icon 的組合模式
- `../Chip/chip.spec.md` — 可互動 filter（不是 Badge 的用途）
- `../Spinner/spinner.spec.md` — Loading 狀態指示
