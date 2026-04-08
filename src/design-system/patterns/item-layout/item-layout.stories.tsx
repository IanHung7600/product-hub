import type { Meta, StoryObj } from '@storybook/react'
import {
  Mail, Bell, Settings, Star, ChevronRight, ExternalLink, User,
  Search, Calendar, Trash2, Copy, Archive,
} from 'lucide-react'
import { SelectMenuItem, SelectMenuGroup } from '@/design-system/components/SelectMenu/select-menu-item'
import { SelectionItem } from '@/design-system/components/SelectionControl/selection-item'
import { Checkbox } from '@/design-system/components/Checkbox/checkbox'
import { RadioGroup, RadioGroupItem } from '@/design-system/components/Radio/radio'

const meta: Meta = {
  title: 'Design System/Patterns/Item Layout',
  parameters: { layout: 'padded' },
}
export default meta

/* ═══════════════════════════════════════════════════════════════════════════
   Helper Components
   ═══════════════════════════════════════════════════════════════════════════ */

/** Annotation label for dimensions */
const Dim = ({ children }: { children: React.ReactNode }) => (
  <span className="text-footnote font-mono text-fg-muted whitespace-nowrap">{children}</span>
)

/** Section title */
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-h5 font-semibold text-foreground">{children}</h3>
)

/** Section subtitle */
const SectionDesc = ({ children }: { children: React.ReactNode }) => (
  <p className="text-caption text-fg-muted max-w-[720px]">{children}</p>
)

/** A label under an example */
const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-footnote text-fg-muted mt-1">{children}</p>
)

/** Menu container to wrap SelectMenuItem examples */
const MenuFrame = ({ children, width = 320 }: { children: React.ReactNode; width?: number }) => (
  <div
    className="rounded-lg bg-surface-raised border border-border overflow-hidden"
    style={{ width, boxShadow: 'var(--elevation-200)' }}
  >
    {children}
  </div>
)

/** Avatar placeholder */
const AvatarImg = ({ bg = '#e0e7ff' }: { bg?: string }) => (
  <div
    className="w-full h-full rounded-full flex items-center justify-center text-[10px] font-medium"
    style={{ backgroundColor: bg }}
  >
    <User size={12} className="text-fg-muted" />
  </div>
)


/* ═══════════════════════════════════════════════════════════════════════════
   1. 總覽
   ═══════════════════════════════════════════════════════════════════════════ */

export const Overview: StoryObj = {
  name: '1. 總覽',
  render: () => (
    <div className="flex flex-col gap-10">
      <div>
        <SectionTitle>Item Layout 三區域結構</SectionTitle>
        <SectionDesc>
          所有「prefix + content + suffix」結構的元件共用此佈局邏輯。
          這不是一個元件，是一組設計規則——每個元件獨立實作，但遵循同一套公式。
        </SectionDesc>
      </div>

      {/* ASCII diagram */}
      <div className="bg-surface-raised border border-border rounded-lg p-6 font-mono text-caption max-w-[680px]">
        <div className="text-fg-muted mb-3">完整結構：</div>
        <pre className="text-foreground leading-relaxed">{`[prefix h-ref]  [content flex-1 min-w-0]  [suffix h-ref ml-auto]

外層：flex items-start（多行時 prefix/suffix Y 不動）

prefix h-ref：
  內容物 <= 24px  ->  h-[1lh]           對齊第一行 label 垂直中心
  內容物 >  24px  ->  h-[calc(...)]     對齊 label+gap+desc 文字塊

suffix h-ref：
  與 prefix 共用規則，但通常 <= 24px，所以幾乎總是 h-[1lh]`}</pre>
      </div>

      {/* Live structure breakdown */}
      <div className="flex flex-col gap-6">
        <Dim>只有 prefix</Dim>
        <MenuFrame width={380}>
          <SelectMenuGroup>
            <SelectMenuItem startIcon={Mail} description="每日寄送摘要信件">
              電子郵件通知
            </SelectMenuItem>
          </SelectMenuGroup>
        </MenuFrame>
        <Label>[prefix: icon h-[1lh]] --gap-2-- [content: label + desc]</Label>

        <Dim>prefix + suffix</Dim>
        <MenuFrame width={380}>
          <SelectMenuGroup>
            {/* Custom layout to show full 3-region structure */}
            <div className="flex items-start gap-2 px-3 w-full text-body leading-compact py-[calc((var(--field-height-md)-1lh)/2)] cursor-pointer hover:bg-neutral-hover">
              <div className="h-[1lh] flex items-center shrink-0">
                <Settings size={16} />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="truncate">外觀主題</span>
                <span className="mt-0.5 text-caption text-fg-secondary">切換介面顏色主題</span>
              </div>
              <div className="h-[1lh] flex items-center gap-1 ml-auto shrink-0">
                <span className="text-body leading-compact text-fg-muted">深色</span>
                <ChevronRight size={16} className="text-fg-muted" />
              </div>
            </div>
          </SelectMenuGroup>
        </MenuFrame>
        <Label>[prefix: icon h-[1lh]] --gap-2-- [content: label + desc, flex-1] --ml-auto-- [suffix: value + chevron, h-[1lh]]</Label>

        <Dim>只有 content（無 prefix、無 suffix）</Dim>
        <MenuFrame width={380}>
          <SelectMenuGroup>
            <SelectMenuItem>純文字選項</SelectMenuItem>
          </SelectMenuGroup>
        </MenuFrame>
        <Label>[content] -- 無 prefix/suffix 時 content 獨佔整行</Label>

        <Dim>SelectionItem（prefix = control，無 suffix）</Dim>
        <div className="max-w-[380px]">
          <SelectionItem
            size="md"
            control={<Checkbox size="md" />}
            label="接受使用條款"
            description="勾選表示您同意我們的服務條款與隱私權政策"
          />
        </div>
        <Label>[prefix: checkbox h-[1lh]] --gap-2-- [content: label + desc]</Label>
      </div>
    </div>
  ),
}


/* ═══════════════════════════════════════════════════════════════════════════
   2. Padding 公式
   ═══════════════════════════════════════════════════════════════════════════ */

export const PaddingFormula: StoryObj = {
  name: '2. Padding 公式',
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <SectionTitle>Padding 公式: py = (field-height - 1lh) / 2</SectionTitle>
        <SectionDesc>
          單行時 item 總高度等於 field-height，與同 size 的 Button、TextField 等高。
          多行時 padding 不變，高度自然撐開。density 切換時 field-height 自動調整。
        </SectionDesc>
      </div>

      {/* Size comparison table */}
      <div className="border border-border rounded-lg overflow-hidden max-w-[540px]">
        <table className="w-full text-body">
          <thead>
            <tr className="bg-surface-raised">
              <th className="text-left px-4 py-2 text-caption font-medium text-fg-muted">Size</th>
              <th className="text-left px-4 py-2 text-caption font-medium text-fg-muted">field-height</th>
              <th className="text-left px-4 py-2 text-caption font-medium text-fg-muted">font / 1lh</th>
              <th className="text-left px-4 py-2 text-caption font-medium text-fg-muted">py calc</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-mono text-caption">
            <tr><td className="px-4 py-2">sm</td><td className="px-4 py-2">28px</td><td className="px-4 py-2">14px, lh 1.5 = 21px</td><td className="px-4 py-2">(28-21)/2 = 3.5px</td></tr>
            <tr><td className="px-4 py-2">md</td><td className="px-4 py-2">32px</td><td className="px-4 py-2">14px, lh 1.5 = 21px</td><td className="px-4 py-2">(32-21)/2 = 5.5px</td></tr>
            <tr><td className="px-4 py-2">lg</td><td className="px-4 py-2">36px</td><td className="px-4 py-2">16px, lh 1.5 = 24px</td><td className="px-4 py-2">(36-24)/2 = 6px</td></tr>
          </tbody>
        </table>
      </div>

      {/* Live examples per size */}
      <div className="flex flex-col gap-6">
        {(['sm', 'md', 'lg'] as const).map((sz) => (
          <div key={sz} className="flex items-start gap-6">
            <div className="w-[100px] shrink-0">
              <Dim>size="{sz}"</Dim>
            </div>

            {/* SelectionItem (reading mode) */}
            <div className="flex flex-col gap-1">
              <div className="border border-dashed border-border rounded px-3">
                <SelectionItem
                  size={sz}
                  control={<Checkbox size={sz} />}
                  label="單行 — 高度 = field-height"
                />
              </div>
              <Label>SelectionItem (閱讀模式)</Label>
            </div>

            {/* SelectMenuItem (scanning mode) */}
            <div className="flex flex-col gap-1">
              <MenuFrame width={260}>
                <SelectMenuGroup>
                  <SelectMenuItem size={sz} startIcon={Mail}>
                    單行 — 高度 = field-height
                  </SelectMenuItem>
                </SelectMenuGroup>
              </MenuFrame>
              <Label>SelectMenuItem (掃描模式)</Label>
            </div>
          </div>
        ))}
      </div>

      {/* Multi-line demo */}
      <div>
        <SectionDesc>多行時 padding 維持不變，item 高度自然撐開：</SectionDesc>
        <div className="flex items-start gap-6 mt-3">
          <div className="flex flex-col gap-1">
            <div className="border border-dashed border-border rounded px-3">
              <SelectionItem
                size="md"
                control={<Checkbox size="md" />}
                label="多行範例"
                description="描述文字讓 item 自然變高，但上下 padding 維持 (field-height-md - 1lh) / 2，與單行時一致"
              />
            </div>
            <Label>SelectionItem — padding 不因多行改變</Label>
          </div>

          <div className="flex flex-col gap-1">
            <MenuFrame width={320}>
              <SelectMenuGroup>
                <SelectMenuItem size="md" startIcon={Mail} description="描述文字讓 item 自然變高，但 padding 維持一致">
                  多行範例
                </SelectMenuItem>
              </SelectMenuGroup>
            </MenuFrame>
            <Label>SelectMenuItem — padding 不因多行改變</Label>
          </div>
        </div>
      </div>
    </div>
  ),
}


/* ═══════════════════════════════════════════════════════════════════════════
   3. 對齊模式
   ═══════════════════════════════════════════════════════════════════════════ */

export const AlignmentModes: StoryObj = {
  name: '3. 對齊模式',
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <SectionTitle>Prefix 對齊——24px 閾值</SectionTitle>
        <SectionDesc>
          prefix 內容物 ≤ 24px 時，容器設 h-[1lh] 對齊第一行 label 的垂直中心（inline 模式）。
          prefix 內容物 {'>'} 24px 且有 description 時，容器拉高對齊整個文字塊（block 模式）。
          無 description 時 prefix 上限 24px，強制 inline。
        </SectionDesc>
      </div>

      {/* ── Inline examples ── */}
      <div className="flex flex-col gap-4">
        <h4 className="text-body font-medium text-foreground">Inline 對齊 (prefix ≤ 24px, h-[1lh])</h4>

        <div className="flex flex-col gap-4">
          {/* icon 16px */}
          <div className="flex flex-col gap-1">
            <Dim>icon 16px ≤ 24px</Dim>
            <MenuFrame width={360}>
              <SelectMenuGroup>
                <SelectMenuItem startIcon={Mail} description="每日寄送摘要信件">
                  電子郵件通知
                </SelectMenuItem>
              </SelectMenuGroup>
            </MenuFrame>
            <Label>icon (16px) 在 h-[1lh] 容器內，對齊第一行 label 中心</Label>
          </div>

          {/* checkbox + icon */}
          <div className="flex flex-col gap-1">
            <Dim>checkbox 16px + icon 16px，全部 ≤ 24px</Dim>
            <MenuFrame width={360}>
              <SelectMenuGroup>
                <SelectMenuItem checkbox checked={true} startIcon={Mail} description="每日寄送摘要信件">
                  電子郵件通知
                </SelectMenuItem>
              </SelectMenuGroup>
            </MenuFrame>
            <Label>checkbox + icon 都在同一個 h-[1lh] 容器內，gap-2 分隔</Label>
          </div>

          {/* avatar inline (no description) */}
          <div className="flex flex-col gap-1">
            <Dim>avatar 24px ≤ 24px（無 description，強制 inline）</Dim>
            <MenuFrame width={360}>
              <SelectMenuGroup>
                <SelectMenuItem avatar={<AvatarImg />}>
                  Alice Chen
                </SelectMenuItem>
              </SelectMenuGroup>
            </MenuFrame>
            <Label>無 description 時 avatar 使用 inline 尺寸 (20/24px)，h-[1lh] 對齊</Label>
          </div>

          {/* SelectionItem — control always inline */}
          <div className="flex flex-col gap-1">
            <Dim>checkbox 16px ≤ 24px（SelectionItem — control 永遠 inline）</Dim>
            <div className="max-w-[360px]">
              <SelectionItem
                size="md"
                control={<Checkbox size="md" />}
                label="接受使用條款"
                description="勾選表示您同意我們的服務條款與隱私權政策，包括資料收集與使用方式"
              />
            </div>
            <Label>control (16px) 永遠 inline — 即使多行 description，prefix 只對齊第一行</Label>
          </div>
        </div>
      </div>

      {/* ── Block examples ── */}
      <div className="flex flex-col gap-4">
        <h4 className="text-body font-medium text-foreground">Block 對齊 (prefix {'>'} 24px, h-[calc(1lh + 2px + desc_1lh)])</h4>

        <div className="flex flex-col gap-1">
          <Dim>avatar 32px {'>'} 24px（有 description，block 對齊）</Dim>
          <MenuFrame width={360}>
            <SelectMenuGroup>
              <SelectMenuItem avatar={<AvatarImg />} description="設計部門">
                Alice Chen
              </SelectMenuItem>
            </SelectMenuGroup>
          </MenuFrame>
          <Label>avatar + description — 使用 block 尺寸 (32px)，對齊 label+gap+desc 文字塊</Label>
        </div>

        <div className="flex flex-col gap-1">
          <Dim>avatar 32px {'>'} 24px（有 description + checkbox）</Dim>
          <MenuFrame width={360}>
            <SelectMenuGroup>
              <SelectMenuItem checkbox checked={true} avatar={<AvatarImg />} description="設計部門">
                Alice Chen
              </SelectMenuItem>
            </SelectMenuGroup>
          </MenuFrame>
          <Label>checkbox + avatar 都在 block 容器內，一起對齊文字塊中心</Label>
        </div>
      </div>

      {/* ── Suffix behavior with block prefix ── */}
      <div className="flex flex-col gap-4">
        <h4 className="text-body font-medium text-foreground">Suffix 永遠對齊第一行</h4>
        <SectionDesc>
          即使 prefix 使用 block 對齊（容器較高），suffix 仍維持 h-[1lh]，對齊第一行 label。
          Suffix 通常 ≤ 24px（icon + badge），所以幾乎總是 inline。
        </SectionDesc>

        <div className="flex flex-col gap-1">
          <Dim>prefix = block (avatar 32px), suffix = inline (h-[1lh])</Dim>
          <MenuFrame width={400}>
            <SelectMenuGroup>
              {/* Custom to show suffix + block prefix */}
              <div className="flex items-start gap-2 px-3 w-full text-body leading-compact py-[calc((var(--field-height-md)-1lh)/2)] cursor-pointer hover:bg-neutral-hover">
                <div className="h-[calc(1lh+2px+var(--font-caption-size)*1.3)] flex items-center gap-2 shrink-0">
                  <div className="shrink-0 rounded-full overflow-hidden w-8 h-8">
                    <AvatarImg />
                  </div>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="truncate">Alice Chen</span>
                  <span className="mt-0.5 text-caption text-fg-secondary">設計部門</span>
                </div>
                <div className="h-[1lh] flex items-center gap-1 ml-auto shrink-0">
                  <ExternalLink size={16} className="text-fg-muted" />
                </div>
              </div>
            </SelectMenuGroup>
          </MenuFrame>
          <Label>prefix 對齊文字塊中心 (block)，suffix 對齊第一行 label 中心 (inline)——各自獨立</Label>
        </div>
      </div>
    </div>
  ),
}


/* ═══════════════════════════════════════════════════════════════════════════
   4. 兩種閱讀模式
   ═══════════════════════════════════════════════════════════════════════════ */

export const ReadingModes: StoryObj = {
  name: '4. 兩種閱讀模式',
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <SectionTitle>兩種閱讀模式：掃描 vs 閱讀</SectionTitle>
        <SectionDesc>
          同一套佈局公式，typography 策略根據使用者的閱讀行為調整。
          判斷標準：「使用者會仔細讀，還是一掃而過？」
        </SectionDesc>
      </div>

      {(['sm', 'md', 'lg'] as const).map((sz) => {
        const scanLabel = sz === 'lg' ? 'text-body-lg leading-compact (16px, lh 1.3)' : 'text-body leading-compact (14px, lh 1.3)'
        const scanDesc = sz === 'lg' ? 'text-body leading-compact (14px, lh 1.3)' : 'text-caption (12px, lh 1.3)'
        const readLabel = sz === 'lg' ? 'text-body-lg (16px, lh 1.5)' : 'text-body (14px, lh 1.5)'

        return (
          <div key={sz} className="flex flex-col gap-3">
            <Dim>size="{sz}"</Dim>
            <div className="flex items-start gap-8">
              {/* Scanning mode */}
              <div className="flex flex-col gap-1">
                <div className="text-caption text-fg-muted font-medium mb-1">掃描模式（浮層 / overlay）</div>
                <MenuFrame width={340}>
                  <SelectMenuGroup>
                    <SelectMenuItem size={sz} startIcon={Mail} description="每日寄送摘要信件">
                      電子郵件通知
                    </SelectMenuItem>
                    <SelectMenuItem size={sz} startIcon={Bell} description="即時推播到裝置">
                      推播通知
                    </SelectMenuItem>
                    <SelectMenuItem size={sz} startIcon={Settings} description="自訂通知偏好">
                      進階設定
                    </SelectMenuItem>
                  </SelectMenuGroup>
                </MenuFrame>
                <Label>label: {scanLabel}</Label>
                <Label>desc: {scanDesc} + fg-secondary</Label>
                <Label>層級靠「字體大小差 + 顏色差 + 2px gap」建立</Label>
              </div>

              {/* Reading mode */}
              <div className="flex flex-col gap-1">
                <div className="text-caption text-fg-muted font-medium mb-1">閱讀模式（頁面 / 表單）</div>
                <RadioGroup defaultValue="email" className="max-w-[340px]">
                  <SelectionItem
                    size={sz}
                    control={<RadioGroupItem value="email" id={`read-${sz}-email`} size={sz} />}
                    label="電子郵件通知"
                    description="每日寄送摘要信件"
                    htmlFor={`read-${sz}-email`}
                  />
                  <SelectionItem
                    size={sz}
                    control={<RadioGroupItem value="push" id={`read-${sz}-push`} size={sz} />}
                    label="推播通知"
                    description="即時推播到裝置"
                    htmlFor={`read-${sz}-push`}
                  />
                  <SelectionItem
                    size={sz}
                    control={<RadioGroupItem value="settings" id={`read-${sz}-settings`} size={sz} />}
                    label="進階設定"
                    description="自訂通知偏好"
                    htmlFor={`read-${sz}-settings`}
                  />
                </RadioGroup>
                <Label>label: {readLabel}</Label>
                <Label>desc: {readLabel} + fg-secondary（同字體）</Label>
                <Label>層級僅靠「顏色差 + 2px gap」，保持段落韻律</Label>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  ),
}


/* ═══════════════════════════════════════════════════════════════════════════
   5. Icon 色彩原則
   ═══════════════════════════════════════════════════════════════════════════ */

export const IconColorRules: StoryObj = {
  name: '5. Icon 色彩原則',
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <SectionTitle>Icon 色彩原則</SectionTitle>
        <SectionDesc>
          Menu item 和 Field 的 icon 色彩規則不同。差異原因：Menu item 的 prefix icon 是「描述 item 內容」，
          本身就是內容的一部分，應與 label 等重。Field 的 startIcon 是「描述 field 用途的提示」（像 placeholder），所以弱化。
        </SectionDesc>
      </div>

      {/* ── Menu Item icon colors ── */}
      <div className="flex flex-col gap-4">
        <h4 className="text-body font-medium text-foreground">Menu Item（SelectMenuItem、DropdownMenuItem）</h4>

        <div className="flex items-start gap-8">
          {/* Prefix icon = foreground */}
          <div className="flex flex-col gap-1">
            <Dim>prefix icon = foreground（跟 label 同色）</Dim>
            <MenuFrame width={300}>
              <SelectMenuGroup>
                <SelectMenuItem startIcon={Mail}>電子郵件</SelectMenuItem>
                <SelectMenuItem startIcon={Copy}>複製</SelectMenuItem>
                <SelectMenuItem startIcon={Archive}>封存</SelectMenuItem>
              </SelectMenuGroup>
            </MenuFrame>
            <Label>prefix icon 是 label 的一部分，不加 text-fg-muted</Label>
          </div>

          {/* Suffix indicator = fg-muted */}
          <div className="flex flex-col gap-1">
            <Dim>suffix indicator icon = fg-muted</Dim>
            <MenuFrame width={300}>
              <SelectMenuGroup>
                {/* Submenu indicator with value */}
                <div className="flex items-start gap-2 px-3 w-full text-body leading-compact py-[calc((var(--field-height-md)-1lh)/2)] cursor-pointer hover:bg-neutral-hover">
                  <div className="h-[1lh] flex items-center shrink-0">
                    <Settings size={16} />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="truncate">外觀主題</span>
                  </div>
                  <div className="h-[1lh] flex items-center gap-1 ml-auto shrink-0">
                    <span className="text-body leading-compact text-fg-muted">深色</span>
                    <ChevronRight size={16} className="text-fg-muted" />
                  </div>
                </div>
                {/* External link */}
                <div className="flex items-start gap-2 px-3 w-full text-body leading-compact py-[calc((var(--field-height-md)-1lh)/2)] cursor-pointer hover:bg-neutral-hover">
                  <div className="h-[1lh] flex items-center shrink-0">
                    <Star size={16} />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="truncate">說明文件</span>
                  </div>
                  <div className="h-[1lh] flex items-center gap-2 ml-auto shrink-0">
                    <ExternalLink size={16} className="text-fg-muted" />
                  </div>
                </div>
              </SelectMenuGroup>
            </MenuFrame>
            <Label>ChevronRight, ExternalLink 是方向指示，退到背景 (fg-muted)</Label>
            <Label>value 文字跟 label 同字體大小，僅顏色 fg-muted</Label>
          </div>
        </div>

        {/* Danger variant */}
        <div className="flex flex-col gap-1">
          <Dim>danger prefix icon = text-error（跟 label 同色）</Dim>
          <MenuFrame width={300}>
            <SelectMenuGroup>
              <div className="flex items-start gap-2 px-3 w-full text-body leading-compact py-[calc((var(--field-height-md)-1lh)/2)] cursor-pointer hover:bg-neutral-hover text-error">
                <div className="h-[1lh] flex items-center shrink-0">
                  <Trash2 size={16} />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="truncate">刪除</span>
                </div>
              </div>
            </SelectMenuGroup>
          </MenuFrame>
          <Label>危險操作：icon 和 label 都是 text-error，保持同色原則</Label>
        </div>
      </div>

      {/* ── Field icon colors ── */}
      <div className="flex flex-col gap-4">
        <h4 className="text-body font-medium text-foreground">Field（TextField、SelectField 等）</h4>

        <div className="flex flex-col gap-1">
          <Dim>startIcon = fg-muted（用途提示，像 placeholder）</Dim>
          <div className="flex items-center gap-2 border border-border rounded-lg px-3 h-8 max-w-[300px]">
            <Search size={16} className="text-fg-muted shrink-0" />
            <span className="text-body text-fg-muted">搜尋...</span>
          </div>
          <div className="flex items-center gap-2 border border-border rounded-lg px-3 h-8 max-w-[300px] mt-2">
            <Calendar size={16} className="text-fg-muted shrink-0" />
            <span className="text-body text-fg-muted">選擇日期</span>
          </div>
          <Label>Field startIcon 是描述 field 用途的提示，弱化為 fg-muted</Label>
        </div>
      </div>

      {/* ── Comparison table ── */}
      <div className="border border-border rounded-lg overflow-hidden max-w-[600px]">
        <table className="w-full text-body">
          <thead>
            <tr className="bg-surface-raised">
              <th className="text-left px-4 py-2 text-caption font-medium text-fg-muted">情境</th>
              <th className="text-left px-4 py-2 text-caption font-medium text-fg-muted">Icon 角色</th>
              <th className="text-left px-4 py-2 text-caption font-medium text-fg-muted">顏色</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-caption">
            <tr><td className="px-4 py-2">Menu prefix icon</td><td className="px-4 py-2">內容描述</td><td className="px-4 py-2 font-medium">foreground（跟 label 同色）</td></tr>
            <tr><td className="px-4 py-2">Menu danger icon</td><td className="px-4 py-2">內容描述</td><td className="px-4 py-2 font-medium">text-error（跟 label 同色）</td></tr>
            <tr><td className="px-4 py-2">Menu suffix icon</td><td className="px-4 py-2">方向指示</td><td className="px-4 py-2 font-medium">fg-muted</td></tr>
            <tr><td className="px-4 py-2">Menu suffix value</td><td className="px-4 py-2">狀態值</td><td className="px-4 py-2 font-medium">fg-muted（同字體大小）</td></tr>
            <tr><td className="px-4 py-2">Field startIcon</td><td className="px-4 py-2">用途提示</td><td className="px-4 py-2 font-medium">fg-muted</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  ),
}


/* ═══════════════════════════════════════════════════════════════════════════
   6. Gap 慣例
   ═══════════════════════════════════════════════════════════════════════════ */

export const GapConventions: StoryObj = {
  name: '6. Gap 慣例',
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <SectionTitle>Gap 慣例</SectionTitle>
        <SectionDesc>
          所有 gap 值都固定，不隨 size 變化。統一的間距讓不同元件組合時視覺節奏一致。
        </SectionDesc>
      </div>

      {/* Gap reference table */}
      <div className="border border-border rounded-lg overflow-hidden max-w-[600px]">
        <table className="w-full text-body">
          <thead>
            <tr className="bg-surface-raised">
              <th className="text-left px-4 py-2 text-caption font-medium text-fg-muted">位置</th>
              <th className="text-left px-4 py-2 text-caption font-medium text-fg-muted">Gap</th>
              <th className="text-left px-4 py-2 text-caption font-medium text-fg-muted">Token</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr><td className="px-4 py-2">prefix 內部元素之間</td><td className="px-4 py-2 font-mono text-caption">8px</td><td className="px-4 py-2 font-mono text-caption">gap-2</td></tr>
            <tr><td className="px-4 py-2">prefix ↔ content</td><td className="px-4 py-2 font-mono text-caption">8px</td><td className="px-4 py-2 font-mono text-caption">gap-2</td></tr>
            <tr><td className="px-4 py-2">content ↔ suffix</td><td className="px-4 py-2 font-mono text-caption">auto</td><td className="px-4 py-2 font-mono text-caption">ml-auto</td></tr>
            <tr><td className="px-4 py-2">label ↔ description</td><td className="px-4 py-2 font-mono text-caption">2px</td><td className="px-4 py-2 font-mono text-caption">mt-0.5</td></tr>
            <tr><td className="px-4 py-2">suffix 獨立後綴內部</td><td className="px-4 py-2 font-mono text-caption">8px</td><td className="px-4 py-2 font-mono text-caption">gap-2</td></tr>
            <tr><td className="px-4 py-2">suffix 子選單指示內部</td><td className="px-4 py-2 font-mono text-caption">4px</td><td className="px-4 py-2 font-mono text-caption">gap-1</td></tr>
          </tbody>
        </table>
      </div>

      {/* prefix 內部 gap + prefix↔content */}
      <div className="flex flex-col gap-3">
        <Dim>prefix 內部 gap-2 (8px) + prefix↔content gap-2 (8px)</Dim>
        <MenuFrame width={400}>
          <SelectMenuGroup>
            <SelectMenuItem checkbox checked={true} startIcon={Mail} description="每日寄送摘要信件">
              電子郵件通知
            </SelectMenuItem>
          </SelectMenuGroup>
        </MenuFrame>
        <Label>[checkbox] --8px-- [icon] --8px-- [label / desc(2px)]</Label>
      </div>

      {/* Suffix: 獨立後綴 (gap-2) */}
      <div className="flex flex-col gap-3">
        <Dim>獨立後綴 (gap-2, 8px): [badge] --8px-- [endIcon]</Dim>
        <MenuFrame width={400}>
          <SelectMenuGroup>
            <div className="flex items-start gap-2 px-3 w-full text-body leading-compact py-[calc((var(--field-height-md)-1lh)/2)] cursor-pointer hover:bg-neutral-hover">
              <div className="h-[1lh] flex items-center shrink-0">
                <Star size={16} />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="truncate">收藏項目</span>
              </div>
              <div className="h-[1lh] flex items-center gap-2 ml-auto shrink-0">
                <div className="bg-error text-white text-footnote font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">3</div>
                <ExternalLink size={16} className="text-fg-muted" />
              </div>
            </div>
          </SelectMenuGroup>
        </MenuFrame>
        <Label>[prefix icon] --8px-- [label] --ml-auto-- [badge] --8px-- [endIcon]</Label>
      </div>

      {/* Suffix: 子選單指示 (gap-1) */}
      <div className="flex flex-col gap-3">
        <Dim>子選單指示 (gap-1, 4px): [value] --4px-- [ChevronRight]</Dim>
        <MenuFrame width={400}>
          <SelectMenuGroup>
            <div className="flex items-start gap-2 px-3 w-full text-body leading-compact py-[calc((var(--field-height-md)-1lh)/2)] cursor-pointer hover:bg-neutral-hover">
              <div className="h-[1lh] flex items-center shrink-0">
                <Settings size={16} />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="truncate">外觀主題</span>
              </div>
              <div className="h-[1lh] flex items-center gap-1 ml-auto shrink-0">
                <span className="text-body leading-compact text-fg-muted">深色</span>
                <ChevronRight size={16} className="text-fg-muted" />
              </div>
            </div>
          </SelectMenuGroup>
        </MenuFrame>
        <Label>[prefix icon] --8px-- [label] --ml-auto-- [value] --4px-- [ChevronRight]</Label>
      </div>

      {/* label ↔ description gap — both modes */}
      <div className="flex flex-col gap-3">
        <Dim>label ↔ description (2px, mt-0.5) — 兩種模式統一</Dim>
        <div className="flex items-start gap-8">
          <div className="flex flex-col gap-1">
            <MenuFrame width={340}>
              <SelectMenuGroup>
                <SelectMenuItem startIcon={Bell} description="即時推播到裝置">
                  推播通知
                </SelectMenuItem>
              </SelectMenuGroup>
            </MenuFrame>
            <Label>掃描模式 — label 和 desc 間 2px</Label>
          </div>
          <div className="flex flex-col gap-1">
            <div className="max-w-[340px]">
              <SelectionItem
                size="md"
                control={<Checkbox size="md" />}
                label="推播通知"
                description="即時推播到裝置"
              />
            </div>
            <Label>閱讀模式 — label 和 desc 間 2px</Label>
          </div>
        </div>
      </div>
    </div>
  ),
}
