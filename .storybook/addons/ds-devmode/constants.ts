export const ADDON_ID = 'ds-devmode'
export const PANEL_ID = `${ADDON_ID}/panel`
export const TOOL_ID = `${ADDON_ID}/tool`
export const PARAM_KEY = 'dsDevmode'

export const EVENTS = {
  TOGGLE: `${ADDON_ID}/toggle`,
  INSPECT: `${ADDON_ID}/inspect`,
  CLEAR: `${ADDON_ID}/clear`,
  /** Panel → preview:set forced pseudo-class state on pinned element */
  FORCE_STATE: `${ADDON_ID}/force-state`,
} as const

export type DevmodeMode = 'off' | 'live' | 'pin'

/** Pseudo-class force-state(對齊 Chrome / Firefox / Safari Inspector idiom) */
export type ForceState = 'none' | 'hover' | 'focus' | 'active'

export interface InspectPayload {
  tag: string
  className: string
  id: string
  rect: { x: number; y: number; width: number; height: number }
  parentRect: { x: number; y: number; width: number; height: number } | null
  distancesToParent: { top: number; right: number; bottom: number; left: number } | null
  padding: { top: number; right: number; bottom: number; left: number }
  margin: { top: number; right: number; bottom: number; left: number }
  border: { top: number; right: number; bottom: number; left: number }
  computed: Record<string, string>
  tokenUsage: Array<{
    property: string
    raw: string
    tokens: string[]
    resolved: string
    /** 'author' = 從 source stylesheet/inline 抓的(可信);'speculative' = reverse-lookup 候選(同值多 token 推測,可能 misleading) */
    source: 'author' | 'speculative'
  }>
  /** Element ancestor chain(html → body → ... → element)。Click 任一 breadcrumb 可 pin parent。Chrome DevTools idiom。 */
  breadcrumb: Array<{
    tag: string
    id: string
    className: string
  }>
  /** Auto-layout context — element 是 flex / grid container 時填,讓 inspector 顯示 layout intent(對齊 Figma Inspect / Chrome layout panel idiom)。 */
  autoLayout: {
    display: 'flex' | 'grid' | null
    flexDirection?: string
    gap?: string
    rowGap?: string
    columnGap?: string
    justifyContent?: string
    alignItems?: string
    flexWrap?: string
    gridTemplateColumns?: string
    gridTemplateRows?: string
  } | null
}
