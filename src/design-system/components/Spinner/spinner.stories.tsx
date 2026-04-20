import type { Meta, StoryObj } from '@storybook/react'
import { Search, Upload } from 'lucide-react'
import { Spinner } from './spinner'
import { Button } from '@/design-system/components/Button/button'

/**
 * Spinner 展示——整個設計系統唯一的 loading 旋轉圖示,任何要表達「進行中」的
 * 元件都從這裡消費。
 *
 * 展示範例均對標世界級產品的真實使用場景(Stripe 付款送出、GitHub PR merging、
 * Figma 雲端同步、Notion workspace loading)。設計規則詳見 `spinner.spec.md`。
 */

const meta: Meta = {
  title: 'Design System/Components/Spinner/展示',
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj

export const Default: Story = {
  name: '預設',
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner size={16} />
      <Spinner size={20} />
      <Spinner size={24} />
      <Spinner size={32} />
    </div>
  ),
}

export const ButtonLoading: Story = {
  name: 'Button loading(Stripe 付款送出)',
  render: () => (
    <div className="flex items-center gap-3">
      <Button variant="primary" loading>處理付款中</Button>
      <Button variant="secondary" loading>儲存草稿</Button>
      <Button variant="tertiary" loading>匯出 CSV</Button>
    </div>
  ),
}

export const InlineAction: Story = {
  name: 'Inline action(搜尋 / upload 進行中)',
  render: () => (
    <div className="flex flex-col gap-4 max-w-sm">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
        <input
          type="text"
          className="w-full pl-9 pr-9 py-1.5 border border-border rounded-md text-body"
          placeholder="搜尋 GitHub repositories..."
          defaultValue="react-"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Spinner size={16} />
        </div>
      </div>

      <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2">
        <Upload size={16} className="text-fg-muted" />
        <span className="text-body flex-1">presentation.pdf</span>
        <Spinner size={16} />
        <span className="text-caption text-fg-muted">上傳中</span>
      </div>
    </div>
  ),
}

export const InlineCellLoading: Story = {
  name: 'Cell 局部載入(Figma 雲端同步)',
  render: () => (
    <div className="border border-border rounded-lg overflow-hidden max-w-2xl">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="text-left text-caption text-fg-secondary px-4 py-2 font-medium">檔案</th>
            <th className="text-left text-caption text-fg-secondary px-4 py-2 font-medium">最後修改</th>
            <th className="text-left text-caption text-fg-secondary px-4 py-2 font-medium">同步狀態</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          <tr>
            <td className="px-4 py-3 text-body">Design System v2</td>
            <td className="px-4 py-3 text-body text-fg-muted">2 分鐘前</td>
            <td className="px-4 py-3">
              <span className="inline-flex items-center gap-2 text-caption text-fg-muted">
                <Spinner size={16} /> 同步中
              </span>
            </td>
          </tr>
          <tr>
            <td className="px-4 py-3 text-body">Onboarding Flow</td>
            <td className="px-4 py-3 text-body text-fg-muted">1 小時前</td>
            <td className="px-4 py-3 text-caption text-fg-muted">已同步</td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
}

export const FullScreenOverlay: Story = {
  name: '全頁 overlay(Notion workspace 切換中)',
  render: () => (
    <div className="relative border border-border rounded-lg w-full h-80 overflow-hidden">
      <div className="p-6">
        <div className="h-6 w-48 rounded-md bg-muted mb-4" />
        <div className="h-4 w-full rounded-md bg-muted mb-2" />
        <div className="h-4 w-full rounded-md bg-muted mb-2" />
        <div className="h-4 w-3/4 rounded-md bg-muted" />
      </div>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3"
        style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
      >
        <Spinner size={48} aria-label="切換 workspace 中" />
        <p className="text-caption text-fg-muted">正在切換到 Acme Inc. workspace</p>
      </div>
    </div>
  ),
}
