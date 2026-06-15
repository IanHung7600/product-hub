// 共用能力目錄 — Module 卡片(Mobbin-style card grid 視覺參考:卡片牆 + hover lift)
// 消費 DS:Tag(分類色)+ elevation token(--elevation-100 / -hover lift)+ surface/divider token
// 間距走 layoutSpace token(容器 space-y / flex gap),不硬寫 magic number

import { Tag } from '@qijenchen/design-system'
import { useNavigate } from 'react-router-dom'
import type { ModuleMeta, ModuleCategory } from '../data/modules'

const CATEGORY_COLOR: Record<ModuleCategory, 'blue' | 'purple' | 'green' | 'amber'> = {
  forms: 'blue',
  approvals: 'purple',
  todos: 'green',
  notifications: 'amber',
}

export function ModuleCard({ module }: { module: ModuleMeta }) {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      onClick={() => navigate(`/modules/${module.id}`)}
      className="flex flex-col text-left rounded-lg border border-divider bg-surface p-[var(--layout-space-loose)] space-y-[var(--layout-space-tight)] shadow-[var(--elevation-100)] transition-shadow hover:shadow-[var(--elevation-100-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="flex items-center gap-[var(--layout-space-tight)]">
        <Tag color={CATEGORY_COLOR[module.category]}>{module.categoryLabel}</Tag>
        {module.status === 'planned' && <Tag color="neutral">規劃中</Tag>}
      </div>
      <h3 className="text-h5">{module.name}</h3>
      <p className="text-body text-fg-secondary line-clamp-2">{module.summary}</p>
      <div className="flex gap-[var(--layout-space-loose)] text-caption text-fg-muted">
        <span>{module.variants.length} 種變種</span>
        <span>{module.adoptedBy.length} 個產品採用</span>
      </div>
    </button>
  )
}
