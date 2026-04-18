import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Popover, PopoverTrigger, PopoverContent } from './popover'
import { Button } from '@/design-system/components/Button/button'

const meta: Meta = {
  title: 'Design System/Components/Popover/設計規格',
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-body font-bold text-foreground mb-2">{children}</h3>
)
const Desc = ({ children }: { children: React.ReactNode }) => (
  <p className="text-caption text-fg-muted mb-4 max-w-[720px] leading-relaxed">{children}</p>
)

export const Overview: Story = {
  name: '元件總覽',
  render: () => (
    <div className="flex flex-col gap-10">
      <div>
        <H3>Anatomy</H3>
        <Desc>Popover 是 shadcn passthrough(基於 Radix Popover)——點擊觸發的浮層容器,提供定位 / 動畫 / 焦點管理。內容完全由 consumer 決定。本 DS 橋接 elevation / radius / border token,不改 Radix 原始結構。</Desc>
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="tertiary">打開 Popover</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="w-56 flex flex-col gap-2">
                <div className="text-body font-medium">Popover 標題</div>
                <div className="text-caption text-fg-muted">內容由 consumer 決定,可放任何 React 元素</div>
                <div className="flex gap-2 pt-2">
                  <Button variant="tertiary" size="sm">取消</Button>
                  <Button variant="primary" size="sm">確認</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <H3>視覺 Token</H3>
        <Desc>Popover 使用跟 DropdownMenuContent 相同的浮層視覺規格(所有 elevation-200 浮層共用):`bg-surface-raised + border-border + rounded-lg + --elevation-200 shadow + sideOffset 8`。</Desc>
      </div>

      <div>
        <H3>Radix 原生 Props</H3>
        <Desc>完整 props 與 API 見 Radix Popover 官方文件。常用:`align`、`sideOffset`、`side`、`open / onOpenChange`。本 DS 不額外包裝 API。</Desc>
      </div>
    </div>
  ),
}
