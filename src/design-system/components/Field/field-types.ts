// ── Field Mode ───────────────────────────────────────────────────────────────
export type FieldMode = 'edit' | 'readonly' | 'disabled'

// ── Menu List Min Height ─────────────────────────────────────────────────────
// SelectMenu / Select / Combobox 共用的 CommandList minHeight 計算。
// 確保空狀態有足夠高度讓 Empty 垂直置中(有框容器 → 置中原則)。

const FIELD_HEIGHT_TOKEN: Record<string, string> = {
  sm: 'var(--field-height-sm)',
  md: 'var(--field-height-md)',
  lg: 'var(--field-height-lg)',
}

/** CommandList 最小高度 = field-height × rows + 16px(CommandGroup py-2 上下 padding） */
export function getMenuListMinHeight(size: string, rows: number = 3): string {
  const token = FIELD_HEIGHT_TOKEN[size] ?? FIELD_HEIGHT_TOKEN.md
  return `calc(${token} * ${rows} + 16px)`
}

