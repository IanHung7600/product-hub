import type { Meta } from '@storybook/react'
import { NameCard, NameCardDefaultActions } from './name-card'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/design-system/components/HoverCard/hover-card'
import { Avatar } from '@/design-system/components/Avatar/avatar'

const meta: Meta = {
  title: 'Design System/Components/NameCard/展示',
  parameters: { layout: 'padded' },
}
export default meta

const noop = () => {}

function NameCardHover({ name, src, subtitle, minimal }: { name: string; src: string; subtitle: string; minimal?: boolean }) {
  return (
    <HoverCard openDelay={300} closeDelay={200}>
      <span className="inline-flex items-center gap-2">
        <HoverCardTrigger asChild>
          <button type="button" className="cursor-pointer">
            <Avatar src={src} alt={name} size={32} />
          </button>
        </HoverCardTrigger>
        <span className="text-body">{name}</span>
      </span>
      <HoverCardContent align="start" className="bg-surface-raised rounded-lg border border-border" style={{ boxShadow: 'var(--elevation-200)' }}>
        <NameCard
          name={name}
          avatar={{ src, alt: name }}
          subtitle={subtitle}
          status="online"
          {...(!minimal ? {
            statusMessage: 'Out of Office: Back on Monday! For urgent matters please contact @Wei-Lun Cheng in the meantime.',
            actions: <NameCardDefaultActions />,
            fields: [
              { label: 'ID', value: 'YHANAX' },
              { label: 'Employee number', value: '1234567' },
            ],
            onViewMore: noop,
          } : {
            status: undefined,
            onViewMore: noop,
          })}
        />
      </HoverCardContent>
    </HoverCard>
  )
}

export const Basic = {
  name: '完整（hover 觸發）',
  render: () => (
    <div className="p-16 flex flex-col gap-6">
      <NameCardHover name="Hanamizuki Yukinome 花水木雪乃芽" src="https://i.pravatar.cc/128?u=hana" subtitle="Design｜D-0042｜EMP-1001" />
      <NameCardHover name="Alice Chen" src="https://i.pravatar.cc/128?u=alice" subtitle="Design｜D-0042｜EMP-1001" />
    </div>
  ),
}

export const Minimal = {
  name: '精簡（hover 觸發）',
  render: () => (
    <div className="p-16 flex flex-col gap-6">
      <NameCardHover name="Bob Lin" src="https://i.pravatar.cc/128?u=bob" subtitle="Engineering｜E-0087｜EMP-1002" minimal />
    </div>
  ),
}
