import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverFooter,
} from '@/design-system/components/Popover/popover'
import { Button } from '@/design-system/components/Button/button'
import { AspectRatio } from '@/design-system/components/AspectRatio/aspect-ratio'

/**
 * Coachmark — 功能介紹 / onboarding tour 的浮層卡片
 *
 * 世界級對照:Apple HIG「Coachmark」(Apple 命名原處)/ Material「Feature Discovery」/
 * Ant Design `<Tour>` / Shepherd.js / react-joyride / Intercom Product Tours。
 *
 * user 敘述:「跟 popover 很像,只是隱藏 header」──完全正確。本元件 = **Popover 的
 * composition pattern**,consume 相同 overlay-surface SSOT 的 Body + Footer:
 *   - 無 Header(user 明確指示)
 *   - Media 區(圖 / 截圖 / illustration,full-width 邊緣對齊)
 *   - Body(SurfaceBody padding):title + description 左對齊
 *   - Footer(SurfaceFooter padding,但 justify-between):step 計數左 / actions 右
 *
 * ── 多步導覽 ──
 * 單 Coachmark 用 `onSkip` + `onNext`;多步(current/total)consumer 自行管理 step
 * state,每步渲染一個 Coachmark,anchor 到對應 trigger element。
 *
 * ── 為什麼 Body+Footer 消費 overlay-surface ──
 * 避免 padding token 漂移:Dialog / Popover / Coachmark 三者共用同一套 Header/Body/Footer
 * padding(px-loose / py-tight),改 Dialog 就三邊自動跟進。
 */

interface CoachmarkStep {
  current: number
  total: number
}

export interface CoachmarkProps {
  /** 控制顯示 */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** 觸發 anchor 元素。通常傳 trigger element;Coachmark 浮層會定位於此 */
  children: React.ReactNode
  /** 頂部 media 區(圖片 / illustration / video 等);不傳則無 media */
  image?: React.ReactNode
  /**
   * Media 區域的長寬比(ratio = 寬 / 高)。預設 `16/9`(onboarding feature tour
   * 世界級 convention — Intercom / Pendo / Shepherd.js)。其他常用:`4/3` 產品截圖 /
   * `1/1` 方圖 / `3/4` 直式 portrait。消費獨立的 `AspectRatio` primitive 元件。
   */
  mediaRatio?: number
  /** 標題(bold) */
  title?: React.ReactNode
  /** 說明文字(normal weight,多行 OK) */
  description?: React.ReactNode
  /** 步驟計數(2 of 3);若需多步導覽 consumer 自行管理 current */
  step?: CoachmarkStep
  /** Skip 按鈕 callback;不傳則不顯示 Skip */
  onSkip?: () => void
  /** Next 按鈕 callback;不傳則不顯示 Next */
  onNext?: () => void
  /** Previous 按鈕 callback(多步 tour 第 2+ 步顯示);不傳則不顯示 */
  onPrev?: () => void
  /** 最後一步時 Next 按鈕文字改用 done text(預設 "Next" / "Done") */
  isLastStep?: boolean
  /** 浮層定位(對齊 Popover props) */
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  /** 外殼寬度(預設 w-80 = 320px,比一般 Popover 寬,因要放 media + 文字) */
  className?: string
}

const Coachmark = React.forwardRef<HTMLDivElement, CoachmarkProps>(
  (
    {
      open,
      onOpenChange,
      children,
      image,
      mediaRatio = 16 / 9,
      title,
      description,
      step,
      onSkip,
      onNext,
      onPrev,
      isLastStep = false,
      side = 'bottom',
      align = 'center',
      sideOffset = 8,
      className,
    },
    ref,
  ) => {
    const hasFooterContent = Boolean(step || onSkip || onNext || onPrev)
    const stepText = step ? `${step.current} of ${step.total}` : null

    return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent
          ref={ref}
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={cn('w-80 p-0 overflow-hidden', className)}
        >
          {image && (
            <AspectRatio ratio={mediaRatio} className="w-full overflow-hidden bg-muted">
              {image}
            </AspectRatio>
          )}

          {(title || description) && (
            <PopoverBody className="flex flex-col gap-1">
              {title && (
                <h3 className="text-body-lg font-medium text-foreground">{title}</h3>
              )}
              {description && (
                <p className="text-body text-fg-secondary">{description}</p>
              )}
            </PopoverBody>
          )}

          {hasFooterContent && (
            <PopoverFooter className="justify-between">
              {stepText ? (
                <span className="text-caption text-fg-secondary tabular-nums">
                  {stepText}
                </span>
              ) : (
                <span aria-hidden /> /* 保持 justify-between space,即使無 step 文字 */
              )}
              <div className="flex items-center gap-2">
                {onPrev && (
                  <Button variant="tertiary" size="sm" onClick={onPrev}>
                    Previous
                  </Button>
                )}
                {onSkip && (
                  <Button variant="tertiary" size="sm" onClick={onSkip}>
                    Skip
                  </Button>
                )}
                {onNext && (
                  <Button variant="primary" size="sm" onClick={onNext}>
                    {isLastStep ? 'Done' : 'Next'}
                  </Button>
                )}
              </div>
            </PopoverFooter>
          )}
        </PopoverContent>
      </Popover>
    )
  },
)
Coachmark.displayName = 'Coachmark'

export { Coachmark }
