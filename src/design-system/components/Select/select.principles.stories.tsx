import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Flag } from 'lucide-react'
import { Select } from './select'

const meta: Meta = {
  title: 'Design System/Components/Select/設計原則',
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj

// ── Helpers ───────────────────────────────────────────────────────────────────

const Rule = ({
  title, note, children,
}: {
  title: string; note?: string; children: React.ReactNode
}) => (
  <div className="mb-14">
    <h3 className="text-body font-bold text-foreground mb-1">{title}</h3>
    {note && <p className="text-caption text-fg-muted mb-5 max-w-[720px] leading-relaxed">{note}</p>}
    <div className="flex flex-col gap-3 max-w-xs">{children}</div>
  </div>
)

const Label = ({ children, warn }: { children: React.ReactNode; warn?: boolean }) => (
  <p className={`text-footnote leading-normal ${warn ? 'text-error font-medium' : 'text-fg-muted'}`}>{children}</p>
)

// ── Options ───────────────────────────────────────────────────────────────────

const statusOptions = [
  { value: 'in_stock', label: 'In stock', tagVariant: 'green' },
  { value: 'low_stock', label: 'Low stock', tagVariant: 'yellow' },
  { value: 'out_of_stock', label: 'Out of stock', tagVariant: 'red' },
]

const categoryOptions = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'food', label: 'Food' },
]

// ── Stories ───────────────────────────────────────────────────────────────────

export const DisplayModeRule: Story = {
  name: '顯示模式選擇',
  render: () => {
    const [category, setCategory] = React.useState('electronics')
    const [status, setStatus] = React.useState('in_stock')
    const [badExample, setBadExample] = React.useState('in_stock')
    return (
      <div>
        <Rule
          title="text — 純文字選項（預設）"
          note="選項沒有色彩語意、僅靠文字就能識別時使用。常見場景：類別、地區、語言、角色等"
        >
          <Select options={categoryOptions} value={category} onChange={setCategory} />
        </Rule>

        <Rule
          title="tag — 需要色彩識別的選項"
          note="選項帶有類別或狀態語意，顏色能加速掃視（庫存狀態、優先級、標籤）。options 裡用 tagVariant 指定顏色，edit / readonly / disabled 都用同一顆 Tag 呈現"
        >
          <Select display="tag" options={statusOptions} value={status} onChange={setStatus} />
        </Rule>

        <Rule
          title="❌ tag 模式不加 startIcon"
          note="Tag 本身就是視覺標記（顏色 + 形狀），再加 startIcon 是雙重傳達——視覺冗餘且爭奪焦點"
        >
          <Select
            display="tag"
            startIcon={Flag}
            options={statusOptions}
            value={badExample}
            onChange={setBadExample}
          />
          <Label warn>↑ 左側 Flag icon 和右邊 Tag 都在傳達「這是狀態」——去掉 startIcon</Label>
        </Rule>
      </div>
    )
  },
}

export const NativeSelectRule: Story = {
  name: '為什麼用原生 select',
  render: () => {
    const [value, setValue] = React.useState('electronics')
    return (
      <div>
        <Rule
          title="用原生 <select> —— 不自建 dropdown menu"
          note="原生 select 免費提供：mobile 上的原生 picker UI、完整的鍵盤導覽（↑↓ 跳選項、字母鍵跳首字）、screen reader 正確朗讀、作業系統層級的無障礙支援。自建 dropdown 任何一樣都要自己做一遍且不一定做好"
        >
          <Select options={categoryOptions} value={value} onChange={setValue} />
          <Label>↑ 打開 mobile 模擬器或用 VoiceOver 測試——原生行為直接可用</Label>
        </Rule>

        <Rule
          title="tag 模式也是原生 select"
          note="Tag 視覺疊在隱藏的原生 select 上（absolute inset-0 opacity-0），Tag 本身 pointer-events-none 讓點擊穿透到 select。視覺客製 + 原生行為兩者兼得"
        >
          <Select display="tag" options={statusOptions} value="in_stock" onChange={() => {}} />
          <Label>↑ 點擊 Tag 會打開原生 picker，看起來客製實際上走原生路徑</Label>
        </Rule>
      </div>
    )
  },
}
