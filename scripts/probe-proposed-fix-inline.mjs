// Inline-style simulation: directly mutate header inline style every frame.
import { chromium } from 'playwright'
const b = await chromium.launch()
const c = await b.newContext({ viewport: { width: 1440, height: 900 } })
const p = await c.newPage()
await p.goto('http://localhost:6006/iframe.html?id=design-system-components-appshell-展示--primary-sidebar&viewMode=story', { waitUntil: 'networkidle' })
await p.waitForTimeout(1000)

// Strategy: remove the offending tailwind classes from header element, then add inline styles for
// padding-only mechanism. This actually simulates what code change would do.
await p.evaluate(() => {
  const header = document.querySelector('[data-sidebar="header"]')
  if (!header) return
  // Remove the discrete-switch utility classes
  const toRemove = [
    'group-data-[collapsible=icon]:!w-[var(--sidebar-width-icon)]',
    'group-data-[collapsible=icon]:!px-0',
    'group-data-[collapsible=icon]:!justify-center',
  ]
  toRemove.forEach(cls => header.classList.remove(cls))
  // Add the new padding-driven classes
  header.classList.add('group-data-[collapsible=icon]:!pl-3', 'group-data-[collapsible=icon]:!pr-0')
})
await p.waitForTimeout(200)

const probe = async (label) => p.evaluate(({ label }) => {
  const r = (el) => el ? {
    x: Math.round(el.getBoundingClientRect().x),
    w: Math.round(el.getBoundingClientRect().width),
    cx: Math.round(el.getBoundingClientRect().x + el.getBoundingClientRect().width / 2),
  } : null
  const css = (el, ...props) => el ? Object.fromEntries(props.map(p => [p, window.getComputedStyle(el).getPropertyValue(p)])) : null
  const sbHeader = document.querySelector('[data-sidebar="header"]')
  const sbHeaderAvatar = sbHeader?.querySelector('[data-prefix-type], img, .rounded-md, [role="img"]')
  const menuIcon = document.querySelector('[data-sidebar="menu-button"] svg')
  return {
    label,
    state: document.querySelector('[data-state]')?.getAttribute('data-state'),
    headerClassList: sbHeader?.className,
    sbHeader: sbHeader ? { ...r(sbHeader), ...css(sbHeader, 'padding-left', 'padding-right', 'width', 'justify-content') } : null,
    avatar: r(sbHeaderAvatar),
    menuIcon: r(menuIcon),
  }
}, { label })

const expanded = await probe('PROPOSED expanded')
// Collapse
await p.locator('[data-sidebar="trigger"]').first().click({ force: true })
await p.waitForTimeout(220)
const collapsed = await probe('PROPOSED collapsed final')
// Expand again — capture animation frames
await p.locator('[data-sidebar="trigger"]').first().click({ force: true })
await p.waitForTimeout(30)
const t30 = await probe('expand t=30ms')
await p.waitForTimeout(40)
const t70 = await probe('expand t=70ms')
await p.waitForTimeout(50)
const t120 = await probe('expand t=120ms')
await p.waitForTimeout(80)
const t200 = await probe('expand t=200ms')

console.log(JSON.stringify({ expanded, collapsed, t30, t70, t120, t200 }, null, 2))
await b.close()
