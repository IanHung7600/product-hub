import type { Meta } from '@storybook/react'
import { Mail, Bell, Settings, Search, Plus, Trash2, ChevronDown, Check, Minus, ExternalLink, Copy, Pencil, User, Folder, Star, ChevronRight } from 'lucide-react'
import { Button } from '@/design-system/components/Button/button'
import { Checkbox } from '@/design-system/components/Checkbox/checkbox'
import { SelectMenuItem, SelectMenuGroup } from '@/design-system/components/SelectMenu/select-menu-item'
import { Tag } from '@/design-system/components/Tag/tag'

const meta: Meta = {
  title: 'Explorations/Icon Stroke Width',
  parameters: { layout: 'padded' },
}
export default meta

const icons = [Mail, Bell, Settings, Search, Plus, Trash2, ChevronDown, Check, Minus, ExternalLink, Copy, Pencil, User, Folder, Star]

const StrokeScope = ({ sw, children }: { sw: number; children: React.ReactNode }) => (
  <div style={{ ['--sw' as string]: sw }}>
    <style>{`[style*="--sw"] .lucide { stroke-width: var(--sw) !important; }`}</style>
    {children}
  </div>
)

const MenuContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="w-[280px] rounded-lg bg-surface-raised border border-border overflow-hidden" style={{ boxShadow: 'var(--elevation-200)' }}>
    {children}
  </div>
)

const Section = ({ sw, label }: { sw: number; label: string }) => (
  <StrokeScope sw={sw}>
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline gap-2">
        <span className="text-h6 font-semibold">{label}</span>
        <span className="text-caption text-fg-muted font-mono">strokeWidth = {sw}</span>
      </div>

      {/* Icons at 16px / 20px */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2.5">
          <span className="text-caption text-fg-muted w-10 shrink-0">16px</span>
          {icons.map((Icon, i) => <Icon key={i} size={16} />)}
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-caption text-fg-muted w-10 shrink-0">20px</span>
          {icons.map((Icon, i) => <Icon key={i} size={20} />)}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        <Button size="sm" startIcon={Mail}>寄送</Button>
        <Button size="sm" variant="tertiary" startIcon={Settings}>設定</Button>
        <Button size="sm" iconOnly startIcon={Plus} aria-label="新增" />
        <Button size="sm" variant="tertiary" endIcon={ChevronDown}>選單</Button>
        <Tag size="sm" startIcon={Star} onDismiss={() => {}}>標籤</Tag>
      </div>

      {/* Checkbox 12px internal icon */}
      <div className="flex items-center gap-3">
        <Checkbox defaultChecked />
        <Checkbox checked="indeterminate" />
        <Checkbox />
        <span className="text-caption text-fg-muted">Checkbox 內 12px icon</span>
      </div>

      {/* Menu */}
      <MenuContainer>
        <SelectMenuGroup>
          <SelectMenuItem startIcon={Mail}>電子郵件</SelectMenuItem>
          <SelectMenuItem startIcon={Bell} selected>通知（選中）</SelectMenuItem>
          <SelectMenuItem startIcon={Settings} disabled>設定（停用）</SelectMenuItem>
        </SelectMenuGroup>
      </MenuContainer>
    </div>
  </StrokeScope>
)

export const Comparison = {
  name: '2.0 vs 1.75',
  render: () => (
    <div className="grid grid-cols-2 gap-10">
      <Section sw={2} label="2.0（預設）" />
      <Section sw={1.75} label="1.75（建議）" />
    </div>
  ),
}
