import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Sparkles, Bot, Users, FolderPlus, BarChart3 } from 'lucide-react'
import { Coachmark } from './coachmark'
import { Button } from '@/design-system/components/Button/button'

const meta: Meta = {
  title: 'Design System/Components/Coachmark/展示',
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj

// ── Media helpers (placeholder gradients — avoid external image refs) ────────

const MediaGradient = ({
  from, to, icon: Icon, label,
}: {
  from: string; to: string; icon: React.ComponentType<{ className?: string }>; label: string
}) => (
  <div
    className="w-full h-full flex items-center justify-center"
    style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
  >
    <div className="flex flex-col items-center gap-2 text-white/90">
      <Icon className="w-10 h-10" />
      <span className="text-footnote font-medium">{label}</span>
    </div>
  </div>
)

// ── Single Coachmark: Intercom-style feature discovery ──────────────────────

export const FeatureDiscovery: Story = {
  name: '新功能介紹(Intercom / Slack 風格)',
  render: () => {
    const [open, setOpen] = React.useState(true)
    return (
      <div className="flex flex-col items-center gap-3">
        <Coachmark
          open={open}
          onOpenChange={setOpen}
          image={<MediaGradient from="#6366f1" to="#8b5cf6" icon={Bot} label="AI 助理" />}
          title="試試新的 AI 助理"
          description="在任何文件中按下 AI 按鈕,讓 Claude 幫你摘要、翻譯或改寫內容。"
          onSkip={() => setOpen(false)}
          onNext={() => setOpen(false)}
          side="bottom"
          align="center"
        >
          <Button variant="primary" startIcon={Bot}>AI 助理</Button>
        </Coachmark>
        <p className="text-footnote text-fg-muted">↑ 首次看到新功能時主動介紹;使用者可 Skip 或點 Next 確認</p>
      </div>
    )
  },
}

// ── Multi-step Tour: Linear/Notion/Figma onboarding ─────────────────────────

const tourSteps = [
  {
    anchor: '建立 Workspace',
    icon: FolderPlus,
    media: { from: '#0ea5e9', to: '#06b6d4', label: 'Workspace' },
    title: '建立你的第一個 Workspace',
    description: 'Workspace 是團隊協作的主要空間,所有專案、文件、成員都在這裡集中管理。',
  },
  {
    anchor: '邀請成員',
    icon: Users,
    media: { from: '#f59e0b', to: '#ef4444', label: '團隊' },
    title: '邀請成員加入',
    description: '輸入 email 寄送邀請,新成員會自動加入這個 Workspace 並看到你目前的專案。',
  },
  {
    anchor: '建立第一個專案',
    icon: Sparkles,
    media: { from: '#10b981', to: '#059669', label: '專案' },
    title: '建立你的第一個專案',
    description: '專案用來組織相關的任務、文件和討論。你隨時可以建立更多專案或邀請成員加入。',
  },
]

export const MultiStepTour: Story = {
  name: '多步 Onboarding Tour(Linear / Notion / Figma 風格)',
  render: () => {
    const [step, setStep] = React.useState(0)
    const [open, setOpen] = React.useState(true)
    const isLast = step === tourSteps.length - 1

    return (
      <div className="flex flex-col gap-6 min-w-[360px]">
        <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-surface">
          {tourSteps.map((s, i) => (
            <Coachmark
              key={s.anchor}
              open={open && step === i}
              onOpenChange={(o) => { if (!o) setOpen(false) }}
              image={<MediaGradient from={s.media.from} to={s.media.to} icon={s.icon} label={s.media.label} />}
              title={s.title}
              description={s.description}
              step={{ current: i + 1, total: tourSteps.length }}
              onPrev={i > 0 ? () => setStep(i - 1) : undefined}
              onSkip={() => setOpen(false)}
              onNext={() => (isLast && step === i ? setOpen(false) : setStep(i + 1))}
              isLastStep={i === tourSteps.length - 1}
              side="bottom"
              align="start"
            >
              <Button variant={i === step ? 'primary' : 'tertiary'} size="sm" startIcon={s.icon}>
                {s.anchor}
              </Button>
            </Coachmark>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="tertiary" size="sm" onClick={() => { setStep(0); setOpen(true) }}>重設 Tour</Button>
          <span className="text-footnote text-fg-muted self-center">
            目前第 {step + 1} / {tourSteps.length} 步{isLast ? '(最後步 — Next 變 Done)' : ''}
          </span>
        </div>
      </div>
    )
  },
}

// ── No Media: Simple What's New ─────────────────────────────────────────────

export const TextOnly: Story = {
  name: '純文字提示(What\'s New / Stripe 風格)',
  render: () => {
    const [open, setOpen] = React.useState(true)
    return (
      <div className="flex flex-col items-center gap-3">
        <Coachmark
          open={open}
          onOpenChange={setOpen}
          title="新版圖表模式已上線"
          description="Dashboard 現在支援互動式圖表,可切換折線 / 長條 / 圓餅。點選右上圖表圖示查看。"
          onNext={() => setOpen(false)}
          side="bottom"
          align="end"
        >
          <Button variant="tertiary" startIcon={BarChart3}>圖表模式</Button>
        </Coachmark>
        <p className="text-footnote text-fg-muted">↑ 不含 media 時整體更緊湊,適合單純的版本更新提示</p>
      </div>
    )
  },
}

// ── Video / Illustration ────────────────────────────────────────────────────

export const WithIllustration: Story = {
  name: '搭配動畫 illustration(Figma 風格)',
  render: () => {
    const [open, setOpen] = React.useState(true)
    return (
      <div className="flex flex-col items-center gap-3">
        <Coachmark
          open={open}
          onOpenChange={setOpen}
          image={
            <div className="w-full h-full flex items-center justify-center"
              style={{
                backgroundImage: 'radial-gradient(circle at 30% 30%, #fde68a 0%, transparent 50%), radial-gradient(circle at 70% 60%, #a5b4fc 0%, transparent 50%), linear-gradient(135deg, #fff 0%, #f3f4f6 100%)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div className="text-caption text-foreground font-medium">Figma-style preview</div>
              </div>
            </div>
          }
          title="Auto-layout 讓設計更有彈性"
          description="選取多個 layer 後按 Shift+A 建立 auto-layout,元素會自動對齊並隨內容調整。"
          onSkip={() => setOpen(false)}
          onNext={() => setOpen(false)}
          side="bottom"
          align="start"
        >
          <Button variant="primary" size="sm" startIcon={Sparkles}>Auto-layout</Button>
        </Coachmark>
        <p className="text-footnote text-fg-muted">↑ Illustration / animated preview 比純截圖更能傳達「這個功能在做什麼」</p>
      </div>
    )
  },
}
