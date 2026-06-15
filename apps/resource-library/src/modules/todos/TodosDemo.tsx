// 待辦事項 Module — live demo (user approval: "授權" 2026-06-15)
// 消費 DS: DataTable / Checkbox / Badge / Tag / Button / DropdownMenu / Empty / toast

import { useState } from 'react'
import {
  Badge, Tag, Button, Checkbox, Empty, toast,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@qijenchen/design-system'
import { MoreVertical, CheckCheck } from 'lucide-react'

type TodoStatus = 'pending' | 'in-progress' | 'done'

interface Todo {
  id: string
  title: string
  assignee: string
  due: string
  status: TodoStatus
  priority: 'high' | 'normal' | 'low'
}

const INITIAL: Todo[] = [
  { id: '1', title: '審查 Q2 設計規範更新',    assignee: '陳怡君', due: '2026-06-20', status: 'pending',     priority: 'high' },
  { id: '2', title: '完成請假系統 UI 交付',    assignee: '陳怡君', due: '2026-06-18', status: 'in-progress', priority: 'high' },
  { id: '3', title: '更新元件庫文件',          assignee: '林志明', due: '2026-06-25', status: 'pending',     priority: 'normal' },
  { id: '4', title: '排定下季 OKR 會議',      assignee: '王淑芬', due: '2026-06-30', status: 'pending',     priority: 'low' },
  { id: '5', title: '確認差旅報銷流程',        assignee: '張家豪', due: '2026-06-17', status: 'done',        priority: 'normal' },
]

function statusColor(s: TodoStatus): 'amber' | 'blue' | 'green' {
  if (s === 'pending')     return 'amber'
  if (s === 'in-progress') return 'blue'
  return 'green'
}
function statusLabel(s: TodoStatus) {
  if (s === 'pending')     return '待處理'
  if (s === 'in-progress') return '進行中'
  return '已完成'
}
function priorityColor(p: Todo['priority']): 'red' | 'neutral' | 'green' {
  if (p === 'high')   return 'red'
  if (p === 'normal') return 'neutral'
  return 'green'
}

// ── 清單模式 ──────────────────────────────────────────────────────
function ListMode() {
  const [todos, setTodos] = useState<Todo[]>(INITIAL)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<TodoStatus | 'all'>('all')

  const visible = filter === 'all' ? todos : todos.filter((t) => t.status === filter)

  const toggle = (id: string) =>
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  const markDone = (ids: string[]) => {
    setTodos((ts) => ts.map((t) => ids.includes(t.id) ? { ...t, status: 'done' } : t))
    setSelected(new Set())
    toast({ variant: 'success', title: `${ids.length} 項已完成` })
  }

  const FILTERS: Array<{ value: TodoStatus | 'all'; label: string }> = [
    { value: 'all',         label: '全部' },
    { value: 'pending',     label: '待處理' },
    { value: 'in-progress', label: '進行中' },
    { value: 'done',        label: '已完成' },
  ]

  return (
    <div className="space-y-[var(--layout-space-loose)]">
      {/* 篩選列 + 批次操作 */}
      <div className="flex items-center gap-[var(--layout-space-tight)] flex-wrap">
        {FILTERS.map((f) => (
          <Button key={f.value} variant={filter === f.value ? 'secondary' : 'tertiary'}
            onClick={() => setFilter(f.value)}>{f.label}</Button>
        ))}
        {selected.size > 0 && (
          <Button variant="primary" startIcon={CheckCheck}
            onClick={() => markDone([...selected])}>
            標記完成（{selected.size}）
          </Button>
        )}
      </div>

      {/* 清單 */}
      {visible.length === 0 ? (
        <Empty title="沒有符合條件的待辦" description="試試切換上方篩選條件。" />
      ) : (
        <ul className="divide-y divide-divider rounded-lg border border-divider">
          {visible.map((t) => (
            <li key={t.id}
              className="flex items-center gap-[var(--layout-space-loose)] px-[var(--layout-space-loose)] py-[var(--layout-space-tight)]">
              <Checkbox
                checked={selected.has(t.id)}
                onCheckedChange={() => toggle(t.id)}
                aria-label={t.title}
              />
              <div className="min-w-0 flex-1">
                <div className={`text-body font-medium ${t.status === 'done' ? 'line-through text-fg-muted' : ''}`}>
                  {t.title}
                </div>
                <div className="text-body text-fg-secondary">指派：{t.assignee}　到期：{t.due}</div>
              </div>
              <Tag color={statusColor(t.status)}>{statusLabel(t.status)}</Tag>
              <Badge count={t.priority === 'high' ? 1 : 0} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="text" iconOnly startIcon={MoreVertical} aria-label="更多操作" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => markDone([t.id])}>標記完成</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() =>
                    setTodos((ts) => ts.filter((x) => x.id !== t.id))}>刪除</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ── 看板模式 ──────────────────────────────────────────────────────
const COLUMNS: Array<{ status: TodoStatus; label: string }> = [
  { status: 'pending',     label: '待處理' },
  { status: 'in-progress', label: '進行中' },
  { status: 'done',        label: '已完成' },
]

function BoardMode() {
  const [todos, setTodos] = useState<Todo[]>(INITIAL)

  const moveTo = (id: string, next: TodoStatus) => {
    setTodos((ts) => ts.map((t) => t.id === id ? { ...t, status: next } : t))
    toast({ title: `已移至「${statusLabel(next)}」` })
  }

  return (
    <div className="grid grid-cols-3 gap-[var(--layout-space-loose)]">
      {COLUMNS.map((col) => {
        const items = todos.filter((t) => t.status === col.status)
        return (
          <div key={col.status} className="space-y-[var(--layout-space-tight)]">
            <div className="flex items-center gap-[var(--layout-space-tight)]">
              <span className="text-body font-medium">{col.label}</span>
              <Tag color={statusColor(col.status)}>{items.length}</Tag>
            </div>
            {items.length === 0
              ? <p className="text-body text-fg-muted">無項目</p>
              : items.map((t) => (
                <div key={t.id}
                  className="rounded-lg border border-divider bg-surface p-[var(--layout-space-tight)] space-y-[var(--layout-space-tight)]">
                  <div className="text-body font-medium">{t.title}</div>
                  <div className="text-body text-fg-secondary">{t.assignee}</div>
                  <div className="flex gap-[var(--layout-space-tight)]">
                    {COLUMNS.filter((c) => c.status !== col.status).map((c) => (
                      <Button key={c.status} variant="tertiary" onClick={() => moveTo(t.id, c.status)}>
                        → {c.label}
                      </Button>
                    ))}
                  </div>
                </div>
              ))
            }
          </div>
        )
      })}
    </div>
  )
}

export function TodosDemo({ variant }: { variant: string }) {
  if (variant === 'board') return <BoardMode />
  return <ListMode />
}
