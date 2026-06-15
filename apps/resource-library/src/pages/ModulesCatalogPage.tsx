// 共用能力目錄 — 卡片牆 + 分類篩選(Mobbin-style 視覺參考)
// 篩選用 SegmentedControl(分類切換);卡片牆 RWD grid。

import { useState } from 'react'
import { SegmentedControl, SegmentedControlItem, Empty } from '@qijenchen/design-system'
import { MODULES, type ModuleCategory } from '../data/modules'
import { ModuleCard } from '../shell/ModuleCard'

type Filter = 'all' | ModuleCategory

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'forms', label: '資料收集' },
  { id: 'approvals', label: '審批流程' },
  { id: 'todos', label: '任務管理' },
  { id: 'notifications', label: '訊息層' },
]

export function ModulesCatalogPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const list = filter === 'all' ? MODULES : MODULES.filter((m) => m.category === filter)

  return (
    <div className="px-[var(--layout-space-loose)] py-[var(--layout-space-tight)] space-y-[var(--layout-space-loose)]">
      <div className="space-y-[var(--layout-space-tight)]">
        <h2 className="text-h3">共用能力目錄</h2>
        <p className="text-body text-fg-secondary max-w-2xl">
          每個 Module 都是可直接引用的流程模板。點開查看可互動 demo 與規格。
        </p>
      </div>

      <SegmentedControl
        value={filter}
        onValueChange={(v) => setFilter(v as Filter)}
        aria-label="依分類篩選"
      >
        {FILTERS.map((f) => (
          <SegmentedControlItem key={f.id} value={f.id}>
            {f.label}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>

      {list.length === 0 ? (
        <Empty title="此分類暫無 Module" description="切換其他分類或回到全部。" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--layout-space-loose)]">
          {list.map((m) => (
            <ModuleCard key={m.id} module={m} />
          ))}
        </div>
      )}
    </div>
  )
}
