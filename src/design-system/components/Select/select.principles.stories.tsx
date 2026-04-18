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

export const ComponentChoiceRule: Story = {
  name: '何時用 Select vs 近親元件',
  render: () => {
    const [status, setStatus] = React.useState('in_stock')
    return (
      <div>
        <Rule
          title="Select 的 sweet spot — 3+ 選項、空間受限、不需一眼全看"
          note="表單欄位、toolbar filter、table cell。使用者先看 label，點開才瀏覽選項"
        >
          <Select display="tag" options={statusOptions} value={status} onChange={setStatus} />
        </Rule>

        <Rule
          title="❌ 2-5 個全可見選項：用 RadioGroup"
          note="RadioGroup 所有選項一次看完，不用兩次點擊。視覺掃視比 Select 快很多。適合表單中重要、需仔細評估的選擇（付款方式、方案等級）"
        >
          <Select options={statusOptions} value={status} onChange={setStatus} />
          <Label warn>↑ 只有 3 個選項還收進 dropdown → 使用者多花一次點擊才看到全貌</Label>
        </Rule>

        <Rule
          title="❌ 緊湊切換 / filter：用 SegmentedControl"
          note="SegmentedControl 是 compact control（pill 尺寸），能跟 Button / Input 並排不違和。適合 toolbar 的 view mode、filter tab、chart 時間維度切換。詳見 segmented-control.spec.md"
        >
          <Select
            options={[
              { value: 'all', label: '全部' },
              { value: 'active', label: '進行中' },
              { value: 'done', label: '已完成' },
            ]}
            value="active"
            onChange={() => {}}
          />
          <Label warn>↑ Toolbar filter 放 Select → 佔空間、視覺重量比旁邊 Button 重</Label>
        </Rule>

        <Rule
          title="❌ 多選：用 Combobox"
          note="Select 永遠單選。需要多選（categories、tags、assignees）必須用 Combobox"
        >
          <Select options={categoryOptions} value="electronics" onChange={() => {}} />
          <Label warn>↑ 需要「同時選 Electronics + Furniture」就不能用 Select</Label>
        </Rule>

        <Rule
          title="❌ 布林 on/off：用 Switch"
          note="on/off 不需要「選一個」的心智模型。Switch 視覺直接表達開關狀態，一次點擊完成切換"
        >
          <Select
            options={[{ value: 'on', label: 'On' }, { value: 'off', label: 'Off' }]}
            value="on"
            onChange={() => {}}
          />
          <Label warn>↑ On/Off 用 Select → 多餘的 dropdown 互動、不如 Switch 直觀</Label>
        </Rule>
      </div>
    )
  },
}

export const ImmediateVsSubmitRule: Story = {
  name: '即時套用 vs 隨 form 送出',
  render: () => {
    const [immediate, setImmediate] = React.useState('in_stock')
    const [draft, setDraft] = React.useState('electronics')
    return (
      <div>
        <Rule
          title="即時套用 — onChange 直接觸發副作用"
          note="Jira status、Linear priority、filter、theme 切換。改了立刻寫 DB / 送 API / 改 URL。onChange 通常呼叫 mutation 或 setState 更新父層。沒有「取消」的概念"
        >
          <div>
            <p className="text-caption text-fg-muted mb-1">Task status（改了立刻寫 DB）</p>
            <Select display="tag" options={statusOptions} value={immediate} onChange={setImmediate} />
          </div>
          <Label>↑ 視覺上是獨立的 inline control，旁邊沒有 submit button</Label>
        </Rule>

        <Rule
          title="隨 form 送出 — onChange 只更新 local state"
          note="建立/編輯表單、對話框設定。onChange 寫進 React state，直到 submit button 被按才送出。有「取消」可回復"
        >
          <div className="border border-border rounded-lg p-4 space-y-3">
            <div>
              <label className="text-caption text-fg-muted mb-1 block">Category</label>
              <Select options={categoryOptions} value={draft} onChange={setDraft} />
            </div>
            <div className="flex gap-2 pt-2">
              <button className="h-field-md px-3 text-body rounded-md bg-primary text-inverse-fg">儲存</button>
              <button className="h-field-md px-3 text-body rounded-md border border-border">取消</button>
            </div>
          </div>
          <Label>↑ 包在 Form 容器內 + submit / cancel button，使用者清楚儲存時機</Label>
        </Rule>

        <Rule
          title="❌ 讓使用者搞不清楚是哪種"
          note="最常見的失敗：inline 放一個 Select 但 onChange 只改 local state，旁邊卻沒有 submit button。使用者以為改了就套用，離開頁面才發現沒存。這是 DS 最常見的信任破壞點"
        >
          <Select options={categoryOptions} value={draft} onChange={setDraft} />
          <Label warn>↑ 沒有 Form 容器、沒有 submit button、又是獨立的 inline control——使用者無法判斷是即時還是要送出</Label>
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
