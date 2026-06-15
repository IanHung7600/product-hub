// 平台殼 — Sidebar(router-driven active state)
// 對齊 DS canonical sidebar.stories.tsx#IconCollapse:collapsible="icon" + WorkspaceBrand + footer
// activeId 由 URL 推導(controlled),onActiveChange 觸發 navigate — DS 官方 router-driven 用法。

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  Avatar,
  ItemAvatar,
} from '@qijenchen/design-system'
import { Home, Blocks, AppWindow, BookOpen } from 'lucide-react'

export const NAV = [
  { id: 'home', label: '首頁', icon: Home, path: '/' },
  { id: 'modules', label: '共用能力目錄', icon: Blocks, path: '/modules' },
  { id: 'showcase', label: '產品案例庫', icon: AppWindow, path: '/showcase' },
  { id: 'guidelines', label: '治理規範', icon: BookOpen, path: '/guidelines' },
] as const

// activeId 與 onClick→navigate 由 App.tsx 的 SidebarProvider(controlled)統一處理:
// SidebarMenuButton 傳 id → 自動從 provider.activeId 算 isActive、click 時觸發 onActiveChange。
export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {/* chrome header avatar canonical:raw <Avatar size={24}>,非 row context */}
        {/* @layout-space-magic-ok: gap-2 是 brand icon+label 的 chrome 內距,直抄 DS canonical SidebarHeader(sidebar.stories.tsx#IconCollapse / template App.tsx),非 consumer content layout */}
        <div className="flex items-center gap-2 min-w-0 group-data-[collapsible=icon]:justify-center">
          <Avatar alt="資源庫平台" size={24} shape="square" color="purple" solid />
          <span className="text-body-lg font-medium truncate group-data-[collapsible=icon]:hidden">
            資源庫平台
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map(({ id, label, icon }) => (
                <SidebarMenuItem key={id}>
                  <SidebarMenuButton id={id} startIcon={icon} tooltip={label}>
                    {label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div role="group" aria-label="當前使用者">
                <ItemAvatar alt="當前使用者" color="purple" />
                <span data-sidebar="menu-label" className="min-w-0 flex-1 truncate">
                  UX Lead
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
