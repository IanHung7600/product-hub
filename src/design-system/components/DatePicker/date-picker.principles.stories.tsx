import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { DatePicker } from './date-picker'

const meta: Meta = {
  title: 'Design System/Components/DatePicker/設計原則',
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

// ── Stories ───────────────────────────────────────────────────────────────────

export const NativePickerRule: Story = {
  name: '用原生 date picker',
  render: () => {
    const [value, setValue] = React.useState('2026-04-02')
    return (
      <div>
        <Rule
          title="Edit 模式用原生 <input type=\"date\">"
          note="瀏覽器原生 picker 免費提供：完整無障礙（鍵盤、screen reader）、mobile 上的系統 date picker、locale 自動處理、作業系統層級的日期驗證。自建 calendar 任何一樣都要自己做一遍"
        >
          <DatePicker value={value} onChange={setValue} />
          <Label>↑ 點擊打開瀏覽器原生 picker；mobile 會顯示系統 date wheel</Label>
        </Rule>

        <Rule
          title="Calendar icon 取代原生指示器"
          note="瀏覽器原生 date indicator 外觀各家不同（Chrome 不同於 Safari），透過 CSS 隱藏並以 Field 的 Calendar startIcon 統一視覺。點擊 icon 或 field 任何位置都會觸發 picker"
        >
          <DatePicker value={value} onChange={setValue} />
          <Label>↑ 左側固定 Calendar icon；右側 chevron 指示可展開</Label>
        </Rule>

        <Rule
          title="❌ 不自建 calendar picker"
          note="即使設計有視覺主張，自建 calendar 會失去原生的鍵盤、mobile UX、a11y。視覺由 Field wrapper 統一已足夠——picker 彈出 UI 由瀏覽器提供，不是 DS 的主戰場"
        >
          <Label>實作細節見 Design System / Components / DatePicker / 設計規格</Label>
        </Rule>
      </div>
    )
  },
}

export const FormattingRule: Story = {
  name: 'Display 格式化',
  render: () => (
    <div>
      <Rule
        title="Display（readonly / disabled / table cell）用 Intl.DateTimeFormat"
        note="Display 模式的格式完全受控：formatOptions + locale 決定顯示。確保跨頁面、跨元件一致"
      >
        <DatePicker
          mode="readonly"
          value="2026-04-02"
          formatOptions={{ year: 'numeric', month: 'short', day: 'numeric' }}
        />
        <DatePicker
          mode="readonly"
          value="2026-04-02"
          locale="zh-TW"
          formatOptions={{ year: 'numeric', month: 'long', day: 'numeric' }}
        />
        <Label>↑ formatOptions 控制格式；locale 控制語言</Label>
      </Rule>

      <Rule
        title="Edit 模式格式由瀏覽器決定——接受這個差異"
        note="原生 date input 的顯示格式由瀏覽器 locale 控制（不是 DS 能干預）。Edit 和 Display 格式不一致是原生 picker 的代價——交換回來的是完整的無障礙和 mobile 體驗，值得"
      >
        <DatePicker value="2026-04-02" onChange={() => {}} />
        <Label>↑ 瀏覽器顯示為 YYYY/MM/DD 或 MM/DD/YYYY 取決於 browser locale</Label>
      </Rule>

      <Rule
        title="null 值統一顯示 em dash"
        note="Display 模式 null / undefined 顯示 —（fg-muted），與其他 Field 元件一致"
      >
        <DatePicker mode="readonly" value={null} />
      </Rule>
    </div>
  ),
}

export const ClearableRule: Story = {
  name: 'Clearable 使用',
  render: () => {
    const [value, setValue] = React.useState<string | null>('2026-04-02')
    return (
      <div>
        <Rule
          title="日期是選填時才開 clearable"
          note="必填的日期欄位（出生日、到期日）不該有 clear——避免使用者不小心清空後不知怎麼填回。選填日期（備註日期、提醒日）開啟 clearable 才合理"
        >
          <DatePicker value={value} onChange={setValue} clearable />
          <Label>↑ 選填情境：有值時右側出現 X，清除後回到空白</Label>
        </Rule>

        <Rule
          title="readonly / disabled 不顯示 clear"
          note="clear 是 edit 行為，readonly 的 field 邏輯上不可操作，clear 按鈕既無法點擊也造成視覺誤導"
        >
          <DatePicker mode="readonly" value="2026-04-02" clearable />
          <Label>↑ readonly 模式下即使傳 clearable 也不顯示 clear 按鈕</Label>
        </Rule>
      </div>
    )
  },
}
