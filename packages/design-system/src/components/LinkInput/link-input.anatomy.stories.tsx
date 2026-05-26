//['edit' | 'display' | 'readonly' | 'disabled']@anatomy-rationale:
//['edit' | 'display' | 'readonly' | 'disabled']  StateBehavior covered by Overview「互動流程」段(7 種觸發 → 效果對照)
//['edit' | 'display' | 'readonly' | 'disabled']    + ColorMatrix「edit mode 三狀態 / readonly / disabled / hover 狀態」段。
//['edit' | 'display' | 'readonly' | 'disabled']    LinkInput 的核心狀態是 edit 模式內的 link ↔ input ↔ error 三態切換以及
//['edit' | 'display' | 'readonly' | 'disabled']    mode(edit / readonly / disabled)組合,集中於 ColorMatrix 比拆 5. 更直觀。
['edit' | 'display' | 'readonly' | 'disabled']mport type { Meta } from '@storybook/react'
['edit' | 'display' | 'readonly' | 'disabled']mport { useState, useEffect } from 'react'
['edit' | 'display' | 'readonly' | 'disabled']mport { LinkInput } from './link-input'

c['edit' | 'display' | 'readonly' | 'disabled']nst meta: Meta = {
['edit' | 'display' | 'readonly' | 'disabled'] title: 'Design System/Components/LinkInput/設計規格',
['edit' | 'display' | 'readonly' | 'disabled'] parameters: { layout: 'padded' },
}
['edit' | 'display' | 'readonly' | 'disabled']xport default meta

/*['edit' | 'display' | 'readonly' | 'disabled']═══════════════════════════════════════════════════════════════════════════
['edit' | 'display' | 'readonly' | 'disabled']  Types & Data
['edit' | 'display' | 'readonly' | 'disabled']  ═══════════════════════════════════════════════════════════════════════════ */

['edit' | 'display' | 'readonly' | 'disabled']ype ModeKey = 'edit' | 'display' | 'readonly' | 'disabled'
['edit' | 'display' | 'readonly' | 'disabled']ype EditStateKey = 'link' | 'input' | 'error'
['edit' | 'display' | 'readonly' | 'disabled']ype SizeKey = 'sm' | 'md' | 'lg'
['edit' | 'display' | 'readonly' | 'disabled']ype ColorSpec = { bg: string; text: string; border: string }

c['edit' | 'display' | 'readonly' | 'disabled']nst MODES: ModeKey[] = ['edit', 'readonly', 'disabled']
c['edit' | 'display' | 'readonly' | 'disabled']nst EDIT_STATES: EditStateKey[] = ['link', 'input', 'error']
c['edit' | 'display' | 'readonly' | 'disabled']nst SIZES: SizeKey[] = ['sm', 'md', 'lg']

/*['edit' | 'display' | 'readonly' | 'disabled']── Mode × EditState color tokens ── */

['edit' | 'display' | 'readonly' | 'disabled']nterface ModeStateColors {
['edit' | 'display' | 'readonly' | 'disabled'] wrapper: ColorSpec
['edit' | 'display' | 'readonly' | 'disabled'] value: string
['edit' | 'display' | 'readonly' | 'disabled'] placeholder: string
['edit' | 'display' | 'readonly' | 'disabled'] pencil: string
['edit' | 'display' | 'readonly' | 'disabled'] pencilHover: string
}

c['edit' | 'display' | 'readonly' | 'disabled']nst COLOR_MAP: Record<ModeKey, Partial<Record<EditStateKey, ModeStateColors>>> = {
['edit' | 'display' | 'readonly' | 'disabled'] edit: {
['edit' | 'display' | 'readonly' | 'disabled']   link: {
['edit' | 'display' | 'readonly' | 'disabled']     wrapper: { bg: '--surface', text: '--foreground', border: '--border' },
['edit' | 'display' | 'readonly' | 'disabled']     value: '--primary',
['edit' | 'display' | 'readonly' | 'disabled']     placeholder: '--fg-muted',
['edit' | 'display' | 'readonly' | 'disabled']     pencil: '--fg-muted',
['edit' | 'display' | 'readonly' | 'disabled']     pencilHover: '--foreground',
['edit' | 'display' | 'readonly' | 'disabled']   },
['edit' | 'display' | 'readonly' | 'disabled']   input: {
['edit' | 'display' | 'readonly' | 'disabled']     wrapper: { bg: '--surface', text: '--foreground', border: '--border' },
['edit' | 'display' | 'readonly' | 'disabled']     value: '--foreground',
['edit' | 'display' | 'readonly' | 'disabled']     placeholder: '--fg-muted',
['edit' | 'display' | 'readonly' | 'disabled']     pencil: '—',
['edit' | 'display' | 'readonly' | 'disabled']     pencilHover: '—',
['edit' | 'display' | 'readonly' | 'disabled']   },
['edit' | 'display' | 'readonly' | 'disabled']   error: {
['edit' | 'display' | 'readonly' | 'disabled']     wrapper: { bg: '--surface', text: '--foreground', border: '--error' },
['edit' | 'display' | 'readonly' | 'disabled']     value: '--foreground',
['edit' | 'display' | 'readonly' | 'disabled']     placeholder: '--fg-muted',
['edit' | 'display' | 'readonly' | 'disabled']     pencil: '—',
['edit' | 'display' | 'readonly' | 'disabled']     pencilHover: '—',
['edit' | 'display' | 'readonly' | 'disabled']   },
['edit' | 'display' | 'readonly' | 'disabled'] },
['edit' | 'display' | 'readonly' | 'disabled'] readonly: {
['edit' | 'display' | 'readonly' | 'disabled']   link: {
['edit' | 'display' | 'readonly' | 'disabled']     wrapper: { bg: '--bg-disabled', text: '--foreground', border: 'transparent' },
['edit' | 'display' | 'readonly' | 'disabled']     value: '--primary',
['edit' | 'display' | 'readonly' | 'disabled']     placeholder: '--fg-muted',
['edit' | 'display' | 'readonly' | 'disabled']     pencil: '—',
['edit' | 'display' | 'readonly' | 'disabled']     pencilHover: '—',
['edit' | 'display' | 'readonly' | 'disabled']   },
['edit' | 'display' | 'readonly' | 'disabled'] },
['edit' | 'display' | 'readonly' | 'disabled'] disabled: {
['edit' | 'display' | 'readonly' | 'disabled']   link: {
['edit' | 'display' | 'readonly' | 'disabled']     wrapper: { bg: '--bg-disabled', text: '--fg-disabled', border: 'transparent' },
['edit' | 'display' | 'readonly' | 'disabled']     value: '--fg-disabled',
['edit' | 'display' | 'readonly' | 'disabled']     placeholder: '--fg-muted',
['edit' | 'display' | 'readonly' | 'disabled']     pencil: '—',
['edit' | 'display' | 'readonly' | 'disabled']     pencilHover: '—',
['edit' | 'display' | 'readonly' | 'disabled']   },
['edit' | 'display' | 'readonly' | 'disabled'] },
}

/*['edit' | 'display' | 'readonly' | 'disabled']── Size specs ── */

['edit' | 'display' | 'readonly' | 'disabled']nterface SizeSpec {
['edit' | 'display' | 'readonly' | 'disabled'] heightToken: string; height: string
['edit' | 'display' | 'readonly' | 'disabled'] pxToken: string; px: number
['edit' | 'display' | 'readonly' | 'disabled'] gapToken: string; gap: number
['edit' | 'display' | 'readonly' | 'disabled'] fontToken: string; font: string
['edit' | 'display' | 'readonly' | 'disabled'] icon: number
['edit' | 'display' | 'readonly' | 'disabled'] actionHover: number
}

c['edit' | 'display' | 'readonly' | 'disabled']nst SIZE_SPECS: Record<SizeKey, SizeSpec> = {
['edit' | 'display' | 'readonly' | 'disabled'] sm: { heightToken: 'h-field-sm', height: '28px', pxToken: 'px-3', px: 12, gapToken: 'gap-2', gap: 8, fontToken: 'text-body', font: '14px', icon: 16, actionHover: 18 },
['edit' | 'display' | 'readonly' | 'disabled'] md: { heightToken: 'h-field-md', height: '32px', pxToken: 'px-3', px: 12, gapToken: 'gap-2', gap: 8, fontToken: 'text-body', font: '14px', icon: 16, actionHover: 18 },
['edit' | 'display' | 'readonly' | 'disabled'] lg: { heightToken: 'h-field-lg', height: '36px', pxToken: 'px-3', px: 12, gapToken: 'gap-2', gap: 8, fontToken: 'text-body-lg', font: '16px', icon: 20, actionHover: 22 },
}

/*['edit' | 'display' | 'readonly' | 'disabled']═══════════════════════════════════════════════════════════════════════════
['edit' | 'display' | 'readonly' | 'disabled']  Shared UI Components

['edit' | 'display' | 'readonly' | 'disabled']  NOTE: Kept local (not imported from `_anatomy/anatomy-utils`) because the
['edit' | 'display' | 'readonly' | 'disabled']  Button-family inspector layout diverges visually from the 通用 helpers:
['edit' | 'display' | 'readonly' | 'disabled']  H3 `text-h6 font-semibold` (not `text-body font-bold mb-2`), Desc has no
['edit' | 'display' | 'readonly' | 'disabled']  bottom margin, Th/Td use `p-2 border-b border-divider` row style, and
['edit' | 'display' | 'readonly' | 'disabled']  Swatch defaults to `size="md"` for inline token chips.
['edit' | 'display' | 'readonly' | 'disabled']  ═══════════════════════════════════════════════════════════════════════════ */

c['edit' | 'display' | 'readonly' | 'disabled']nst H3 = ({ children }: { children: React.ReactNode }) => (
['edit' | 'display' | 'readonly' | 'disabled'] <h3 className="text-h6 font-semibold text-foreground">{children}</h3>
)
c['edit' | 'display' | 'readonly' | 'disabled']nst Desc = ({ children }: { children: React.ReactNode }) => (
['edit' | 'display' | 'readonly' | 'disabled'] <p className="text-caption text-fg-muted max-w-[720px]">{children}</p>
)
c['edit' | 'display' | 'readonly' | 'disabled']nst Th = ({ children }: { children: React.ReactNode }) => (
['edit' | 'display' | 'readonly' | 'disabled'] <th className="text-left p-2 border-b border-divider text-fg-muted font-medium text-caption whitespace-nowrap">{children}</th>
)
c['edit' | 'display' | 'readonly' | 'disabled']nst Td = ({ children, mono }: { children: React.ReactNode; mono?: boolean }) => (
['edit' | 'display' | 'readonly' | 'disabled'] <td className={`p-2 border-b border-divider align-top whitespace-nowrap text-caption ${mono ? 'font-mono' : ''}`}>{children}</td>
)

c['edit' | 'display' | 'readonly' | 'disabled']nst TkVal = ({ token, value }: { token: string; value?: string }) => (
['edit' | 'display' | 'readonly' | 'disabled'] <div className="flex flex-col gap-0.5">
['edit' | 'display' | 'readonly' | 'disabled']   <span className="font-mono text-[12px] text-fg-secondary">{token}</span>
['edit' | 'display' | 'readonly' | 'disabled']   {value && <span className="font-mono text-[10px] text-fg-muted">{value}</span>}
['edit' | 'display' | 'readonly' | 'disabled'] </div>
)

c['edit' | 'display' | 'readonly' | 'disabled']nst Swatch = ({ value, size = 'md' }: { value: string; size?: 'sm' | 'md' }) => {
['edit' | 'display' | 'readonly' | 'disabled'] const s = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
['edit' | 'display' | 'readonly' | 'disabled'] if (value === 'transparent' || value === '—') {
['edit' | 'display' | 'readonly' | 'disabled']   return <span className={`${s} rounded-md shrink-0 border border-border`}
['edit' | 'display' | 'readonly' | 'disabled']     style={{ backgroundImage: 'linear-gradient(45deg,#ddd 25%,transparent 25%,transparent 75%,#ddd 75%),linear-gradient(45deg,#ddd 25%,transparent 25%,transparent 75%,#ddd 75%)', backgroundSize: '6px 6px', backgroundPosition: '0 0,3px 3px' }} />
['edit' | 'display' | 'readonly' | 'disabled'] }
['edit' | 'display' | 'readonly' | 'disabled'] return <span className={`${s} rounded-md shrink-0 border border-black/10`} style={{ backgroundColor: `var(${value})` }} />
}

c['edit' | 'display' | 'readonly' | 'disabled']nst TokenAnnotation = ({ colors }: { colors: ColorSpec }) => (
['edit' | 'display' | 'readonly' | 'disabled'] <div className="flex flex-col gap-0.5 mt-2">
['edit' | 'display' | 'readonly' | 'disabled']   {([['bg', 'bg'], ['text', 'text'], ['border', 'bdr']] as const).map(([key, label]) => (
['edit' | 'display' | 'readonly' | 'disabled']     <span key={key} className="inline-flex items-center gap-1 text-[10px]">
['edit' | 'display' | 'readonly' | 'disabled']       <Swatch value={colors[key]} size="sm" />
['edit' | 'display' | 'readonly' | 'disabled']       <span className="text-fg-muted w-5 shrink-0">{label}</span>
['edit' | 'display' | 'readonly' | 'disabled']       <span className="font-mono text-fg-secondary">{colors[key]}</span>
['edit' | 'display' | 'readonly' | 'disabled']     </span>
['edit' | 'display' | 'readonly' | 'disabled']   ))}
['edit' | 'display' | 'readonly' | 'disabled'] </div>
)

c['edit' | 'display' | 'readonly' | 'disabled']nst Tab = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
['edit' | 'display' | 'readonly' | 'disabled'] <button type="button" onClick={onClick}
['edit' | 'display' | 'readonly' | 'disabled']   className={`px-2.5 py-1 text-[12px] font-mono rounded-md cursor-pointer transition-colors ${
['edit' | 'display' | 'readonly' | 'disabled']     active ? 'bg-primary text-white font-semibold' : 'bg-neutral-hover text-fg-secondary hover:bg-neutral-active'
['edit' | 'display' | 'readonly' | 'disabled']   }`}>
['edit' | 'display' | 'readonly' | 'disabled']   {children}
['edit' | 'display' | 'readonly' | 'disabled'] </button>
)

c['edit' | 'display' | 'readonly' | 'disabled']nst PropRow = ({ label, dot, children }: { label: string; dot?: string; children: React.ReactNode }) => (
['edit' | 'display' | 'readonly' | 'disabled'] <div className="flex items-start gap-3 py-2 border-b border-divider last:border-b-0">
['edit' | 'display' | 'readonly' | 'disabled']   <span className="text-[11px] text-fg-muted font-medium w-[72px] shrink-0 pt-0.5 flex items-center gap-1.5">
['edit' | 'display' | 'readonly' | 'disabled']     {dot && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dot }} />}
['edit' | 'display' | 'readonly' | 'disabled']     {label}
['edit' | 'display' | 'readonly' | 'disabled']   </span>
['edit' | 'display' | 'readonly' | 'disabled']   <div className="flex-1 text-[12px] font-mono text-fg-secondary">{children}</div>
['edit' | 'display' | 'readonly' | 'disabled'] </div>
)

c['edit' | 'display' | 'readonly' | 'disabled']nst TokenValue = ({ value }: { value: string }) => (
['edit' | 'display' | 'readonly' | 'disabled'] <span className="inline-flex items-center gap-2"><Swatch value={value} /><span>{value}</span></span>
)

/*['edit' | 'display' | 'readonly' | 'disabled']═══════════════════════════════════════════════════════════════════════════
['edit' | 'display' | 'readonly' | 'disabled']  Blueprint components
['edit' | 'display' | 'readonly' | 'disabled']  ═══════════════════════════════════════════════════════════════════════════ */

c['edit' | 'display' | 'readonly' | 'disabled']nst Z = {
['edit' | 'display' | 'readonly' | 'disabled'] pad:    { bg: 'rgba(194,225,154,0.6)', border: 'rgba(139,179,91,0.9)', text: '#5a7a2e' },
['edit' | 'display' | 'readonly' | 'disabled'] icon:   { bg: 'rgba(166,208,245,0.6)', border: 'rgba(80,145,210,0.9)', text: '#2d6a9f' },
['edit' | 'display' | 'readonly' | 'disabled'] gap:    { bg: 'rgba(253,218,158,0.6)', border: 'rgba(218,165,60,0.9)', text: '#8a6010' },
['edit' | 'display' | 'readonly' | 'disabled'] label:  { bg: 'rgba(199,178,230,0.6)', border: 'rgba(138,103,190,0.9)', text: '#6035a8' },
['edit' | 'display' | 'readonly' | 'disabled'] action: { bg: 'rgba(245,183,183,0.6)', border: 'rgba(210,100,100,0.9)', text: '#a03030' },
['edit' | 'display' | 'readonly' | 'disabled'] dim:    { text: '#d04040' },
}

c['edit' | 'display' | 'readonly' | 'disabled']nst BpZone = ({ w, color, label, sub }: { w: number; color: typeof Z.pad; label: string; sub?: string }) => (
['edit' | 'display' | 'readonly' | 'disabled'] <div className="flex flex-col items-center justify-center shrink-0 gap-0.5"
['edit' | 'display' | 'readonly' | 'disabled']   style={{ width: w, height: '100%', background: color.bg, borderLeft: `1.5px dashed ${color.border}`, borderRight: `1.5px dashed ${color.border}` }}>
['edit' | 'display' | 'readonly' | 'disabled']   <span className="text-[11px] font-mono font-bold leading-none" style={{ color: color.text }}>{label}</span>
['edit' | 'display' | 'readonly' | 'disabled']   {sub && <span className="text-[9px] font-mono leading-none opacity-70" style={{ color: color.text }}>{sub}</span>}
['edit' | 'display' | 'readonly' | 'disabled'] </div>
)

/*['edit' | 'display' | 'readonly' | 'disabled']═══════════════════════════════════════════════════════════════════════════
['edit' | 'display' | 'readonly' | 'disabled']  1. 元件總覽
['edit' | 'display' | 'readonly' | 'disabled']  ═══════════════════════════════════════════════════════════════════════════ */

['edit' | 'display' | 'readonly' | 'disabled']xport const Overview = {
['edit' | 'display' | 'readonly' | 'disabled'] name: '元件總覽',
['edit' | 'display' | 'readonly' | 'disabled'] render: () => (
['edit' | 'display' | 'readonly' | 'disabled']   <div className="flex flex-col gap-8">
['edit' | 'display' | 'readonly' | 'disabled']     <div className="flex flex-col gap-4">
['edit' | 'display' | 'readonly' | 'disabled']       <div className="flex flex-col gap-1">
['edit' | 'display' | 'readonly' | 'disabled']         <H3>結構（Anatomy）</H3>
['edit' | 'display' | 'readonly' | 'disabled']         <Desc>LinkInput 是 URL 輸入與顯示元件。edit 模式在「link 狀態」與「input 狀態」之間切換——有合法 URL 時顯示藍色連結 + Pencil 編輯按鈕；無值或正在編輯時顯示文字輸入框。</Desc>
['edit' | 'display' | 'readonly' | 'disabled']       </div>

['edit' | 'display' | 'readonly' | 'disabled']       <div className="flex gap-8">
['edit' | 'display' | 'readonly' | 'disabled']         {/* Link state anatomy */}
['edit' | 'display' | 'readonly' | 'disabled']         <div className="flex flex-col gap-2 items-start">
['edit' | 'display' | 'readonly' | 'disabled']           <span className="text-[11px] text-fg-muted font-medium">edit — link 狀態</span>
['edit' | 'display' | 'readonly' | 'disabled']           <div className="inline-flex items-center border-2 border-dashed border-primary/30 rounded-md px-3 py-2.5 gap-2">
['edit' | 'display' | 'readonly' | 'disabled']             {[
['edit' | 'display' | 'readonly' | 'disabled']               { name: 'link text', color: 'info' },
['edit' | 'display' | 'readonly' | 'disabled']               { name: 'Pencil action', color: 'error' },
['edit' | 'display' | 'readonly' | 'disabled']             ].map((s) => (
['edit' | 'display' | 'readonly' | 'disabled']               <span key={s.name} className="rounded px-2 py-1 text-[11px] font-mono border border-dashed"
['edit' | 'display' | 'readonly' | 'disabled']                 style={{ borderColor: `var(--${s.color})`, backgroundColor: `var(--${s.color}-subtle)`, color: `var(--${s.color})` }}>{s.name}</span>
['edit' | 'display' | 'readonly' | 'disabled']             ))}
['edit' | 'display' | 'readonly' | 'disabled']           </div>
['edit' | 'display' | 'readonly' | 'disabled']           <span className="text-[10px] text-fg-muted font-mono">text-primary · hover:underline · 點擊開啟連結</span>
['edit' | 'display' | 'readonly' | 'disabled']         </div>

['edit' | 'display' | 'readonly' | 'disabled']         {/* Input state anatomy */}
['edit' | 'display' | 'readonly' | 'disabled']         <div className="flex flex-col gap-2 items-start">
['edit' | 'display' | 'readonly' | 'disabled']           <span className="text-[11px] text-fg-muted font-medium">edit — input 狀態</span>
['edit' | 'display' | 'readonly' | 'disabled']           <div className="inline-flex items-center border-2 border-dashed border-primary/30 rounded-md px-3 py-2.5 gap-2">
['edit' | 'display' | 'readonly' | 'disabled']             {[
['edit' | 'display' | 'readonly' | 'disabled']               { name: 'bareInput', color: 'success' },
['edit' | 'display' | 'readonly' | 'disabled']             ].map((s) => (
['edit' | 'display' | 'readonly' | 'disabled']               <span key={s.name} className="rounded px-2 py-1 text-[11px] font-mono border border-dashed"
['edit' | 'display' | 'readonly' | 'disabled']                 style={{ borderColor: `var(--${s.color})`, backgroundColor: `var(--${s.color}-subtle)`, color: `var(--${s.color})` }}>{s.name}</span>
['edit' | 'display' | 'readonly' | 'disabled']             ))}
['edit' | 'display' | 'readonly' | 'disabled']           </div>
['edit' | 'display' | 'readonly' | 'disabled']           <span className="text-[10px] text-fg-muted font-mono">無值 / 正在編輯 / URL 格式錯誤</span>
['edit' | 'display' | 'readonly' | 'disabled']         </div>

['edit' | 'display' | 'readonly' | 'disabled']         {/* Readonly */}
['edit' | 'display' | 'readonly' | 'disabled']         <div className="flex flex-col gap-2 items-start">
['edit' | 'display' | 'readonly' | 'disabled']           <span className="text-[11px] text-fg-muted font-medium">readonly</span>
['edit' | 'display' | 'readonly' | 'disabled']           <div className="inline-flex items-center border-2 border-dashed border-primary/30 rounded-md px-3 py-2.5">
['edit' | 'display' | 'readonly' | 'disabled']             <span className="rounded px-2 py-1 text-[11px] font-mono border border-dashed"
['edit' | 'display' | 'readonly' | 'disabled']               style={{ borderColor: 'var(--info)', backgroundColor: 'var(--info-subtle)', color: 'var(--info)' }}>link text</span>
['edit' | 'display' | 'readonly' | 'disabled']           </div>
['edit' | 'display' | 'readonly' | 'disabled']           <span className="text-[10px] text-fg-muted font-mono">藍色連結可點擊，無 Pencil</span>
['edit' | 'display' | 'readonly' | 'disabled']         </div>
['edit' | 'display' | 'readonly' | 'disabled']       </div>
['edit' | 'display' | 'readonly' | 'disabled']     </div>

['edit' | 'display' | 'readonly' | 'disabled']     {/* Props table */}
['edit' | 'display' | 'readonly' | 'disabled']     <div className="flex flex-col gap-3">
['edit' | 'display' | 'readonly' | 'disabled']       <H3>Props</H3>
['edit' | 'display' | 'readonly' | 'disabled']       <div className="overflow-x-auto">
['edit' | 'display' | 'readonly' | 'disabled']         <table className="text-caption border-collapse">
['edit' | 'display' | 'readonly' | 'disabled']           <thead><tr><Th>Prop</Th><Th>Type</Th><Th>Default</Th><Th>說明</Th></tr></thead>
['edit' | 'display' | 'readonly' | 'disabled']           <tbody>
['edit' | 'display' | 'readonly' | 'disabled']             {[
['edit' | 'display' | 'readonly' | 'disabled']               ['mode', "'edit' | 'display' | 'readonly' | 'disabled'", "'edit'", '四模式'],
['edit' | 'display' | 'readonly' | 'disabled']               ['size', "'sm' | 'md' | 'lg'", "'md'", '尺寸，與 Button 共用 token'],
['edit' | 'display' | 'readonly' | 'disabled']               ['error', 'boolean', 'false', '錯誤狀態，紅色邊框 + aria-invalid'],
['edit' | 'display' | 'readonly' | 'disabled']               ['value', 'string | null', '—', 'URL 值'],
['edit' | 'display' | 'readonly' | 'disabled']               ['onChange', '(value: string) => void', '—', '值變更回調'],
['edit' | 'display' | 'readonly' | 'disabled']               ['placeholder', 'string', "'https://'", '空值時的佔位文字'],
['edit' | 'display' | 'readonly' | 'disabled']               ['disabled', 'boolean', 'false', '等同 mode="disabled"'],
['edit' | 'display' | 'readonly' | 'disabled']               ['label', 'string', '—', '自訂顯示文字（覆蓋自動 hostname 提取）'],
['edit' | 'display' | 'readonly' | 'disabled']             ].map(([p, t, d, desc]) => (
['edit' | 'display' | 'readonly' | 'disabled']               <tr key={p}><Td mono>{p}</Td><Td mono>{t}</Td><Td mono>{d}</Td><Td>{desc}</Td></tr>
['edit' | 'display' | 'readonly' | 'disabled']             ))}
['edit' | 'display' | 'readonly' | 'disabled']           </tbody>
['edit' | 'display' | 'readonly' | 'disabled']         </table>
['edit' | 'display' | 'readonly' | 'disabled']       </div>
['edit' | 'display' | 'readonly' | 'disabled']     </div>

['edit' | 'display' | 'readonly' | 'disabled']     {/* Interaction flow */}
['edit' | 'display' | 'readonly' | 'disabled']     <div className="flex flex-col gap-3">
['edit' | 'display' | 'readonly' | 'disabled']       <H3>互動流程</H3>
['edit' | 'display' | 'readonly' | 'disabled']       <Desc>edit 模式下的狀態轉換。核心差異：點擊 value 開啟連結，不是進入編輯——編輯由 Pencil 觸發。</Desc>
['edit' | 'display' | 'readonly' | 'disabled']       <div className="overflow-x-auto">
['edit' | 'display' | 'readonly' | 'disabled']         <table className="text-caption border-collapse">
['edit' | 'display' | 'readonly' | 'disabled']           <thead><tr><Th>觸發</Th><Th>效果</Th></tr></thead>
['edit' | 'display' | 'readonly' | 'disabled']           <tbody>
['edit' | 'display' | 'readonly' | 'disabled']             {[
['edit' | 'display' | 'readonly' | 'disabled']               ['點擊 link text', '開啟連結（target="_blank"）'],
['edit' | 'display' | 'readonly' | 'disabled']               ['點擊 Pencil', '切換到 input 狀態，自動 focus'],
['edit' | 'display' | 'readonly' | 'disabled']               ['blur（合法 URL）', '切回 link 狀態，觸發 onChange'],
['edit' | 'display' | 'readonly' | 'disabled']               ['blur（不合法 URL）', '維持 input 狀態 + error 邊框'],
['edit' | 'display' | 'readonly' | 'disabled']               ['blur（空值）', '清除值，顯示 placeholder'],
['edit' | 'display' | 'readonly' | 'disabled']               ['Enter', '等同 blur——觸發驗證'],
['edit' | 'display' | 'readonly' | 'disabled']               ['Escape', '取消編輯，回復原值，不觸發驗證'],
['edit' | 'display' | 'readonly' | 'disabled']             ].map(([trigger, effect]) => (
['edit' | 'display' | 'readonly' | 'disabled']               <tr key={trigger}><Td>{trigger}</Td><Td>{effect}</Td></tr>
['edit' | 'display' | 'readonly' | 'disabled']             ))}
['edit' | 'display' | 'readonly' | 'disabled']           </tbody>
['edit' | 'display' | 'readonly' | 'disabled']         </table>
['edit' | 'display' | 'readonly' | 'disabled']       </div>
['edit' | 'display' | 'readonly' | 'disabled']     </div>
['edit' | 'display' | 'readonly' | 'disabled']   </div>
['edit' | 'display' | 'readonly' | 'disabled'] ),
}

/*['edit' | 'display' | 'readonly' | 'disabled']═══════════════════════════════════════════════════════════════════════════
['edit' | 'display' | 'readonly' | 'disabled']  2. 元件檢閱器
['edit' | 'display' | 'readonly' | 'disabled']  ═══════════════════════════════════════════════════════════════════════════ */

c['edit' | 'display' | 'readonly' | 'disabled']nst InspectorInner = () => {
['edit' | 'display' | 'readonly' | 'disabled'] const [mode, setMode] = useState<ModeKey>('edit')
['edit' | 'display' | 'readonly' | 'disabled'] const [editState, setEditState] = useState<EditStateKey>('link')
['edit' | 'display' | 'readonly' | 'disabled'] const [size, setSize] = useState<SizeKey>('md')

['edit' | 'display' | 'readonly' | 'disabled'] // readonly/disabled only have link state
['edit' | 'display' | 'readonly' | 'disabled'] useEffect(() => {
['edit' | 'display' | 'readonly' | 'disabled']   if (mode !== 'edit') setEditState('link')
['edit' | 'display' | 'readonly' | 'disabled'] }, [mode])

['edit' | 'display' | 'readonly' | 'disabled'] const s = SIZE_SPECS[size]
['edit' | 'display' | 'readonly' | 'disabled'] const colors = COLOR_MAP[mode][editState]
['edit' | 'display' | 'readonly' | 'disabled'] const showPencil = mode === 'edit' && editState === 'link'
['edit' | 'display' | 'readonly' | 'disabled'] const showError = mode === 'edit' && editState === 'error'

['edit' | 'display' | 'readonly' | 'disabled'] return (
['edit' | 'display' | 'readonly' | 'disabled']   <div className="flex flex-col gap-6">
['edit' | 'display' | 'readonly' | 'disabled']     {/* Controls */}
['edit' | 'display' | 'readonly' | 'disabled']     <div className="flex flex-col gap-2.5">
['edit' | 'display' | 'readonly' | 'disabled']       <div className="flex items-center gap-2">
['edit' | 'display' | 'readonly' | 'disabled']         <span className="text-[11px] text-fg-muted w-16 shrink-0">Mode</span>
['edit' | 'display' | 'readonly' | 'disabled']         <div className="flex gap-1.5">
['edit' | 'display' | 'readonly' | 'disabled']           {MODES.map((m) => <Tab key={m} active={mode === m} onClick={() => setMode(m)}>{m}</Tab>)}
['edit' | 'display' | 'readonly' | 'disabled']         </div>
['edit' | 'display' | 'readonly' | 'disabled']       </div>
['edit' | 'display' | 'readonly' | 'disabled']       <div className="flex items-center gap-2">
['edit' | 'display' | 'readonly' | 'disabled']         <span className="text-[11px] text-fg-muted w-16 shrink-0">State</span>
['edit' | 'display' | 'readonly' | 'disabled']         <div className="flex gap-1.5">
['edit' | 'display' | 'readonly' | 'disabled']           {EDIT_STATES.map((st) => (
['edit' | 'display' | 'readonly' | 'disabled']             <Tab key={st} active={editState === st} onClick={() => { if (mode === 'edit') setEditState(st) }}>
['edit' | 'display' | 'readonly' | 'disabled']               {st}
['edit' | 'display' | 'readonly' | 'disabled']             </Tab>
['edit' | 'display' | 'readonly' | 'disabled']           ))}
['edit' | 'display' | 'readonly' | 'disabled']         </div>
['edit' | 'display' | 'readonly' | 'disabled']         {mode !== 'edit' && <span className="text-[11px] text-fg-muted">readonly / disabled 只有 link 狀態</span>}
['edit' | 'display' | 'readonly' | 'disabled']       </div>
['edit' | 'display' | 'readonly' | 'disabled']       <div className="flex items-center gap-2">
['edit' | 'display' | 'readonly' | 'disabled']         <span className="text-[11px] text-fg-muted w-16 shrink-0">Size</span>
['edit' | 'display' | 'readonly' | 'disabled']         <div className="flex gap-1.5">
['edit' | 'display' | 'readonly' | 'disabled']           {SIZES.map((sz) => <Tab key={sz} active={size === sz} onClick={() => setSize(sz)}>{sz}</Tab>)}
['edit' | 'display' | 'readonly' | 'disabled']         </div>
['edit' | 'display' | 'readonly' | 'disabled']       </div>
['edit' | 'display' | 'readonly' | 'disabled']     </div>

['edit' | 'display' | 'readonly' | 'disabled']     {/* Preview + Panel */}
['edit' | 'display' | 'readonly' | 'disabled']     <div className="flex gap-6 items-start">
['edit' | 'display' | 'readonly' | 'disabled']       {/* Left: preview + blueprint */}
['edit' | 'display' | 'readonly' | 'disabled']       <div className="flex flex-col gap-5 min-w-[340px]">
['edit' | 'display' | 'readonly' | 'disabled']         {/* Live preview */}
['edit' | 'display' | 'readonly' | 'disabled']         <div className="px-10 py-8 rounded-lg bg-canvas border border-divider flex items-center justify-center">
['edit' | 'display' | 'readonly' | 'disabled']           <div className="w-64">
['edit' | 'display' | 'readonly' | 'disabled']             {mode === 'edit' && editState === 'link' && (
['edit' | 'display' | 'readonly' | 'disabled']               <LinkInput mode="edit" size={size} value="https://github.com" onChange={() => {}} />
['edit' | 'display' | 'readonly' | 'disabled']             )}
['edit' | 'display' | 'readonly' | 'disabled']             {mode === 'edit' && editState === 'input' && (
['edit' | 'display' | 'readonly' | 'disabled']               <LinkInput mode="edit" size={size} value="" onChange={() => {}} />
['edit' | 'display' | 'readonly' | 'disabled']             )}
['edit' | 'display' | 'readonly' | 'disabled']             {mode === 'edit' && editState === 'error' && (
['edit' | 'display' | 'readonly' | 'disabled']               <LinkInput mode="edit" size={size} value="" onChange={() => {}} error />
['edit' | 'display' | 'readonly' | 'disabled']             )}
['edit' | 'display' | 'readonly' | 'disabled']             {mode === 'readonly' && (
['edit' | 'display' | 'readonly' | 'disabled']               <LinkInput mode="readonly" size={size} value="https://github.com" />
['edit' | 'display' | 'readonly' | 'disabled']             )}
['edit' | 'display' | 'readonly' | 'disabled']             {mode === 'disabled' && (
['edit' | 'display' | 'readonly' | 'disabled']               <LinkInput mode="disabled" size={size} value="https://github.com" />
['edit' | 'display' | 'readonly' | 'disabled']             )}
['edit' | 'display' | 'readonly' | 'disabled']           </div>
['edit' | 'display' | 'readonly' | 'disabled']         </div>

['edit' | 'display' | 'readonly' | 'disabled']         {/* Blueprint */}
['edit' | 'display' | 'readonly' | 'disabled']         <div className="flex flex-col gap-2">
['edit' | 'display' | 'readonly' | 'disabled']           <div className="flex items-center gap-4 text-[10px]">
['edit' | 'display' | 'readonly' | 'disabled']             {[
['edit' | 'display' | 'readonly' | 'disabled']               { c: Z.pad, l: '左右內距' },
['edit' | 'display' | 'readonly' | 'disabled']               ...(showPencil ? [{ c: Z.label, l: 'Link text' }, { c: Z.gap, l: '間距' }, { c: Z.action, l: 'Pencil' }] : [{ c: Z.label, l: 'bareInput' }]),
['edit' | 'display' | 'readonly' | 'disabled']             ].map(({ c, l }) => (
['edit' | 'display' | 'readonly' | 'disabled']               <span key={l} className="inline-flex items-center gap-1">
['edit' | 'display' | 'readonly' | 'disabled']                 <span className="w-2.5 h-2.5 rounded-md" style={{ background: c.bg, border: `1px dashed ${c.border}` }} />
['edit' | 'display' | 'readonly' | 'disabled']                 <span className="font-medium" style={{ color: c.text }}>{l}</span>
['edit' | 'display' | 'readonly' | 'disabled']               </span>
['edit' | 'display' | 'readonly' | 'disabled']             ))}
['edit' | 'display' | 'readonly' | 'disabled']           </div>
['edit' | 'display' | 'readonly' | 'disabled']           <div className="flex items-center">
['edit' | 'display' | 'readonly' | 'disabled']             <div className="flex items-center rounded-md overflow-hidden" style={{ height: 52, outline: `2px solid ${Z.dim.text}22` }}>
['edit' | 'display' | 'readonly' | 'disabled']               <BpZone w={44} color={Z.pad} label={s.pxToken} sub={`${s.px}px`} />
['edit' | 'display' | 'readonly' | 'disabled']               {showPencil ? (
['edit' | 'display' | 'readonly' | 'disabled']                 <>
['edit' | 'display' | 'readonly' | 'disabled']                   <BpZone w={80} color={Z.label} label="link text" sub="flex-1 truncate" />
['edit' | 'display' | 'readonly' | 'disabled']                   <BpZone w={32} color={Z.gap} label={s.gapToken} sub={`${s.gap}px`} />
['edit' | 'display' | 'readonly' | 'disabled']                   <BpZone w={40} color={Z.action} label={`${s.icon}px`} sub="Pencil" />
['edit' | 'display' | 'readonly' | 'disabled']                 </>
['edit' | 'display' | 'readonly' | 'disabled']               ) : (
['edit' | 'display' | 'readonly' | 'disabled']                 <BpZone w={140} color={Z.label} label="bareInput" sub="flex-1 min-w-0" />
['edit' | 'display' | 'readonly' | 'disabled']               )}
['edit' | 'display' | 'readonly' | 'disabled']               <BpZone w={44} color={Z.pad} label={s.pxToken} sub={`${s.px}px`} />
['edit' | 'display' | 'readonly' | 'disabled']             </div>
['edit' | 'display' | 'readonly' | 'disabled']             <div className="ml-3 flex items-center" style={{ height: 52 }}>
['edit' | 'display' | 'readonly' | 'disabled']               <svg width="10" height="52" className="shrink-0">
['edit' | 'display' | 'readonly' | 'disabled']                 <line x1="5" y1="2" x2="5" y2="50" stroke={Z.dim.text} strokeWidth="1" />
['edit' | 'display' | 'readonly' | 'disabled']                 <line x1="1" y1="2" x2="9" y2="2" stroke={Z.dim.text} strokeWidth="1.5" />
['edit' | 'display' | 'readonly' | 'disabled']                 <line x1="1" y1="50" x2="9" y2="50" stroke={Z.dim.text} strokeWidth="1.5" />
['edit' | 'display' | 'readonly' | 'disabled']               </svg>
['edit' | 'display' | 'readonly' | 'disabled']               <div className="ml-1.5"><TkVal token={s.heightToken} value={s.height} /></div>
['edit' | 'display' | 'readonly' | 'disabled']             </div>
['edit' | 'display' | 'readonly' | 'disabled']           </div>
['edit' | 'display' | 'readonly' | 'disabled']           <p className="text-[10px] text-fg-muted">寬度為示意比例，實際由內容決定</p>
['edit' | 'display' | 'readonly' | 'disabled']         </div>
['edit' | 'display' | 'readonly' | 'disabled']       </div>

['edit' | 'display' | 'readonly' | 'disabled']       {/* Right: inspect panel */}
['edit' | 'display' | 'readonly' | 'disabled']       <div className="w-[300px] shrink-0 border border-divider rounded-lg bg-surface overflow-hidden">
['edit' | 'display' | 'readonly' | 'disabled']         <div className="px-4 py-2.5 border-b border-divider bg-neutral-hover">
['edit' | 'display' | 'readonly' | 'disabled']           <span className="text-[12px] font-semibold text-foreground">Inspect</span>
['edit' | 'display' | 'readonly' | 'disabled']         </div>

['edit' | 'display' | 'readonly' | 'disabled']         {/* COLOR */}
['edit' | 'display' | 'readonly' | 'disabled']         {colors && (
['edit' | 'display' | 'readonly' | 'disabled']           <div className="px-4 py-1">
['edit' | 'display' | 'readonly' | 'disabled']             <div className="py-2 border-b border-divider"><span className="text-[10px] font-semibold text-fg-muted uppercase tracking-wider">Color</span></div>
['edit' | 'display' | 'readonly' | 'disabled']             <PropRow label="Fill"><TokenValue value={colors.wrapper.bg} /></PropRow>
['edit' | 'display' | 'readonly' | 'disabled']             <PropRow label="Text"><TokenValue value={colors.value} /></PropRow>
['edit' | 'display' | 'readonly' | 'disabled']             <PropRow label="Stroke"><TokenValue value={colors.wrapper.border} /></PropRow>
['edit' | 'display' | 'readonly' | 'disabled']             {showPencil && (
['edit' | 'display' | 'readonly' | 'disabled']               <>
['edit' | 'display' | 'readonly' | 'disabled']                 <PropRow label="Pencil"><TokenValue value={colors.pencil} /></PropRow>
['edit' | 'display' | 'readonly' | 'disabled']                 <PropRow label="Pencil hov"><TokenValue value={colors.pencilHover} /></PropRow>
['edit' | 'display' | 'readonly' | 'disabled']               </>
['edit' | 'display' | 'readonly' | 'disabled']             )}
['edit' | 'display' | 'readonly' | 'disabled']             {showError && <PropRow label="Error bdr"><TokenValue value="--error" /></PropRow>}
['edit' | 'display' | 'readonly' | 'disabled']             <PropRow label="Placeholder"><TokenValue value={colors.placeholder} /></PropRow>
['edit' | 'display' | 'readonly' | 'disabled']           </div>
['edit' | 'display' | 'readonly' | 'disabled']         )}

['edit' | 'display' | 'readonly' | 'disabled']         {/* LAYOUT */}
['edit' | 'display' | 'readonly' | 'disabled']         <div className="px-4 py-1">
['edit' | 'display' | 'readonly' | 'disabled']           <div className="py-2 border-b border-divider"><span className="text-[10px] font-semibold text-fg-muted uppercase tracking-wider">Layout</span></div>
['edit' | 'display' | 'readonly' | 'disabled']           <PropRow label="高度" dot={Z.dim.text}><TkVal token={s.heightToken} value={s.height} /></PropRow>
['edit' | 'display' | 'readonly' | 'disabled']           <PropRow label="左右內距" dot={Z.pad.text}><TkVal token={s.pxToken} value={`${s.px}px`} /></PropRow>
['edit' | 'display' | 'readonly' | 'disabled']           <PropRow label="元素間距" dot={Z.gap.text}><TkVal token={s.gapToken} value={`${s.gap}px`} /></PropRow>
['edit' | 'display' | 'readonly' | 'disabled']           {showPencil && <PropRow label="Pencil icon" dot={Z.action.text}>{s.icon}px</PropRow>}
['edit' | 'display' | 'readonly' | 'disabled']           {showPencil && <PropRow label="Action hover">{s.actionHover}px (icon+2)</PropRow>}
['edit' | 'display' | 'readonly' | 'disabled']         </div>

['edit' | 'display' | 'readonly' | 'disabled']         {/* TYPOGRAPHY */}
['edit' | 'display' | 'readonly' | 'disabled']         <div className="px-4 py-1">
['edit' | 'display' | 'readonly' | 'disabled']           <div className="py-2 border-b border-divider"><span className="text-[10px] font-semibold text-fg-muted uppercase tracking-wider">Typography</span></div>
['edit' | 'display' | 'readonly' | 'disabled']           <PropRow label="Font"><TkVal token={s.fontToken} value={s.font} /></PropRow>
['edit' | 'display' | 'readonly' | 'disabled']           <PropRow label="Weight"><TkVal token="font-normal" value="400" /></PropRow>
['edit' | 'display' | 'readonly' | 'disabled']         </div>

['edit' | 'display' | 'readonly' | 'disabled']         {/* STYLE */}
['edit' | 'display' | 'readonly' | 'disabled']         <div className="px-4 py-1 pb-3">
['edit' | 'display' | 'readonly' | 'disabled']           <div className="py-2 border-b border-divider"><span className="text-[10px] font-semibold text-fg-muted uppercase tracking-wider">Style</span></div>
['edit' | 'display' | 'readonly' | 'disabled']           <PropRow label="Radius"><TkVal token="rounded-md" value="4px" /></PropRow>
['edit' | 'display' | 'readonly' | 'disabled']           <PropRow label="Border"><TkVal token="border" value="1px solid" /></PropRow>
['edit' | 'display' | 'readonly' | 'disabled']           <PropRow label="Focus"><TkVal token="border-primary" value="1px" /></PropRow>
['edit' | 'display' | 'readonly' | 'disabled']         </div>
['edit' | 'display' | 'readonly' | 'disabled']       </div>
['edit' | 'display' | 'readonly' | 'disabled']     </div>
['edit' | 'display' | 'readonly' | 'disabled']   </div>
['edit' | 'display' | 'readonly' | 'disabled'] )
}

['edit' | 'display' | 'readonly' | 'disabled']xport const Inspector = {
['edit' | 'display' | 'readonly' | 'disabled'] name: '元件檢閱器',
['edit' | 'display' | 'readonly' | 'disabled'] render: () => (
['edit' | 'display' | 'readonly' | 'disabled']   <div className="flex flex-col gap-4">
['edit' | 'display' | 'readonly' | 'disabled']     <div className="flex flex-col gap-1">
['edit' | 'display' | 'readonly' | 'disabled']       <H3>元件檢閱器</H3>
['edit' | 'display' | 'readonly' | 'disabled']       <Desc>選擇 mode / state / size 組合，即時查看所有 token。LinkInput 的 edit mode 有三種內部狀態：link（藍色連結 + Pencil）、input（文字輸入框）、error（紅框）。</Desc>
['edit' | 'display' | 'readonly' | 'disabled']     </div>
['edit' | 'display' | 'readonly' | 'disabled']     <InspectorInner />
['edit' | 'display' | 'readonly' | 'disabled']   </div>
['edit' | 'display' | 'readonly' | 'disabled'] ),
}

/*['edit' | 'display' | 'readonly' | 'disabled']═══════════════════════════════════════════════════════════════════════════
['edit' | 'display' | 'readonly' | 'disabled']  3. 色彩對照表
['edit' | 'display' | 'readonly' | 'disabled']  ═══════════════════════════════════════════════════════════════════════════ */

['edit' | 'display' | 'readonly' | 'disabled']xport const ColorMatrix = {
['edit' | 'display' | 'readonly' | 'disabled'] name: '色彩對照表',
['edit' | 'display' | 'readonly' | 'disabled'] render: () => (
['edit' | 'display' | 'readonly' | 'disabled']   <div className="flex flex-col gap-8">
['edit' | 'display' | 'readonly' | 'disabled']     <div className="flex flex-col gap-1">
['edit' | 'display' | 'readonly' | 'disabled']       <H3>Mode x State 色彩對照</H3>
['edit' | 'display' | 'readonly' | 'disabled']       <Desc>LinkInput 的色彩設計重點：edit-link 狀態的 value 用 text-primary 呈現為可點擊連結；error 狀態的邊框用 border-error。色塊即時渲染，切 dark mode 自動更新。</Desc>
['edit' | 'display' | 'readonly' | 'disabled']     </div>

['edit' | 'display' | 'readonly' | 'disabled']     {/* edit mode — 3 states */}
['edit' | 'display' | 'readonly' | 'disabled']     <div className="flex flex-col gap-3">
['edit' | 'display' | 'readonly' | 'disabled']       <span className="text-caption font-medium text-fg-secondary">edit 模式</span>
['edit' | 'display' | 'readonly' | 'disabled']       <div className="overflow-x-auto">
['edit' | 'display' | 'readonly' | 'disabled']         <table className="border-collapse">
['edit' | 'display' | 'readonly' | 'disabled']           <thead>
['edit' | 'display' | 'readonly' | 'disabled']             <tr>
['edit' | 'display' | 'readonly' | 'disabled']               <Th>State</Th>
['edit' | 'display' | 'readonly' | 'disabled']               <Th>預覽</Th>
['edit' | 'display' | 'readonly' | 'disabled']               <Th>Wrapper</Th>
['edit' | 'display' | 'readonly' | 'disabled']               <Th>Value</Th>
['edit' | 'display' | 'readonly' | 'disabled']               <Th>Pencil</Th>
['edit' | 'display' | 'readonly' | 'disabled']             </tr>
['edit' | 'display' | 'readonly' | 'disabled']           </thead>
['edit' | 'display' | 'readonly' | 'disabled']           <tbody>
['edit' | 'display' | 'readonly' | 'disabled']             {EDIT_STATES.map((st) => {
['edit' | 'display' | 'readonly' | 'disabled']               const c = COLOR_MAP.edit[st]!
['edit' | 'display' | 'readonly' | 'disabled']               return (
['edit' | 'display' | 'readonly' | 'disabled']                 <tr key={st}>
['edit' | 'display' | 'readonly' | 'disabled']                   <Td mono>{st}</Td>
['edit' | 'display' | 'readonly' | 'disabled']                   <td className="p-3 border-b border-divider min-w-[200px]">
['edit' | 'display' | 'readonly' | 'disabled']                     {st === 'link' && <LinkInput mode="edit" value="https://github.com" onChange={() => {}} />}
['edit' | 'display' | 'readonly' | 'disabled']                     {st === 'input' && <LinkInput mode="edit" value="" onChange={() => {}} />}
['edit' | 'display' | 'readonly' | 'disabled']                     {st === 'error' && <LinkInput mode="edit" value="" onChange={() => {}} error />}
['edit' | 'display' | 'readonly' | 'disabled']                   </td>
['edit' | 'display' | 'readonly' | 'disabled']                   <td className="p-3 border-b border-divider align-top">
['edit' | 'display' | 'readonly' | 'disabled']                     <TokenAnnotation colors={c.wrapper} />
['edit' | 'display' | 'readonly' | 'disabled']                   </td>
['edit' | 'display' | 'readonly' | 'disabled']                   <td className="p-3 border-b border-divider align-top">
['edit' | 'display' | 'readonly' | 'disabled']                     <span className="inline-flex items-center gap-1 text-[10px]">
['edit' | 'display' | 'readonly' | 'disabled']                       <Swatch value={c.value} size="sm" />
['edit' | 'display' | 'readonly' | 'disabled']                       <span className="font-mono text-fg-secondary">{c.value}</span>
['edit' | 'display' | 'readonly' | 'disabled']                     </span>
['edit' | 'display' | 'readonly' | 'disabled']                   </td>
['edit' | 'display' | 'readonly' | 'disabled']                   <td className="p-3 border-b border-divider align-top">
['edit' | 'display' | 'readonly' | 'disabled']                     {c.pencil !== '—' ? (
['edit' | 'display' | 'readonly' | 'disabled']                       <div className="flex flex-col gap-0.5">
['edit' | 'display' | 'readonly' | 'disabled']                         <span className="inline-flex items-center gap-1 text-[10px]">
['edit' | 'display' | 'readonly' | 'disabled']                           <Swatch value={c.pencil} size="sm" />
['edit' | 'display' | 'readonly' | 'disabled']                           <span className="font-mono text-fg-secondary">{c.pencil}</span>
['edit' | 'display' | 'readonly' | 'disabled']                           <span className="text-fg-muted">default</span>
['edit' | 'display' | 'readonly' | 'disabled']                         </span>
['edit' | 'display' | 'readonly' | 'disabled']                         <span className="inline-flex items-center gap-1 text-[10px]">
['edit' | 'display' | 'readonly' | 'disabled']                           <Swatch value={c.pencilHover} size="sm" />
['edit' | 'display' | 'readonly' | 'disabled']                           <span className="font-mono text-fg-secondary">{c.pencilHover}</span>
['edit' | 'display' | 'readonly' | 'disabled']                           <span className="text-fg-muted">hover</span>
['edit' | 'display' | 'readonly' | 'disabled']                         </span>
['edit' | 'display' | 'readonly' | 'disabled']                       </div>
['edit' | 'display' | 'readonly' | 'disabled']                     ) : (
['edit' | 'display' | 'readonly' | 'disabled']                       <span className="text-[10px] text-fg-muted">—</span>
['edit' | 'display' | 'readonly' | 'disabled']                     )}
['edit' | 'display' | 'readonly' | 'disabled']                   </td>
['edit' | 'display' | 'readonly' | 'disabled']                 </tr>
['edit' | 'display' | 'readonly' | 'disabled']               )
['edit' | 'display' | 'readonly' | 'disabled']             })}
['edit' | 'display' | 'readonly' | 'disabled']           </tbody>
['edit' | 'display' | 'readonly' | 'disabled']         </table>
['edit' | 'display' | 'readonly' | 'disabled']       </div>
['edit' | 'display' | 'readonly' | 'disabled']     </div>

['edit' | 'display' | 'readonly' | 'disabled']     {/* readonly + disabled */}
['edit' | 'display' | 'readonly' | 'disabled']     <div className="flex flex-col gap-3">
['edit' | 'display' | 'readonly' | 'disabled']       <span className="text-caption font-medium text-fg-secondary">readonly / disabled</span>
['edit' | 'display' | 'readonly' | 'disabled']       <div className="overflow-x-auto">
['edit' | 'display' | 'readonly' | 'disabled']         <table className="border-collapse">
['edit' | 'display' | 'readonly' | 'disabled']           <thead>
['edit' | 'display' | 'readonly' | 'disabled']             <tr>
['edit' | 'display' | 'readonly' | 'disabled']               <Th>Mode</Th>
['edit' | 'display' | 'readonly' | 'disabled']               <Th>預覽</Th>
['edit' | 'display' | 'readonly' | 'disabled']               <Th>Wrapper</Th>
['edit' | 'display' | 'readonly' | 'disabled']               <Th>Value</Th>
['edit' | 'display' | 'readonly' | 'disabled']               <Th>說明</Th>
['edit' | 'display' | 'readonly' | 'disabled']             </tr>
['edit' | 'display' | 'readonly' | 'disabled']           </thead>
['edit' | 'display' | 'readonly' | 'disabled']           <tbody>
['edit' | 'display' | 'readonly' | 'disabled']             {(['readonly', 'disabled'] as const).map((m) => {
['edit' | 'display' | 'readonly' | 'disabled']               const c = COLOR_MAP[m].link!
['edit' | 'display' | 'readonly' | 'disabled']               return (
['edit' | 'display' | 'readonly' | 'disabled']                 <tr key={m}>
['edit' | 'display' | 'readonly' | 'disabled']                   <Td mono>{m}</Td>
['edit' | 'display' | 'readonly' | 'disabled']                   <td className="p-3 border-b border-divider min-w-[200px]">
['edit' | 'display' | 'readonly' | 'disabled']                     <LinkInput mode={m} value="https://github.com" />
['edit' | 'display' | 'readonly' | 'disabled']                   </td>
['edit' | 'display' | 'readonly' | 'disabled']                   <td className="p-3 border-b border-divider align-top">
['edit' | 'display' | 'readonly' | 'disabled']                     <TokenAnnotation colors={c.wrapper} />
['edit' | 'display' | 'readonly' | 'disabled']                   </td>
['edit' | 'display' | 'readonly' | 'disabled']                   <td className="p-3 border-b border-divider align-top">
['edit' | 'display' | 'readonly' | 'disabled']                     <span className="inline-flex items-center gap-1 text-[10px]">
['edit' | 'display' | 'readonly' | 'disabled']                       <Swatch value={c.value} size="sm" />
['edit' | 'display' | 'readonly' | 'disabled']                       <span className="font-mono text-fg-secondary">{c.value}</span>
['edit' | 'display' | 'readonly' | 'disabled']                     </span>
['edit' | 'display' | 'readonly' | 'disabled']                   </td>
['edit' | 'display' | 'readonly' | 'disabled']                   <td className="p-2 border-b border-divider text-caption text-fg-muted">
['edit' | 'display' | 'readonly' | 'disabled']                     {m === 'readonly' ? '藍色連結可點擊，無 Pencil' : '文字灰化，不可點擊'}
['edit' | 'display' | 'readonly' | 'disabled']                   </td>
['edit' | 'display' | 'readonly' | 'disabled']                 </tr>
['edit' | 'display' | 'readonly' | 'disabled']               )
['edit' | 'display' | 'readonly' | 'disabled']             })}
['edit' | 'display' | 'readonly' | 'disabled']           </tbody>
['edit' | 'display' | 'readonly' | 'disabled']         </table>
['edit' | 'display' | 'readonly' | 'disabled']       </div>
['edit' | 'display' | 'readonly' | 'disabled']     </div>

['edit' | 'display' | 'readonly' | 'disabled']     {/* Hover states detail */}
['edit' | 'display' | 'readonly' | 'disabled']     <div className="flex flex-col gap-3">
['edit' | 'display' | 'readonly' | 'disabled']       <span className="text-caption font-medium text-fg-secondary">hover 狀態</span>
['edit' | 'display' | 'readonly' | 'disabled']       <div className="overflow-x-auto">
['edit' | 'display' | 'readonly' | 'disabled']         <table className="border-collapse">
['edit' | 'display' | 'readonly' | 'disabled']           <thead><tr><Th>元素</Th><Th>Default</Th><Th>Hover</Th><Th>Active</Th></tr></thead>
['edit' | 'display' | 'readonly' | 'disabled']           <tbody>
['edit' | 'display' | 'readonly' | 'disabled']             <tr>
['edit' | 'display' | 'readonly' | 'disabled']               <Td>Wrapper border (edit)</Td>
['edit' | 'display' | 'readonly' | 'disabled']               <Td><TokenValue value="--border" /></Td>
['edit' | 'display' | 'readonly' | 'disabled']               <Td><TokenValue value="--border-hover" /></Td>
['edit' | 'display' | 'readonly' | 'disabled']               <Td>—</Td>
['edit' | 'display' | 'readonly' | 'disabled']             </tr>
['edit' | 'display' | 'readonly' | 'disabled']             <tr>
['edit' | 'display' | 'readonly' | 'disabled']               <Td>Link text</Td>
['edit' | 'display' | 'readonly' | 'disabled']               <Td><TokenValue value="--primary" /></Td>
['edit' | 'display' | 'readonly' | 'disabled']               <Td>
['edit' | 'display' | 'readonly' | 'disabled']                 <span className="inline-flex items-center gap-2">
['edit' | 'display' | 'readonly' | 'disabled']                   <TokenValue value="--primary-hover" />
['edit' | 'display' | 'readonly' | 'disabled']                   <span className="text-[10px] text-fg-muted">+ underline</span>
['edit' | 'display' | 'readonly' | 'disabled']                 </span>
['edit' | 'display' | 'readonly' | 'disabled']               </Td>
['edit' | 'display' | 'readonly' | 'disabled']               <Td>—</Td>
['edit' | 'display' | 'readonly' | 'disabled']             </tr>
['edit' | 'display' | 'readonly' | 'disabled']             <tr>
['edit' | 'display' | 'readonly' | 'disabled']               <Td>Pencil icon</Td>
['edit' | 'display' | 'readonly' | 'disabled']               <Td><TokenValue value="--fg-muted" /></Td>
['edit' | 'display' | 'readonly' | 'disabled']               <Td><TokenValue value="--foreground" /></Td>
['edit' | 'display' | 'readonly' | 'disabled']               <Td><TokenValue value="--foreground" /></Td>
['edit' | 'display' | 'readonly' | 'disabled']             </tr>
['edit' | 'display' | 'readonly' | 'disabled']             <tr>
['edit' | 'display' | 'readonly' | 'disabled']               <Td>Pencil bg</Td>
['edit' | 'display' | 'readonly' | 'disabled']               <Td><TokenValue value="transparent" /></Td>
['edit' | 'display' | 'readonly' | 'disabled']               <Td><TokenValue value="--neutral-hover" /></Td>
['edit' | 'display' | 'readonly' | 'disabled']               <Td><TokenValue value="--neutral-active" /></Td>
['edit' | 'display' | 'readonly' | 'disabled']             </tr>
['edit' | 'display' | 'readonly' | 'disabled']             <tr>
['edit' | 'display' | 'readonly' | 'disabled']               <Td>Error border</Td>
['edit' | 'display' | 'readonly' | 'disabled']               <Td><TokenValue value="--error" /></Td>
['edit' | 'display' | 'readonly' | 'disabled']               <Td><TokenValue value="--error-hover" /></Td>
['edit' | 'display' | 'readonly' | 'disabled']               <Td>—</Td>
['edit' | 'display' | 'readonly' | 'disabled']             </tr>
['edit' | 'display' | 'readonly' | 'disabled']           </tbody>
['edit' | 'display' | 'readonly' | 'disabled']         </table>
['edit' | 'display' | 'readonly' | 'disabled']       </div>
['edit' | 'display' | 'readonly' | 'disabled']     </div>
['edit' | 'display' | 'readonly' | 'disabled']   </div>
['edit' | 'display' | 'readonly' | 'disabled'] ),
}

/*['edit' | 'display' | 'readonly' | 'disabled']═══════════════════════════════════════════════════════════════════════════
['edit' | 'display' | 'readonly' | 'disabled']  4. 尺寸對照表
['edit' | 'display' | 'readonly' | 'disabled']  ═══════════════════════════════════════════════════════════════════════════ */

['edit' | 'display' | 'readonly' | 'disabled']xport const SizeMatrix = {
['edit' | 'display' | 'readonly' | 'disabled'] name: '尺寸對照表',
['edit' | 'display' | 'readonly' | 'disabled'] render: () => (
['edit' | 'display' | 'readonly' | 'disabled']   <div className="flex flex-col gap-8">
['edit' | 'display' | 'readonly' | 'disabled']     <div className="flex flex-col gap-1">
['edit' | 'display' | 'readonly' | 'disabled']       <H3>Size Token 對照</H3>
['edit' | 'display' | 'readonly' | 'disabled']       <Desc>每個 size 對應的 token 一覽。高度使用 --field-height-* semantic token，與 Button 共用同一組 token。</Desc>
['edit' | 'display' | 'readonly' | 'disabled']     </div>

['edit' | 'display' | 'readonly' | 'disabled']     {/* Token comparison table */}
['edit' | 'display' | 'readonly' | 'disabled']     <div className="overflow-x-auto">
['edit' | 'display' | 'readonly' | 'disabled']       <table className="border-collapse text-caption">
['edit' | 'display' | 'readonly' | 'disabled']         <thead><tr>
['edit' | 'display' | 'readonly' | 'disabled']           <Th>屬性</Th>
['edit' | 'display' | 'readonly' | 'disabled']           {SIZES.map((sz) => <Th key={sz}>{sz}{sz === 'md' ? '（預設）' : ''}</Th>)}
['edit' | 'display' | 'readonly' | 'disabled']         </tr></thead>
['edit' | 'display' | 'readonly' | 'disabled']         <tbody>
['edit' | 'display' | 'readonly' | 'disabled']           {([
['edit' | 'display' | 'readonly' | 'disabled']             { label: '高度', key: 'heightToken' as const, subKey: 'height' as const },
['edit' | 'display' | 'readonly' | 'disabled']             { label: '左右內距', key: 'pxToken' as const, subFn: (s: SizeSpec) => `${s.px}px` },
['edit' | 'display' | 'readonly' | 'disabled']             { label: '元素間距', key: 'gapToken' as const, subFn: (s: SizeSpec) => `${s.gap}px` },
['edit' | 'display' | 'readonly' | 'disabled']             { label: '字體', key: 'fontToken' as const, subFn: (s: SizeSpec) => s.font },
['edit' | 'display' | 'readonly' | 'disabled']             { label: 'Pencil icon', subFn: (s: SizeSpec) => `${s.icon}px` },
['edit' | 'display' | 'readonly' | 'disabled']             { label: 'Action hover', subFn: (s: SizeSpec) => `${s.actionHover}px (icon+2)` },
['edit' | 'display' | 'readonly' | 'disabled']           ]).map((row) => (
['edit' | 'display' | 'readonly' | 'disabled']             <tr key={row.label}>
['edit' | 'display' | 'readonly' | 'disabled']               <Td>{row.label}</Td>
['edit' | 'display' | 'readonly' | 'disabled']               {SIZES.map((sz) => {
['edit' | 'display' | 'readonly' | 'disabled']                 const spec = SIZE_SPECS[sz]
['edit' | 'display' | 'readonly' | 'disabled']                 const token = row.key ? spec[row.key] as string : undefined
['edit' | 'display' | 'readonly' | 'disabled']                 const sub = 'subKey' in row && row.subKey ? spec[row.subKey] as string : row.subFn?.(spec)
['edit' | 'display' | 'readonly' | 'disabled']                 return (
['edit' | 'display' | 'readonly' | 'disabled']                   <Td key={sz} mono>
['edit' | 'display' | 'readonly' | 'disabled']                     {token && <div className="text-fg-secondary">{token}</div>}
['edit' | 'display' | 'readonly' | 'disabled']                     {sub && <div className="text-fg-muted text-[10px]">{sub}</div>}
['edit' | 'display' | 'readonly' | 'disabled']                   </Td>
['edit' | 'display' | 'readonly' | 'disabled']                 )
['edit' | 'display' | 'readonly' | 'disabled']               })}
['edit' | 'display' | 'readonly' | 'disabled']             </tr>
['edit' | 'display' | 'readonly' | 'disabled']           ))}
['edit' | 'display' | 'readonly' | 'disabled']         </tbody>
['edit' | 'display' | 'readonly' | 'disabled']       </table>
['edit' | 'display' | 'readonly' | 'disabled']     </div>

['edit' | 'display' | 'readonly' | 'disabled']     {/* Visual preview */}
['edit' | 'display' | 'readonly' | 'disabled']     <div className="flex flex-col gap-4">
['edit' | 'display' | 'readonly' | 'disabled']       <span className="text-caption font-medium text-fg-secondary">預覽 — link 狀態</span>
['edit' | 'display' | 'readonly' | 'disabled']       <div className="flex flex-col gap-3">
['edit' | 'display' | 'readonly' | 'disabled']         {SIZES.map((sz) => (
['edit' | 'display' | 'readonly' | 'disabled']           <div key={sz} className="flex items-center gap-4">
['edit' | 'display' | 'readonly' | 'disabled']             <span className="text-[11px] text-fg-muted w-8 shrink-0 font-mono">{sz}</span>
['edit' | 'display' | 'readonly' | 'disabled']             <LinkInput mode="edit" size={sz} value="https://github.com" onChange={() => {}} className="max-w-xs" />
['edit' | 'display' | 'readonly' | 'disabled']           </div>
['edit' | 'display' | 'readonly' | 'disabled']         ))}
['edit' | 'display' | 'readonly' | 'disabled']       </div>
['edit' | 'display' | 'readonly' | 'disabled']     </div>

['edit' | 'display' | 'readonly' | 'disabled']     <div className="flex flex-col gap-4">
['edit' | 'display' | 'readonly' | 'disabled']       <span className="text-caption font-medium text-fg-secondary">預覽 — input 狀態</span>
['edit' | 'display' | 'readonly' | 'disabled']       <div className="flex flex-col gap-3">
['edit' | 'display' | 'readonly' | 'disabled']         {SIZES.map((sz) => (
['edit' | 'display' | 'readonly' | 'disabled']           <div key={sz} className="flex items-center gap-4">
['edit' | 'display' | 'readonly' | 'disabled']             <span className="text-[11px] text-fg-muted w-8 shrink-0 font-mono">{sz}</span>
['edit' | 'display' | 'readonly' | 'disabled']             <LinkInput mode="edit" size={sz} value="" onChange={() => {}} className="max-w-xs" />
['edit' | 'display' | 'readonly' | 'disabled']           </div>
['edit' | 'display' | 'readonly' | 'disabled']         ))}
['edit' | 'display' | 'readonly' | 'disabled']       </div>
['edit' | 'display' | 'readonly' | 'disabled']     </div>

['edit' | 'display' | 'readonly' | 'disabled']     <div className="flex flex-col gap-4">
['edit' | 'display' | 'readonly' | 'disabled']       <span className="text-caption font-medium text-fg-secondary">預覽 — readonly / disabled</span>
['edit' | 'display' | 'readonly' | 'disabled']       <div className="flex flex-col gap-3">
['edit' | 'display' | 'readonly' | 'disabled']         {(['readonly', 'disabled'] as const).map((m) => (
['edit' | 'display' | 'readonly' | 'disabled']           <div key={m} className="flex items-center gap-4">
['edit' | 'display' | 'readonly' | 'disabled']             <span className="text-[11px] text-fg-muted w-16 shrink-0 font-mono">{m}</span>
['edit' | 'display' | 'readonly' | 'disabled']             <LinkInput mode={m} value="https://github.com" className="max-w-xs" />
['edit' | 'display' | 'readonly' | 'disabled']           </div>
['edit' | 'display' | 'readonly' | 'disabled']         ))}
['edit' | 'display' | 'readonly' | 'disabled']       </div>
['edit' | 'display' | 'readonly' | 'disabled']     </div>
['edit' | 'display' | 'readonly' | 'disabled']   </div>
['edit' | 'display' | 'readonly' | 'disabled'] ),
}

//['edit' | 'display' | 'readonly' | 'disabled']── Accessibility ─────────────────────────────────────────────────────────
//['edit' | 'display' | 'readonly' | 'disabled']2026-05-17 ship per audit Dim 13(story-rules.md 6-canonical 含 Accessibility)
['edit' | 'display' | 'readonly' | 'disabled']xport const Accessibility = {
['edit' | 'display' | 'readonly' | 'disabled'] name: '無障礙',
['edit' | 'display' | 'readonly' | 'disabled'] render: () => (
['edit' | 'display' | 'readonly' | 'disabled']   <div className="max-w-3xl text-body text-fg-secondary">
['edit' | 'display' | 'readonly' | 'disabled']     <h3 className="text-h5 text-foreground mb-2">無障礙設計</h3>
['edit' | 'display' | 'readonly' | 'disabled']     <p className="whitespace-pre-line">{"詳 `link-input.spec.md` 「A11y 預設」段。摘要:\n\n  ARIA / Pattern  :native  <input>  element 預設 a11y;Field wrapper 補  aria-labelledby  /  aria-invalid  /  aria-describedby 。\n\n  Keyboard 行為  :\n\n- Tab — focus\n- 字母鍵 — 輸入\n- Esc — 清空(若 clearable + 有值)\n\n  Focus  :native input focus ring;DS focus-visible ring( focus-visible:!border-primary )由 Field wrapper 提供。\n\n  驗證  :Storybook a11y addon panel 應 0 critical violation;鍵盤完整可操作(無需滑鼠)。WCAG AA contrast ≥ 4.5:1(text)/ 3:1(UI)。"}</p>
['edit' | 'display' | 'readonly' | 'disabled']   </div>
['edit' | 'display' | 'readonly' | 'disabled'] ),
}
