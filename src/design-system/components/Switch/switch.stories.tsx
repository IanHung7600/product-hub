import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from './switch'
import { SelectionItem } from '@/design-system/components/SelectionControl/selection-item'

const meta: Meta<typeof Switch> = {
  title: 'Design System/Components/Switch/展示',
  component: Switch,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Switch>

/* ── 狀態 ── */
export const States: Story = {
  name: '狀態',
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-caption text-fg-muted mb-2">md（預設）</p>
        <div className="flex items-center gap-6">
          <Switch />
          <Switch defaultChecked />
          <Switch disabled />
          <Switch disabled defaultChecked />
        </div>
        <div className="flex items-center gap-6 mt-1 text-[10px] text-fg-muted">
          <span className="w-10 text-center">off</span>
          <span className="w-10 text-center">on</span>
          <span className="w-10 text-center">off+dis</span>
          <span className="w-10 text-center">on+dis</span>
        </div>
      </div>
      <div>
        <p className="text-caption text-fg-muted mb-2">lg</p>
        <div className="flex items-center gap-6">
          <Switch size="lg" />
          <Switch size="lg" defaultChecked />
          <Switch size="lg" disabled />
          <Switch size="lg" disabled defaultChecked />
        </div>
      </div>
    </div>
  ),
}

/* ── 搭配 SelectionItem ── */
export const WithLabel: Story = {
  name: '搭配 Label',
  render: () => (
    <div className="flex flex-col gap-4 max-w-sm">
      {(['sm', 'md', 'lg'] as const).map(size => (
        <div key={size}>
          <p className="text-caption text-fg-muted mb-1">size="{size}"</p>
          <div className="grid">
            <SelectionItem
              size={size}
              control={<Switch id={`sw-${size}-a`} size={size} defaultChecked />}
              label="啟用通知"
              description="接收電子郵件和推播通知"
              htmlFor={`sw-${size}-a`}
            />
            <SelectionItem
              size={size}
              control={<Switch id={`sw-${size}-b`} size={size} />}
              label="自動更新"
              htmlFor={`sw-${size}-b`}
            />
            <SelectionItem
              size={size}
              control={<Switch id={`sw-${size}-c`} size={size} disabled />}
              label="維護模式（管理員限定）"
              htmlFor={`sw-${size}-c`}
              disabled
            />
          </div>
        </div>
      ))}
    </div>
  ),
}
