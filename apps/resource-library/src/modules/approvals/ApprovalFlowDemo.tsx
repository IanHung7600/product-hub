// 多層級/多方簽核 Module — live demo (user approval: "授權" 2026-06-15)
// 消費 DS: Steps / Avatar / Tag / Button / DescriptionList / DescriptionItem / toast

import { useState } from 'react'
import {
  Steps, StepItem, StepLabel, StepDescription, StepContent,
  Avatar, Tag, Button, DescriptionList, DescriptionItem, toast,
} from '@qijenchen/design-system'

type ApprovalState = 'pending' | 'approved' | 'rejected'
interface Approver { id: string; name: string; role: string }

function RequestSummary() {
  return (
    <DescriptionList cols={2}>
      <DescriptionItem label="申請人">陳怡君</DescriptionItem>
      <DescriptionItem label="假別">特休 2 天</DescriptionItem>
      <DescriptionItem label="起訖">2026-06-20 ～ 2026-06-21</DescriptionItem>
      <DescriptionItem label="事由">家庭旅遊</DescriptionItem>
    </DescriptionList>
  )
}

function StatusTag({ state }: { state: ApprovalState }) {
  if (state === 'approved') return <Tag color="green">已核准</Tag>
  if (state === 'rejected') return <Tag color="red">已退回</Tag>
  return <Tag color="neutral">待簽核</Tag>
}

function ApproverRow({ approver, state, onApprove, onReject }: {
  approver: Approver; state: ApprovalState; onApprove: () => void; onReject?: () => void
}) {
  return (
    <li className="flex items-center gap-[var(--layout-space-loose)] rounded-lg border border-divider bg-surface p-[var(--layout-space-tight)]">
      <Avatar alt={approver.name} size={32} />
      <div className="min-w-0 flex-1">
        <div className="text-body font-medium">{approver.name}</div>
        <div className="text-body text-fg-secondary">{approver.role}</div>
      </div>
      <StatusTag state={state} />
      {state === 'pending' && (
        <div className="flex gap-[var(--layout-space-tight)]">
          <Button variant="primary" onClick={onApprove}>核准</Button>
          {onReject && <Button variant="secondary" danger onClick={onReject}>退回</Button>}
        </div>
      )}
    </li>
  )
}

// ── 序簽 ──────────────────────────────────────────────────────────
const SEQ_CHAIN: Approver[] = [
  { id: 'lead', name: '林志明', role: '直屬主管' },
  { id: 'mgr',  name: '王淑芬', role: '部門經理' },
  { id: 'hr',   name: '張家豪', role: 'HR' },
]

function SequentialFlow() {
  const [states, setStates] = useState<Record<string, ApprovalState>>({})
  const rejected = SEQ_CHAIN.some((a) => states[a.id] === 'rejected')
  const allApproved = SEQ_CHAIN.every((a) => states[a.id] === 'approved')
  const currentIdx = SEQ_CHAIN.findIndex((a) => (states[a.id] ?? 'pending') === 'pending')

  const act = (id: string, next: ApprovalState) => {
    setStates((s) => ({ ...s, [id]: next }))
    if (next === 'approved' && id === SEQ_CHAIN[SEQ_CHAIN.length - 1].id)
      toast({ variant: 'success', title: '簽核完成', description: '請假單已全數核准' })
    if (next === 'rejected')
      toast({ variant: 'warning', title: '已退回', description: `${SEQ_CHAIN.find((a) => a.id === id)?.name} 退回此申請` })
  }

  const completed = SEQ_CHAIN.filter((a) => states[a.id] === 'approved').map((a) => a.id)
  const errors    = SEQ_CHAIN.filter((a) => states[a.id] === 'rejected').map((a) => a.id)
  const activeId  = rejected || allApproved ? '' : SEQ_CHAIN[currentIdx]?.id ?? ''

  return (
    <div className="space-y-[var(--layout-space-loose)]">
      <RequestSummary />
      <Steps value={activeId} completedValues={completed} errorValues={errors} orientation="vertical">
        {SEQ_CHAIN.map((a, idx) => {
          const state = states[a.id] ?? 'pending'
          const isCurrent = idx === currentIdx && !rejected
          return (
            <StepItem key={a.id} value={a.id} state={state === 'rejected' ? 'error' : undefined}>
              <StepLabel>
                <span className="inline-flex items-center gap-[var(--layout-space-tight)]">
                  {a.role} <StatusTag state={state} />
                </span>
              </StepLabel>
              <StepDescription>{a.name}</StepDescription>
              <StepContent>
                {isCurrent ? (
                  <div className="flex gap-[var(--layout-space-tight)]">
                    <Button variant="primary" onClick={() => act(a.id, 'approved')}>核准</Button>
                    <Button variant="secondary" danger  onClick={() => act(a.id, 'rejected')}>退回</Button>
                  </div>
                ) : (
                  <span className="text-body text-fg-secondary">
                    {state === 'approved' ? '已核准' : state === 'rejected' ? '已退回' : '等待前一關核准'}
                  </span>
                )}
              </StepContent>
            </StepItem>
          )
        })}
      </Steps>
    </div>
  )
}

// ── 會簽 ──────────────────────────────────────────────────────────
const PARALLEL_GROUP: Approver[] = [
  { id: 'hr',      name: '張家豪', role: 'HR' },
  { id: 'finance', name: '李美玲', role: '財務' },
  { id: 'admin',   name: '吳建宏', role: '行政' },
]

function ParallelFlow() {
  const [states, setStates] = useState<Record<string, ApprovalState>>({})
  const act = (id: string, next: ApprovalState) => {
    const merged = { ...states, [id]: next }
    setStates(merged)
    if (PARALLEL_GROUP.every((a) => merged[a.id] === 'approved'))
      toast({ variant: 'success', title: '會簽完成', description: '全部簽核人已核准' })
  }
  return (
    <div className="space-y-[var(--layout-space-loose)]">
      <RequestSummary />
      <p className="text-body text-fg-secondary">三位簽核人可獨立並行核准，全數核准才完成。</p>
      <ul className="space-y-[var(--layout-space-tight)]">
        {PARALLEL_GROUP.map((a) => (
          <ApproverRow key={a.id} approver={a} state={states[a.id] ?? 'pending'}
            onApprove={() => act(a.id, 'approved')} onReject={() => act(a.id, 'rejected')} />
        ))}
      </ul>
    </div>
  )
}

// ── 混合:序簽 → 會簽 ─────────────────────────────────────────────
const HYBRID_GROUP: Approver[] = [
  { id: 'hr',      name: '張家豪', role: 'HR' },
  { id: 'finance', name: '李美玲', role: '財務' },
]

function HybridCoSignStage() {
  const [states, setStates] = useState<Record<string, ApprovalState>>({})
  const act = (id: string) => {
    const merged = { ...states, [id]: 'approved' as ApprovalState }
    setStates(merged)
    if (HYBRID_GROUP.every((a) => merged[a.id] === 'approved'))
      toast({ variant: 'success', title: '簽核完成', description: '序簽 + 會簽皆已核准' })
  }
  return (
    <ul className="space-y-[var(--layout-space-tight)]">
      {HYBRID_GROUP.map((a) => (
        <ApproverRow key={a.id} approver={a} state={states[a.id] ?? 'pending'}
          onApprove={() => act(a.id)} />
      ))}
    </ul>
  )
}

function HybridFlow() {
  const [leadApproved, setLeadApproved] = useState(false)
  const lead: Approver = { id: 'lead', name: '林志明', role: '直屬主管' }
  return (
    <div className="space-y-[var(--layout-space-loose)]">
      <RequestSummary />
      <section className="space-y-[var(--layout-space-tight)]">
        <h4 className="text-body font-medium">第一關 — 序簽：直屬主管</h4>
        <ul><ApproverRow approver={lead} state={leadApproved ? 'approved' : 'pending'}
          onApprove={() => setLeadApproved(true)} /></ul>
      </section>
      <section className="space-y-[var(--layout-space-tight)]">
        <h4 className="text-body font-medium">第二關 — 會簽：HR + 財務</h4>
        {leadApproved
          ? <HybridCoSignStage />
          : <p className="text-body text-fg-secondary">等待直屬主管核准後開放會簽。</p>}
      </section>
    </div>
  )
}

export function ApprovalFlowDemo({ variant }: { variant: string }) {
  if (variant === 'parallel') return <ParallelFlow />
  if (variant === 'hybrid')   return <HybridFlow />
  return <SequentialFlow />
}
