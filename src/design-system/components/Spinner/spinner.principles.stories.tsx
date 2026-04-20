import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from './spinner'
import { Button } from '@/design-system/components/Button/button'
import { Skeleton } from '@/design-system/components/Skeleton/skeleton'

const meta: Meta = {
  title: 'Design System/Components/Spinner/設計原則',
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
    <div className="flex flex-wrap gap-6 items-start">{children}</div>
  </div>
)

const Label = ({ children, warn }: { children: React.ReactNode; warn?: boolean }) => (
  <p className={`text-footnote leading-normal ${warn ? 'text-error font-medium' : 'text-fg-muted'}`}>{children}</p>
)

// ── Stories ───────────────────────────────────────────────────────────────────

export const SpinnerVsSkeletonRule: Story = {
  name: 'Spinner vs Skeleton',
  render: () => (
    <div>
      <Rule
        title="Spinner — 行為回饋(不可預期時長、不知佈局)"
        note="Button 送出中、API 等待、upload 進行中——沒有「資料形狀」可以佔位,只是告訴使用者「正在處理,請稍候」"
      >
        <Button variant="primary" loading>處理付款中</Button>
        <Label>Stripe 結帳:只需要「在做事」的訊號,不需要佔位</Label>
      </Rule>

      <Rule
        title="Skeleton — 內容佔位(佈局已知、等資料填入)"
        note="List / table / card grid 初次載入——佈局結構確定,只差資料。用 Skeleton 讓版面先定型,避免資料回來時跳動"
      >
        <div className="flex items-center gap-3 w-72 border border-border rounded-lg p-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
        <Label>Linear 成員列表:佈局已定,等資料填入</Label>
      </Rule>

      <Rule
        title="判準"
        note="要描述「佈局」還是「行為」?描述佈局 → Skeleton;描述行為 → Spinner"
      >
        <Label>能畫出最終樣貌 → Skeleton</Label>
        <Label>只知道「在進行」 → Spinner</Label>
      </Rule>
    </div>
  ),
}

export const UsageScenarioRule: Story = {
  name: '使用情境',
  render: () => (
    <div>
      <Rule
        title="✅ Button loading — 使用者觸發動作後的即時回饋"
        note="表單送出、API 呼叫、執行動作中,Button 的 loading prop 內部自動渲染 Spinner。是 Spinner 最常見的消費場景"
      >
        <Button variant="primary" loading>送出訂單</Button>
        <Button variant="secondary" loading>儲存變更</Button>
        <Label>按鈕按下後的即時回饋,告訴使用者「已收到,在處理」</Label>
      </Rule>

      <Rule
        title="✅ Inline 表單驗證 / async search"
        note="輸入後等待伺服器驗證或搜尋結果時,用 16px Spinner 放在輸入框尾端。視覺干擾最小,使用者可繼續輸入"
      >
        <div className="relative w-72">
          <input type="text" className="w-full px-3 py-1.5 pr-9 border border-border rounded-md text-body" defaultValue="cq@" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Spinner size={16} />
          </div>
        </div>
        <Label>驗證 email 唯一性(GitHub 註冊場景)</Label>
      </Rule>

      <Rule
        title="✅ 延遲加載浮層 / 全頁 overlay"
        note="切換 workspace / 載入 dashboard 等需要阻擋互動的場景,用 48px Spinner + 說明文字。告知使用者正在處理,不是畫面卡住"
      >
        <div className="relative border border-border rounded-lg w-96 h-40 flex items-center justify-center bg-muted/40">
          <div className="flex flex-col items-center gap-3">
            <Spinner size={48} aria-label="載入 dashboard" />
            <p className="text-caption text-fg-muted">載入 dashboard 資料中</p>
          </div>
        </div>
        <Label>Notion workspace 切換、Stripe dashboard 初載</Label>
      </Rule>
    </div>
  ),
}

export const SizeMatchContextRule: Story = {
  name: 'Size 對應使用情境',
  render: () => (
    <div>
      <Rule
        title="16px — Button 內、Field endAction、Tag 內(inline 小空間)"
        note="inline 元素內部的 spinner,尺寸對齊旁邊的 text / icon。不能更大,會撐破容器"
      >
        <Button variant="tertiary" loading>送出</Button>
        <div className="relative w-60">
          <input type="text" className="w-full px-3 py-1.5 pr-9 border border-border rounded-md text-body" defaultValue="驗證中..." />
          <div className="absolute right-3 top-1/2 -translate-y-1/2"><Spinner size={16} /></div>
        </div>
      </Rule>

      <Rule
        title="24px — row primitive 的 loading footer、card 內 inline loading"
        note="中等尺寸,放在 row / card 內容區,視覺重量足夠吸引注意但不喧賓奪主"
      >
        <div className="flex items-center justify-center gap-2 border border-border rounded-lg p-4 w-72">
          <Spinner size={24} />
          <span className="text-body text-fg-muted">載入更多留言...</span>
        </div>
        <Label>Slack channel 載入更多訊息的 footer</Label>
      </Rule>

      <Rule
        title="32–48px — empty state 中央、full-screen overlay"
        note="全頁或獨立 loading 區塊,需要足夠視覺重量讓使用者一眼看到。通常配說明文字,告知具體在做什麼"
      >
        <div className="flex items-center justify-center gap-3 border border-border rounded-lg p-8 w-96">
          <Spinner size={48} aria-label="初始化專案" />
          <div className="flex flex-col">
            <span className="text-body">初始化新專案</span>
            <span className="text-caption text-fg-muted">這可能需要 30 秒</span>
          </div>
        </div>
        <Label>Figma 新檔案初始化、Jira 專案建立中</Label>
      </Rule>
    </div>
  ),
}

export const ForbiddenRule: Story = {
  name: '禁止事項',
  render: () => (
    <div>
      <Rule
        title="❌ 不用 Spinner 當常駐視覺裝飾"
        note="Spinner 的語意是「正在載入、正在處理」。永遠旋轉的裝飾會讓 a11y 使用者(螢幕閱讀器)持續收到 loading 通知,也讓視覺使用者無法判斷到底何時結束"
      >
        <div className="flex items-center gap-2 border border-border rounded-lg p-3 w-72">
          <Spinner size={20} />
          <span className="text-body">歡迎使用本系統</span>
        </div>
        <Label warn>Welcome banner 裡無限轉的 spinner → 使用者以為系統卡住</Label>
      </Rule>

      <Rule
        title="❌ 不要多個 Spinner 同時旋轉"
        note="同一畫面多個 spinner 會讓使用者不知道注意力該放哪。通常是結構問題:應該用父層單一 overlay Spinner,或改用 Skeleton 描述整個佈局"
      >
        <div className="flex flex-col gap-2 w-72">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 border border-border rounded-md px-3 py-2">
              <Spinner size={16} />
              <span className="text-body text-fg-muted">載入項目 {i + 1}</span>
            </div>
          ))}
        </div>
        <Label warn>四個 Spinner 同時轉 → 改用 Skeleton 做整個列表佔位</Label>
      </Rule>

      <Rule
        title="❌ 不要在 Spinner 外包 overlay 容器做全頁遮罩"
        note="Spinner 是純 primitive,不管 overlay / centering / 背景。全頁 loading 遮罩是另一層元件(未來 LoadingOverlay)的責任。現在需要遮罩自己 compose,但不要把那些樣式加回 Spinner prop"
      >
        <Label warn>不要加 color / variant / speed / thickness prop — Spinner 單一職責</Label>
      </Rule>

      <Rule
        title="❌ 不要 inline copy Loader2"
        note={'設計系統裡任何 loading 視覺都從 Spinner import。自己寫 `<Loader2 className="animate-spin" />` 會造成 icon / animation / a11y 漂移'}
      >
        <Label warn>所有 loading 都走 Spinner,不要 inline Loader2</Label>
      </Rule>
    </div>
  ),
}
