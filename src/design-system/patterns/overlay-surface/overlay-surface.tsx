import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Overlay Surface primitives — Dialog / Popover / Sheet 共用結構化 sub-components。
 *
 * 抽象這層避免各自硬寫 padding / border 導致漂移。有特殊行為(Dialog Close 按鈕 /
 * viewport-fill 高度)由 consumer 額外包裝,不污染 primitive。
 *
 * ── Header / Footer 高度 canonical(2026-04-22 v2 校準,世界級 Linear / Notion / Figma / Polaris pattern)──
 * `min-h-[var(--chrome-header-height)]`(48 md / 56 lg)**fixed slot**,content 透過 `items-center` 置中,
 * **無 py**。優勢:
 * - sm button(28 md / 32 lg)自動置中於 48/56,breathing = (48-28)/2 = 10px 視覺自然
 * - xs button(24 固定)也置中,breathing = 12/16 px
 * - 多行 title 可 overflow min-h,header 自然長高(min- 不是 fixed-)
 * - Dialog / Popover / Sheet / Coachmark chrome 高度一致 = `--chrome-header-height`(canonical token)
 *
 * ── Token 規則 ──
 * horizontal padding: `px-[var(--layout-space-loose)]`
 * vertical sizing: `min-h-[var(--chrome-header-height)]`(Header / Footer),無 py
 * 分隔線: `border-{b|t} border-divider`
 *
 * ── Body ──
 * Body 仍用 padding-based(content area,不用固定高度 canonical)。
 * `px-[var(--layout-space-loose)] py-[var(--layout-space-tight)]`,Dialog / Sheet body 有
 * variant="list" 時 py 由 consumer override(見 dialog.tsx)。
 */

const CHROME_FRAME_H = 'min-h-[var(--chrome-header-height)]'

export const SurfaceHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center gap-2 shrink-0 border-b border-divider',
      'px-[var(--layout-space-loose)]',
      CHROME_FRAME_H,
      className,
    )}
    {...props}
  />
))
SurfaceHeader.displayName = 'SurfaceHeader'

export const SurfaceBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'px-[var(--layout-space-loose)] py-[var(--layout-space-tight)]',
      className,
    )}
    {...props}
  />
))
SurfaceBody.displayName = 'SurfaceBody'

export const SurfaceFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-end gap-2 shrink-0 border-t border-divider',
      'px-[var(--layout-space-loose)]',
      CHROME_FRAME_H,
      className,
    )}
    {...props}
  />
))
SurfaceFooter.displayName = 'SurfaceFooter'
