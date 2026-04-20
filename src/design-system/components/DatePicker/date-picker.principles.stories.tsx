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

export const CalendarRule: Story = {
  name: '自建 Calendar + 視覺一致性',
  render: () => {
    const [deadline, setDeadline] = React.useState('2026-05-15')
    const [releaseDate, setReleaseDate] = React.useState('2025-12-25')
    return (
      <div>
        <Rule
          title="Edit 用本 DS 自建 Calendar + Popover"
          note="點擊 trigger 開啟的 Calendar 使用本 DS 的 overlay-surface token(與 Dialog / SelectMenu / Combobox 相同)——浮層的圓角、陰影、間距、typography 跨元件視覺整齊。瀏覽器原生 picker 視覺不受控、跨 Chrome/Safari/Firefox 不一致,無法達成世界級設計系統的視覺連續性"
        >
          <DatePicker value={deadline} onChange={setDeadline} />
          <Label>↑ 專案截止日:點擊 trigger → Popover 打開 Calendar,視覺與 SelectMenu 一致</Label>
        </Rule>

        <Rule
          title="Calendar 內部 token 全由 DS 控制"
          note="Calendar 的月份 caption / nav 按鈕 / 星期標頭 / 日格 / hover / selected / today 全部由 DS token 驅動:hover 用 neutral-hover、selected 用 primary、today 用 ring-primary。切 dark mode 自動聯動,不需元件內重寫"
        >
          <DatePicker value={releaseDate} onChange={setReleaseDate} />
          <Label>↑ 發佈日:Calendar 所有視覺 token 來自 semantic.css</Label>
        </Rule>

        <Rule
          title="❌ 不用其他 calendar library 平行實作"
          note="未來若需要 Date Range / DateTime,擴充本 Calendar(`./calendar.tsx`)而非引入第二個 library——避免兩套視覺語言在同一系統並存"
        >
          <Label>實作細節見 Design System / Components / DatePicker / 設計規格</Label>
        </Rule>

        <Rule
          title="❌ 不覆寫 Calendar token 為非 DS 色"
          note="Calendar 視覺 token(bg-primary / ring-primary / neutral-hover 等)必須來自 semantic token。硬寫 #xxx / bg-blue-500 會破壞 dark mode 聯動、跟其他浮層語言分岔"
        >
          <Label>token 表見設計規格 → Calendar 內部 token</Label>
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
        title="Display 與 Edit trigger 皆用 Intl.DateTimeFormat"
        note="formatOptions + locale 同時控制 readonly / disabled 的 Display 文字,以及 edit 模式 trigger 顯示的已選日期文字。跨模式一致、跨頁面可預期。Calendar popup 的月份語言由 Calendar 內部 locale 處理"
      >
        <DatePicker
          mode="readonly"
          value="2026-05-15"
          formatOptions={{ year: 'numeric', month: 'short', day: 'numeric' }}
        />
        <DatePicker
          mode="readonly"
          value="2026-05-15"
          locale="zh-TW"
          formatOptions={{ year: 'numeric', month: 'long', day: 'numeric' }}
        />
        <Label>↑ 專案截止日:formatOptions 控制格式;locale 控制語言</Label>
      </Rule>

      <Rule
        title="Edit trigger 文字也受 formatOptions / locale 控制"
        note={'原本原生 <input type="date"> 的 trigger 格式受瀏覽器 locale 控制無法干預;改自建後,edit trigger 顯示的已選日期也走 Intl.DateTimeFormat——跟 Display 模式完全一致'}
      >
        <DatePicker
          value="2026-05-15"
          onChange={() => {}}
          locale="zh-TW"
          formatOptions={{ year: 'numeric', month: 'long', day: 'numeric' }}
        />
        <Label>↑ 專案截止日:edit trigger 顯示「2026年5月15日」,與 readonly 一致</Label>
      </Rule>

      <Rule
        title="null 值統一顯示 em dash"
        note="Display 模式 null / undefined 顯示 —(fg-muted),與其他 Field 元件一致"
      >
        <DatePicker mode="readonly" value={null} />
      </Rule>
    </div>
  ),
}

export const ClearableRule: Story = {
  name: 'Clearable 使用',
  render: () => {
    const [value, setValue] = React.useState<string | null>('2026-05-15')
    return (
      <div>
        <Rule
          title="日期是選填時才開 clearable"
          note="必填的日期欄位(出生日、到期日)不該有 clear——避免使用者不小心清空後不知怎麼填回。選填日期(備註日期、提醒日)開啟 clearable 才合理"
        >
          <DatePicker value={value} onChange={setValue} clearable />
          <Label>↑ 選填情境:有值時右側出現 X,清除後回到空白</Label>
        </Rule>

        <Rule
          title="readonly / disabled 不顯示 clear"
          note="clear 是 edit 行為,readonly 的 field 邏輯上不可操作,clear 按鈕既無法點擊也造成視覺誤導"
        >
          <DatePicker mode="readonly" value="2026-05-15" clearable />
          <Label>↑ readonly 模式下即使傳 clearable 也不顯示 clear 按鈕</Label>
        </Rule>
      </div>
    )
  },
}
