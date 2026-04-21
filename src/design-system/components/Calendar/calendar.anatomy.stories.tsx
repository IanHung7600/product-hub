import type { Meta, StoryObj } from '@storybook/react'
import { Calendar, type CalendarEvent } from './calendar'

const meta: Meta<typeof Calendar> = {
  title: 'Design System/Components/Calendar/設計規格',
  component: Calendar,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof Calendar>

const now = new Date()
const thisMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0')

const sampleEvents: CalendarEvent[] = [
  { id: 'e1', title: 'Design review', start: `${thisMonth}-05`, end: `${thisMonth}-05`, color: 'blue' },
  { id: 'e2', title: 'Sprint planning', start: `${thisMonth}-08`, end: `${thisMonth}-08`, color: 'blue' },
  { id: 'e3', title: 'Release deadline', start: `${thisMonth}-12`, end: `${thisMonth}-12`, color: 'red' },
  { id: 'e4', title: 'Q review', start: `${thisMonth}-18`, end: `${thisMonth}-18`, color: 'green' },
  { id: 'e5', title: 'Alex vacation', start: `${thisMonth}-20`, end: `${thisMonth}-22`, color: 'yellow', allDay: true },
]

// ── 1. 元件總覽 ────────────────────────────────────────────────────────────────
export const Overview: Story = {
  name: '1. 元件總覽',
  render: () => (
    <div className="h-screen p-4 bg-canvas">
      <Calendar events={sampleEvents} />
    </div>
  ),
}

// ── 3. 色彩對照表(事件 color 類別)─────────────────────────────────────────────
// 跳過 2. Inspector + 4. SizeMatrix(rationale 見 calendar.spec.md「無 size variant」)
export const ColorMatrix: Story = {
  name: '3. 色彩對照表',
  render: () => {
    const colorEvents: CalendarEvent[] = (
      ['blue', 'green', 'orange', 'purple', 'red', 'yellow'] as const
    ).map((c, i) => ({
      id: `c-${c}`,
      title: `${c} category`,
      start: `${thisMonth}-${String(i + 3).padStart(2, '0')}`,
      end: `${thisMonth}-${String(i + 3).padStart(2, '0')}`,
      color: c,
    }))
    return (
      <div className="h-screen p-4 bg-canvas">
        <div className="mb-2 text-body text-fg-muted">
          6 個 event color 對齊 Tag primitive colors(blue / green / orange / purple / red / yellow)。
          color 是**類別語意**(同 team / 同 project),非 severity。
        </div>
        <Calendar events={colorEvents} />
      </div>
    )
  },
}

// ── 5. 狀態行為 ─────────────────────────────────────────────────────────────
export const StateBehavior: Story = {
  name: '5. 狀態行為',
  render: () => (
    <div className="h-screen p-4 bg-canvas">
      <div className="mb-2 text-body text-fg-muted space-y-1">
        <div>• <b>today</b> cell:date 數字加 `bg-primary text-on-emphasis rounded-full` 圓</div>
        <div>• <b>outside month</b>:前後月日期走 `text-fg-muted`</div>
        <div>• <b>多事件 cell</b>:超出顯示的 event 顯示「+N more」(hover 展開)</div>
        <div>• <b>event hover</b>:tile 輕微 `hover:brightness-95` + `cursor-pointer`</div>
        <div>• <b>empty cell</b>:無事件保持純底色,點擊觸發 onDateClick</div>
      </div>
      <Calendar events={sampleEvents} />
    </div>
  ),
}
