import type * as React from 'react'
import type { LucideIcon } from 'lucide-react'

// ── Field Mode ───────────────────────────────────────────────────────────────

export type FieldMode = 'edit' | 'readonly' | 'disabled'

// ── Inline Action ────────────────────────────────────────────────────────────
// 宣告式 API：消費者只宣告 intent，host 根據 size tier 自動渲染。
// 見 uiSize.spec.md 的 Inline Action 段落。Canonical 實作:`ItemInlineAction`。

export interface InlineActionConfig {
  icon: LucideIcon
  /** aria-label，同時作為 tooltip 來源 */
  label: string
  /**
   * 點擊 handler。可選接收 React 事件物件——有需要時可呼叫 `stopPropagation()` 避免
   * 事件冒泡到父層(例如 Select 清除按鈕在 popover trigger 內,不想觸發 popover open)。
   */
  onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void
}
