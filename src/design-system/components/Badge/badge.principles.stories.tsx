import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Bell, Inbox, Archive, FileText, MessageSquare, Filter, Settings } from 'lucide-react'
import { Badge } from './badge'
import { Button } from '@/design-system/components/Button/button'

const meta: Meta = {
  title: 'Design System/Components/Badge/設計原則',
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
    <div className="flex flex-col gap-4 max-w-md">{children}</div>
  </div>
)

const Label = ({ children, warn }: { children: React.ReactNode; warn?: boolean }) => (
  <p className={`text-footnote leading-normal ${warn ? 'text-error font-medium' : 'text-fg-muted'}`}>{children}</p>
)

export const DefaultLowRule: Story = {
  name: 'Default LOW，escalate with reason',
  render: () => (
    <div>
      <Rule
        title="選 level 時問：使用者錯過會怎樣？"
        note="從 low 起跳,只有當內容本身 urgency 更高才升級。Critical 的紅色從「罕見」獲得信號價值——過度使用會稀釋紅色在產品內的「急迫」意義"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Archive size={16} />
            <span className="text-body">Archive</span>
            <Badge count={128} variant="low" />
          </div>
          <Label>low — 錯過無影響（被動計數）</Label>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} />
            <span className="text-body">留言</span>
            <Badge count={12} variant="medium" />
          </div>
          <Label>medium — 輕微不便（可延後看）</Label>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Bell size={16} />
            <span className="text-body">待辦</span>
            <Badge count={7} variant="high" />
          </div>
          <Label>high — 有感影響（工作堆積）</Label>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Inbox size={16} />
            <span className="text-body">未讀私訊</span>
            <Badge count={3} variant="critical" />
          </div>
          <Label>critical — 直接傷害（錯過溝通）</Label>
        </div>
      </Rule>

      <Rule
        title="❌ 把 passive count 當 critical（訊號稀釋）"
        note="Archive / Trash 這類被動計數升 critical → 紅色遍地都是,使用者麻木,真正急迫的通知被稀釋"
      >
        <div className="flex items-center gap-2">
          <Archive size={16} />
          <span className="text-body">Archive</span>
          <Badge count={128} variant="critical" />
        </div>
        <Label warn>↑ Archive 有多少郵件不需要 critical 紅色觸發 action——使用者只在整理時才看,用 low 即可</Label>
      </Rule>

      <Rule
        title="自我檢查：一個畫面最多 1-2 個 critical badge"
        note="超過代表把不急迫的事標成 critical。紅色稀缺性才有信號價值"
      >
        <Label>打開任何 app 的主頁面,數一下紅色 badge——超過 2 個就該降級</Label>
      </Rule>
    </div>
  ),
}

export const ContrastFloorRule: Story = {
  name: 'Contrast floor（容器對比下限）',
  render: () => (
    <div>
      <Rule
        title="最終 level = max(semantic urgency, contrast floor)"
        note="Contrast 是下限（最少要是哪個 level 才看得清）,不是上限（業務需求可永遠再升）。兩個約束各自獨立推高 level"
      >
        <div className="flex items-center gap-3">
          <span className="text-footnote text-fg-muted w-20">Case 1:</span>
          <div className="relative inline-flex">
            <Button variant="tertiary" size="sm" iconOnly startIcon={Bell} aria-label="通知 (3)" />
            <Badge count={3} variant="high" className="absolute -top-1 -right-1" />
          </div>
          <Label>semantic=high,容器 contrast floor=low → 用 high(semantic ≥ floor)</Label>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-footnote text-fg-muted w-20">Case 2:</span>
          <div className="relative inline-flex">
            <Button variant="primary" startIcon={Bell}>通知</Button>
            <Badge count={3} variant="critical" className="absolute -top-1 -right-1" />
          </div>
          <Label warn>semantic=low(passive)但 primary 容器 contrast floor=high/critical → 被迫 bump(設計錯配訊號)</Label>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-footnote text-fg-muted w-20">Case 3:</span>
          <div className="relative inline-flex">
            <Button variant="tertiary" size="sm" iconOnly startIcon={Bell} aria-label="錯誤 (5)" />
            <Badge count={5} variant="critical" className="absolute -top-1 -right-1" />
          </div>
          <Label>semantic=critical 業務需求本身急 → critical,不受 floor 封頂</Label>
        </div>
      </Rule>

      <Rule
        title="Case 2 是設計錯配訊號——重新考慮放置"
        note="passive count 被 primary button 逼到 high/critical,semantic 跟 visual 不搭。解決不是一直升 level,是重新思考這 badge 該不該在這裡"
      >
        <Label>改用 dot 模式 / 移到外部 label / 乾脆不放 badge</Label>
      </Rule>

      <Rule
        title="❌ 為了「能在深色容器上看見」把 passive count 升 critical"
        note="扭曲 level 語意——把「被動資訊」包裝成「需立即處理」,誤導使用者的注意力分配"
      >
        <div className="relative inline-flex">
          <Button variant="primary" startIcon={Archive}>Archive</Button>
          <Badge count={128} variant="critical" className="absolute -top-1 -right-1" />
        </div>
        <Label warn>↑ Archive 的 128 被強制 critical 紅色 → 使用者誤以為「要去看」,實際只是總數</Label>
      </Rule>
    </div>
  ),
}

export const DotVsCountRule: Story = {
  name: 'Dot vs Count 選擇',
  render: () => (
    <div>
      <Rule
        title="Count — 數字本身有意義（3 vs 30 觸發不同 urgency）"
        note="未讀訊息 / 錯誤數 / 購物車品項——使用者會根據數字決定行動優先序"
      >
        <div className="flex items-center gap-4">
          <div className="relative inline-flex">
            <Button variant="tertiary" size="sm" iconOnly startIcon={MessageSquare} aria-label="訊息 (3)" />
            <Badge count={3} variant="critical" className="absolute -top-1 -right-1" />
          </div>
          <div className="relative inline-flex">
            <Button variant="tertiary" size="sm" iconOnly startIcon={MessageSquare} aria-label="訊息 (42)" />
            <Badge count={42} variant="critical" className="absolute -top-1 -right-1" />
          </div>
          <div className="relative inline-flex">
            <Button variant="tertiary" size="sm" iconOnly startIcon={MessageSquare} aria-label="訊息 (150+)" />
            <Badge count={150} max={99} variant="critical" className="absolute -top-1 -right-1" />
          </div>
          <Label>3 vs 42 vs 99+ 觸發不同 urgency 感</Label>
        </div>
      </Rule>

      <Rule
        title="Dot — 存在性指示（「有新東西」即訊號）"
        note="新功能提示、unsaved changes、在線狀態——具體數量不重要或無意義"
      >
        <div className="flex items-center gap-4">
          <div className="relative inline-flex">
            <Button variant="tertiary" size="sm" startIcon={Settings}>設定</Button>
            <Badge dot variant="critical" className="absolute -top-1 -right-1" aria-label="有新功能" />
          </div>
          <Label>「設定有新功能」——有即可,不需知道多少個</Label>
        </div>
      </Rule>

      <Rule
        title="判斷法：「使用者想知道『有沒有』還是『多少』？」"
        note="知道有就夠 → dot / 需要數量判斷 urgency → count"
      >
        <Label>若 count 永遠顯示 99+(threshold 失去區別力),改用 dot 或升高 max</Label>
      </Rule>
    </div>
  ),
}

export const AccessibilityRule: Story = {
  name: '無障礙必備',
  render: () => (
    <div>
      <Rule
        title="Parent 元件的 aria-label 必須整合 badge 資訊"
        note="Badge 本身是裝飾層——screen reader 需要從 parent 的 aria-label 取得完整 context。「通知 (3 則未讀)」比「通知」+「3」更清楚"
      >
        <div className="relative inline-flex">
          <Button variant="tertiary" size="sm" iconOnly startIcon={Bell} aria-label="通知 (3 則未讀)" />
          <Badge count={3} variant="critical" className="absolute -top-1 -right-1" />
        </div>
        <Label>✓ aria-label="通知 (3 則未讀)" — screen reader 一次讀出完整資訊</Label>
      </Rule>

      <Rule
        title="Dot 模式必須給 aria-label"
        note="Dot 無文字,screen reader 完全看不到——沒 aria-label 等於對 a11y 使用者不存在"
      >
        <div className="flex items-center gap-4">
          <Badge dot variant="critical" aria-label="有新訊息" />
          <span className="text-body">✓ 有 aria-label</span>
        </div>
        <div className="flex items-center gap-4">
          <Badge dot variant="critical" />
          <span className="text-body">❌ 沒 aria-label</span>
        </div>
        <Label warn>↑ 沒 aria-label 的 dot → screen reader 使用者不知道「有東西」</Label>
      </Rule>

      <Rule
        title="❌ 單靠顏色傳達 urgency（color-blind 失效）"
        note="Badge 的 level 靠顏色(紅/藍/灰)——color-blind 使用者可能分不清 critical vs high。必須搭配 aria-label、count 數字、或容器上的其他視覺指示"
      >
        <div className="flex items-center gap-4">
          <Badge dot variant="critical" aria-label="緊急" />
          <Badge dot variant="high" aria-label="重要" />
          <Badge dot variant="medium" aria-label="一般" />
          <Badge dot variant="low" aria-label="被動" />
        </div>
        <Label>↑ 4 個 dot 差異只在顏色——必須靠 aria-label 明確語意,不能只靠「紅色代表緊急」</Label>
      </Rule>
    </div>
  ),
}

export const PlacementRule: Story = {
  name: '三種放置模式',
  render: () => (
    <div>
      <Rule
        title="Overlay — 疊加在元件角落（最常見）"
        note="Button iconOnly / Avatar / Icon 的右上角疊 badge。badge 用 absolute,不影響主元件 layout box"
      >
        <div className="relative inline-flex">
          <Button variant="tertiary" size="sm" iconOnly startIcon={Bell} aria-label="通知 (3)" />
          <Badge count={3} variant="critical" className="absolute -top-1 -right-1" />
        </div>
      </Rule>

      <Rule
        title="Inline — 跟 label 並列（計數展示）"
        note="Tab / Menu item / Section title 旁邊顯示計數。不用 absolute,gap 控制間距"
      >
        <div className="flex items-center gap-2">
          <FileText size={16} />
          <span className="text-body">文件</span>
          <Badge count={12} variant="low" />
        </div>
        <Label>↑ 「文件 (12)」一體展示,不是 overlay</Label>
      </Rule>

      <Rule
        title="Standalone — 獨立狀態指示"
        note="通常是 dot 模式,跟 description 文字並列作為狀態 indicator"
      >
        <div className="flex items-center gap-2">
          <Badge dot variant="critical" aria-label="離線" />
          <span className="text-body">離線</span>
        </div>
      </Rule>

      <Rule
        title="❌ 一個元件疊多個 badge（signal crowding）"
        note="多個 badge 同時爭奪注意力 → 失去 signal 功能。合併資訊成一個 badge"
      >
        <div className="relative inline-flex">
          <Button variant="tertiary" size="sm" iconOnly startIcon={Bell} aria-label="通知" />
          <Badge count={3} variant="critical" className="absolute -top-1 -right-1" />
          <Badge dot variant="high" className="absolute -bottom-1 -right-1" />
        </div>
        <Label warn>↑ 同一顆按鈕疊兩個 badge(count + dot)→ 使用者無法判斷重要性</Label>
      </Rule>
    </div>
  ),
}
