# CheckboxGroup 設計原則

## 定位

CheckboxGroup 是**多選 Checkbox 的 layout primitive**——封裝 role="group" + canonical 間距規則,避免 consumer 在外層加 `gap-*` 造成雙重 padding。

**Layout Family**:非上述 family — layout wrapper(wraps Family 2 SelectionItem rows)。

**實作基礎**:純 layout wrapper + role="group"。對齊 `RadioGroup` 的 canonical(Radix `RadioGroup.Root` 預設 `grid`)。

---

## 為什麼需要此 primitive

Checkbox 有 `label` prop → 內部自動包 SelectionItem(row 結構)。SelectionItem 的**垂直 padding 公式** = `(field-height - 1lh) / 2`,已經擁有 row 間距。

**歷史 bug**:consumer 在外層包 `<div className="flex flex-col gap-2">` → 外 gap + 內 py 雙重 padding → 超出 canonical,行與行之間過寬。此問題在本 session 反覆發生,canonical 只存在於 Checkbox spec 內,consumer 不看就錯。

**此 primitive codify 正確 layout**:consumer 只用 `<CheckboxGroup>` 包住 Checkbox,不需要記間距規則。

---

## 何時用

- **多選清單**:篩選條件、偏好設定、權限勾選(3 個以上選項)
- **Form 內的 Checkbox 組**:搭配 `<Field>` 的 FieldLabel / FieldDescription / FieldError
- **短 label 橫向排列**(`orientation="horizontal"`):通知管道(Email / Push / SMS)、平台選擇

## 何時不用

| 場景 | 改用 | 原因 |
|------|------|------|
| 單一布林(同意條款 / 收電子報)| 單獨 `<Checkbox>` | 不是多選,不需要 group wrapper |
| 三態或更多(enum 單選)| `RadioGroup` / `Select` | Checkbox 是多選,單選用 Radio |
| 即時生效的 toggle | `Switch` | Checkbox 是 submit-flow,Switch 是即時 |
| 大量選項(> 10)| `Combobox` with `searchable` + multi | 長 list 需搜尋 |

---

## Orientation

| 值 | Layout | 典型場景 |
|---|---|---|
| `vertical`(預設) | `grid`(垂直堆疊,row 間距由 SelectionItem 公式擁有) | 篩選條件列表、偏好設定、權限組 |
| `horizontal` | `flex flex-wrap gap-4` | 短 label 並排(Email / Push / SMS、工作日勾選) |

**為什麼 vertical 不需要 external gap**:
SelectionItem 內部 `py-[calc((field-height-md - 1lh) / 2)]` ≈ 6-8px 各邊,相鄰 row 自然有 12-16px 呼吸空間,這就是 canonical。加 `gap-2` 外層會疊成 20-24px,過鬆。

**為什麼 horizontal 需要 gap-4**:
水平排列時 label 緊貼自己的 Checkbox,row 的 py 不會「擴散」到左右。`gap-4`(16px)給 Checkbox 水平視覺分隔,對齊 Material / Polaris horizontal checkbox group 慣例。

---

## Field 整合

`CheckboxGroup` 有 `fieldLayout: 'block'` 屬性(跟 `RadioGroup` 一致),在 `<Field orientation="horizontal">` 內:
- Control area 自動切 `items-start`
- `padding-top` 公式對齊第一個 Checkbox 的 label 第一行
- FieldLabel 是整組的 label,每個 Checkbox 的 `label` 是選項自己的 label(不衝突)

```tsx
<Field orientation="horizontal">
  <FieldLabel>通知方式</FieldLabel>
  <CheckboxGroup orientation="horizontal">
    <Checkbox label="Email" />
    <Checkbox label="Push" />
    <Checkbox label="SMS" />
  </CheckboxGroup>
</Field>
```

---

## 禁止事項

- ❌ 在 `<CheckboxGroup>` 外層加 `className="flex flex-col gap-*"` / wrap `<div className="space-y-*">`——雙重 padding,超出 canonical
- ❌ 在 `<CheckboxGroup>` 內的 Checkbox 不傳 `label` 然後外層手刻 `<label><Checkbox/>文字</label>`——失去 SelectionItem 的對齊與 disabled 連動;用 Checkbox `label` prop(自動包 SelectionItem)
- ❌ 當三態或單選用 CheckboxGroup(「on/off/auto」)——改用 RadioGroup / Select / SegmentedControl
- ❌ 把 CheckboxGroup 當 table 多列 row 用——CheckboxGroup 是**單一組**多選,多筆同結構用 DataTable + cell Checkbox

---

## 為何無 Inspector / ColorMatrix / SizeMatrix

CheckboxGroup 是**純 layout wrapper**,無 variant / state / size 決策:
- 無自己的視覺(color / size 由 Checkbox 決定)
- 無互動 state(grouping 是 ARIA role="group",非 UI state)
- orientation(vertical / horizontal)已在 Overview story 覆蓋

對應 anatomy story:保留 `Overview`(vertical / horizontal 對照) + 元件特有 `SpacingProof`(證明 external gap-0 + SelectionItem py 就是 canonical)。

---

## 相關

- `../Checkbox/checkbox.spec.md` — 個別 Checkbox 元件 + SelectionItem 內部 wrap
- `../RadioGroup/radio-group.spec.md` — 單選對應元件(結構對稱)
- `../Field/field.spec.md` — Field 整合(FieldLabel / horizontal 對齊)
- `../SelectionControl/selection-item.spec.md` — row 結構 + py 公式 SSOT
- `../../patterns/element-anatomy/item-anatomy.spec.md` — Family 2 SelectionItem variant
