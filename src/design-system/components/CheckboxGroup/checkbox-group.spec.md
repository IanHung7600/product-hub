# CheckboxGroup 設計原則

## 定位

CheckboxGroup 是**多選 Checkbox 的 layout primitive**——封裝 role="group" + canonical 間距規則,避免 consumer 在外層加 `gap-*` 造成雙重 padding。

**Layout Family**:非上述 family — layout wrapper(wraps Family 2 SelectionItem rows)。

**實作基礎**:純 layout wrapper + role="group"。對齊 `RadioGroup` 的 canonical(Radix `RadioGroup.Root` 預設 `grid`)。

---

## 為什麼需要此 primitive

Checkbox 有 `label` prop → 內部自動包 SelectionItem(row 結構)。SelectionItem 的**垂直 padding 公式** = `(field-height - 1lh) / 2` ≈ 5.5px 各邊 @ md(7.5px @ lg),讓「單行高度 = field-height」且 **row 堆疊時自然有 2×py 的視覺呼吸**。

## Canonical 鐵律(2026-04-21 定版)

**垂直 CheckboxGroup 的 item 之間沒有外部 gap**。

```
正確:  <CheckboxGroup>              (grid 無 gap,靠 SelectionItem py)
         <Checkbox label="A" />      ← py 上下各 5.5-7.5px
         <Checkbox label="B" />      ← 相鄰 row 自然呼吸
       </CheckboxGroup>

錯誤:  <CheckboxGroup className="gap-2">         ← double padding
       <div className="space-y-2"><Checkbox />  ← 外層包裝 gap
       consumer 外層再加 margin                    ← 違反
```

### 為什麼 zero gap

SelectionItem 的 py 公式已經保證:
1. 單行 checkbox 高度 = field-height(對齊 Input 高度,row align)
2. 多行堆疊時相鄰 row 的 py 各自擴散 = 2×py 真實視覺呼吸空間(10-16px @ density md-lg)
3. Density 切換時 py 公式自動跟 field-height 縮放,間距等比例變化

外加 gap 會 double-padding 導致視覺斷裂。

### 世界級對照

- **Atlassian AkSelect / Checkbox group**:row 間距由 item 自身 py 擁有,group 無 gap
- **Radix UI RadioGroup**:`RadioGroup.Root` 預設 `grid`,無 gap
- **Ant Design Checkbox.Group** vertical:row 間距由 Checkbox 自身 line-height + margin 擁有
- **Chakra UI CheckboxGroup**:spacing prop 可選(預設 0),依賴 Checkbox 自帶 line-height

**流派:row 高度定義 gap,不加外部 gap** —— 本 DS 採此。

### 本 session 歷史錯誤(警惕)

2026-04-20 ~ 04-21 此問題在本 session 反覆 4 次:
1. 早期 consumer 手工 `<div className="gap-2">` → double padding
2. 引入 CheckboxGroup primitive,忘記說清楚 zero gap
3. 誤加 `gap-y-1` 想「補呼吸」—— 根因其實是 Checkbox 在 Field context 誤吞 label(見 #2 的根因),label 消失才造成「黏在一起」錯覺
4. 修正 Checkbox label bug + 徹底 revert gap-y-1 → 回歸 zero gap canonical

**避免再犯的機制**(2026-04-21 codify):
- CheckboxGroup / RadioGroup.tsx docblock 直接寫死「zero gap」canonical
- Checkbox.tsx 加 CheckboxGroupContext 偵測,group 內 Checkbox 永遠保留 label
- 此 spec 與 `radio-group.spec.md` 互相指 reciprocal pointer

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
| `vertical`(預設) | `grid`(無 gap,row 間距由 SelectionItem py 公式獨家擁有) | 篩選條件列表、偏好設定、權限組 |
| `horizontal` | `flex flex-wrap gap-4` | 短 label 並排(Email / Push / SMS、工作日勾選) |

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
