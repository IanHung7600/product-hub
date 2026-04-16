import type { Meta } from '@storybook/react'
import { Notice, type NoticeVariant } from '@/design-system/components/Notice/notice'
import { Button } from '@/design-system/components/Button/button'
import { Toaster, toast } from './toast'
import { cn } from '@/lib/utils'

const meta: Meta = {
  title: 'Design System/Components/Toast/展示',
  parameters: { layout: 'padded' },
}
export default meta

const VARIANTS: NoticeVariant[] = ['neutral', 'success', 'warning', 'error']
const LABELS: Record<string, string> = { neutral: 'Info/neutral', success: 'Success', warning: 'Warning', error: 'Error' }

/**
 * 靜態 Toast 展示——完全複製 Toast.tsx 的三層結構:
 * 1. Shadow wrapper: rounded-lg + elevation-200
 * 2. Bg layer: bg-{color}
 * 3. Theme layer: data-theme + text-foreground
 *
 * pageTheme 模擬頁面 theme,用來計算 inverse。
 */
function StaticToast({ variant, title, description, pageTheme }: {
  variant: NoticeVariant; title: string; description?: string; pageTheme: 'light' | 'dark'
}) {
  const inverse = pageTheme === 'light' ? 'dark' : 'light'
  const isInverse = variant === 'neutral' || variant === 'success'
  const actionBtn = <Button variant="tertiary" size="xs">Label</Button>

  // ── inverse: bg + theme 同層 ──
  if (isInverse) {
    return (
      <div className="rounded-lg overflow-hidden w-[360px]" style={{ boxShadow: 'var(--elevation-200)' }}>
        <div data-theme={inverse} className="bg-surface-raised text-foreground">
          <Notice variant={variant} title={title} description={description}
            iconClassName={variant === 'success' ? 'text-success' : undefined}
            endContent={actionBtn} />
        </div>
      </div>
    )
  }

  // ── 有色相: bg outer + theme inner ──
  const bg = variant === 'warning' ? 'bg-warning' : variant === 'error' ? 'bg-error' : 'bg-info'
  const theme = variant === 'warning' ? 'light' : 'dark'

  return (
    <div className="rounded-lg overflow-hidden w-[360px]" style={{ boxShadow: 'var(--elevation-200)' }}>
      <div className={bg}>
        <div data-theme={theme} className="text-foreground">
          <Notice variant={variant} title={title} description={description} endContent={actionBtn} />
        </div>
      </div>
    </div>
  )
}

function modeLabel(variant: NoticeVariant, pageTheme: 'light' | 'dark') {
  if (variant === 'warning') return 'light'
  if (variant === 'neutral' || variant === 'success') return pageTheme === 'light' ? 'dark' : 'light'
  return 'dark'
}

export const AllVariants = {
  name: '所有 Variant',
  render: () => (
    <div className="flex gap-16">
      <div className="flex flex-col gap-4">
        <span className="text-caption text-fg-muted font-medium">light mode</span>
        <div className="flex flex-col gap-3 p-8 rounded-lg bg-canvas border border-divider">
          {VARIANTS.map((v) => (
            <div key={v} className="flex items-center gap-4">
              <span className="text-caption text-fg-muted w-24 shrink-0">元素 {modeLabel(v, 'light')} mode</span>
              <StaticToast variant={v} title={LABELS[v]} pageTheme="light" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4" data-theme="dark">
        <span className="text-caption text-fg-muted font-medium">dark mode</span>
        <div className="flex flex-col gap-3 p-8 rounded-lg bg-canvas border border-divider">
          {VARIANTS.map((v) => (
            <div key={v} className="flex items-center gap-4">
              <span className="text-caption text-fg-muted w-24 shrink-0">元素 {modeLabel(v, 'dark')} mode</span>
              <StaticToast variant={v} title={LABELS[v]} pageTheme="dark" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}

export const WithDescription = {
  name: '有 Title + Description',
  render: () => (
    <div className="flex gap-16">
      <div className="flex flex-col gap-4">
        <span className="text-caption text-fg-muted font-medium">light mode</span>
        <div className="flex flex-col gap-3 p-8 rounded-lg bg-canvas border border-divider">
          {VARIANTS.map((v) => (
            <div key={v} className="flex items-center gap-4">
              <span className="text-caption text-fg-muted w-24 shrink-0">元素 {modeLabel(v, 'light')} mode</span>
              <StaticToast variant={v} title={LABELS[v]} description="description" pageTheme="light" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4" data-theme="dark">
        <span className="text-caption text-fg-muted font-medium">dark mode</span>
        <div className="flex flex-col gap-3 p-8 rounded-lg bg-canvas border border-divider">
          {VARIANTS.map((v) => (
            <div key={v} className="flex items-center gap-4">
              <span className="text-caption text-fg-muted w-24 shrink-0">元素 {modeLabel(v, 'dark')} mode</span>
              <StaticToast variant={v} title={LABELS[v]} description="description" pageTheme="dark" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}

export const Interactive = {
  name: '互動測試',
  render: () => (
    <div className="flex flex-col gap-4">
      <span className="text-caption text-fg-muted">點按鈕觸發 Toast</span>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => toast({ title: 'Info/neutral', action: { label: 'Label', onClick: () => {} } })}>Neutral</Button>
        <Button variant="secondary" onClick={() => toast({ variant: 'success', title: '操作成功', description: '已儲存變更', action: { label: 'Label', onClick: () => {} } })}>Success</Button>
        <Button variant="secondary" onClick={() => toast({ variant: 'warning', title: '注意', description: '即將到期', action: { label: 'Label', onClick: () => {} } })}>Warning</Button>
        <Button variant="secondary" onClick={() => toast({ variant: 'error', title: '操作失敗', description: '請稍後重試', action: { label: 'Label', onClick: () => {} } })}>Error</Button>
      </div>
      <Toaster />
    </div>
  ),
}
