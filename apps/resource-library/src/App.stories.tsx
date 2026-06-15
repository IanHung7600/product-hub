// 資源庫平台 — 完整平台殼 + 多頁路由範例
// 平台殼(AppShell + Sidebar + ChromeHeader)+ React Router 多頁(首頁 / 目錄 / Module 詳情)。

import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

const meta: Meta<typeof App> = {
  title: 'Apps/resource-library/平台殼',
  component: App,
  // App 依賴 router context — Storybook 用 MemoryRouter 提供(main.tsx 真實環境用 BrowserRouter)
  decorators: [
    (Story, ctx) => (
      <MemoryRouter initialEntries={[(ctx.parameters.initialPath as string) ?? '/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '資源庫平台殼 — DS canonical `AppShell + Sidebar + ChromeHeader` + React Router 多頁。\n\n' +
          'SSOT 鐵律:只 import `@qijenchen/design-system` exports,**禁修改 DS source**。',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof App>

export const Default: Story = {
  name: '首頁',
}

export const ModuleCatalog: Story = {
  name: '共用能力目錄',
  parameters: { initialPath: '/modules' },
}

export const FormsModuleDetail: Story = {
  name: '表單 Module 詳情',
  parameters: { initialPath: '/modules/forms' },
}
