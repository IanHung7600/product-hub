import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Combobox } from './combobox'

const meta: Meta = {
  title: 'Design System/Components/Combobox/設計原則',
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
    <div className="flex flex-col gap-3 max-w-md">{children}</div>
  </div>
)

const Label = ({ children, warn }: { children: React.ReactNode; warn?: boolean }) => (
  <p className={`text-footnote leading-normal ${warn ? 'text-error font-medium' : 'text-fg-muted'}`}>{children}</p>
)

// ── Options ───────────────────────────────────────────────────────────────────

const categoryOptions = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'food', label: 'Food' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'books', label: 'Books' },
  { value: 'sports', label: 'Sports' },
]

// ── Stories ───────────────────────────────────────────────────────────────────

export const WrapRule: Story = {
  name: 'Wrap 模式選擇',
  render: () => {
    const [single, setSingle] = React.useState(['electronics', 'food', 'lifestyle', 'clothing', 'books'])
    const [wrapped, setWrapped] = React.useState(['electronics', 'food', 'lifestyle', 'clothing', 'books'])
    return (
      <div>
        <Rule
          title="單行（預設）— Table cell、空間受限的 Form"
          note="固定高度，與 Input / Select 等欄位並排對齊。多於可見寬度的 Tag 以 +N 指示器代替，hover 可看完整清單"
        >
          <Combobox options={categoryOptions} value={single} onChange={setSingle} />
          <Label>↑ 單行：高度固定，超出的 Tag → +N</Label>
        </Rule>

        <Rule
          title="多行 wrap — 空間充裕的 Form"
          note="高度隨選中數量展開，每個 Tag 都完整可見。適合填答型表單——使用者一眼看到所有選項，不需 hover 溢出指示器"
        >
          <Combobox wrap options={categoryOptions} value={wrapped} onChange={setWrapped} />
          <Label>↑ 多行：完整展開，無溢出</Label>
        </Rule>

        <Rule
          title="❌ Table cell 不用 wrap"
          note="多行會破壞 row 高度一致性，讓 table 變得不規則。Table cell 永遠用單行，使用者需要完整清單時 hover +N"
        >
          <div className="border border-border rounded-lg overflow-hidden w-full max-w-md">
            <div className="flex items-center gap-3 px-3 py-2 border-b border-border bg-muted">
              <span className="w-24 text-caption font-medium">Product</span>
              <span className="text-caption font-medium">Categories</span>
            </div>
            <div className="flex items-start gap-3 px-3 py-2">
              <span className="w-24 text-caption pt-1">Headphones</span>
              <Combobox wrap options={categoryOptions} value={['electronics', 'lifestyle', 'sports']} mode="readonly" className="flex-1" />
            </div>
            <div className="flex items-start gap-3 px-3 py-2 border-t border-border">
              <span className="w-24 text-caption pt-1">USB Hub</span>
              <Combobox wrap options={categoryOptions} value={['electronics']} mode="readonly" className="flex-1" />
            </div>
          </div>
          <Label warn>↑ 每 row 高度不同 → 掃視節奏被破壞。Table 用單行 + +N 指示器</Label>
        </Rule>
      </div>
    )
  },
}

export const TagOperationRule: Story = {
  name: 'Tag 操作規則',
  render: () => {
    const [value, setValue] = React.useState(['electronics', 'food', 'lifestyle'])
    const [ro, setRo] = React.useState(['electronics', 'food'])
    return (
      <div>
        <Rule
          title="Tag 只能被「移除」，不能被「編輯」或「重排」"
          note="每個 Tag 右側的 X 是唯一被允許的互動——保持 Tag 的心智模型單純：它代表一個已選中的選項，要換就刪了重選"
        >
          <Combobox options={categoryOptions} value={value} onChange={setValue} />
          <Label>↑ 點 Tag 的 X 移除；右側 clear all 一次清除；新增從 dropdown 選擇</Label>
        </Rule>

        <Rule
          title="readonly / disabled 的 Tag 沒有任何互動"
          note="沒有 dismiss X、沒有 ChevronDown、沒有 clear。Tag 變純顯示，溢出規則仍然套用（+N 指示器可 hover 查看完整）"
        >
          <Combobox mode="readonly" options={categoryOptions} value={ro} />
          <Label>↑ 不可移除、不可新增、不可清空——整個 field 變「顯示」</Label>
        </Rule>

        <Rule
          title="dropdown 只列出未選中選項"
          note="避免使用者選了同一個選項兩次。已選中的就在 field 裡，用 X 移除即可"
        >
          <Combobox options={categoryOptions} value={['electronics']} onChange={() => {}} />
          <Label>↑ 打開 dropdown，Electronics 不會出現在清單裡</Label>
        </Rule>
      </div>
    )
  },
}

export const OverflowRule: Story = {
  name: '溢出指示必須存在',
  render: () => {
    const [value, setValue] = React.useState(['electronics', 'food', 'lifestyle', 'clothing', 'books', 'sports'])
    return (
      <div>
        <Rule
          title="+N 指示器是單行模式的必要元件"
          note="使用者必須知道「還有多少沒看到」——沒有 +N 的單行會誤導使用者以為選項已完整顯示。Hover 可看完整清單"
        >
          <Combobox options={categoryOptions} value={value} onChange={setValue} />
          <Label>↑ 窄容器內多個 Tag，自動出現 +N</Label>
        </Rule>

        <Rule
          title="❌ 不自建 dropdown"
          note="與 Select 同理——原生 select 提供 mobile picker、鍵盤導覽、screen reader，自建會失去這些。Combobox 底層也走原生 select，Tag 浮在上層但點擊穿透"
        >
          <Label>實作細節見 Design System / Components / Combobox / 設計規格</Label>
        </Rule>
      </div>
    )
  },
}
