// 資源庫平台 — 平台殼(AppShell + Sidebar + ChromeHeader)+ React Router 多頁
//
// SSOT 鐵律:
//   - Consumer 只 import @qijenchen/design-system public exports
//   - 禁修改 DS source
//   - 視覺 token 透過 @qijenchen/design-system/styles/tokens 載入
//
// 路由 ↔ Sidebar:SidebarProvider controlled(activeId 由 URL 推導,onActiveChange → navigate)

import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AppShell, SidebarProvider, Empty } from '@qijenchen/design-system'
import { AppSidebar, NAV } from './shell/AppSidebar'
import { PageHeader } from './shell/PageHeader'
import { HomePage } from './pages/HomePage'
import { ModulesCatalogPage } from './pages/ModulesCatalogPage'
import { ModuleDetailPage } from './pages/ModuleDetailPage'

function activeIdFromPath(pathname: string): string {
  if (pathname.startsWith('/modules')) return 'modules'
  if (pathname.startsWith('/showcase')) return 'showcase'
  if (pathname.startsWith('/guidelines')) return 'guidelines'
  return 'home'
}

function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="px-[var(--layout-space-loose)] py-[var(--layout-space-loose)]">
      <Empty title={title} description={description} />
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const activeId = activeIdFromPath(location.pathname)
  const title = NAV.find((n) => n.id === activeId)?.label ?? '資源庫平台'

  return (
    <SidebarProvider
      activeId={activeId}
      onActiveChange={(id) => {
        const target = NAV.find((n) => n.id === id)
        if (target) navigate(target.path)
      }}
    >
      <AppShell layout="primary-sidebar" sidebar={<AppSidebar />} header={<PageHeader title={title} />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/modules" element={<ModulesCatalogPage />} />
          <Route path="/modules/:moduleId" element={<ModuleDetailPage />} />
          <Route
            path="/showcase"
            element={<PlaceholderPage title="產品案例庫" description="L3 真實產品的組合範例,將在後續階段提供。" />}
          />
          <Route
            path="/guidelines"
            element={<PlaceholderPage title="治理規範" description="客製化邊界、貢獻流程、版本政策,將在後續階段提供。" />}
          />
        </Routes>
      </AppShell>
    </SidebarProvider>
  )
}
