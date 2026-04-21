import type { Meta, StoryObj } from '@storybook/react'
import { Calendar, type CalendarEvent } from './calendar'
import { DatePicker } from '@/design-system/components/DatePicker/date-picker'
import { Field, FieldLabel } from '@/design-system/components/Field/field'

const meta: Meta = {
  title: 'Design System/Components/Calendar/設計原則',
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj

const now = new Date()
const thisMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0')

const Rule: React.FC<{ title: string; note: string; children: React.ReactNode }> = ({ title, note, children }) => (
  <div className="mb-8 max-w-5xl">
    <div className="text-body-lg font-medium text-foreground mb-1">{title}</div>
    <div className="text-body text-fg-secondary mb-3">{note}</div>
    <div className="rounded-md border border-divider p-4 bg-surface">{children}</div>
  </div>
)

// ── 原則 1:Calendar vs DatePicker ─────────────────────────────────────────
export const VsDatePicker: Story = {
  name: '1. Calendar vs DatePicker',
  render: () => (
    <div className="space-y-6">
      <Rule
        title="Calendar 是「看事件」的 page canvas,DatePicker 是「選日期」的 form control"
        note="名字相近,職責完全不同。Calendar 是行事曆檢視(月 / 週 / 日 view);DatePicker 是欄位,選單一日期寫入 form state。"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-body font-medium mb-2">DatePicker(form control)</div>
            <Field>
              <FieldLabel>Due date</FieldLabel>
              <DatePicker />
            </Field>
          </div>
          <div>
            <div className="text-body font-medium mb-2">Calendar(event canvas)</div>
            <div className="h-80 border border-divider rounded-md overflow-hidden">
              <Calendar
                events={[
                  { id: 'a', title: 'Design review', start: `${thisMonth}-05`, end: `${thisMonth}-05`, color: 'blue' },
                ] as CalendarEvent[]}
              />
            </div>
          </div>
        </div>
      </Rule>
    </div>
  ),
}

// ── 原則 2:Event color 是類別語意,不是 severity ─────────────────────────────
export const ColorSemantic: Story = {
  name: '2. Event color 類別語意',
  render: () => (
    <div className="space-y-6">
      <Rule
        title="event `color` 是「這是哪類事件」(team / project),不是 severity"
        note="Calendar 的 color 對齊 Tag primitive colors(blue / green / red / orange / purple / yellow)。紅色 ≠「警告」,只是一個類別選擇。若要標示緊急,另用 event title 文字(例:「🚨 Release deadline」)或 Badge overlay(未來)。"
      >
        <div className="h-80 border border-divider rounded-md overflow-hidden">
          <Calendar
            events={[
              { id: '1', title: 'Design review', start: `${thisMonth}-05`, end: `${thisMonth}-05`, color: 'blue' },
              { id: '2', title: 'Sprint planning', start: `${thisMonth}-08`, end: `${thisMonth}-08`, color: 'blue' },
              { id: '3', title: 'Release deadline', start: `${thisMonth}-12`, end: `${thisMonth}-12`, color: 'red' },
              { id: '4', title: 'Q review', start: `${thisMonth}-18`, end: `${thisMonth}-18`, color: 'green' },
            ] as CalendarEvent[]}
          />
        </div>
      </Rule>
    </div>
  ),
}

// ── 原則 3:MVP scope — 月 view only ─────────────────────────────────────────
export const MvpScope: Story = {
  name: '3. MVP scope',
  render: () => (
    <div className="space-y-6">
      <Rule
        title="月 view only;週 / 日 view / 拖拉 event 是 tech debt"
        note="World-class Calendar(Google / Notion / Fantastical)最常用的是月 view(80%+ 使用情境是「看本月整體」)。本 DS MVP 只實作月 view,週 / 日 view / drag-create / inline edit 留待後續 iteration。若當下產品需要週 view,fallback 用 DataTable(橫向 week) + 自刻 event tile,不勉強用 Calendar。"
      >
        <div className="h-80 border border-divider rounded-md overflow-hidden">
          <Calendar
            events={[
              { id: '1', title: 'Sprint planning', start: `${thisMonth}-08`, end: `${thisMonth}-08`, color: 'blue' },
            ] as CalendarEvent[]}
          />
        </div>
      </Rule>
    </div>
  ),
}

// ── 原則 4:What NOT to put in Calendar ─────────────────────────────────────────
export const NonGoals: Story = {
  name: '4. 何時不用',
  render: () => (
    <div className="space-y-4 text-body text-fg-secondary max-w-3xl">
      <div className="text-body-lg font-medium text-foreground">何時不用 Calendar</div>
      <ul className="list-disc pl-5 space-y-2">
        <li><b>選單一日期</b>(Due date / Birthday)→ 用 <code>DatePicker</code></li>
        <li><b>選日期範圍</b>(訂單 from-to)→ 用 <code>DatePicker mode="range"</code></li>
        <li><b>任務看板</b>(非時間軸 view)→ 用 <code>DataTable</code> + status column</li>
        <li><b>時段可用性</b>(會議訂房 slot picker)→ 獨立 time-slot picker(未來 primitive)</li>
        <li><b>Mini month widget</b>(sidebar 小月曆)→ 用 <code>DateGrid</code>(不 fullscreen)</li>
      </ul>
    </div>
  ),
}
