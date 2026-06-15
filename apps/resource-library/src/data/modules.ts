// 共用能力 Module 目錄 mock data(P1)
// SSOT:apps/resource-library/docs/PRD.md §5。dsComponents 取自 @qijenchen/design-system public exports。
// 真實後端接入前,此為純前端 catalog 資料來源。

export type ModuleCategory = 'forms' | 'approvals' | 'todos' | 'notifications'
export type ModuleStatus = 'ready' | 'planned'

export interface ModuleVariant {
  id: string
  label: string
  description: string
}

export interface ModuleMeta {
  id: string
  name: string
  category: ModuleCategory
  categoryLabel: string
  summary: string
  /** 流程視圖:典型使用情境敘述 */
  scenario: string
  variants: ModuleVariant[]
  /** 規格視圖:消費的 DS 元件(public export 名) */
  dsComponents: string[]
  /** 客製化邊界 */
  customization: { editable: string[]; locked: string[] }
  /** 採用此 Module 的產品案例 */
  adoptedBy: string[]
  status: ModuleStatus
}

export const MODULES: ModuleMeta[] = [
  {
    id: 'forms',
    name: '表單問卷',
    category: 'forms',
    categoryLabel: '資料收集',
    summary: '動態表單與問卷填寫,員工面產品最高頻流程 — 請假、報銷、申請、調查。',
    scenario:
      '員工開啟「請假申請單」,選擇假別與起訖日期、填寫事由後送出。系統即時驗證必填欄位,送出後跳出成功提示。分步模式(wizard)用於欄位較多的申請。',
    variants: [
      { id: 'single', label: '單頁表單', description: '所有欄位在同一頁,適合欄位少的申請' },
      { id: 'wizard', label: '分步表單(Wizard)', description: '依步驟分段填寫,適合欄位多或需審閱的流程' },
      { id: 'survey', label: '問卷模式', description: '題組 + 進度指示,適合滿意度調查' },
    ],
    dsComponents: ['Field', 'FieldGroup', 'Input', 'Textarea', 'Select', 'DatePicker', 'Button', 'Steps'],
    customization: {
      editable: ['欄位組成與順序', '驗證規則', '欄位文案與說明', '假別 / 選項清單'],
      locked: ['欄位元件樣式', '錯誤態視覺與行為', 'Field label / description 排版'],
    },
    adoptedBy: ['請假系統', '差旅報銷', '員工滿意度調查'],
    status: 'ready',
  },
  {
    id: 'approvals',
    name: '多層級 / 多方簽核',
    category: 'approvals',
    categoryLabel: '審批流程',
    summary: '序簽 / 會簽流程與簽核狀態追蹤,員工面審批場景核心。',
    scenario:
      '申請送出後進入簽核流程,依層級逐關核准(序簽)或多位主管並行核准(會簽)。每關顯示簽核人、狀態與意見,可退回或加簽。',
    variants: [
      { id: 'sequential', label: '序簽', description: '依層級依序核准' },
      { id: 'parallel', label: '會簽', description: '多位簽核人並行核准' },
      { id: 'hybrid', label: '混合流程', description: '序簽與會簽混合' },
    ],
    dsComponents: ['Steps', 'Avatar', 'Badge', 'Tag', 'DescriptionList', 'Button', 'Dialog', 'DataTable'],
    customization: {
      editable: ['簽核層級數', '簽核角色', '意見欄位'],
      locked: ['狀態機邏輯', '時間軸視覺'],
    },
    adoptedBy: ['請假系統', '差旅報銷', '採購申請'],
    status: 'ready',
  },
  {
    id: 'todos',
    name: '待辦事項',
    category: 'todos',
    categoryLabel: '任務管理',
    summary: '任務 / 待辦清單與狀態管理,跨產品的「我的工作」入口。',
    scenario:
      '使用者在「我的待辦」看到待處理任務,可勾選完成、批次操作、依狀態篩選,或切換清單 / 看板檢視。',
    variants: [
      { id: 'list', label: '清單模式', description: '表格式待辦清單' },
      { id: 'board', label: '看板模式', description: '依狀態分欄的看板' },
      { id: 'assigned', label: '含指派 + 到期', description: '指派人與到期日管理' },
    ],
    dsComponents: ['DataTable', 'Checkbox', 'Badge', 'Tag', 'Avatar', 'DatePicker', 'DropdownMenu', 'BulkActionBar', 'Empty'],
    customization: {
      editable: ['欄位', '狀態分類', '排序規則'],
      locked: ['批次操作互動', '卡片版面'],
    },
    adoptedBy: ['請假系統', '專案管理'],
    status: 'ready',
  },
  {
    id: 'notifications',
    name: '通知與提醒',
    category: 'notifications',
    categoryLabel: '訊息層',
    summary: '通知中心、即時提醒與未讀管理,跨產品共用的訊息層。',
    scenario:
      '使用者點開通知中心面板,依分類(系統 / 待辦 / 提及)瀏覽,標記已讀後未讀數遞減;重要事件即時跳出 toast。',
    variants: [
      { id: 'center', label: '通知中心面板', description: '集中式通知列表' },
      { id: 'toast', label: '即時 Toast', description: '即時事件提示' },
      { id: 'categorized', label: '分類通知', description: '系統 / 待辦 / 提及分流' },
    ],
    dsComponents: ['Popover', 'Sheet', 'Badge', 'Toast', 'Tabs', 'Avatar', 'Empty', 'Button'],
    customization: {
      editable: ['通知分類', '通知文案', '來源設定'],
      locked: ['未讀標記行為', 'Toast 出現位置'],
    },
    adoptedBy: ['請假系統', '專案管理', '差旅報銷'],
    status: 'ready',
  },
]

export function getModule(id: string): ModuleMeta | undefined {
  return MODULES.find((m) => m.id === id)
}
