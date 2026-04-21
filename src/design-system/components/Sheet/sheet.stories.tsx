import type { Meta, StoryObj } from '@storybook/react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetBody,
  SheetFooter,
  SheetClose,
} from './sheet'
import { Button } from '@/design-system/components/Button/button'
import { Field, FieldLabel, FieldDescription } from '@/design-system/components/Field/field'
import { Input } from '@/design-system/components/Input/input'
import { Textarea } from '@/design-system/components/Textarea/textarea'
import { Checkbox } from '@/design-system/components/Checkbox/checkbox'
import { CheckboxGroup } from '@/design-system/components/CheckboxGroup/checkbox-group'

const meta: Meta = {
  title: 'Design System/Components/Sheet/展示',
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj

export const CreateProjectRight: Story = {
  name: '右側建立 project(Linear / Stripe style)',
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="primary">建立新專案</Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>建立新專案</SheetTitle>
        </SheetHeader>
        <SheetBody className="flex flex-col gap-4">
          <Field>
            <FieldLabel>專案名稱</FieldLabel>
            <Input placeholder="例:Q2 產品路線圖" />
          </Field>
          <Field>
            <FieldLabel>描述</FieldLabel>
            <Textarea placeholder="簡述此專案的目標與範圍" rows={4} />
            <FieldDescription>選填,可在建立後補上</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>預設通知</FieldLabel>
            <CheckboxGroup>
              <Checkbox defaultChecked label="新任務指派給我" />
              <Checkbox defaultChecked label="我參與的任務有新評論" />
              <Checkbox label="每日摘要" />
            </CheckboxGroup>
          </Field>
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="tertiary">取消</Button>
          </SheetClose>
          <Button variant="primary">建立專案</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const EditUserRight: Story = {
  name: '右側編輯 user detail(Jira issue drawer)',
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="tertiary">檢視成員詳情</Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Ada Chen</SheetTitle>
        </SheetHeader>
        <SheetBody className="flex flex-col gap-4">
          <Field>
            <FieldLabel>顯示名稱</FieldLabel>
            <Input defaultValue="Ada Chen" />
          </Field>
          <Field>
            <FieldLabel>職稱</FieldLabel>
            <Input defaultValue="Design Engineer" />
          </Field>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input defaultValue="ada.chen@example.com" />
          </Field>
          <Field>
            <FieldLabel>權限</FieldLabel>
            <CheckboxGroup>
              <Checkbox defaultChecked label="可管理成員" />
              <Checkbox defaultChecked label="可編輯設定" />
              <Checkbox label="可刪除專案" />
            </CheckboxGroup>
          </Field>
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="tertiary">取消</Button>
          </SheetClose>
          <Button variant="primary">儲存變更</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

// LeftNavigation 範例移除(AR35):消費者 Sheet API **只能用 side="right"**。
// 左側 / 頂部 / 底部為 DS 內部基建用(如 Sidebar 在 narrow viewport 時切 left 滑入),
// 需 user 明示授權。本 stories 檔不提供未授權用法示範。
