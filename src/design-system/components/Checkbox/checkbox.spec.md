# Checkbox & Radio 設計原則

## 定位

Checkbox 和 Radio 是選擇控件，視覺語言完全一致，差異只有形狀和語意。

| | Checkbox | Radio |
|---|---|---|
| 形狀 | `rounded-md`（方） | `rounded-full`（圓） |
| 指示器 | Check icon | Filled dot |
| 語意 | 獨立 toggle（多選） | 互斥選擇（單選，必須在 RadioGroup 內） |

---

## 尺寸

三種尺寸（sm/md = 16px、lg = 20px），對齊 icon 系統。sm 和 md 視覺相同，純粹是命名 mapping 讓消費者直接傳同一個 size。

| Size | 控件尺寸 | 內部 icon | 配對 field |
|------|---------|----------|-----------|
| sm | 16px | 12px | field sm |
| md | 16px | 12px | field md |
| lg | 20px | 16px | field lg |

---

## Label 對齊

Checkbox/Radio 不內建 label。Label 組合使用 `SelectionItem` 元件。

對齊機制：
1. 外層 `<div>` 設 `text-body` / `text-body-lg`（建立 line-height context）
2. 控件包在 `h-[1lh]` 的容器內（容器高度 = 一行文字高度）
3. `flex items-center`（控件在文字行高內垂直置中）
4. 外層 `flex items-start`（多行時控件對齊第一行）

`1lh` 在 `<div>` 上正常繼承，改字體自動重算。

---

## SelectionItem 佈局

垂直排列和水平排列共用 `SelectionItem`。

| | 垂直 | 水平 |
|---|---|---|
| Item 間距 | 0（padding 處理） | 24px（gap-6） |
| Item padding | `py = (field-height - 1lh) / 2` | 同左 |
| Label ↔ Description | 2px（`mt-0.5`） | 同左 |
| 單行高度 | = field-height（對齊 Input） | 同左 |
| 多行高度 | padding 不變，自然撐高 | — |

---

## Clamp 政策(Label / Description 行數)

| Prop | 預設 | 理由 |
|---|---|---|
| `labelMaxLines` | `'none'`(∞) | Form 欄位的選項標籤可能很長,絕不可截斷 |
| `descMaxLines` | `'none'`(∞) | Form 欄位的補充說明、條款、隱私聲明必須完整呈現 |

**為什麼預設不截斷?**

Checkbox / Radio 在 form 內承載的常常是:
- **法律條款**(「我同意服務條款 + 隱私政策...」)
- **隱私聲明**(「允許 Cookie 用於...」)
- **複雜條件描述**(「啟用此功能會...」)

**任何截斷都是違法或誤導**——使用者必須完整看到他正在同意什麼。MenuItem 的「掃視優先」不適用,SelectionItem 的核心訴求是「**完整閱讀後同意**」。

### Per-instance override

若 consumer 有合理理由(例如 settings 頁的選項列表想截斷過長 label 維持掃視節奏),可以顯式覆寫:

```tsx
<SelectionItem labelMaxLines={1} descMaxLines={2} ... />
```

**注意:不能傳 `undefined` 表達「不截」**——React 的 destructure default 會把 undefined 當「沒傳」、fallback 到預設值。要明確表達「不截」傳 `'none'`(雖然語意等同預設,但更明確)。

### 為什麼不像 MenuItem 強制截斷?

| | MenuItem | SelectionItem |
|---|---|---|
| 使用情境 | 浮層選單,挑一個 | Form 內,**同意**或**選擇**內容本身 |
| 內容性質 | 選項名稱(短) | 條款 / 聲明 / 條件描述(可長) |
| 截斷後果 | 失去 context,但可重開選單看完 | **法律或道德問題**(同意了沒看到的內容) |
| 預設政策 | label / desc 都 `1`(掃視優先) | label / desc 都 `'none'`(完整閱讀優先) |

---

## 狀態

### Checkbox

| 狀態 | 邊框 | 底色 | 指示器 |
|------|------|------|--------|
| unchecked | border | surface | 無 |
| checked | primary | primary | white check |
| indeterminate | primary | primary | white minus |
| hover unchecked | neutral-6 | surface | 無 |
| hover checked | primary-hover | primary-hover | white check |
| hover indeterminate | primary-hover | primary-hover | white minus |
| disabled unchecked | 無 | neutral-2 | 無 |
| disabled checked | 無 | neutral-2 | fg-disabled check |
| disabled indeterminate | 無 | neutral-2 | fg-disabled minus |

### Indeterminate（半選）

`checked="indeterminate"` 表示「部分子項被選中」。視覺上與 checked 相同（藍底白圖示），只是圖示從 Check 換成 Minus。

典型場景：SelectMenu 的「全選」checkbox——當部分選項被勾選時顯示 indeterminate。

Indeterminate 是由父層邏輯控制的狀態，Checkbox 本身不會自動進入 indeterminate——必須明確傳入 `checked="indeterminate"`。

### Radio

| 狀態 | 邊框 | 底色 | 指示器 |
|------|------|------|--------|
| unchecked | border | surface | 無 |
| checked | primary | surface | primary dot |
| hover unchecked | neutral-6 | surface | 無 |
| hover checked | primary-hover | surface | primary-hover dot |
| disabled unchecked | 無 | neutral-2 | 無 |
| disabled checked | 無 | neutral-2 | fg-disabled dot |

---

## 禁止事項

- ❌ Radio 不可單獨使用——必須在 RadioGroup 內
- ❌ Checkbox 不內建 label——label 組合用 SelectionItem
- ❌ 垂直排列不加 gap——padding 已處理間距
- ❌ 多選一不用 Checkbox——用 Radio 或 Select
