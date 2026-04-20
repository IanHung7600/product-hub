import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * CheckboxGroup — 多選 Checkbox 的 layout primitive
 *
 * ── 為什麼需要 primitive(2026-04-20)──
 * Checkbox 有 `label` prop(內部透過 SelectionItem 包 row)。多個 Checkbox 在
 * 畫面上垂直排列時,**row 之間的垂直間距由 SelectionItem 的 py 公式擁有**
 * (`(field-height - 1lh) / 2`)——consumer **不該**在外層加 `gap-2` / `gap-3`,
 * 否則雙重 padding 會超出 canonical。此 primitive 把正確 layout codify,
 * consumer 不需要記規則、不會寫錯。
 *
 * ── 對齊 RadioGroup canonical ──
 * Radix `RadioGroup.Root` 預設用 `grid`(見 radio-group.tsx),此元件同樣用 `grid`
 * (vertical)或 `flex flex-wrap gap-4`(horizontal)。
 *
 * ── fieldLayout:block ──
 * 在 `<Field orientation="horizontal">` 內,control area auto `items-start` +
 * padding-top 公式對齊第一個 item 的 label 第一行(見 field.spec.md)。
 *
 * ── 用法範例 ──
 *   <CheckboxGroup>
 *     <Checkbox label="待處理" defaultChecked />
 *     <Checkbox label="進行中" defaultChecked />
 *     <Checkbox label="已完成" />
 *   </CheckboxGroup>
 *
 *   <CheckboxGroup orientation="horizontal">
 *     <Checkbox label="Email" />
 *     <Checkbox label="Push" />
 *     <Checkbox label="SMS" />
 *   </CheckboxGroup>
 */

export interface CheckboxGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 排列方向。
   * - `vertical`(預設):多選項目堆疊,row 間距由 SelectionItem 擁有(外層 0 gap)
   * - `horizontal`:選項並排,gap-4 分隔(短 label 場景,如「Email / Push / SMS」)
   */
  orientation?: 'vertical' | 'horizontal'
}

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  ({ className, orientation = 'vertical', ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      className={cn(
        orientation === 'vertical' ? 'grid' : 'flex flex-wrap gap-4',
        className
      )}
      {...props}
    />
  )
)
CheckboxGroup.displayName = 'CheckboxGroup'
// Field layout declaration:block primitive(多項堆疊)——進入 <Field> 時
// control area 自動切 items-start + padding-top 公式。對齊 RadioGroup 做法。
;(CheckboxGroup as unknown as { fieldLayout: 'block' }).fieldLayout = 'block'

export { CheckboxGroup }
