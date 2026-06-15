// Module 詳情 — 雙視圖(流程視圖 PM / 規格視圖 Dev)+ live demo
// 流程視圖:情境敘述 + 變種 + 可互動 demo(Mobbin Interactive Mode 視覺參考)
// 規格視圖:依賴 DS 元件 + 客製化邊界

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  SegmentedControl,
  SegmentedControlItem,
  Tag,
  Button,
  Empty,
} from '@qijenchen/design-system'
import { getModule } from '../data/modules'
import { LeaveRequestDemo } from '../modules/forms/LeaveRequestDemo'
import { ApprovalFlowDemo } from '../modules/approvals/ApprovalFlowDemo'
import { TodosDemo } from '../modules/todos/TodosDemo'
import { NotificationsDemo } from '../modules/notifications/NotificationsDemo'

export function ModuleDetailPage() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const navigate = useNavigate()
  const module = getModule(moduleId ?? '')
  const [variant, setVariant] = useState(module?.variants[0]?.id ?? '')

  if (!module) {
    return (
      <div className="px-[var(--layout-space-loose)] py-[var(--layout-space-tight)]">
        <Empty title="找不到此 Module" description="它可能尚未收錄。">
          <Button variant="secondary" onClick={() => navigate('/modules')}>回到目錄</Button>
        </Empty>
      </div>
    )
  }

  return (
    <div className="px-[var(--layout-space-loose)] py-[var(--layout-space-tight)] space-y-[var(--layout-space-loose)]">
      {/* 標題區 */}
      <div className="space-y-[var(--layout-space-tight)]">
        <div className="flex items-center gap-[var(--layout-space-tight)]">
          <h2 className="text-h3">{module.name}</h2>
          <Tag color="neutral">{module.categoryLabel}</Tag>
          {module.status === 'planned' && <Tag color="neutral">規劃中</Tag>}
        </div>
        <p className="text-body text-fg-secondary max-w-2xl">{module.summary}</p>
      </div>

      {/* 雙視圖 */}
      <Tabs defaultValue="flow">
        <TabsList>
          <TabsTrigger value="flow">流程視圖</TabsTrigger>
          <TabsTrigger value="spec">規格視圖</TabsTrigger>
        </TabsList>

        {/* ── 流程視圖(PM)── */}
        <TabsContent value="flow">
          <div className="space-y-[var(--layout-space-loose)] pt-[var(--layout-space-tight)]">
            <section className="space-y-[var(--layout-space-tight)]">
              <h3 className="text-h5">使用情境</h3>
              <p className="text-body text-fg-secondary max-w-2xl">{module.scenario}</p>
            </section>

            <section className="space-y-[var(--layout-space-tight)]">
              <h3 className="text-h5">變種</h3>
              <SegmentedControl value={variant} onValueChange={setVariant} aria-label="選擇變種">
                {module.variants.map((v) => (
                  <SegmentedControlItem key={v.id} value={v.id}>{v.label}</SegmentedControlItem>
                ))}
              </SegmentedControl>
              <p className="text-body text-fg-secondary">
                {module.variants.find((v) => v.id === variant)?.description}
              </p>
            </section>

            <section className="space-y-[var(--layout-space-tight)]">
              <h3 className="text-h5">可互動 Demo</h3>
              <div className="rounded-lg border border-divider bg-surface p-[var(--layout-space-loose)]">
                {module.id === 'forms'         ? <LeaveRequestDemo variant={variant} />
                 : module.id === 'approvals'   ? <ApprovalFlowDemo variant={variant} />
                 : module.id === 'todos'        ? <TodosDemo variant={variant} />
                 : module.id === 'notifications'? <NotificationsDemo variant={variant} />
                 : <Empty title="Demo 規劃中" description="此 Module 的可互動 demo 將在後續階段提供。" />}
              </div>
            </section>
          </div>
        </TabsContent>

        {/* ── 規格視圖(Dev)── */}
        <TabsContent value="spec">
          <div className="space-y-[var(--layout-space-loose)] pt-[var(--layout-space-tight)]">
            <section className="space-y-[var(--layout-space-tight)]">
              <h3 className="text-h5">依賴的 DS 元件</h3>
              <div className="flex flex-wrap gap-[var(--layout-space-tight)]">
                {module.dsComponents.map((c) => (
                  <Tag key={c} color="blue">{c}</Tag>
                ))}
              </div>
            </section>

            <section className="space-y-[var(--layout-space-tight)]">
              <h3 className="text-h5">客製化邊界</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--layout-space-loose)] max-w-3xl">
                <div className="rounded-lg border border-divider bg-surface p-[var(--layout-space-loose)] space-y-[var(--layout-space-tight)]">
                  <div className="text-body font-medium text-fg-success">可客製</div>
                  <ul className="text-body text-fg-secondary list-disc pl-[var(--layout-space-loose)] space-y-[var(--layout-space-tight)]">
                    {module.customization.editable.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                </div>
                <div className="rounded-lg border border-divider bg-surface p-[var(--layout-space-loose)] space-y-[var(--layout-space-tight)]">
                  <div className="text-body font-medium">鎖定(維持一致性)</div>
                  <ul className="text-body text-fg-secondary list-disc pl-[var(--layout-space-loose)] space-y-[var(--layout-space-tight)]">
                    {module.customization.locked.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-[var(--layout-space-tight)]">
              <h3 className="text-h5">已採用的產品</h3>
              <div className="flex flex-wrap gap-[var(--layout-space-tight)]">
                {module.adoptedBy.map((p) => <Tag key={p} color="neutral">{p}</Tag>)}
              </div>
            </section>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
