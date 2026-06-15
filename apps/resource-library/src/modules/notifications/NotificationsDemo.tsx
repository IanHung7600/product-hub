// 通知與提醒 Module — live demo (user approval: "授權" 2026-06-15)
// 消費 DS: Popover / Tabs / TabsList / TabsTrigger / TabsContent / Badge / Avatar / Button / Tag / Empty / toast

import { useState } from 'react'
import {
  Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverTitle, PopoverBody,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Badge, Avatar, Button, Tag, Empty, toast,
} from '@qijenchen/design-system'
import { Bell, Check } from 'lucide-react'

type NotifCategory = 'system' | 'todo' | 'mention'
interface Notif {
  id: string
  category: NotifCategory
  title: string
  body: string
  time: string
  read: boolean
  avatar?: string
}

const INITIAL: Notif[] = [
  { id: '1', category: 'todo',    title: '待簽核申請',      body: '陳怡君 的請假申請等待您核准。',         time: '5 分鐘前',  read: false },
  { id: '2', category: 'mention', title: '有人提到您',       body: '林志明 在「設計規範」文件中提到您。',    time: '30 分鐘前', read: false },
  { id: '3', category: 'system',  title: '系統維護通知',     body: '本週六 02:00–04:00 系統進行例行維護。', time: '2 小時前',  read: false },
  { id: '4', category: 'todo',    title: '到期提醒',         body: '「Q2 設計規範審查」今日到期。',          time: '昨天',      read: true  },
  { id: '5', category: 'system',  title: '版本更新',         body: 'Design System beta.67 已發布。',        time: '昨天',      read: true  },
]

function categoryColor(c: NotifCategory): 'blue' | 'amber' | 'purple' {
  if (c === 'system')  return 'blue'
  if (c === 'todo')    return 'amber'
  return 'purple'
}
function categoryLabel(c: NotifCategory) {
  if (c === 'system')  return '系統'
  if (c === 'todo')    return '待辦'
  return '提及'
}

// ── 通知中心面板 ──────────────────────────────────────────────────
function NotificationCenter() {
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL)
  const [tab, setTab] = useState<NotifCategory | 'all'>('all')

  const unread = notifs.filter((n) => !n.read).length
  const visible = tab === 'all' ? notifs : notifs.filter((n) => n.category === tab)

  const markRead = (id: string) =>
    setNotifs((ns) => ns.map((n) => n.id === id ? { ...n, read: true } : n))

  const markAllRead = () => {
    setNotifs((ns) => ns.map((n) => ({ ...n, read: true })))
    toast({ title: '全部標記為已讀' })
  }

  const TABS: Array<{ value: NotifCategory | 'all'; label: string }> = [
    { value: 'all',     label: '全部' },
    { value: 'system',  label: '系統' },
    { value: 'todo',    label: '待辦' },
    { value: 'mention', label: '提及' },
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="tertiary" iconOnly aria-label="通知中心">
          <span className="relative inline-flex">
            <Bell className="size-4" />
            {unread > 0 && (
              <Badge count={unread} />
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[380px]">
        <PopoverHeader>
          <PopoverTitle>通知中心</PopoverTitle>
          {unread > 0 && (
            <Button variant="text" onClick={markAllRead} startIcon={Check}>全部已讀</Button>
          )}
        </PopoverHeader>
        <PopoverBody>
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList>
              {TABS.map((t) => <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>)}
            </TabsList>
            <TabsContent value={tab}>
              {visible.length === 0 ? (
                <Empty title="沒有通知" description="目前沒有此類通知。" />
              ) : (
                <ul className="divide-y divide-divider">
                  {visible.map((n) => (
                    <li key={n.id}
                      className={`flex gap-[var(--layout-space-tight)] py-[var(--layout-space-tight)] cursor-pointer ${!n.read ? 'bg-surface-raised' : ''}`}
                      onClick={() => markRead(n.id)}>
                      <Avatar alt={n.title} size={32} color={categoryColor(n.category)} />
                      <div className="min-w-0 flex-1 space-y-[var(--layout-space-tight)]">
                        <div className="flex items-center gap-[var(--layout-space-tight)]">
                          <span className="text-body font-medium">{n.title}</span>
                          {!n.read && <span className="size-2 rounded-full bg-[var(--color-blue-5)]" />}
                        </div>
                        <p className="text-body text-fg-secondary">{n.body}</p>
                        <div className="flex items-center gap-[var(--layout-space-tight)]">
                          <Tag color={categoryColor(n.category)}>{categoryLabel(n.category)}</Tag>
                          <span className="text-body text-fg-muted">{n.time}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

// ── 即時 Toast 示範 ───────────────────────────────────────────────
function ToastDemo() {
  const scenarios = [
    { label: '申請已送出',   variant: 'success' as const, title: '請假申請已送出',   desc: '將進入主管簽核流程' },
    { label: '簽核待辦',     variant: 'neutral' as const, title: '您有新的簽核申請', desc: '陳怡君 的請假申請' },
    { label: '到期提醒',     variant: 'warning' as const, title: '任務即將到期',     desc: 'Q2 設計規範審查 今日到期' },
    { label: '操作失敗',     variant: 'error' as const, title: '送出失敗',     desc: '請檢查網路連線後重試' },
  ]
  return (
    <div className="space-y-[var(--layout-space-loose)]">
      <p className="text-body text-fg-secondary">點擊下方按鈕觸發不同類型的即時通知 Toast：</p>
      <div className="flex flex-wrap gap-[var(--layout-space-tight)]">
        {scenarios.map((s) => (
          <Button key={s.label} variant="secondary"
            onClick={() => toast({ variant: s.variant, title: s.title, description: s.desc })}>
            {s.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

// ── 分類通知 ─────────────────────────────────────────────────────
function CategorizedDemo() {
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL)
  const grouped = (['system', 'todo', 'mention'] as NotifCategory[]).map((cat) => ({
    cat,
    items: notifs.filter((n) => n.category === cat),
  }))
  const markRead = (id: string) =>
    setNotifs((ns) => ns.map((n) => n.id === id ? { ...n, read: true } : n))

  return (
    <div className="space-y-[var(--layout-space-loose)]">
      {grouped.map(({ cat, items }) => (
        <section key={cat} className="space-y-[var(--layout-space-tight)]">
          <div className="flex items-center gap-[var(--layout-space-tight)]">
            <span className="text-body font-medium">{categoryLabel(cat)}</span>
            <Tag color={categoryColor(cat)}>{items.filter((n) => !n.read).length} 未讀</Tag>
          </div>
          {items.length === 0 ? (
            <p className="text-body text-fg-muted">無通知</p>
          ) : (
            <ul className="divide-y divide-divider rounded-lg border border-divider">
              {items.map((n) => (
                <li key={n.id}
                  className={`flex gap-[var(--layout-space-tight)] p-[var(--layout-space-tight)] cursor-pointer ${!n.read ? 'font-medium' : ''}`}
                  onClick={() => markRead(n.id)}>
                  <div className="min-w-0 flex-1">
                    <div className="text-body">{n.title}</div>
                    <div className="text-body text-fg-secondary">{n.body}</div>
                  </div>
                  <span className="text-body text-fg-muted whitespace-nowrap">{n.time}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  )
}

export function NotificationsDemo({ variant }: { variant: string }) {
  if (variant === 'toast')       return <ToastDemo />
  if (variant === 'categorized') return <CategorizedDemo />
  // center variant 顯示完整通知中心面板 + 操作說明
  return (
    <div className="space-y-[var(--layout-space-loose)]">
      <p className="text-body text-fg-secondary">點擊右側鈴鐺圖示開啟通知中心，可依分類瀏覽、標記已讀：</p>
      <NotificationCenter />
    </div>
  )
}
