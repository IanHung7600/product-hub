// 平台殼 — PageHeader(消費 DS ChromeHeader primitive,對齊 header-canonical)
// SidebarTrigger 必有(primary-sidebar menu toggle + ⌘B);右側放主題切換。

import { ChromeHeader, SidebarTrigger, Button } from '@qijenchen/design-system'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

// Dark/Light:切換 <html data-theme>(DS semantic token 依此 selector 切色)
function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') ?? 'light',
  )
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  return { theme, toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')) }
}

export function PageHeader({ title, rightSlot }: { title: string; rightSlot?: JSX.Element }) {
  const { theme, toggle } = useTheme()
  return (
    <ChromeHeader className="bg-surface">
      <SidebarTrigger />
      <h1 className="text-body-lg font-medium flex-1 truncate">{title}</h1>
      {rightSlot}
      <Button
        variant="text"
        size="md"
        iconOnly
        startIcon={theme === 'light' ? Moon : Sun}
        aria-label={theme === 'light' ? '切換深色模式' : '切換淺色模式'}
        onClick={toggle}
      />
    </ChromeHeader>
  )
}
