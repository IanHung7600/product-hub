// 首頁 — 平台介紹 + 三層心智模型 + 精選 Module
// 間距全走 layoutSpace token(容器 space-y,不逐元素硬寫 margin)

import { Button } from '@qijenchen/design-system'
import { useNavigate } from 'react-router-dom'
import { MODULES } from '../data/modules'
import { ModuleCard } from '../shell/ModuleCard'

export function HomePage() {
  const navigate = useNavigate()
  return (
    <div className="px-[var(--layout-space-loose)] py-[var(--layout-space-tight)] space-y-[var(--layout-space-loose)]">
      <section className="max-w-2xl space-y-[var(--layout-space-tight)]">
        <h2 className="text-h3">在發想階段就引用既有的共用能力</h2>
        <p className="text-body-lg text-fg-secondary">
          這裡收錄公司產品共用的流程 Module — 表單、簽核、待辦、通知。瀏覽可互動的 demo,
          理解如何在你的產品中直接引用與組合,不必從零規劃。
        </p>
        <div>
          <Button variant="primary" onClick={() => navigate('/modules')}>瀏覽共用能力目錄</Button>
        </div>
      </section>

      <section className="space-y-[var(--layout-space-tight)]">
        <h3 className="text-h5">三層複用模型</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[var(--layout-space-loose)]">
          {[
            { t: 'L1 元件', d: 'DS 原子積木:Button、Input、DataTable…(見 Storybook)' },
            { t: 'L2 共用能力 Module', d: '流程模板:表單、簽核、待辦、通知(本平台核心)' },
            { t: 'L3 產品案例', d: '真實產品如何組合 L2 + L1' },
          ].map(({ t, d }) => (
            <div
              key={t}
              className="rounded-lg border border-divider bg-surface p-[var(--layout-space-loose)] space-y-[var(--layout-space-tight)]"
            >
              <div className="text-body font-medium">{t}</div>
              <div className="text-body text-fg-secondary">{d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-[var(--layout-space-tight)]">
        <h3 className="text-h5">共用能力 Module</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--layout-space-loose)]">
          {MODULES.map((m) => (
            <ModuleCard key={m.id} module={m} />
          ))}
        </div>
      </section>
    </div>
  )
}
