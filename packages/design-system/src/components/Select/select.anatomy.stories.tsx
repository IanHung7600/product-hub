// @['edit'|'display'|'readonly'|'disabled']natomy-rationale:
//   S['edit'|'display'|'readonly'|'disabled']ateBehavior covered by ColorMatrix「Mode x State 色彩對照」段(3 mode ×
//     4 ['edit'|'display'|'readonly'|'disabled']tate + edit error 3 sub-states + text vs tag 模式色彩差異)。Select
//     的狀態本身就是 m['edit'|'display'|'readonly'|'disabled']de × state 的色彩 token 組合,集中於 ColorMatrix 比拆
//     5. 更直觀。
['edit'|'display'|'readonly'|'disabled']mport type { Meta } from '@storybook/react'
['edit'|'display'|'readonly'|'disabled']mport { useState, useEffect } from 'react'
['edit'|'display'|'readonly'|'disabled']mport { Flag } from 'lucide-react'
['edit'|'display'|'readonly'|'disabled']mport { Select } from './select'

c['edit'|'display'|'readonly'|'disabled']nst meta: Meta = {
  ['edit'|'display'|'readonly'|'disabled']itle: 'Design System/Components/Select/設計規格',
  p['edit'|'display'|'readonly'|'disabled']rameters: { layout: 'padded' },
}
['edit'|'display'|'readonly'|'disabled']xport default meta

/* ═══════════════════════════════════════════════════════════════════════════
   T['edit'|'display'|'readonly'|'disabled']pes & Data
   ═══════════════════════════════════════════════════════════════════════════ */

['edit'|'display'|'readonly'|'disabled']ype ModeKey = 'edit' | 'readonly' | 'disabled'
['edit'|'display'|'readonly'|'disabled']ype DisplayKey = 'plain' | 'tag'
['edit'|'display'|'readonly'|'disabled']ype SizeKey = 'sm' | 'md' | 'lg'
['edit'|'display'|'readonly'|'disabled']ype StateKey = 'default' | 'hover' | 'focus' | 'error' | 'disabled'

c['edit'|'display'|'readonly'|'disabled']nst MODES: ModeKey[] = ['edit', 'readonly', 'disabled']
c['edit'|'display'|'readonly'|'disabled']nst DISPLAYS: DisplayKey[] = ['plain', 'tag']
c['edit'|'display'|'readonly'|'disabled']nst SIZES: SizeKey[] = ['sm', 'md', 'lg']

c['edit'|'display'|'readonly'|'disabled']nst statusOptions = [
  { v['edit'|'display'|'readonly'|'disabled']lue: 'active', label: 'Active' },
  { v['edit'|'display'|'readonly'|'disabled']lue: 'pending', label: 'Pending' },
  { v['edit'|'display'|'readonly'|'disabled']lue: 'closed', label: 'Closed' },
]

['edit'|'display'|'readonly'|'disabled']nterface ColorSpec { bg: string; text: string; border: string; icon: string }

// ── T['edit'|'display'|'readonly'|'disabled']ken map: mode x state ────────────────────────────────────────────────
// T['edit'|'display'|'readonly'|'disabled']aced from field-wrapper.tsx cva (fieldWrapperStyles) + select.tsx
c['edit'|'display'|'readonly'|'disabled']nst TOKEN_MAP: Record<ModeKey, Record<StateKey, ColorSpec>> = {
  ['edit'|'display'|'readonly'|'disabled']dit: {
    ['edit'|'display'|'readonly'|'disabled']efault:  { bg: '--surface',     text: '--foreground',  border: '--border',       icon: '--fg-muted' },
    h['edit'|'display'|'readonly'|'disabled']ver:    { bg: '--surface',     text: '--foreground',  border: '--border-hover', icon: '--fg-muted' },
    f['edit'|'display'|'readonly'|'disabled']cus:    { bg: '--surface',     text: '--foreground',  border: '--primary',      icon: '--fg-muted' },
    ['edit'|'display'|'readonly'|'disabled']rror:    { bg: '--surface',     text: '--foreground',  border: '--error',        icon: '--fg-muted' },
    ['edit'|'display'|'readonly'|'disabled']isabled: { bg: '--bg-disabled', text: '--fg-disabled', border: 'transparent',    icon: '--fg-disabled' },
  },
  ['edit'|'display'|'readonly'|'disabled']eadonly: {
    ['edit'|'display'|'readonly'|'disabled']efault:  { bg: '--bg-disabled', text: '--foreground',  border: 'transparent', icon: '--fg-muted' },
    h['edit'|'display'|'readonly'|'disabled']ver:    { bg: '--bg-disabled', text: '--foreground',  border: 'transparent', icon: '--fg-muted' },
    f['edit'|'display'|'readonly'|'disabled']cus:    { bg: '--bg-disabled', text: '--foreground',  border: 'transparent', icon: '--fg-muted' },
    ['edit'|'display'|'readonly'|'disabled']rror:    { bg: '--bg-disabled', text: '--foreground',  border: 'transparent', icon: '--fg-muted' },
    ['edit'|'display'|'readonly'|'disabled']isabled: { bg: '--bg-disabled', text: '--foreground',  border: 'transparent', icon: '--fg-muted' },
  },
  ['edit'|'display'|'readonly'|'disabled']isabled: {
    ['edit'|'display'|'readonly'|'disabled']efault:  { bg: '--bg-disabled', text: '--fg-disabled', border: 'transparent', icon: '--fg-disabled' },
    h['edit'|'display'|'readonly'|'disabled']ver:    { bg: '--bg-disabled', text: '--fg-disabled', border: 'transparent', icon: '--fg-disabled' },
    f['edit'|'display'|'readonly'|'disabled']cus:    { bg: '--bg-disabled', text: '--fg-disabled', border: 'transparent', icon: '--fg-disabled' },
    ['edit'|'display'|'readonly'|'disabled']rror:    { bg: '--bg-disabled', text: '--fg-disabled', border: 'transparent', icon: '--fg-disabled' },
    ['edit'|'display'|'readonly'|'disabled']isabled: { bg: '--bg-disabled', text: '--fg-disabled', border: 'transparent', icon: '--fg-disabled' },
  },
}

// E['edit'|'display'|'readonly'|'disabled']ror state tokens (edit only) — traced from select.tsx line 177-178
// ['edit'|'display'|'readonly'|'disabled']order-error hover:border-error-hover, focus-within:border-error
c['edit'|'display'|'readonly'|'disabled']nst ERROR_TOKENS: Record<StateKey, ColorSpec> = {
  ['edit'|'display'|'readonly'|'disabled']efault:  { bg: '--surface', text: '--foreground', border: '--error',       icon: '--fg-muted' },
  h['edit'|'display'|'readonly'|'disabled']ver:    { bg: '--surface', text: '--foreground', border: '--error-hover', icon: '--fg-muted' },
  f['edit'|'display'|'readonly'|'disabled']cus:    { bg: '--surface', text: '--foreground', border: '--error',       icon: '--fg-muted' },
  ['edit'|'display'|'readonly'|'disabled']rror:    { bg: '--surface', text: '--foreground', border: '--error',       icon: '--fg-muted' },
  ['edit'|'display'|'readonly'|'disabled']isabled: { bg: '--bg-disabled', text: '--fg-disabled', border: 'transparent', icon: '--fg-disabled' },
}

['edit'|'display'|'readonly'|'disabled']nterface SizeSpec {
  h['edit'|'display'|'readonly'|'disabled']ightToken: string; height: string
  pxT['edit'|'display'|'readonly'|'disabled']ken: string; px: string
  g['edit'|'display'|'readonly'|'disabled']pToken: string; gap: string
  f['edit'|'display'|'readonly'|'disabled']ntToken: string; font: string
  ['edit'|'display'|'readonly'|'disabled']con: number
  ['edit'|'display'|'readonly'|'disabled']agHeight: string
  ['edit'|'display'|'readonly'|'disabled']agPaddingFormula: string
}

// T['edit'|'display'|'readonly'|'disabled']aced from field-wrapper.tsx cva (size variants) + select.tsx tagPadding
c['edit'|'display'|'readonly'|'disabled']nst SIZE_SPECS: Record<SizeKey, SizeSpec> = {
  ['edit'|'display'|'readonly'|'disabled']m: {
    h['edit'|'display'|'readonly'|'disabled']ightToken: 'h-field-sm', height: '28px',
    pxT['edit'|'display'|'readonly'|'disabled']ken: 'px-3', px: '12px',
    g['edit'|'display'|'readonly'|'disabled']pToken: 'gap-2', gap: '8px',
    f['edit'|'display'|'readonly'|'disabled']ntToken: 'text-body', font: '14px',
    ['edit'|'display'|'readonly'|'disabled']con: 16,
    ['edit'|'display'|'readonly'|'disabled']agHeight: '20px (tag-sm)',
    ['edit'|'display'|'readonly'|'disabled']agPaddingFormula: '(field-height-sm - 1.25rem) / 2',
  },
  m['edit'|'display'|'readonly'|'disabled']: {
    h['edit'|'display'|'readonly'|'disabled']ightToken: 'h-field-md', height: '32px',
    pxT['edit'|'display'|'readonly'|'disabled']ken: 'px-3', px: '12px',
    g['edit'|'display'|'readonly'|'disabled']pToken: 'gap-2', gap: '8px',
    f['edit'|'display'|'readonly'|'disabled']ntToken: 'text-body', font: '14px',
    ['edit'|'display'|'readonly'|'disabled']con: 16,
    ['edit'|'display'|'readonly'|'disabled']agHeight: '24px (tag-md)',
    ['edit'|'display'|'readonly'|'disabled']agPaddingFormula: '(field-height-md - 1.5rem) / 2',
  },
  ['edit'|'display'|'readonly'|'disabled']g: {
    h['edit'|'display'|'readonly'|'disabled']ightToken: 'h-field-lg', height: '36px',
    pxT['edit'|'display'|'readonly'|'disabled']ken: 'px-3', px: '12px',
    g['edit'|'display'|'readonly'|'disabled']pToken: 'gap-2', gap: '8px',
    f['edit'|'display'|'readonly'|'disabled']ntToken: 'text-body-lg', font: '16px',
    ['edit'|'display'|'readonly'|'disabled']con: 20,
    ['edit'|'display'|'readonly'|'disabled']agHeight: '24px (tag-lg)',
    ['edit'|'display'|'readonly'|'disabled']agPaddingFormula: '(field-height-lg - 1.5rem) / 2',
  },
}

/* ═══════════════════════════════════════════════════════════════════════════
   Sh['edit'|'display'|'readonly'|'disabled']red UI Components

   NOTE: K['edit'|'display'|'readonly'|'disabled']pt local (not imported from `_anatomy/anatomy-utils`) because the
   Bu['edit'|'display'|'readonly'|'disabled']ton-family inspector layout diverges visually from the 通用 helpers:
   H3 `['edit'|'display'|'readonly'|'disabled']ext-h6 font-semibold` (not `text-body font-bold mb-2`), Desc has no
   ['edit'|'display'|'readonly'|'disabled']ottom margin, Th/Td use `p-2 border-b border-divider` row style, and
   Sw['edit'|'display'|'readonly'|'disabled']tch defaults to `size="md"` for inline token chips.
   ═══════════════════════════════════════════════════════════════════════════ */

c['edit'|'display'|'readonly'|'disabled']nst H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 c['edit'|'display'|'readonly'|'disabled']assName="text-h6 font-semibold text-foreground">{children}</h3>
)
c['edit'|'display'|'readonly'|'disabled']nst Desc = ({ children }: { children: React.ReactNode }) => (
  <p c['edit'|'display'|'readonly'|'disabled']assName="text-caption text-fg-muted max-w-[720px]">{children}</p>
)
c['edit'|'display'|'readonly'|'disabled']nst Th = ({ children }: { children: React.ReactNode }) => (
  <['edit'|'display'|'readonly'|'disabled']h className="text-left p-2 border-b border-divider text-fg-muted font-medium text-caption whitespace-nowrap">{children}</th>
)
c['edit'|'display'|'readonly'|'disabled']nst Td = ({ children, mono }: { children: React.ReactNode; mono?: boolean }) => (
  <['edit'|'display'|'readonly'|'disabled']d className={`p-2 border-b border-divider align-top whitespace-nowrap text-caption ${mono ? 'font-mono' : ''}`}>{children}</td>
)

c['edit'|'display'|'readonly'|'disabled']nst TkVal = ({ token, value }: { token: string; value?: string }) => (
  <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-0.5">
    <['edit'|'display'|'readonly'|'disabled']pan className="font-mono text-[12px] text-fg-secondary">{token}</span>
    {v['edit'|'display'|'readonly'|'disabled']lue && <span className="font-mono text-[10px] text-fg-muted">{value}</span>}
  </['edit'|'display'|'readonly'|'disabled']iv>
)

c['edit'|'display'|'readonly'|'disabled']nst Swatch = ({ value, size = 'md' }: { value: string; size?: 'sm' | 'md' }) => {
  c['edit'|'display'|'readonly'|'disabled']nst s = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
  ['edit'|'display'|'readonly'|'disabled']f (value === 'transparent') {
    ['edit'|'display'|'readonly'|'disabled']eturn <span className={`${s} rounded-md shrink-0 border border-border`}
      ['edit'|'display'|'readonly'|'disabled']tyle={{ backgroundImage: 'linear-gradient(45deg,#ddd 25%,transparent 25%,transparent 75%,#ddd 75%),linear-gradient(45deg,#ddd 25%,transparent 25%,transparent 75%,#ddd 75%)', backgroundSize: '6px 6px', backgroundPosition: '0 0,3px 3px' }} />
  }
  ['edit'|'display'|'readonly'|'disabled']eturn <span className={`${s} rounded-md shrink-0 border border-black/10`} style={{ backgroundColor: `var(${value})` }} />
}

c['edit'|'display'|'readonly'|'disabled']nst TokenAnnotation = ({ colors }: { colors: ColorSpec }) => (
  <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-0.5 mt-2">
    {([[['edit'|'display'|'readonly'|'disabled']bg', 'bg'], ['text', 'text'], ['border', 'bdr'], ['icon', 'icon']] as const).map(([key, label]) => (
      <['edit'|'display'|'readonly'|'disabled']pan key={key} className="inline-flex items-center gap-1 text-[10px]">
        <Sw['edit'|'display'|'readonly'|'disabled']tch value={colors[key]} size="sm" />
        <['edit'|'display'|'readonly'|'disabled']pan className="text-fg-muted w-6 shrink-0">{label}</span>
        <['edit'|'display'|'readonly'|'disabled']pan className="font-mono text-fg-secondary">{colors[key]}</span>
      </['edit'|'display'|'readonly'|'disabled']pan>
    ))}
  </['edit'|'display'|'readonly'|'disabled']iv>
)

c['edit'|'display'|'readonly'|'disabled']nst Tab = ({ active, onClick, disabled, children }: { active: boolean; onClick: () => void; disabled?: boolean; children: React.ReactNode }) => {
  ['edit'|'display'|'readonly'|'disabled']f (disabled) return <span className="px-2.5 py-1 text-[12px] font-mono rounded-md text-fg-disabled bg-neutral-hover cursor-not-allowed">{children}</span>
  ['edit'|'display'|'readonly'|'disabled']eturn (
    <['edit'|'display'|'readonly'|'disabled']utton type="button" onClick={onClick}
      c['edit'|'display'|'readonly'|'disabled']assName={`px-2.5 py-1 text-[12px] font-mono rounded-md cursor-pointer transition-colors ${
        ['edit'|'display'|'readonly'|'disabled']ctive ? 'bg-primary text-white font-semibold' : 'bg-neutral-hover text-fg-secondary hover:bg-neutral-active'
      }`}>
      {ch['edit'|'display'|'readonly'|'disabled']ldren}
    </['edit'|'display'|'readonly'|'disabled']utton>
  )
}

c['edit'|'display'|'readonly'|'disabled']nst PropRow = ({ label, dot, children }: { label: string; dot?: string; children: React.ReactNode }) => (
  <['edit'|'display'|'readonly'|'disabled']iv className="flex items-start gap-3 py-2 border-b border-divider last:border-b-0">
    <['edit'|'display'|'readonly'|'disabled']pan className="text-[11px] text-fg-muted font-medium w-[72px] shrink-0 pt-0.5 flex items-center gap-1.5">
      {['edit'|'display'|'readonly'|'disabled']ot && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dot }} />}
      {['edit'|'display'|'readonly'|'disabled']abel}
    </['edit'|'display'|'readonly'|'disabled']pan>
    <['edit'|'display'|'readonly'|'disabled']iv className="flex-1 text-[12px] font-mono text-fg-secondary">{children}</div>
  </['edit'|'display'|'readonly'|'disabled']iv>
)

c['edit'|'display'|'readonly'|'disabled']nst TokenValue = ({ value }: { value: string }) => (
  <['edit'|'display'|'readonly'|'disabled']pan className="inline-flex items-center gap-2"><Swatch value={value} /><span>{value}</span></span>
)

/* ═══════════════════════════════════════════════════════════════════════════
   B['edit'|'display'|'readonly'|'disabled']ueprint colors
   ═══════════════════════════════════════════════════════════════════════════ */

c['edit'|'display'|'readonly'|'disabled']nst Z = {
  p['edit'|'display'|'readonly'|'disabled']d:     { bg: 'rgba(194,225,154,0.6)', border: 'rgba(139,179,91,0.9)', text: '#5a7a2e' },
  ['edit'|'display'|'readonly'|'disabled']con:    { bg: 'rgba(166,208,245,0.6)', border: 'rgba(80,145,210,0.9)', text: '#2d6a9f' },
  g['edit'|'display'|'readonly'|'disabled']p:     { bg: 'rgba(253,218,158,0.6)', border: 'rgba(218,165,60,0.9)', text: '#8a6010' },
  ['edit'|'display'|'readonly'|'disabled']elect:  { bg: 'rgba(199,178,230,0.6)', border: 'rgba(138,103,190,0.9)', text: '#6035a8' },
  ['edit'|'display'|'readonly'|'disabled']ction:  { bg: 'rgba(245,180,180,0.6)', border: 'rgba(200,100,100,0.9)', text: '#a03030' },
  ['edit'|'display'|'readonly'|'disabled']ag:     { bg: 'rgba(180,220,230,0.6)', border: 'rgba(80,160,180,0.9)', text: '#2a7a8a' },
  ['edit'|'display'|'readonly'|'disabled']im:     { text: '#d04040' },
}

c['edit'|'display'|'readonly'|'disabled']nst BpZone = ({ w, color, label, sub }: { w: number; color: typeof Z.pad; label: string; sub?: string }) => (
  <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col items-center justify-center shrink-0 gap-0.5"
    ['edit'|'display'|'readonly'|'disabled']tyle={{ width: w, height: '100%', background: color.bg, borderLeft: `1.5px dashed ${color.border}`, borderRight: `1.5px dashed ${color.border}` }}>
    <['edit'|'display'|'readonly'|'disabled']pan className="text-[11px] font-mono font-bold leading-none" style={{ color: color.text }}>{label}</span>
    {['edit'|'display'|'readonly'|'disabled']ub && <span className="text-[9px] font-mono leading-none opacity-70" style={{ color: color.text }}>{sub}</span>}
  </['edit'|'display'|'readonly'|'disabled']iv>
)

/* ═══════════════════════════════════════════════════════════════════════════
   1. 元件總覽
   ═══════════════════════════════════════════════════════════════════════════ */

['edit'|'display'|'readonly'|'disabled']xport const Overview = {
  ['edit'|'display'|'readonly'|'disabled']ame: '元件總覽',
  ['edit'|'display'|'readonly'|'disabled']ender: () => (
    <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-8">
      {/* ── A['edit'|'display'|'readonly'|'disabled']atomy: text mode ── */}
      <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-4">
        <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-1">
          <H3>結構（A['edit'|'display'|'readonly'|'disabled']atomy）— plain 模式</H3>
          <D['edit'|'display'|'readonly'|'disabled']sc>display="plain"（預設）。原生 select 純文字 + ChevronDown。可搭配 startIcon 代表 value 的圖示。clearable 有值時出現 clear 按鈕。「plain」表樸素文字呈現,跟 Button variant="text" 區隔(2026-05-01 從 'text' 改名,避免 prop value 跨元件衝突)。</Desc>
        </['edit'|'display'|'readonly'|'disabled']iv>
        <['edit'|'display'|'readonly'|'disabled']iv className="flex gap-8">
          <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-2 items-start">
            <['edit'|'display'|'readonly'|'disabled']pan className="text-[11px] text-fg-muted font-medium">基本</span>
            <['edit'|'display'|'readonly'|'disabled']iv className="inline-flex items-center border-2 border-dashed border-primary/30 rounded-md px-3 py-2.5 gap-2">
              {[{ ['edit'|'display'|'readonly'|'disabled']ame: 'select （文字）', color: 'success' }, { name: 'select （文字）', color: 'magenta' }].map((s) => (
                <['edit'|'display'|'readonly'|'disabled']pan key={s.name} className="rounded px-2 py-1 text-[11px] font-mono border border-dashed"
                  ['edit'|'display'|'readonly'|'disabled']tyle={{ borderColor: `var(--${s.color})`, backgroundColor: `var(--${s.color}-subtle)`, color: `var(--${s.color})` }}>{s.name}</span>
              ))}
            </['edit'|'display'|'readonly'|'disabled']iv>
          </['edit'|'display'|'readonly'|'disabled']iv>
          <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-2 items-start">
            <['edit'|'display'|'readonly'|'disabled']pan className="text-[11px] text-fg-muted font-medium">startIcon + clearable</span>
            <['edit'|'display'|'readonly'|'disabled']iv className="inline-flex items-center border-2 border-dashed border-primary/30 rounded-md px-3 py-2.5 gap-2">
              {[{ ['edit'|'display'|'readonly'|'disabled']ame: 'startIcon', color: 'info' }, { name: 'startIcon', color: 'success' }, { name: 'startIcon', color: 'warning' }, { name: 'startIcon', color: 'magenta' }].map((s) => (
                <['edit'|'display'|'readonly'|'disabled']pan key={s.name} className="rounded px-2 py-1 text-[11px] font-mono border border-dashed"
                  ['edit'|'display'|'readonly'|'disabled']tyle={{ borderColor: `var(--${s.color})`, backgroundColor: `var(--${s.color}-subtle)`, color: `var(--${s.color})` }}>{s.name}</span>
              ))}
            </['edit'|'display'|'readonly'|'disabled']iv>
          </['edit'|'display'|'readonly'|'disabled']iv>
        </['edit'|'display'|'readonly'|'disabled']iv>
      </['edit'|'display'|'readonly'|'disabled']iv>

      {/* ── A['edit'|'display'|'readonly'|'disabled']atomy: tag mode ── */}
      <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-4">
        <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-1">
          <H3>結構（A['edit'|'display'|'readonly'|'disabled']atomy）— tag 模式</H3>
          <D['edit'|'display'|'readonly'|'disabled']sc>display="tag"。Tag 元件呈現選中值 + 隱藏的原生 select overlay（absolute inset-0 opacity-0）。Tag 設為 pointer-events-none，點擊穿透到底層 select。startIcon 不可用於 tag 模式。</Desc>
        </['edit'|'display'|'readonly'|'disabled']iv>
        <['edit'|'display'|'readonly'|'disabled']iv className="flex gap-8">
          <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-2 items-start">
            <['edit'|'display'|'readonly'|'disabled']pan className="text-[11px] text-fg-muted font-medium">edit</span>
            <['edit'|'display'|'readonly'|'disabled']iv className="inline-flex items-center border-2 border-dashed border-primary/30 rounded-md px-3 py-2.5 gap-2">
              {[{ ['edit'|'display'|'readonly'|'disabled']ame: 'Tag', color: 'turquoise' }, { name: 'Tag', color: 'success' }, { name: 'Tag', color: 'info' }, { name: 'Tag', color: 'magenta' }].map((s) => (
                <['edit'|'display'|'readonly'|'disabled']pan key={s.name} className="rounded px-2 py-1 text-[11px] font-mono border border-dashed"
                  ['edit'|'display'|'readonly'|'disabled']tyle={{ borderColor: `var(--${s.color})`, backgroundColor: `var(--${s.color}-subtle)`, color: `var(--${s.color})` }}>{s.name}</span>
              ))}
            </['edit'|'display'|'readonly'|'disabled']iv>
            <['edit'|'display'|'readonly'|'disabled']pan className="text-[10px] text-fg-muted font-mono">select: absolute inset-0 opacity-0 · Tag: pointer-events-none</span>
          </['edit'|'display'|'readonly'|'disabled']iv>
          <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-2 items-start">
            <['edit'|'display'|'readonly'|'disabled']pan className="text-[11px] text-fg-muted font-medium">readonly / disabled</span>
            <['edit'|'display'|'readonly'|'disabled']iv className="inline-flex items-center border-2 border-dashed border-primary/30 rounded-md px-3 py-2.5 gap-2">
              <['edit'|'display'|'readonly'|'disabled']pan className="rounded px-2 py-1 text-[11px] font-mono border border-dashed"
                ['edit'|'display'|'readonly'|'disabled']tyle={{ borderColor: 'var(--color-turquoise-6)', backgroundColor: 'var(--color-turquoise-1)', color: 'var(--color-turquoise-6)' }}>Tag</span>
            </['edit'|'display'|'readonly'|'disabled']iv>
            <['edit'|'display'|'readonly'|'disabled']pan className="text-[10px] text-fg-muted font-mono">無 chevron · 無 select overlay · tagPadding 置中</span>
          </['edit'|'display'|'readonly'|'disabled']iv>
        </['edit'|'display'|'readonly'|'disabled']iv>
      </['edit'|'display'|'readonly'|'disabled']iv>

      {/* ── D['edit'|'display'|'readonly'|'disabled']splay prop catalog ── */}
      <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-3">
        <H3>['edit'|'display'|'readonly'|'disabled']isplay 模式一覽</H3>
        <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-2">
          {([
            { ['edit'|'display'|'readonly'|'disabled']isplay: 'plain' as const, desc: '（預設）狀態、類別等純文字選項。原生 select 純文字 + ChevronDown' },
            { ['edit'|'display'|'readonly'|'disabled']isplay: 'tag' as const, desc: '需要視覺標記的選項（顏色標籤、優先級等）。Tag 元件 + 隱藏 select overlay' },
          ]).m['edit'|'display'|'readonly'|'disabled']p(({ display, desc }) => (
            <['edit'|'display'|'readonly'|'disabled']iv key={display} className="flex items-center gap-4">
              <['edit'|'display'|'readonly'|'disabled']iv className="w-52 shrink-0">
                <S['edit'|'display'|'readonly'|'disabled']lect display={display} options={statusOptions} value="active" size="md" />
              </['edit'|'display'|'readonly'|'disabled']iv>
              <['edit'|'display'|'readonly'|'disabled']pan className="text-caption text-fg-secondary">
                <['edit'|'display'|'readonly'|'disabled']pan className="font-mono font-medium">display="{display}"</span> — {desc}
              </['edit'|'display'|'readonly'|'disabled']pan>
            </['edit'|'display'|'readonly'|'disabled']iv>
          ))}
        </['edit'|'display'|'readonly'|'disabled']iv>
      </['edit'|'display'|'readonly'|'disabled']iv>

      {/* ── P['edit'|'display'|'readonly'|'disabled']ops table ── */}
      <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-3">
        <H3>P['edit'|'display'|'readonly'|'disabled']ops</H3>
        <['edit'|'display'|'readonly'|'disabled']iv className="overflow-x-auto">
          <['edit'|'display'|'readonly'|'disabled']able className="text-caption border-collapse">
            <['edit'|'display'|'readonly'|'disabled']head><tr><Th>Prop</Th><Th>Type</Th><Th>Default</Th><Th>說明</Th></tr></thead>
            <['edit'|'display'|'readonly'|'disabled']body>
              {[
                [['edit'|'display'|'readonly'|'disabled']mode', "'edit'|'display'|'readonly'|'disabled'", "'edit'", 'FieldMode 四模式 — edit 可編輯 / display 純展示 / readonly 顯示值不可改 / disabled 灰化'],
                [['edit'|'display'|'readonly'|'disabled']display', "'plain'|'tag'", "'plain'", '顯示模式——plain 純文字，tag 用 Tag 元件呈現'],
                [['edit'|'display'|'readonly'|'disabled']size', "'sm'|'md'|'lg'", "'md'", '尺寸，與 Button 同 size 並排高度一致'],
                [['edit'|'display'|'readonly'|'disabled']options', 'SelectOption[]', '—', '選項列表 { value, label }'],
                [['edit'|'display'|'readonly'|'disabled']value', 'string | null', '—', '目前選中的值'],
                [['edit'|'display'|'readonly'|'disabled']onChange', '(value: string) => void', '—', '值變更回呼'],
                [['edit'|'display'|'readonly'|'disabled']placeholder', 'string', '—', '未選值時的提示文字'],
                [['edit'|'display'|'readonly'|'disabled']clearable', 'boolean', 'false', '有值時顯示 clear 按鈕（僅 edit 模式）'],
                [['edit'|'display'|'readonly'|'disabled']startIcon', 'LucideIcon', '—', '左側 icon，代表 value 的圖示（僅 text 模式）'],
                [['edit'|'display'|'readonly'|'disabled']error', 'boolean', 'false', '紅色邊框 + aria-invalid（僅 edit 模式有視覺效果）'],
                [['edit'|'display'|'readonly'|'disabled']disabled', 'boolean', '—', '原生屬性，自動覆蓋 mode 為 disabled'],
              ].m['edit'|'display'|'readonly'|'disabled']p(([p, t, d, desc]) => (
                <['edit'|'display'|'readonly'|'disabled']r key={p}><Td mono>{p}</Td><Td mono>{t}</Td><Td mono>{d}</Td><Td>{desc}</Td></tr>
              ))}
            </['edit'|'display'|'readonly'|'disabled']body>
          </['edit'|'display'|'readonly'|'disabled']able>
        </['edit'|'display'|'readonly'|'disabled']iv>
      </['edit'|'display'|'readonly'|'disabled']iv>
    </['edit'|'display'|'readonly'|'disabled']iv>
  ),
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. 元件檢閱器 — I['edit'|'display'|'readonly'|'disabled']teractive Inspector
   ═══════════════════════════════════════════════════════════════════════════ */

c['edit'|'display'|'readonly'|'disabled']nst InspectorInner = () => {
  c['edit'|'display'|'readonly'|'disabled']nst [mode, setMode] = useState<ModeKey>('edit')
  c['edit'|'display'|'readonly'|'disabled']nst [display, setDisplay] = useState<DisplayKey>('plain')
  c['edit'|'display'|'readonly'|'disabled']nst [size, setSize] = useState<SizeKey>('md')
  c['edit'|'display'|'readonly'|'disabled']nst [error, setError] = useState(false)
  c['edit'|'display'|'readonly'|'disabled']nst [clearable, setClearable] = useState(false)
  c['edit'|'display'|'readonly'|'disabled']nst [hasStartIcon, setHasStartIcon] = useState(false)
  c['edit'|'display'|'readonly'|'disabled']nst [value, setValue] = useState<string>('active')

  // ['edit'|'display'|'readonly'|'disabled']tartIcon only available in text mode — traced from spec: startIcon 不可用於 tag 模式
  u['edit'|'display'|'readonly'|'disabled']eEffect(() => { if (display === 'tag') setHasStartIcon(false) }, [display])
  // ['edit'|'display'|'readonly'|'disabled']rror only visible in edit mode — traced from field.spec.md: 只在 edit 模式下有視覺效果
  u['edit'|'display'|'readonly'|'disabled']eEffect(() => { if (mode !== 'edit') setError(false) }, [mode])

  c['edit'|'display'|'readonly'|'disabled']nst s = SIZE_SPECS[size]
  c['edit'|'display'|'readonly'|'disabled']nst colors = error ? ERROR_TOKENS.default : TOKEN_MAP[mode].default
  c['edit'|'display'|'readonly'|'disabled']nst isTag = display === 'tag'

  ['edit'|'display'|'readonly'|'disabled']eturn (
    <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-6">
      {/* C['edit'|'display'|'readonly'|'disabled']ntrols */}
      <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-2.5">
        <['edit'|'display'|'readonly'|'disabled']iv className="flex items-center gap-2">
          <['edit'|'display'|'readonly'|'disabled']pan className="text-[11px] text-fg-muted w-16 shrink-0">Mode</span>
          <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-wrap gap-1.5">
            {MODES.m['edit'|'display'|'readonly'|'disabled']p((m) => <Tab key={m} active={mode === m} onClick={() => setMode(m)}>{m}</Tab>)}
          </['edit'|'display'|'readonly'|'disabled']iv>
        </['edit'|'display'|'readonly'|'disabled']iv>
        <['edit'|'display'|'readonly'|'disabled']iv className="flex items-center gap-2">
          <['edit'|'display'|'readonly'|'disabled']pan className="text-[11px] text-fg-muted w-16 shrink-0">Display</span>
          <['edit'|'display'|'readonly'|'disabled']iv className="flex gap-1.5">
            {DISPLAYS.m['edit'|'display'|'readonly'|'disabled']p((d) => <Tab key={d} active={display === d} onClick={() => setDisplay(d)}>{d}</Tab>)}
          </['edit'|'display'|'readonly'|'disabled']iv>
        </['edit'|'display'|'readonly'|'disabled']iv>
        <['edit'|'display'|'readonly'|'disabled']iv className="flex items-center gap-2">
          <['edit'|'display'|'readonly'|'disabled']pan className="text-[11px] text-fg-muted w-16 shrink-0">Size</span>
          <['edit'|'display'|'readonly'|'disabled']iv className="flex gap-1.5">
            {SIZES.m['edit'|'display'|'readonly'|'disabled']p((sz) => <Tab key={sz} active={size === sz} onClick={() => setSize(sz)}>{sz}</Tab>)}
          </['edit'|'display'|'readonly'|'disabled']iv>
        </['edit'|'display'|'readonly'|'disabled']iv>
        <['edit'|'display'|'readonly'|'disabled']iv className="flex items-center gap-2">
          <['edit'|'display'|'readonly'|'disabled']pan className="text-[11px] text-fg-muted w-16 shrink-0">Error</span>
          <['edit'|'display'|'readonly'|'disabled']iv className="flex gap-1.5">
            <T['edit'|'display'|'readonly'|'disabled']b active={!error} onClick={() => setError(false)}>off</Tab>
            <T['edit'|'display'|'readonly'|'disabled']b active={error} onClick={() => setError(true)} disabled={mode !== 'edit'}>on</Tab>
          </['edit'|'display'|'readonly'|'disabled']iv>
          {m['edit'|'display'|'readonly'|'disabled']de !== 'edit' && <span className="text-[11px] text-fg-muted">僅 edit 模式有效</span>}
        </['edit'|'display'|'readonly'|'disabled']iv>
        <['edit'|'display'|'readonly'|'disabled']iv className="flex items-center gap-2">
          <['edit'|'display'|'readonly'|'disabled']pan className="text-[11px] text-fg-muted w-16 shrink-0">Clearable</span>
          <['edit'|'display'|'readonly'|'disabled']iv className="flex gap-1.5">
            <T['edit'|'display'|'readonly'|'disabled']b active={!clearable} onClick={() => setClearable(false)}>off</Tab>
            <T['edit'|'display'|'readonly'|'disabled']b active={clearable} onClick={() => setClearable(true)}>on</Tab>
          </['edit'|'display'|'readonly'|'disabled']iv>
        </['edit'|'display'|'readonly'|'disabled']iv>
        <['edit'|'display'|'readonly'|'disabled']iv className="flex items-center gap-2">
          <['edit'|'display'|'readonly'|'disabled']pan className="text-[11px] text-fg-muted w-16 shrink-0">startIcon</span>
          <['edit'|'display'|'readonly'|'disabled']iv className="flex gap-1.5">
            <T['edit'|'display'|'readonly'|'disabled']b active={!hasStartIcon} onClick={() => setHasStartIcon(false)}>off</Tab>
            <T['edit'|'display'|'readonly'|'disabled']b active={hasStartIcon} onClick={() => setHasStartIcon(true)} disabled={display === 'tag'}>on</Tab>
          </['edit'|'display'|'readonly'|'disabled']iv>
          {['edit'|'display'|'readonly'|'disabled']isplay === 'tag' && <span className="text-[11px] text-fg-muted">tag 模式不支援 startIcon</span>}
        </['edit'|'display'|'readonly'|'disabled']iv>
      </['edit'|'display'|'readonly'|'disabled']iv>

      {/* P['edit'|'display'|'readonly'|'disabled']eview + Panel */}
      <['edit'|'display'|'readonly'|'disabled']iv className="flex gap-6 items-start">
        {/* L['edit'|'display'|'readonly'|'disabled']ft: preview + blueprint */}
        <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-5 min-w-[340px]">
          <['edit'|'display'|'readonly'|'disabled']iv className="px-10 py-8 rounded-lg bg-canvas border border-divider flex items-center justify-center">
            <S['edit'|'display'|'readonly'|'disabled']lect
              m['edit'|'display'|'readonly'|'disabled']de={mode}
              ['edit'|'display'|'readonly'|'disabled']isplay={display}
              ['edit'|'display'|'readonly'|'disabled']ize={size}
              ['edit'|'display'|'readonly'|'disabled']rror={error}
              c['edit'|'display'|'readonly'|'disabled']earable={clearable}
              ['edit'|'display'|'readonly'|'disabled']tartIcon={hasStartIcon ? Flag : undefined}
              ['edit'|'display'|'readonly'|'disabled']ptions={statusOptions}
              v['edit'|'display'|'readonly'|'disabled']lue={value}
              ['edit'|'display'|'readonly'|'disabled']nChange={setValue}
              p['edit'|'display'|'readonly'|'disabled']aceholder="選擇狀態"
              c['edit'|'display'|'readonly'|'disabled']assName="w-52"
            />
          </['edit'|'display'|'readonly'|'disabled']iv>

          {/* B['edit'|'display'|'readonly'|'disabled']ueprint */}
          <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-2">
            {!['edit'|'display'|'readonly'|'disabled']sTag ? (
              /* ── ['edit'|'display'|'readonly'|'disabled']ext mode blueprint ── */
              <>
                <['edit'|'display'|'readonly'|'disabled']iv className="flex items-center gap-4 text-[10px]">
                  {[
                    { c: Z.p['edit'|'display'|'readonly'|'disabled']d, l: '左右內距' },
                    ...(h['edit'|'display'|'readonly'|'disabled']sStartIcon ? [{ c: Z.icon, l: 'startIcon' }] : []),
                    { c: Z.g['edit'|'display'|'readonly'|'disabled']p, l: '元素間距' },
                    { c: Z.['edit'|'display'|'readonly'|'disabled']elect, l: 'Select 文字' },
                    ...(c['edit'|'display'|'readonly'|'disabled']earable && value ? [{ c: Z.action, l: 'Clear' }] : []),
                    { c: Z.['edit'|'display'|'readonly'|'disabled']con, l: 'Chevron' },
                  ].m['edit'|'display'|'readonly'|'disabled']p(({ c, l }) => (
                    <['edit'|'display'|'readonly'|'disabled']pan key={l} className="inline-flex items-center gap-1">
                      <['edit'|'display'|'readonly'|'disabled']pan className="w-2.5 h-2.5 rounded-md" style={{ background: c.bg, border: `1px dashed ${c.border}` }} />
                      <['edit'|'display'|'readonly'|'disabled']pan className="font-medium" style={{ color: c.text }}>{l}</span>
                    </['edit'|'display'|'readonly'|'disabled']pan>
                  ))}
                </['edit'|'display'|'readonly'|'disabled']iv>
                <['edit'|'display'|'readonly'|'disabled']iv className="flex items-center">
                  <['edit'|'display'|'readonly'|'disabled']iv className="flex items-center rounded-md overflow-hidden" style={{ height: 52, outline: `2px solid ${Z.dim.text}22` }}>
                    <BpZ['edit'|'display'|'readonly'|'disabled']ne w={44} color={Z.pad} label={s.pxToken} sub={s.px} />
                    {h['edit'|'display'|'readonly'|'disabled']sStartIcon && <BpZone w={44} color={Z.icon} label={`${s.icon}px`} sub="startIcon" />}
                    {h['edit'|'display'|'readonly'|'disabled']sStartIcon && <BpZone w={32} color={Z.gap} label={s.gapToken} sub={s.gap} />}
                    <BpZ['edit'|'display'|'readonly'|'disabled']ne w={80} color={Z.select} label="flex-1" sub="select 文字" />
                    {c['edit'|'display'|'readonly'|'disabled']earable && value && <BpZone w={36} color={Z.action} label={`${s.icon}px`} sub="clear" />}
                    <BpZ['edit'|'display'|'readonly'|'disabled']ne w={36} color={Z.icon} label={`${s.icon}px`} sub="chevron" />
                    <BpZ['edit'|'display'|'readonly'|'disabled']ne w={44} color={Z.pad} label={s.pxToken} sub={s.px} />
                  </['edit'|'display'|'readonly'|'disabled']iv>
                  <['edit'|'display'|'readonly'|'disabled']iv className="ml-3 flex items-center" style={{ height: 52 }}>
                    <['edit'|'display'|'readonly'|'disabled']vg width="10" height="52" className="shrink-0">
                      <['edit'|'display'|'readonly'|'disabled']ine x1="5" y1="2" x2="5" y2="50" stroke={Z.dim.text} strokeWidth="1" />
                      <['edit'|'display'|'readonly'|'disabled']ine x1="1" y1="2" x2="9" y2="2" stroke={Z.dim.text} strokeWidth="1.5" />
                      <['edit'|'display'|'readonly'|'disabled']ine x1="1" y1="50" x2="9" y2="50" stroke={Z.dim.text} strokeWidth="1.5" />
                    </['edit'|'display'|'readonly'|'disabled']vg>
                    <['edit'|'display'|'readonly'|'disabled']iv className="ml-1.5"><TkVal token={s.heightToken} value={s.height} /></div>
                  </['edit'|'display'|'readonly'|'disabled']iv>
                </['edit'|'display'|'readonly'|'disabled']iv>
              </>
            ) : (
              /* ── ['edit'|'display'|'readonly'|'disabled']ag mode blueprint ── */
              <>
                <['edit'|'display'|'readonly'|'disabled']iv className="flex items-center gap-4 text-[10px]">
                  {[
                    { c: Z.p['edit'|'display'|'readonly'|'disabled']d, l: 'tagPadding' },
                    { c: Z.['edit'|'display'|'readonly'|'disabled']ag, l: 'Tag' },
                    { c: Z.['edit'|'display'|'readonly'|'disabled']elect, l: 'Select (hidden)' },
                    { c: Z.g['edit'|'display'|'readonly'|'disabled']p, l: 'Spacer' },
                    ...(c['edit'|'display'|'readonly'|'disabled']earable && value ? [{ c: Z.action, l: 'Clear' }] : []),
                    { c: Z.['edit'|'display'|'readonly'|'disabled']con, l: 'Chevron' },
                  ].m['edit'|'display'|'readonly'|'disabled']p(({ c, l }) => (
                    <['edit'|'display'|'readonly'|'disabled']pan key={l} className="inline-flex items-center gap-1">
                      <['edit'|'display'|'readonly'|'disabled']pan className="w-2.5 h-2.5 rounded-md" style={{ background: c.bg, border: `1px dashed ${c.border}` }} />
                      <['edit'|'display'|'readonly'|'disabled']pan className="font-medium" style={{ color: c.text }}>{l}</span>
                    </['edit'|'display'|'readonly'|'disabled']pan>
                  ))}
                </['edit'|'display'|'readonly'|'disabled']iv>
                <['edit'|'display'|'readonly'|'disabled']iv className="flex items-center">
                  <['edit'|'display'|'readonly'|'disabled']iv className="flex items-center rounded-md overflow-hidden" style={{ height: 52, outline: `2px solid ${Z.dim.text}22` }}>
                    <BpZ['edit'|'display'|'readonly'|'disabled']ne w={44} color={Z.pad} label="tagPad" sub="calc()" />
                    <BpZ['edit'|'display'|'readonly'|'disabled']ne w={56} color={Z.tag} label="Tag" sub={s.tagHeight} />
                    <BpZ['edit'|'display'|'readonly'|'disabled']ne w={40} color={Z.select} label="select" sub="hidden" />
                    <BpZ['edit'|'display'|'readonly'|'disabled']ne w={36} color={Z.gap} label="flex-1" sub="spacer" />
                    {c['edit'|'display'|'readonly'|'disabled']earable && value && <BpZone w={36} color={Z.action} label={`${s.icon}px`} sub="clear" />}
                    <BpZ['edit'|'display'|'readonly'|'disabled']ne w={36} color={Z.icon} label={`${s.icon}px`} sub="chevron" />
                    <BpZ['edit'|'display'|'readonly'|'disabled']ne w={44} color={Z.pad} label="12px" sub="pR fixed" />
                  </['edit'|'display'|'readonly'|'disabled']iv>
                  <['edit'|'display'|'readonly'|'disabled']iv className="ml-3 flex items-center" style={{ height: 52 }}>
                    <['edit'|'display'|'readonly'|'disabled']vg width="10" height="52" className="shrink-0">
                      <['edit'|'display'|'readonly'|'disabled']ine x1="5" y1="2" x2="5" y2="50" stroke={Z.dim.text} strokeWidth="1" />
                      <['edit'|'display'|'readonly'|'disabled']ine x1="1" y1="2" x2="9" y2="2" stroke={Z.dim.text} strokeWidth="1.5" />
                      <['edit'|'display'|'readonly'|'disabled']ine x1="1" y1="50" x2="9" y2="50" stroke={Z.dim.text} strokeWidth="1.5" />
                    </['edit'|'display'|'readonly'|'disabled']vg>
                    <['edit'|'display'|'readonly'|'disabled']iv className="ml-1.5"><TkVal token={s.heightToken} value={s.height} /></div>
                  </['edit'|'display'|'readonly'|'disabled']iv>
                </['edit'|'display'|'readonly'|'disabled']iv>
              </>
            )}
            <p c['edit'|'display'|'readonly'|'disabled']assName="text-[10px] text-fg-muted">寬度為示意比例，實際由內容決定</p>
          </['edit'|'display'|'readonly'|'disabled']iv>
        </['edit'|'display'|'readonly'|'disabled']iv>

        {/* R['edit'|'display'|'readonly'|'disabled']ght: inspect panel */}
        <['edit'|'display'|'readonly'|'disabled']iv className="w-[300px] shrink-0 border border-divider rounded-lg bg-surface overflow-hidden">
          <['edit'|'display'|'readonly'|'disabled']iv className="px-4 py-2.5 border-b border-divider bg-neutral-hover">
            <['edit'|'display'|'readonly'|'disabled']pan className="text-[12px] font-semibold text-foreground">Inspect</span>
          </['edit'|'display'|'readonly'|'disabled']iv>

          {/* COLOR */}
          <['edit'|'display'|'readonly'|'disabled']iv className="px-4 py-1">
            <['edit'|'display'|'readonly'|'disabled']iv className="py-2 border-b border-divider"><span className="text-[10px] font-semibold text-fg-muted uppercase tracking-wider">Color</span></div>
            <P['edit'|'display'|'readonly'|'disabled']opRow label="Fill"><TokenValue value={colors.bg} /></PropRow>
            <P['edit'|'display'|'readonly'|'disabled']opRow label="Text"><TokenValue value={colors.text} /></PropRow>
            <P['edit'|'display'|'readonly'|'disabled']opRow label="Stroke"><TokenValue value={colors.border} /></PropRow>
            <P['edit'|'display'|'readonly'|'disabled']opRow label="Icon"><TokenValue value={colors.icon} /></PropRow>
          </['edit'|'display'|'readonly'|'disabled']iv>

          {/* LAYOUT */}
          <['edit'|'display'|'readonly'|'disabled']iv className="px-4 py-1">
            <['edit'|'display'|'readonly'|'disabled']iv className="py-2 border-b border-divider"><span className="text-[10px] font-semibold text-fg-muted uppercase tracking-wider">Layout</span></div>
            <P['edit'|'display'|'readonly'|'disabled']opRow label="高度" dot={Z.dim.text}><TkVal token={s.heightToken} value={s.height} /></PropRow>
            {['edit'|'display'|'readonly'|'disabled']sTag ? (
              <>
                <P['edit'|'display'|'readonly'|'disabled']opRow label="tagPadding" dot={Z.pad.text}><TkVal token="calc()" value={s.tagPaddingFormula} /></PropRow>
                <P['edit'|'display'|'readonly'|'disabled']opRow label="右側 pR"><TkVal token="0.75rem" value="12px" /></PropRow>
                <P['edit'|'display'|'readonly'|'disabled']opRow label="Tag 高度" dot={Z.tag.text}>{s.tagHeight}</PropRow>
              </>
            ) : (
              <P['edit'|'display'|'readonly'|'disabled']opRow label="左右內距" dot={Z.pad.text}><TkVal token={s.pxToken} value={s.px} /></PropRow>
            )}
            <P['edit'|'display'|'readonly'|'disabled']opRow label="元素間距" dot={Z.gap.text}><TkVal token={s.gapToken} value={s.gap} /></PropRow>
            <P['edit'|'display'|'readonly'|'disabled']opRow label="Icon 尺寸" dot={Z.icon.text}>{s.icon}px</PropRow>
          </['edit'|'display'|'readonly'|'disabled']iv>

          {/* TYPOGRAPHY */}
          <['edit'|'display'|'readonly'|'disabled']iv className="px-4 py-1">
            <['edit'|'display'|'readonly'|'disabled']iv className="py-2 border-b border-divider"><span className="text-[10px] font-semibold text-fg-muted uppercase tracking-wider">Typography</span></div>
            <P['edit'|'display'|'readonly'|'disabled']opRow label="Font"><TkVal token={s.fontToken} value={s.font} /></PropRow>
            <P['edit'|'display'|'readonly'|'disabled']opRow label="Weight"><TkVal token="font-normal" value="400" /></PropRow>
          </['edit'|'display'|'readonly'|'disabled']iv>

          {/* STYLE */}
          <['edit'|'display'|'readonly'|'disabled']iv className="px-4 py-1 pb-3">
            <['edit'|'display'|'readonly'|'disabled']iv className="py-2 border-b border-divider"><span className="text-[10px] font-semibold text-fg-muted uppercase tracking-wider">Style</span></div>
            <P['edit'|'display'|'readonly'|'disabled']opRow label="Radius"><TkVal token="rounded-md" value="4px" /></PropRow>
            <P['edit'|'display'|'readonly'|'disabled']opRow label="Border"><TkVal token="border" value="1px solid" /></PropRow>
            <P['edit'|'display'|'readonly'|'disabled']opRow label="Focus"><TkVal token="border-primary" value="1px (no ring)" /></PropRow>
          </['edit'|'display'|'readonly'|'disabled']iv>
        </['edit'|'display'|'readonly'|'disabled']iv>
      </['edit'|'display'|'readonly'|'disabled']iv>
    </['edit'|'display'|'readonly'|'disabled']iv>
  )
}

['edit'|'display'|'readonly'|'disabled']xport const Inspector = {
  ['edit'|'display'|'readonly'|'disabled']ame: '元件檢閱器',
  ['edit'|'display'|'readonly'|'disabled']ender: () => (
    <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-4">
      <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-1">
        <H3>元件檢閱器</H3>
        <D['edit'|'display'|'readonly'|'disabled']sc>選擇任意組合，即時查看所有 token。開發只需確認 token 正確——theme / density 的值解析由系統處理。</Desc>
      </['edit'|'display'|'readonly'|'disabled']iv>
      <I['edit'|'display'|'readonly'|'disabled']spectorInner />
    </['edit'|'display'|'readonly'|'disabled']iv>
  ),
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. 色彩對照表 — M['edit'|'display'|'readonly'|'disabled']de × State Token Matrix
   ═══════════════════════════════════════════════════════════════════════════ */

c['edit'|'display'|'readonly'|'disabled']nst COLOR_STATES: StateKey[] = ['default', 'hover', 'focus', 'disabled']

['edit'|'display'|'readonly'|'disabled']xport const ColorMatrix = {
  ['edit'|'display'|'readonly'|'disabled']ame: '色彩對照表',
  ['edit'|'display'|'readonly'|'disabled']ender: () => (
    <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-8">
      <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-1">
        <H3>M['edit'|'display'|'readonly'|'disabled']de x State 色彩對照</H3>
        <D['edit'|'display'|'readonly'|'disabled']sc>text 和 tag 模式共用同一組 wrapper 色彩 token（來自 fieldWrapperStyles）。差異在 tag 模式的 Tag 元件有自己的色彩（由 Tag variant 決定）。色塊即時渲染，切 dark mode 自動更新。</Desc>
      </['edit'|'display'|'readonly'|'disabled']iv>

      {/* ── N['edit'|'display'|'readonly'|'disabled']rmal: mode x state ── */}
      <['edit'|'display'|'readonly'|'disabled']iv className="overflow-x-auto">
        <['edit'|'display'|'readonly'|'disabled']able className="border-collapse">
          <['edit'|'display'|'readonly'|'disabled']head><tr><Th>Mode</Th>{COLOR_STATES.map((st) => <Th key={st}>{st}</Th>)}</tr></thead>
          <['edit'|'display'|'readonly'|'disabled']body>
            {MODES.m['edit'|'display'|'readonly'|'disabled']p((m) => (
              <['edit'|'display'|'readonly'|'disabled']r key={m}>
                <['edit'|'display'|'readonly'|'disabled']d className="p-3 border-b border-divider font-mono text-caption font-medium align-top">{m}</td>
                {COLOR_STATES.m['edit'|'display'|'readonly'|'disabled']p((st) => {
                  c['edit'|'display'|'readonly'|'disabled']nst stateKey = m === 'disabled' ? 'disabled' : st
                  c['edit'|'display'|'readonly'|'disabled']nst resolvedMode = m === 'disabled' ? 'disabled' : m
                  ['edit'|'display'|'readonly'|'disabled']eturn (
                    <['edit'|'display'|'readonly'|'disabled']d key={st} className="p-3 border-b border-divider align-top min-w-[180px]">
                      <S['edit'|'display'|'readonly'|'disabled']lect
                        m['edit'|'display'|'readonly'|'disabled']de={resolvedMode}
                        ['edit'|'display'|'readonly'|'disabled']ptions={statusOptions}
                        v['edit'|'display'|'readonly'|'disabled']lue="active"
                        ['edit'|'display'|'readonly'|'disabled']ize="sm"
                        ['edit'|'display'|'readonly'|'disabled']isabled={m === 'disabled'}
                      />
                      <T['edit'|'display'|'readonly'|'disabled']kenAnnotation colors={TOKEN_MAP[resolvedMode][stateKey]} />
                    </['edit'|'display'|'readonly'|'disabled']d>
                  )
                })}
              </['edit'|'display'|'readonly'|'disabled']r>
            ))}
          </['edit'|'display'|'readonly'|'disabled']body>
        </['edit'|'display'|'readonly'|'disabled']able>
      </['edit'|'display'|'readonly'|'disabled']iv>

      {/* ── E['edit'|'display'|'readonly'|'disabled']ror state (edit only) ── */}
      <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-2">
        <['edit'|'display'|'readonly'|'disabled']pan className="text-caption font-medium text-fg-secondary">error = true（僅 edit 模式有視覺效果）</span>
        <['edit'|'display'|'readonly'|'disabled']iv className="overflow-x-auto">
          <['edit'|'display'|'readonly'|'disabled']able className="border-collapse">
            <['edit'|'display'|'readonly'|'disabled']head><tr><Th>State</Th>{(['default', 'hover', 'focus'] as const).map((st) => <Th key={st}>{st}</Th>)}</tr></thead>
            <['edit'|'display'|'readonly'|'disabled']body>
              <['edit'|'display'|'readonly'|'disabled']r>
                <['edit'|'display'|'readonly'|'disabled']d className="p-3 border-b border-divider font-mono text-caption font-medium align-top">edit + error</td>
                {([['edit'|'display'|'readonly'|'disabled']default', 'hover', 'focus'] as const).map((st) => (
                  <['edit'|'display'|'readonly'|'disabled']d key={st} className="p-3 border-b border-divider align-top min-w-[180px]">
                    <S['edit'|'display'|'readonly'|'disabled']lect options={statusOptions} value="active" size="sm" error />
                    <T['edit'|'display'|'readonly'|'disabled']kenAnnotation colors={ERROR_TOKENS[st]} />
                  </['edit'|'display'|'readonly'|'disabled']d>
                ))}
              </['edit'|'display'|'readonly'|'disabled']r>
            </['edit'|'display'|'readonly'|'disabled']body>
          </['edit'|'display'|'readonly'|'disabled']able>
        </['edit'|'display'|'readonly'|'disabled']iv>
      </['edit'|'display'|'readonly'|'disabled']iv>

      {/* ── T['edit'|'display'|'readonly'|'disabled']g mode color comparison ── */}
      <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-3">
        <['edit'|'display'|'readonly'|'disabled']pan className="text-caption font-medium text-fg-secondary">text vs tag 模式色彩差異</span>
        <D['edit'|'display'|'readonly'|'disabled']sc>wrapper 色彩相同，tag 模式的 Tag 元件有自己的底色和文字色（bg-muted + text-foreground）。disabled 時 Tag 文字色變為 fg-disabled。</Desc>
        <['edit'|'display'|'readonly'|'disabled']iv className="overflow-x-auto">
          <['edit'|'display'|'readonly'|'disabled']able className="border-collapse">
            <['edit'|'display'|'readonly'|'disabled']head><tr><Th>Mode</Th><Th>text 模式</Th><Th>tag 模式</Th><Th>差異說明</Th></tr></thead>
            <['edit'|'display'|'readonly'|'disabled']body>
              {MODES.m['edit'|'display'|'readonly'|'disabled']p((m) => (
                <['edit'|'display'|'readonly'|'disabled']r key={m}>
                  <T['edit'|'display'|'readonly'|'disabled'] mono>{m}</Td>
                  <T['edit'|'display'|'readonly'|'disabled']>
                    <S['edit'|'display'|'readonly'|'disabled']lect mode={m} display="plain" options={statusOptions} value="active" size="sm" disabled={m === 'disabled'} />
                  </T['edit'|'display'|'readonly'|'disabled']>
                  <T['edit'|'display'|'readonly'|'disabled']>
                    <S['edit'|'display'|'readonly'|'disabled']lect mode={m} display="tag" options={statusOptions} value="active" size="sm" disabled={m === 'disabled'} />
                  </T['edit'|'display'|'readonly'|'disabled']>
                  <T['edit'|'display'|'readonly'|'disabled']>
                    {m === ['edit'|'display'|'readonly'|'disabled']edit' && 'Wrapper 相同。Tag 用 Tag 元件色彩（bg-muted + text-foreground）'}
                    {m === ['edit'|'display'|'readonly'|'disabled']readonly' && 'Wrapper 相同（bg-disabled）。Tag 用 tagPadding 置中'}
                    {m === ['edit'|'display'|'readonly'|'disabled']disabled' && 'Wrapper 相同。Tag 文字色 fg-disabled + 背景 bg-disabled'}
                  </T['edit'|'display'|'readonly'|'disabled']>
                </['edit'|'display'|'readonly'|'disabled']r>
              ))}
            </['edit'|'display'|'readonly'|'disabled']body>
          </['edit'|'display'|'readonly'|'disabled']able>
        </['edit'|'display'|'readonly'|'disabled']iv>
      </['edit'|'display'|'readonly'|'disabled']iv>
    </['edit'|'display'|'readonly'|'disabled']iv>
  ),
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. 尺寸對照表 — S['edit'|'display'|'readonly'|'disabled']ze Token Comparison
   ═══════════════════════════════════════════════════════════════════════════ */

['edit'|'display'|'readonly'|'disabled']xport const SizeMatrix = {
  ['edit'|'display'|'readonly'|'disabled']ame: '尺寸對照表',
  ['edit'|'display'|'readonly'|'disabled']ender: () => (
    <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-8">
      <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-1">
        <H3>S['edit'|'display'|'readonly'|'disabled']ze Token 對照</H3>
        <D['edit'|'display'|'readonly'|'disabled']sc>每個 size 對應的 token 一覽。Field 高度使用 --field-height-* semantic token（rem），與 Button 共用。density 切換由系統自動處理。</Desc>
      </['edit'|'display'|'readonly'|'disabled']iv>

      {/* ── ['edit'|'display'|'readonly'|'disabled']ext mode token table ── */}
      <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-2">
        <['edit'|'display'|'readonly'|'disabled']pan className="text-caption font-medium text-fg-secondary">text 模式</span>
        <['edit'|'display'|'readonly'|'disabled']iv className="overflow-x-auto">
          <['edit'|'display'|'readonly'|'disabled']able className="border-collapse text-caption">
            <['edit'|'display'|'readonly'|'disabled']head><tr>
              <Th>屬性</Th>
              {SIZES.m['edit'|'display'|'readonly'|'disabled']p((sz) => <Th key={sz}>{sz}{sz === 'md' ? '（預設）' : ''}</Th>)}
            </['edit'|'display'|'readonly'|'disabled']r></thead>
            <['edit'|'display'|'readonly'|'disabled']body>
              {([
                { ['edit'|'display'|'readonly'|'disabled']abel: '高度', get: (s: SizeSpec) => ({ token: s.heightToken, sub: s.height }) },
                { ['edit'|'display'|'readonly'|'disabled']abel: '左右內距', get: (s: SizeSpec) => ({ token: s.pxToken, sub: s.px }) },
                { ['edit'|'display'|'readonly'|'disabled']abel: '元素間距', get: (s: SizeSpec) => ({ token: s.gapToken, sub: s.gap }) },
                { ['edit'|'display'|'readonly'|'disabled']abel: '字體', get: (s: SizeSpec) => ({ token: s.fontToken, sub: s.font }) },
                { ['edit'|'display'|'readonly'|'disabled']abel: 'Icon 尺寸', get: (s: SizeSpec) => ({ token: undefined, sub: `${s.icon}px` }) },
              ]).m['edit'|'display'|'readonly'|'disabled']p((row) => (
                <['edit'|'display'|'readonly'|'disabled']r key={row.label}>
                  <T['edit'|'display'|'readonly'|'disabled']>{row.label}</Td>
                  {SIZES.m['edit'|'display'|'readonly'|'disabled']p((sz) => {
                    c['edit'|'display'|'readonly'|'disabled']nst { token, sub } = row.get(SIZE_SPECS[sz])
                    ['edit'|'display'|'readonly'|'disabled']eturn (
                      <T['edit'|'display'|'readonly'|'disabled'] key={sz} mono>
                        {['edit'|'display'|'readonly'|'disabled']oken && <div className="text-fg-secondary">{token}</div>}
                        {['edit'|'display'|'readonly'|'disabled']ub && <div className="text-fg-muted text-[10px]">{sub}</div>}
                      </T['edit'|'display'|'readonly'|'disabled']>
                    )
                  })}
                </['edit'|'display'|'readonly'|'disabled']r>
              ))}
            </['edit'|'display'|'readonly'|'disabled']body>
          </['edit'|'display'|'readonly'|'disabled']able>
        </['edit'|'display'|'readonly'|'disabled']iv>
      </['edit'|'display'|'readonly'|'disabled']iv>

      {/* ── ['edit'|'display'|'readonly'|'disabled']ag mode additional tokens ── */}
      <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-2">
        <['edit'|'display'|'readonly'|'disabled']pan className="text-caption font-medium text-fg-secondary">tag 模式額外 token</span>
        <D['edit'|'display'|'readonly'|'disabled']sc>tag 模式的 padding 用 calc() 公式置中 Tag：px = (field-height - tag-height) / 2。右側 paddingRight 固定 12px（0.75rem）。</Desc>
        <['edit'|'display'|'readonly'|'disabled']iv className="overflow-x-auto">
          <['edit'|'display'|'readonly'|'disabled']able className="border-collapse text-caption">
            <['edit'|'display'|'readonly'|'disabled']head><tr>
              <Th>屬性</Th>
              {SIZES.m['edit'|'display'|'readonly'|'disabled']p((sz) => <Th key={sz}>{sz}</Th>)}
            </['edit'|'display'|'readonly'|'disabled']r></thead>
            <['edit'|'display'|'readonly'|'disabled']body>
              <['edit'|'display'|'readonly'|'disabled']r>
                <T['edit'|'display'|'readonly'|'disabled']>Tag 尺寸</Td>
                {SIZES.m['edit'|'display'|'readonly'|'disabled']p((sz) => (
                  <T['edit'|'display'|'readonly'|'disabled'] key={sz} mono>
                    <['edit'|'display'|'readonly'|'disabled']iv className="text-fg-secondary">{sz === 'sm' ? 'tag-sm' : sz === 'md' ? 'tag-md' : 'tag-lg'}</div>
                    <['edit'|'display'|'readonly'|'disabled']iv className="text-fg-muted text-[10px]">{SIZE_SPECS[sz].tagHeight}</div>
                  </T['edit'|'display'|'readonly'|'disabled']>
                ))}
              </['edit'|'display'|'readonly'|'disabled']r>
              <['edit'|'display'|'readonly'|'disabled']r>
                <T['edit'|'display'|'readonly'|'disabled']>tagPadding (px)</Td>
                {SIZES.m['edit'|'display'|'readonly'|'disabled']p((sz) => (
                  <T['edit'|'display'|'readonly'|'disabled'] key={sz} mono>
                    <['edit'|'display'|'readonly'|'disabled']iv className="text-fg-secondary">calc()</div>
                    <['edit'|'display'|'readonly'|'disabled']iv className="text-fg-muted text-[10px]">{SIZE_SPECS[sz].tagPaddingFormula}</div>
                  </T['edit'|'display'|'readonly'|'disabled']>
                ))}
              </['edit'|'display'|'readonly'|'disabled']r>
              <['edit'|'display'|'readonly'|'disabled']r>
                <T['edit'|'display'|'readonly'|'disabled']>paddingRight</Td>
                {SIZES.m['edit'|'display'|'readonly'|'disabled']p((sz) => (
                  <T['edit'|'display'|'readonly'|'disabled'] key={sz} mono>
                    <['edit'|'display'|'readonly'|'disabled']iv className="text-fg-secondary">0.75rem</div>
                    <['edit'|'display'|'readonly'|'disabled']iv className="text-fg-muted text-[10px]">12px（固定）</div>
                  </T['edit'|'display'|'readonly'|'disabled']>
                ))}
              </['edit'|'display'|'readonly'|'disabled']r>
            </['edit'|'display'|'readonly'|'disabled']body>
          </['edit'|'display'|'readonly'|'disabled']able>
        </['edit'|'display'|'readonly'|'disabled']iv>
      </['edit'|'display'|'readonly'|'disabled']iv>

      {/* ── V['edit'|'display'|'readonly'|'disabled']sual preview: text mode ── */}
      <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-4">
        <['edit'|'display'|'readonly'|'disabled']pan className="text-caption font-medium text-fg-secondary">預覽 — text 模式</span>
        <['edit'|'display'|'readonly'|'disabled']iv className="overflow-x-auto">
          <['edit'|'display'|'readonly'|'disabled']able className="border-collapse">
            <['edit'|'display'|'readonly'|'disabled']head><tr>
              <Th>M['edit'|'display'|'readonly'|'disabled']de</Th>
              {SIZES.m['edit'|'display'|'readonly'|'disabled']p((sz) => <Th key={sz}>{sz}</Th>)}
            </['edit'|'display'|'readonly'|'disabled']r></thead>
            <['edit'|'display'|'readonly'|'disabled']body>
              {MODES.m['edit'|'display'|'readonly'|'disabled']p((m) => (
                <['edit'|'display'|'readonly'|'disabled']r key={m}>
                  <T['edit'|'display'|'readonly'|'disabled'] mono>{m}</Td>
                  {SIZES.m['edit'|'display'|'readonly'|'disabled']p((sz) => (
                    <T['edit'|'display'|'readonly'|'disabled'] key={sz}>
                      <S['edit'|'display'|'readonly'|'disabled']lect mode={m} display="plain" size={sz} options={statusOptions} value="active" disabled={m === 'disabled'} />
                    </T['edit'|'display'|'readonly'|'disabled']>
                  ))}
                </['edit'|'display'|'readonly'|'disabled']r>
              ))}
            </['edit'|'display'|'readonly'|'disabled']body>
          </['edit'|'display'|'readonly'|'disabled']able>
        </['edit'|'display'|'readonly'|'disabled']iv>
      </['edit'|'display'|'readonly'|'disabled']iv>

      {/* ── V['edit'|'display'|'readonly'|'disabled']sual preview: tag mode ── */}
      <['edit'|'display'|'readonly'|'disabled']iv className="flex flex-col gap-4">
        <['edit'|'display'|'readonly'|'disabled']pan className="text-caption font-medium text-fg-secondary">預覽 — tag 模式</span>
        <['edit'|'display'|'readonly'|'disabled']iv className="overflow-x-auto">
          <['edit'|'display'|'readonly'|'disabled']able className="border-collapse">
            <['edit'|'display'|'readonly'|'disabled']head><tr>
              <Th>M['edit'|'display'|'readonly'|'disabled']de</Th>
              {SIZES.m['edit'|'display'|'readonly'|'disabled']p((sz) => <Th key={sz}>{sz}</Th>)}
            </['edit'|'display'|'readonly'|'disabled']r></thead>
            <['edit'|'display'|'readonly'|'disabled']body>
              {MODES.m['edit'|'display'|'readonly'|'disabled']p((m) => (
                <['edit'|'display'|'readonly'|'disabled']r key={m}>
                  <T['edit'|'display'|'readonly'|'disabled'] mono>{m}</Td>
                  {SIZES.m['edit'|'display'|'readonly'|'disabled']p((sz) => (
                    <T['edit'|'display'|'readonly'|'disabled'] key={sz}>
                      <S['edit'|'display'|'readonly'|'disabled']lect mode={m} display="tag" size={sz} options={statusOptions} value="active" disabled={m === 'disabled'} />
                    </T['edit'|'display'|'readonly'|'disabled']>
                  ))}
                </['edit'|'display'|'readonly'|'disabled']r>
              ))}
            </['edit'|'display'|'readonly'|'disabled']body>
          </['edit'|'display'|'readonly'|'disabled']able>
        </['edit'|'display'|'readonly'|'disabled']iv>
      </['edit'|'display'|'readonly'|'disabled']iv>
    </['edit'|'display'|'readonly'|'disabled']iv>
  ),
}

// ── Acc['edit'|'display'|'readonly'|'disabled']ssibility ─────────────────────────────────────────────────────────
// 2026-05-17 ['edit'|'display'|'readonly'|'disabled']hip per audit Dim 13(story-rules.md 6-canonical 含 Accessibility)
['edit'|'display'|'readonly'|'disabled']xport const Accessibility = {
  ['edit'|'display'|'readonly'|'disabled']ame: '無障礙',
  ['edit'|'display'|'readonly'|'disabled']ender: () => (
    <['edit'|'display'|'readonly'|'disabled']iv className="max-w-3xl text-body text-fg-secondary">
      <h3 c['edit'|'display'|'readonly'|'disabled']assName="text-h5 text-foreground mb-2">無障礙設計</h3>
      <p c['edit'|'display'|'readonly'|'disabled']assName="whitespace-pre-line">{"詳 `select.spec.md` 「A11y 預設」段。摘要:\n\n  ARIA / Pattern  :native  <input>  element 預設 a11y;Field wrapper 補  aria-labelledby  /  aria-invalid  /  aria-describedby 。\n\n  Keyboard 行為  :\n\n- Tab — focus\n- 字母鍵 — 輸入\n- Esc — 清空(若 clearable + 有值)\n\n  Focus  :native input focus ring;DS focus-visible ring( focus-visible:!border-primary )由 Field wrapper 提供。\n\n  驗證  :Storybook a11y addon panel 應 0 critical violation;鍵盤完整可操作(無需滑鼠)。WCAG AA contrast ≥ 4.5:1(text)/ 3:1(UI)。"}</p>
    </['edit'|'display'|'readonly'|'disabled']iv>
  ),
}
