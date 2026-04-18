import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from './sheet'
import { Button } from '@/design-system/components/Button/button'

const meta: Meta = {
  title: 'Design System/Components/Sheet/設計規格',
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
const Td = ({ children, mono }: { children: React.ReactNode; mono?: boolean }) => (
  <td className={`border border-border px-3 py-1.5 text-caption ${mono ? 'font-mono' : ''}`}>{children}</td>
)
const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="border border-border px-3 py-1.5 text-caption text-fg-secondary bg-muted text-left">{children}</th>
)

export const Overview: Story = {
  name: '元件總覽',
  render: () => (
    <div className="flex flex-col gap-10">
      <div>
        <H3>Anatomy</H3>
        <Desc>Sheet 是 shadcn passthrough(基於 Radix Dialog 的 `side` variant)——從畫面邊緣(top / bottom / left / right)滑入的浮層面板。結構跟 Dialog 同(Header + Content + Footer),差異在位置與動畫。</Desc>
        <div className="flex items-center gap-3 flex-wrap">
          {(['left', 'right', 'top', 'bottom'] as const).map(side => (
            <Sheet key={side}>
              <SheetTrigger asChild>
                <Button variant="tertiary">{side}</Button>
              </SheetTrigger>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle>{side} Sheet</SheetTitle>
                  <SheetDescription>從 {side} 滑入的 Sheet demo</SheetDescription>
                </SheetHeader>
                <div className="flex-1 p-4">
                  <p className="text-body">Sheet 主要內容區</p>
                </div>
                <SheetFooter>
                  <Button variant="tertiary">取消</Button>
                  <Button variant="primary">確認</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          ))}
        </div>
      </div>

      <div>
        <H3>Side 方向</H3>
        <div className="overflow-x-auto">
          <table className="text-caption border-collapse">
            <thead><tr><Th>Side</Th><Th>滑入方向</Th><Th>典型用途</Th></tr></thead>
            <tbody>
              <tr><Td mono>right(預設)</Td><Td>從右邊</Td><Td>Detail panel、filter drawer、task 編輯</Td></tr>
              <tr><Td mono>left</Td><Td>從左邊</Td><Td>Mobile navigation drawer</Td></tr>
              <tr><Td mono>top</Td><Td>從上方</Td><Td>Notification panel、system announcement</Td></tr>
              <tr><Td mono>bottom</Td><Td>從下方</Td><Td>Mobile bottom sheet(action sheet / picker)</Td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <H3>Sheet vs Dialog</H3>
        <Desc>共用 Radix Dialog base。視覺差異:Sheet 靠邊(側邊滑入),Dialog 居中(縮放入場)。完整分界詳見 sheet.spec.md。</Desc>
      </div>
    </div>
  ),
}
