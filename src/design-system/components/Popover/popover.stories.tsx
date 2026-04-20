import type { Meta, StoryObj } from '@storybook/react'
import { Filter, SlidersHorizontal } from 'lucide-react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverTitle,
} from './popover'
import { Button } from '@/design-system/components/Button/button'
import { Field, FieldLabel } from '@/design-system/components/Field/field'
import { Input } from '@/design-system/components/Input/input'
import { Checkbox } from '@/design-system/components/Checkbox/checkbox'

const meta: Meta = {
  title: 'Design System/Components/Popover/展示',
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj

export const FilterPanel: Story = {
  name: '篩選面板(Jira / Linear)',
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="tertiary" startIcon={Filter}>依狀態篩選</Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <PopoverHeader>
          <PopoverTitle>依狀態篩選</PopoverTitle>
        </PopoverHeader>
        <PopoverBody>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-body">
              <Checkbox defaultChecked /> 待處理
            </label>
            <label className="flex items-center gap-2 text-body">
              <Checkbox defaultChecked /> 進行中
            </label>
            <label className="flex items-center gap-2 text-body">
              <Checkbox /> 已完成
            </label>
            <label className="flex items-center gap-2 text-body">
              <Checkbox /> 已封存
            </label>
          </div>
        </PopoverBody>
        <PopoverFooter>
          <Button variant="tertiary" size="sm" className="flex-1">清除</Button>
          <Button variant="primary" size="sm" className="flex-1">套用</Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  ),
}

export const SettingsPanel: Story = {
  name: '設定 mini panel(Notion 頁面設定)',
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="tertiary" startIcon={SlidersHorizontal}>頁面設定</Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <PopoverHeader>
          <PopoverTitle>頁面設定</PopoverTitle>
        </PopoverHeader>
        <PopoverBody>
          <div className="flex flex-col gap-3">
            <Field>
              <FieldLabel>頁面標題</FieldLabel>
              <Input defaultValue="Q1 產品路線圖" />
            </Field>
            <label className="flex items-center justify-between text-body">
              <span>顯示目錄</span>
              <Checkbox defaultChecked />
            </label>
            <label className="flex items-center justify-between text-body">
              <span>小字體</span>
              <Checkbox />
            </label>
            <label className="flex items-center justify-between text-body">
              <span>全寬模式</span>
              <Checkbox defaultChecked />
            </label>
          </div>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  ),
}

export const BareBody: Story = {
  name: '純內容(w-auto p-0 覆寫 — SelectMenu style)',
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="tertiary">選擇優先度</Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col py-1 min-w-[180px]">
          {[
            { icon: '🔥', label: '緊急', hint: 'Urgent' },
            { icon: '🔴', label: '高', hint: 'High' },
            { icon: '🟡', label: '中', hint: 'Medium' },
            { icon: '🔵', label: '低', hint: 'Low' },
            { icon: '⚪', label: '無', hint: 'No priority' },
          ].map(item => (
            <button
              key={item.label}
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 text-body text-left hover:bg-neutral-hover"
            >
              <span className="text-base">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              <span className="text-caption text-fg-muted">{item.hint}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  ),
}
