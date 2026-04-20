import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Settings, Bell, Home } from 'lucide-react'
import { Avatar } from './avatar'
import { NameCard, NameCardDefaultActions } from '@/design-system/components/NameCard/name-card'

const meta: Meta = {
  title: 'Design System/Components/Avatar/設計原則',
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj

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

export const IdentityVsIconRule: Story = {
  name: 'Avatar 代表身份,Icon 代表概念',
  render: () => (
    <div>
      <Rule
        title="Avatar — 代表實體（人、組織、專案、App）"
        note="留言者頭像、團隊成員、workspace logo、app 身份。視覺上 identity 是唯一的、可被辨識的"
      >
        <div className="flex items-center gap-3">
          <Avatar alt="Ada Chen" size={32} />
          <span className="text-body">Ada Chen留言</span>
        </div>
        <div className="flex items-center gap-3">
          <Avatar alt="Engineering Team" size={32} color="blue" />
          <span className="text-body">Engineering Team 專案</span>
        </div>
      </Rule>

      <Rule
        title="❌ 代表抽象概念：用 Lucide Icon"
        note="「設定」「通知」「首頁」這類功能 / 動作 / 概念不是「誰」,是「做什麼」。Icon 更適合——Avatar 用在這裡會讓使用者以為是某個人的頭像"
      >
        <div className="flex items-center gap-3">
          <Avatar alt="S" icon={Settings} size={32} />
          <span className="text-body">❌ 設定用 Avatar</span>
        </div>
        <Label warn>↑ 「S」+ icon 讓使用者誤以為是某個人(使用者 S?)。功能導覽用 Lucide icon</Label>
        <div className="flex items-center gap-3">
          <Settings size={20} />
          <span className="text-body">✓ 設定用 Icon</span>
        </div>
      </Rule>

      <Rule
        title="判斷法：「這代表『誰』還是『做什麼』？」"
        note="誰 / 什麼實體 → Avatar;做什麼 / 某個概念 → Icon"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Avatar alt="Ada Chen" size={24} />
            <span className="text-footnote text-fg-muted">人員</span>
          </div>
          <div className="flex items-center gap-2">
            <Home size={16} />
            <span className="text-footnote text-fg-muted">首頁(概念)</span>
          </div>
          <div className="flex items-center gap-2">
            <Avatar alt="ABC Corp" size={24} color="purple" />
            <span className="text-footnote text-fg-muted">組織</span>
          </div>
          <div className="flex items-center gap-2">
            <Bell size={16} />
            <span className="text-footnote text-fg-muted">通知(動作)</span>
          </div>
        </div>
      </Rule>
    </div>
  ),
}

export const FallbackRule: Story = {
  name: 'Fallback 順序',
  render: () => (
    <div>
      <Rule
        title="有 src → 顯示圖片；沒有 src / 圖片載入失敗 → 顯示 initials"
        note="Fallback 用 `name` 取首字母(中文取第一字,英文取前兩字首字母大寫)。背景色由 `color` prop 決定"
      >
        <div className="flex items-center gap-3">
          <Avatar alt="Ada Chen" size={40} src="https://i.pravatar.cc/80?img=1" />
          <Avatar alt="Ada Chen" size={40} />
          <Avatar alt="Alice Wang" size={40} />
          <Avatar alt="ABC Corp" size={40} color="blue" />
        </div>
        <Label>↑ 依序:有圖 / 中文首字 / 英文前兩字 / 組織首字 + 色彩</Label>
      </Rule>

      <Rule
        title="❌ src 壞掉又沒 name → 空 avatar（不可辨識）"
        note="Avatar 的核心是識別身份,沒 name 又沒 src 等於失去意義。必須至少有 name"
      >
        <Avatar alt="" size={40} src="https://invalid-url.example/fail.jpg" />
        <Label warn>↑ 空 avatar → 使用者不知道是誰</Label>
      </Rule>
    </div>
  ),
}

export const WithBadgeOverlayRule: Story = {
  name: 'Avatar overlay:presence dot / count badge',
  render: () => (
    <div>
      <Rule
        title="Avatar 右下角 status dot — presence(在線 / 忙碌 / 離開 / 離線)"
        note="用 Avatar 的 `status` prop(不是手刻 `<Badge dot>`)—— 顏色走 presence semantic token(`--status-online` 等,獨立於 success / error / warning),位置固定 avatar 右下角,尺寸程式化 28%"
      >
        <div className="flex items-center gap-4">
          <Avatar alt="Ada" size={40} status="online" />
          <Avatar alt="Alex" size={40} status="busy" />
          <Avatar alt="Ben" size={40} status="away" />
          <Avatar alt="Bella" size={40} status="offline" />
        </div>
        <Label>↑ online / busy / away / offline ── dot 自動 `role="status"` + aria-label</Label>
      </Rule>

      <Rule
        title="Avatar 右上角 count badge — 未讀訊息(chat / messenger 場景)"
        note="用 Avatar 的 `badgeCount` prop(不是手刻 `<Badge count>`)—— 內部消費 DS Badge critical variant + surface ring,max=99 自動處理 99+"
      >
        <div className="flex items-center gap-4">
          <Avatar alt="Ada" size={40} badgeCount={3} />
          <Avatar alt="Alex" size={40} badgeCount={12} />
          <Avatar alt="Ben" size={40} badgeCount={128} />
        </div>
        <Label>↑ count 3 / 12 / 128(超過 99 顯示 "99+")</Label>
      </Rule>

      <Rule
        title="status + badgeCount 可同時存在(不同角、不同語義)"
        note="右下 presence + 右上 count 是世界級 chat app(Slack / LINE / WhatsApp)的標配。兩個 overlay 管不同事,不衝突"
      >
        <div className="flex items-center gap-4">
          <Avatar alt="Ada" size={40} status="online" badgeCount={3} />
          <Avatar alt="Alex" size={40} status="busy" badgeCount={99} />
        </div>
        <Label>↑ 右下 presence + 右上 未讀(iMessage / Slack pattern)</Label>
      </Rule>
    </div>
  ),
}

export const HoverCardIntegrationRule: Story = {
  name: 'Avatar + NameCard 整合',
  render: () => (
    <div>
      <Rule
        title="人員 Avatar 的 hover 預覽必須用 NameCard"
        note="NameCard 是 DS canonical 人員 hover 內容元件(avatar + name + subtitle + actions + status + fields 統一佈局)。Avatar 的 hoverCard prop 接 NameCard,不可手刻 JSX — 手刻會漂移出 NameCard 對齊 / 間距 / status token 規則"
      >
        <Avatar
          alt="Ada Chen"
          size={40}
          hoverCard={
            <NameCard
              name="Ada Chen"
              subtitle="Design Engineer · 台北"
              actions={<NameCardDefaultActions />}
            />
          }
        />
        <Label>↑ hover avatar 彈出 NameCard(action 列:Chat + Audio call canonical)</Label>
      </Rule>

      <Rule
        title="❌ 關鍵資訊只靠 hover 顯示(觸控裝置看不到)"
        note="NameCard hover 本身用法沒錯,問題是「資訊的唯一出口」。觸控裝置無 hover 能力,若必看資訊(狀態角色、是否離職、權限等)只出現在 hover 浮層裡,平板 / 手機使用者完全錯過。hover 是**補充資訊**管道,不是**關鍵資訊**唯一載體"
      >
        <div className="flex items-start gap-8">
          <div className="flex flex-col gap-2">
            <Avatar alt="Alex Wang" size={48}
              hoverCard={
                <NameCard name="Alex Wang" subtitle="Engineer · 已離職" />
              }
            />
            <Label warn>❌ 「已離職」只出現在 hover 內 — 觸控使用者看不到,可能誤發訊息給已離職成員</Label>
          </div>
          <div className="flex flex-col gap-2">
            {/* Family 2 card-header mode(avatar > text block,見 item-anatomy.spec.md「Card header 大 prefix 對齊」):
                items-start + text column `justify-center min-h-[avatar-size]`,短文字置中於 avatar、長文字自然撐高。
                gap-3(12px)對齊 card header canonical(非 gap-2 的 row 緊湊間距)。 */}
            <div className="flex items-start gap-3">
              <Avatar alt="Alex Wang" size={48} className="opacity-50" />
              <div className="flex flex-col justify-center min-w-0 flex-1" style={{ minHeight: 48 }}>
                <span className="text-body font-medium text-fg-muted">Alex Wang</span>
                <span className="text-caption text-error mt-0.5">已離職</span>
              </div>
            </div>
            <Label>✅ 關鍵狀態直接在主畫面呈現(opacity + 文字標示 + Family 2 card-header 對齊),hover 補充細節即可</Label>
          </div>
        </div>
      </Rule>
    </div>
  ),
}
