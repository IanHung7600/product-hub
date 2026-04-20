
/**
 * BooleanDisplay — 布林值的純文字顯示
 *
 * 用於：
 *   1. DataTable cell 的 boolean 型別 cell（meta.type='boolean'）
 *   2. 任何需要顯示布林值但不需要可點擊 checkbox 視覺的場景
 *
 * 不是 Checkbox primitive 的一部分——Checkbox 本身有 `readOnly` prop
 * 可以維持互動形態的 ON/OFF 視覺；BooleanDisplay 則是純文字 ✓ / —，
 * 更適合密集排列的表格 cell。
 *
 * 顯示規則：
 *   true               → ✓（foreground）
 *   false / null / undefined → —（fg-muted）
 *
 * 此元件取代原本 CheckboxFieldDisplay / SwitchFieldDisplay——後兩者已隨
 * CheckboxField / SwitchField 刪除（見 Field 架構重構）。
 */
export function BooleanDisplay({ value }: { value?: boolean | null }) {
  return value
    ? <span className="text-foreground">✓</span>
    : <span className="text-fg-muted">—</span>
}
BooleanDisplay.displayName = 'BooleanDisplay'
