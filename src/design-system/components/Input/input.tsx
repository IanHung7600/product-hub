import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FieldMode, InlineActionConfig } from '@/design-system/components/Field/field-types'
import { fieldWrapperStyles, bareInputStyles, EMPTY_DISPLAY } from '@/design-system/components/Field/field-wrapper'
import { useFieldContext } from '@/design-system/components/Field/field-context'
import { ItemInlineAction } from '@/design-system/patterns/element-anatomy/item-anatomy'
import { CircularProgress } from '@/design-system/components/CircularProgress/circular-progress'

// ── Types ───────────────────────────────────────────────────────────────────

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    Omit<VariantProps<typeof fieldWrapperStyles>, 'mode'> {
  /** Field display mode */
  mode?: FieldMode
  /** Error 狀態（正交於 mode）。border-error + aria-invalid。 */
  error?: boolean
  /** 左側靜態 icon — 輔助理解 input 用途（如 Search）。fg-muted。 */
  startIcon?: LucideIcon
  /** 右側 inline action — 宣告式 API，Field 根據 size 自動渲染。 */
  endAction?: InlineActionConfig
  /**
   * Loading 狀態(async 驗證 / debounce fetch 中)。
   * - **input 保持可編輯**(user 可以邊改邊讀,debounce 場景 UX 最好)
   * - 世界級對照:Ant Input.Search 派(input editable during loading);非 Material readonly 派
   * - 自動在 endAction slot 塞 `<CircularProgress size={iconSize}/>`(與 endAction prop 互斥)
   * - 宣告 `aria-busy="true"` 讓 screen reader 感知處理中
   */
  loading?: boolean
}

// ── Component ───────────────────────────────────────────────────────────────

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      mode = 'edit',
      error = false,
      size,
      startIcon: StartIcon,
      endAction,
      loading = false,
      className,
      disabled,
      readOnly,
      ...props
    },
    ref
  ) => {
    // ── FieldContext 自動讀取(在 <Field> 內時,invalid / disabled 由 context 接管) ──
    const fieldCtx = useFieldContext()
    // loading 期間 input 保持可編輯(Ant Input.Search 派,UX「邊改邊讀」)
    // 只用 aria-busy + endAction Spinner 標示狀態,不動 mode
    const resolvedMode = disabled
      ? 'disabled'
      : readOnly
        ? 'readonly'
        : fieldCtx?.disabled
          ? 'disabled'
          : mode
    const isEditable = resolvedMode === 'edit'
    // error 合併:自身 error prop OR Field context invalid
    const resolvedError = error || (fieldCtx?.invalid ?? false)
    const iconSize = size === 'lg' ? 20 : 16
    const iconColor = resolvedMode === 'disabled' ? 'text-fg-disabled' : 'text-fg-muted'

    return (
      <div
        className={cn(
          fieldWrapperStyles({ mode: resolvedMode, size }),
          isEditable && resolvedError && [
            'border-error hover:border-error-hover',
            'focus-within:border-error focus-within:hover:border-error',
          ],
          className,
        )}
        data-field-mode={resolvedMode}
        data-error={isEditable && resolvedError ? '' : undefined}
        aria-busy={loading || undefined}
      >
        {StartIcon && (
          <StartIcon
            size={iconSize}
            className={cn('shrink-0 pointer-events-none', iconColor)}
            aria-hidden
          />
        )}
        <input
          ref={ref}
          type="text"
          readOnly={resolvedMode === 'readonly'}
          disabled={resolvedMode === 'disabled'}
          aria-invalid={resolvedError || undefined}
          className={cn(
            bareInputStyles,
            resolvedMode === 'disabled' && 'text-fg-disabled placeholder:text-fg-disabled cursor-not-allowed',
          )}
          {...props}
        />
        {loading ? (
          <CircularProgress size={iconSize} className="shrink-0" />
        ) : endAction && isEditable ? (
          <ItemInlineAction action={endAction} size={size ?? 'md'} />
        ) : null}
      </div>
    )
  }
)
Input.displayName = 'Input'

// ── Display ─────────────────────────────────────────────────────────────────
// Table cell 和 Form readonly 共用的格式化顯示。

function InputDisplay({ value }: { value?: string | null }) {
  if (!value) return <span className="text-fg-muted">{EMPTY_DISPLAY}</span>
  return <>{value}</>
}
InputDisplay.displayName = 'InputDisplay'

export { Input, InputDisplay }
