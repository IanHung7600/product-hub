import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner'
import { Notice, useInverseTheme, type NoticeVariant } from '@/design-system/components/Notice/notice'
import { Button } from '@/design-system/components/Button/button'

/**
 * Toast — 非阻斷式浮動通知
 *
 * ── Container 三層結構（所有 variant 統一） ──
 *
 * 1. Shadow wrapper: rounded-lg + elevation-200（永遠在頁面 theme 解析）
 * 2. Bg layer: bg-{color}（有色相 variant 在頁面 theme 解析）
 * 3. Theme layer: data-theme + text-foreground（content token re-resolve）
 *
 * neutral/success(inverse): bg + theme 同層（bg-surface-raised 需要跟 data-theme 一起翻轉）
 * info/error(dark): bg 在 outer,theme 在 inner
 * warning(light always): bg 在 outer,theme="light" 在 inner
 */

export type ToastVariant = NoticeVariant

export interface ToastOptions {
  variant?: ToastVariant
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  duration?: number
}

function ToastInner({
  id,
  variant = 'neutral',
  action,
  ...rest
}: ToastOptions & { id: string | number }) {
  const inverseTheme = useInverseTheme()
  const isInverse = variant === 'neutral' || variant === 'success'
  const dismiss = () => sonnerToast.dismiss(id)

  const actionButton = action ? (
    <Button variant="tertiary" size="xs" onClick={action.onClick}>{action.label}</Button>
  ) : undefined

  // ── 1. Shadow wrapper（統一,永遠在頁面 theme） ──
  // ── 2+3. Bg + theme layer ──

  if (isInverse) {
    // bg-surface-raised 需要跟 data-theme 同層翻轉
    return (
      <div className="rounded-lg overflow-hidden" style={{ boxShadow: 'var(--elevation-200)' }}>
        <div data-theme={inverseTheme} className="bg-surface-raised text-foreground">
          <Notice variant={variant} iconClassName={variant === 'success' ? 'text-success' : undefined}
            endContent={actionButton} onDismiss={dismiss} {...rest} />
        </div>
      </div>
    )
  }

  const bg = variant === 'warning' ? 'bg-warning' : variant === 'error' ? 'bg-error' : 'bg-info'
  const theme = variant === 'warning' ? 'light' : 'dark'

  return (
    <div className="rounded-lg overflow-hidden" style={{ boxShadow: 'var(--elevation-200)' }}>
      <div className={bg}>
        <div data-theme={theme} className="text-foreground">
          <Notice variant={variant} endContent={actionButton} onDismiss={dismiss} {...rest} />
        </div>
      </div>
    </div>
  )
}

export function toast(options: ToastOptions) {
  const { duration = 4000, ...rest } = options
  return sonnerToast.custom((id) => <ToastInner id={id} {...rest} />, { duration })
}

export interface ToasterProps {
  position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center'
}

export function Toaster({ position = 'bottom-right' }: ToasterProps) {
  return (
    <SonnerToaster
      position={position}
      toastOptions={{ unstyled: true, className: 'w-[360px]' }}
    />
  )
}
